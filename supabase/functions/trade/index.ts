import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceOrderBody {
  propertyId: string;
  orderType: 'BUY' | 'SELL';
  tokenCount: number;
  pricePerToken: number;
}

interface ExecuteOrderBody {
  orderId: string;
}

interface CancelOrderBody {
  orderId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the JWT token from the authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token and get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'placeOrder': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const body: PlaceOrderBody = await req.json();
        
        // Verify user has enough tokens if SELL order
        if (body.orderType === 'SELL') {
          const { data: holdings, error: holdingsError } = await supabaseClient
            .from('user_holdings')
            .select('token_count')
            .eq('user_id', user.id)
            .eq('property_id', body.propertyId)
            .single();

          if (holdingsError || !holdings || holdings.token_count < body.tokenCount) {
            return new Response(
              JSON.stringify({ error: 'Insufficient tokens' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            user_id: user.id,
            property_id: body.propertyId,
            order_type: body.orderType,
            token_count: body.tokenCount,
            price_per_token: body.pricePerToken,
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
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { orderId }: ExecuteOrderBody = await req.json();

        // Start a transaction
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

        // Transfer tokens from seller to buyer
        // Note: In the future, this will be replaced with smart contract calls
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

        return new Response(
          JSON.stringify({ message: 'Order executed successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cancelOrder': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { orderId }: CancelOrderBody = await req.json();

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
          JSON.stringify({ error: 'Not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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