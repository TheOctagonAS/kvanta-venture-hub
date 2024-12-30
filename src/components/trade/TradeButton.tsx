import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TradeButtonProps {
  propertyId: string;
  tokenCount: number;
  pricePerToken: number;
  orderType: 'BUY' | 'SELL';
  onSuccess?: () => void;
}

export const TradeButton = ({ 
  propertyId, 
  tokenCount, 
  pricePerToken, 
  orderType,
  onSuccess 
}: TradeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTrade = async () => {
    if (!user) {
      toast.error("Du må være logget inn for å handle");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('trade', {
        body: {
          action: 'placeOrder',
          propertyId,
          orderType,
          tokenCount,
          pricePerToken
        }
      });

      if (error) {
        console.error('Trade error:', error);
        
        // Check for KYC-specific error
        if (error.message?.includes('KYC')) {
          toast.error("Du må være KYC-verifisert for å handle tokens", {
            action: {
              label: "Gå til KYC",
              onClick: () => navigate("/kyc")
            }
          });
          return;
        }
        
        throw error;
      }

      toast.success(`${orderType === 'BUY' ? 'Kjøps' : 'Salgs'}ordre opprettet`);
      onSuccess?.();
    } catch (error) {
      console.error('Trade error:', error);
      toast.error("Kunne ikke opprette ordre");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleTrade} 
      disabled={isLoading}
      variant={orderType === 'BUY' ? "default" : "outline"}
      className={`w-full ${orderType === 'SELL' ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : ''}`}
    >
      {isLoading ? "Behandler..." : orderType === 'BUY' ? "Kjøp tokens" : "Selg tokens"}
    </Button>
  );
};