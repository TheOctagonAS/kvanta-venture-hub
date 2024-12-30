import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_PAYMENT_METHODS = ['bank_account', 'card', 'vipps'];

// Helper function to check KYC status
async function checkKYCStatus(supabaseClient: any, userId: string) {
  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('is_kyc')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking KYC status:', error);
    throw new Error('Could not verify KYC status');
  }

  return profile?.is_kyc || false;
}

// Helper function to create a new order
async function createOrder(supabaseClient: any, {
  userId,
  propertyId,
  orderType,
  tokenCount,
  pricePerToken,
  paymentMethod
}: {
  userId: string;
  propertyId: string;
  orderType: string;
  tokenCount: number;
  pricePerToken: number;
  paymentMethod: string;
}) {
  const { data: order, error } = await supabaseClient
    .from('orders')
    .insert({
      user_id: userId,
      property_id: propertyId,
      order_type: orderType,
      token_count: tokenCount,
      price_per_token: pricePerToken,
      payment_method: paymentMethod,
      status: 'OPEN'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }

  return order;
}

// Helper function to update user holdings after successful payment
async function updateUserHoldings(supabaseClient: any, {
  userId,
  propertyId,
  tokenCount
}: {
  userId: string;
  propertyId: string;
  tokenCount: number;
}) {
  const { data: existingHolding, error: fetchError } = await supabaseClient
    .from('user_holdings')
    .select('*')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching existing holding:', fetchError);
    throw new Error('Failed to check existing holdings');
  }

  if (existingHolding) {
    const { error: updateError } = await supabaseClient
      .from('user_holdings')
      .update({
        token_count: existingHolding.token_count + tokenCount
      })
      .eq('id', existingHolding.id);

    if (updateError) {
      console.error('Error updating holdings:', updateError);
      throw new Error('Failed to update holdings');
    }
  } else {
    const { error: insertError } = await supabaseClient
      .from('user_holdings')
      .insert({
        user_id: userId,
        property_id: propertyId,
        token_count: tokenCount
      });

    if (insertError) {
      console.error('Error creating holdings:', insertError);
      throw new Error('Failed to create holdings');
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, propertyId, orderType, tokenCount, pricePerToken, paymentMethod } = await req.json();

    switch (action) {
      case 'placeOrder': {
        // For BUY orders, verify KYC status
        if (orderType === 'BUY') {
          const isKycVerified = await checkKYCStatus(supabaseClient, user.id);
          if (!isKycVerified) {
            return new Response(
              JSON.stringify({ error: 'KYC verification required to place buy orders' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          if (!paymentMethod) {
            return new Response(
              JSON.stringify({ error: 'Payment method is required for buy orders' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
            return new Response(
              JSON.stringify({ error: 'Invalid payment method' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        const order = await createOrder(supabaseClient, {
          userId: user.id,
          propertyId,
          orderType,
          tokenCount,
          pricePerToken,
          paymentMethod
        });

        // Mock payment confirmation for now
        if (orderType === 'BUY') {
          // Update order status to FILLED
          const { error: updateError } = await supabaseClient
            .from('orders')
            .update({ status: 'FILLED' })
            .eq('id', order.id);

          if (updateError) {
            console.error('Error updating order status:', updateError);
            return new Response(
              JSON.stringify({ error: 'Failed to update order status' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Update user holdings
          await updateUserHoldings(supabaseClient, {
            userId: user.id,
            propertyId,
            tokenCount
          });
        }

        return new Response(
          JSON.stringify(order),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'executeOrder': {
        const { orderId } = await req.json();

        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('status', 'OPEN')
          .single();

        if (orderError || !order) {
          return new Response(
            JSON.stringify({ error: 'Order not found or already executed' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (order.order_type !== 'SELL') {
          return new Response(
            JSON.stringify({ error: 'Can only execute SELL orders' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Transfer tokens using RPC function
        const { error: transferError } = await supabaseClient.rpc('transfer_tokens', {
          p_from_user_id: order.user_id,
          p_to_user_id: user.id,
          p_property_id: order.property_id,
          p_token_count: order.token_count
        });

        if (transferError) {
          console.error('Error transferring tokens:', transferError);
          return new Response(
            JSON.stringify({ error: 'Failed to transfer tokens' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update order status
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            status: 'EXECUTED',
            buyer_id: user.id,
            executed_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to execute order' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ message: 'Order executed successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cancelOrder': {
        const { orderId } = await req.json();

        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .eq('status', 'OPEN')
          .single();

        if (orderError || !order) {
          return new Response(
            JSON.stringify({ error: 'Order not found or cannot be cancelled' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (order.order_type === 'SELL') {
          // Release reserved tokens using RPC function
          const { error: releaseError } = await supabaseClient.rpc('release_tokens', {
            p_user_id: order.user_id,
            p_property_id: order.property_id,
            p_token_count: order.token_count
          });

          if (releaseError) {
            console.error('Error releasing tokens:', releaseError);
            return new Response(
              JSON.stringify({ error: 'Failed to release tokens' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            status: 'CANCELLED',
            cancelled_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error cancelling order:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to cancel order' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ message: 'Order cancelled successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});