import { supabase } from "@/integrations/supabase/client";

export const tokenService = {
  async buyTokens(propertyId: string, tokenCount: number, pricePerToken: number, paymentMethod: string) {
    const { data, error } = await supabase.functions.invoke('trade', {
      body: {
        action: 'placeOrder',
        propertyId,
        orderType: 'BUY',
        tokenCount,
        pricePerToken,
        paymentMethod
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
  }
};