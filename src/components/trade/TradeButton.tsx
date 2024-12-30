import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

      if (error) throw error;

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
      variant={orderType === 'BUY' ? "default" : "secondary"}
      className="w-full"
    >
      {isLoading ? "Behandler..." : orderType === 'BUY' ? "Kjøp tokens" : "Selg tokens"}
    </Button>
  );
};