import { supabase } from "@/integrations/supabase/client";

interface TokenOperationResult {
  success: boolean;
  error?: string;
}

interface TokenRPCParams {
  p_user_id: string;
  p_property_id: string;
  p_token_count: number;
}

interface TransferTokensParams extends TokenRPCParams {
  p_from_user_id: string;
  p_to_user_id: string;
}

export class TokenService {
  static async reserveTokens(
    userId: string,
    propertyId: string,
    quantity: number
  ): Promise<TokenOperationResult> {
    try {
      const { error } = await supabase.rpc('reserve_tokens', {
        p_user_id: userId,
        p_property_id: propertyId,
        p_token_count: quantity
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error reserving tokens:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to reserve tokens' 
      };
    }
  }

  static async releaseTokens(
    userId: string,
    propertyId: string,
    quantity: number
  ): Promise<TokenOperationResult> {
    try {
      const { error } = await supabase.rpc('release_tokens', {
        p_user_id: userId,
        p_property_id: propertyId,
        p_token_count: quantity
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error releasing tokens:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to release tokens' 
      };
    }
  }

  static async transferTokens(
    fromUserId: string,
    toUserId: string,
    propertyId: string,
    quantity: number
  ): Promise<TokenOperationResult> {
    try {
      const { error } = await supabase.rpc('transfer_tokens', {
        p_from_user_id: fromUserId,
        p_to_user_id: toUserId,
        p_property_id: propertyId,
        p_token_count: quantity
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to transfer tokens' 
      };
    }
  }

  // TODO: Future blockchain integration
  private static async onChainTransfer(
    fromAddress: string,
    toAddress: string,
    tokenId: string,
    quantity: number
  ): Promise<TokenOperationResult> {
    throw new Error('Smart contract integration not implemented yet');
  }
}