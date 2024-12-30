import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Check KYC status
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('is_kyc')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Could not verify KYC status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profile.is_kyc) {
      return new Response(
        JSON.stringify({ error: 'KYC verification required to trade' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action } = await req.json();
    
    switch (action) {
      case 'placeOrder': {
        const { propertyId, orderType, tokenCount, pricePerToken, paymentMethod } = await req.json();
        
        if (orderType === 'SELL') {
          // Reserve tokens when placing a sell order
          const { error: reserveError } = await supabaseClient.rpc('reserve_tokens', {
            p_user_id: user.id,
            p_property_id: propertyId,
            p_token_count: tokenCount
          });

          if (reserveError) {
            console.error('Error reserving tokens:', reserveError);
            return new Response(
              JSON.stringify({ error: 'Failed to reserve tokens' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        // Validate payment method
        if (orderType === 'BUY' && !paymentMethod) {
          return new Response(
            JSON.stringify({ error: 'Payment method is required for buy orders' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            user_id: user.id,
            property_id: propertyId,
            order_type: orderType,
            token_count: tokenCount,
            price_per_token: pricePerToken,
            payment_method: paymentMethod,
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order:', orderError);
          return new Response(
            JSON.stringify({ error: 'Failed to create order' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
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