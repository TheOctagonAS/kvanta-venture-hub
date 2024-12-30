import { supabase } from "@/integrations/supabase/client";
import { algorandService } from "./AlgorandService";

export const tokenService = {
  async buyTokens(
    propertyId: string,
    tokenCount: number,
    pricePerToken: number,
    paymentMethod: string,
    onChainTxId?: string | null
  ) {
    const { data, error } = await supabase.functions.invoke('trade', {
      body: {
        action: 'placeOrder',
        propertyId,
        orderType: 'BUY',
        tokenCount,
        pricePerToken,
        paymentMethod,
        onChainTxId
      }
    });

    if (error) throw error;
    return data;
  },

  async sellTokens(propertyId: string, tokenCount: number, pricePerToken: number) {
    const { data, error } = await supabase.functions.invoke('trade', {
      body: {
        action: 'placeOrder',
        propertyId,
        orderType: 'SELL',
        tokenCount,
        pricePerToken
      }
    });

    if (error) throw error;
    return data;
  },

  async executeOrder(orderId: string) {
    const { data, error } = await supabase.functions.invoke('trade', {
      body: {
        action: 'executeOrder',
        orderId
      }
    });

    if (error) throw error;
    return data;
  },

  async transferASATokens(
    fromAddress: string,
    toAddress: string,
    propertyId: string,
    tokenCount: number
  ) {
    // Get property ASA ID
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('property_token_asa_id')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property?.property_token_asa_id) {
      throw new Error('Could not find property ASA ID');
    }

    // Transfer ASA tokens
    const txId = await algorandService.transferASA(
      fromAddress,
      toAddress,
      property.property_token_asa_id,
      tokenCount,
      `Transfer ${tokenCount} tokens of property ${propertyId}`
    );

    return txId;
  }
};