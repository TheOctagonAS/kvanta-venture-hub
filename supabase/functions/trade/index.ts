import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_PAYMENT_METHODS = ['bank_account', 'card', 'vipps', 'algorand'];

// Mock DeFi service implementation
const defiService = {
  async deployToken(propertyId: string) {
    console.log('Mock: Deploying token for property', propertyId);
    
    // Fetch property details from supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { data: property, error } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (error) throw error;
    if (!property) throw new Error('Property not found');
    
    const totalSupply = Math.floor(property.total_raise_cap / property.price_per_token);
    
    // Mock deployment result
    const deploymentResult = {
      tokenAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      symbol: property.on_chain_symbol || 'KVANTA',
      decimals: property.on_chain_decimals || 18,
      chainName: property.chain_name || 'Ethereum',
      explorerUrl: property.chain_explorer_url || 'https://etherscan.io',
    };
    
    console.log('Mock: Token deployed with total supply:', totalSupply);
    console.log('Mock: Deployment result:', deploymentResult);
    
    // Update property with token address
    const { error: updateError } = await supabaseClient
      .from('properties')
      .update({
        property_token_address: deploymentResult.tokenAddress,
        on_chain_symbol: deploymentResult.symbol,
        on_chain_decimals: deploymentResult.decimals,
        chain_name: deploymentResult.chainName,
        chain_explorer_url: deploymentResult.explorerUrl
      })
      .eq('id', propertyId);
    
    if (updateError) throw updateError;
    
    return deploymentResult;
  },
  
  async whitelistInvestor(propertyId: string, userAddress: string) {
    console.log('Mock: Whitelisting investor', userAddress, 'for property', propertyId);
    
    // Mock whitelist transaction
    const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    console.log('Mock: Whitelist transaction hash:', txHash);
    
    return true;
  },
  
  async setupChainlinkFeed(propertyId: string) {
    console.log('Mock: Setting up Chainlink price feed for property', propertyId);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Fetch property details for price calculation
    const { data: property, error } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (error) throw error;
    if (!property) throw new Error('Property not found');
    
    // Mock oracle address
    const oracleAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    // Calculate mock price based on property data
    const mockPrice = property.price_per_token * (1 + (property.yield / 100));
    console.log('Mock: Oracle price feed initialized at:', mockPrice);
    
    return oracleAddress;
  }
}

async function checkKYCStatus(supabaseClient: any, userId: string) {
  console.log('Checking KYC status for user:', userId);
  
  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('is_kyc')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking KYC status:', error);
    throw new Error('Could not verify KYC status');
  }

  console.log('KYC status result:', profile);
  return profile?.is_kyc || false;
}

async function updateOwnerBalance(supabaseClient: any, {
  ownerId,
  amount
}: {
  ownerId: string;
  amount: number;
}) {
  const { data: existingBalance, error: fetchError } = await supabaseClient
    .from('user_balance')
    .select('*')
    .eq('user_id', ownerId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching owner balance:', fetchError);
    throw new Error('Failed to fetch owner balance');
  }

  if (existingBalance) {
    const { error: updateError } = await supabaseClient
      .from('user_balance')
      .update({
        balance: existingBalance.balance + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingBalance.id);

    if (updateError) {
      console.error('Error updating owner balance:', updateError);
      throw new Error('Failed to update owner balance');
    }
  } else {
    const { error: insertError } = await supabaseClient
      .from('user_balance')
      .insert({
        user_id: ownerId,
        balance: amount,
      });

    if (insertError) {
      console.error('Error creating owner balance:', insertError);
      throw new Error('Failed to create owner balance');
    }
  }
}

async function checkInvestorLimits(supabaseClient: any, propertyId: string) {
  const { data, error } = await supabaseClient
    .from('user_holdings')
    .select('user_id')
    .eq('property_id', propertyId)
    .not('token_count', 'eq', 0);

  if (error) throw error;
  return data?.length || 0;
}

async function createOrder(supabaseClient: any, {
  userId,
  propertyId,
  orderType,
  tokenCount,
  pricePerToken,
  paymentMethod = 'bank_account'
}: {
  userId: string;
  propertyId: string;
  orderType: string;
  tokenCount: number;
  pricePerToken: number;
  paymentMethod?: string;
}) {
  const orderData = {
    user_id: userId,
    property_id: propertyId,
    order_type: orderType,
    token_count: tokenCount,
    price_per_token: pricePerToken,
    payment_method: paymentMethod,
    status: 'OPEN',
    buyer_id: orderType === 'BUY' ? userId : null
  };

  console.log('Creating order with data:', orderData);

  const { data: order, error } = await supabaseClient
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }

  return order;
}

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

  if (fetchError && fetchError.code !== 'PGRST116') {
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
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user ID:', user.id);

    const { action, propertyId, orderType, tokenCount, pricePerToken, paymentMethod } = await req.json();

    switch (action) {
      case 'placeOrder': {
        if (orderType === 'BUY') {
          // Check KYC status
          const isKycVerified = await checkKYCStatus(supabaseClient, user.id);
          console.log('KYC verification result:', isKycVerified);
          
          if (!isKycVerified) {
            return new Response(
              JSON.stringify({ error: 'Du må være KYC-verifisert for å kjøpe tokens' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Get property details
          const { data: property, error: propertyError } = await supabaseClient
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();

          if (propertyError || !property) {
            return new Response(
              JSON.stringify({ error: 'Property not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Check max tokens limit
          if (property.tokens_sold + tokenCount > property.max_tokens) {
            return new Response(
              JSON.stringify({ error: 'Ikke nok tilgjengelige tokens' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Check max investors limit
          const currentInvestorCount = await checkInvestorLimits(supabaseClient, propertyId);
          if (currentInvestorCount >= property.max_investors) {
            return new Response(
              JSON.stringify({ error: 'Maksimalt antall investorer er nådd' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Get user's wallet address
          const { data: userWallet, error: walletError } = await supabaseClient
            .from('wallets')
            .select('address')
            .eq('user_id', user.id)
            .eq('wallet_type', 'ALGORAND')
            .single();

          if (walletError) {
            console.error('Error fetching wallet:', walletError);
            return new Response(
              JSON.stringify({ error: 'Kunne ikke finne wallet' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Whitelist investor's wallet
          if (userWallet?.address) {
            try {
              await defiService.whitelistInvestor(propertyId, userWallet.address);
            } catch (error) {
              console.error('Error whitelisting investor:', error);
              return new Response(
                JSON.stringify({ error: 'Kunne ikke whitelist wallet' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }

          const order = await createOrder(supabaseClient, {
            userId: user.id,
            propertyId,
            orderType,
            tokenCount,
            pricePerToken: property.price_per_token,
            paymentMethod
          });

          // Update tokens_sold count
          const { error: updateError } = await supabaseClient
            .from('properties')
            .update({ 
              tokens_sold: property.tokens_sold + tokenCount 
            })
            .eq('id', propertyId);

          if (updateError) {
            console.error('Error updating tokens sold:', updateError);
            throw new Error('Failed to update tokens sold');
          }

          // Update owner's balance with the payment amount
          if (property.owner_id) {
            await updateOwnerBalance(supabaseClient, {
              ownerId: property.owner_id,
              amount: property.price_per_token * tokenCount
            });
          }

          // Update order status
          const { error: updateOrderError } = await supabaseClient
            .from('orders')
            .update({ status: 'FILLED' })
            .eq('id', order.id);

          if (updateOrderError) {
            console.error('Error updating order status:', updateOrderError);
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

          return new Response(
            JSON.stringify(order),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

        let finalPricePerToken = pricePerToken;
        if (!finalPricePerToken) {
          const { data: property, error: propertyError } = await supabaseClient
            .from('properties')
            .select('price_per_token')
            .eq('id', propertyId)
            .single();

          if (propertyError || !property) {
            return new Response(
              JSON.stringify({ error: 'Property not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          finalPricePerToken = property.price_per_token;
        }

        const order = await createOrder(supabaseClient, {
          userId: user.id,
          propertyId,
          orderType,
          tokenCount,
          pricePerToken: finalPricePerToken,
          paymentMethod
        });

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
