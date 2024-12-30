import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { tokenService } from "@/services/tokenService";
import { toast } from "sonner";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { Separator } from "@/components/ui/separator";
import { algorandService } from "@/services/AlgorandService";
import { OrderPreviewDialog } from "./OrderPreviewDialog";
import { OrderSummary } from "./OrderSummary";
import { supabase } from "@/integrations/supabase/client";

interface OrderFormProps {
  property: Property;
}

type PaymentMethod = "bank_account" | "card" | "vipps" | "algorand" | null;

const PRESET_QUANTITIES = [1, 10, 25, 50, 100];

export const OrderForm = ({ property }: OrderFormProps) => {
  const [tokenCount, setTokenCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantitySelect = (quantity: number) => {
    setTokenCount(quantity);
  };

  const handleCustomQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxTokens = property.max_tokens - property.tokens_sold;
    setTokenCount(Math.min(Math.max(0, value), maxTokens));
  };

  const checkKYCStatus = async () => {
    if (!user) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_kyc')
      .eq('id', user.id)
      .single();

    return profile?.is_kyc || false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreviewDialog(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      toast.error("Du må være logget inn for å handle tokens");
      return;
    }

    if (!paymentMethod) {
      toast.error("Velg en betalingsmetode");
      return;
    }

    // Check KYC status for crypto payments
    if (paymentMethod === "algorand") {
      const isKycVerified = await checkKYCStatus();
      if (!isKycVerified) {
        toast.error("Du må fullføre KYC-verifisering før du kan betale med krypto");
        navigate("/kyc");
        return;
      }
    }

    setIsLoading(true);
    try {
      let onChainTxId = null;
      
      if (paymentMethod === "algorand") {
        // Mock Algorand transaction
        const txResult = await algorandService.signTransaction({
          from: "MOCK-USER-ADDRESS",
          to: "MOCK-CONTRACT-ADDRESS",
          amount: tokenCount * property.price_per_token,
          assetId: property.property_token_asa_id,
          note: `Purchase ${tokenCount} tokens of ${property.name}`
        });

        onChainTxId = txResult;
        console.log("Mock Algorand transaction completed:", txResult);
      }

      await tokenService.buyTokens(
        property.id,
        tokenCount,
        property.price_per_token,
        paymentMethod,
        onChainTxId
      );
      
      toast.success("Ordre opprettet!");
      navigate("/minside");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Kunne ikke opprette ordre");
    } finally {
      setIsLoading(false);
      setShowPreviewDialog(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>Velg antall tokens</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUANTITIES.map((quantity) => (
              <Button
                key={quantity}
                type="button"
                variant={tokenCount === quantity ? "default" : "outline"}
                onClick={() => handleQuantitySelect(quantity)}
                className="flex-1 min-w-[80px]"
              >
                {quantity} {quantity === 1 ? 'token' : 'tokens'}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customQuantity">Egendefinert antall</Label>
            <Input
              id="customQuantity"
              type="number"
              min="1"
              max={property.max_tokens - property.tokens_sold}
              value={tokenCount}
              onChange={handleCustomQuantityChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Betalingsmetode</Label>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <OrderSummary
            tokenCount={tokenCount}
            property={property}
            paymentMethod={paymentMethod}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreviewDialog(true)}
              className="w-full"
            >
              Forhåndsvis Ordre
            </Button>
            <Button
              type="submit"
              className="w-full bg-[#345FF6] text-white hover:bg-blue-700 transition-colors"
              disabled={isLoading || tokenCount < 1 || !paymentMethod}
            >
              {isLoading ? "Behandler..." : "Bekreft Ordre"}
            </Button>
          </div>
        </div>
      </form>

      <OrderPreviewDialog
        isOpen={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        onConfirm={handleConfirmOrder}
        tokenCount={tokenCount}
        property={property}
        paymentMethod={paymentMethod}
      />
    </Card>
  );
};
