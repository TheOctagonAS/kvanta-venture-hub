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

interface OrderFormProps {
  property: Property;
}

const PRESET_QUANTITIES = [1, 10, 25, 50, 100];

export const OrderForm = ({ property }: OrderFormProps) => {
  const [tokenCount, setTokenCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank_account" | "card" | "vipps" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Du må være logget inn for å handle tokens");
      return;
    }

    if (!paymentMethod) {
      toast.error("Velg en betalingsmetode");
      return;
    }

    setIsLoading(true);
    try {
      await tokenService.buyTokens(
        property.id,
        tokenCount,
        property.price_per_token,
        paymentMethod
      );
      toast.success("Ordre opprettet!");
      navigate("/minside");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Kunne ikke opprette ordre");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantitySelect = (quantity: number) => {
    setTokenCount(quantity);
  };

  const handleCustomQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxTokens = property.max_tokens - property.tokens_sold;
    setTokenCount(Math.min(Math.max(0, value), maxTokens));
  };

  const totalAmount = tokenCount * property.price_per_token;

  const handlePreviewOrder = () => {
    setShowPreview(true);
    toast.info("Dette er en forhåndsvisning av din ordre", {
      description: `${tokenCount} tokens til ${property.price_per_token} NOK per token`
    });
  };

  return (
    <Card className="p-6">
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
          <Label>Pris per token</Label>
          <div className="text-lg font-semibold">
            {property.price_per_token.toLocaleString()} NOK
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Antall tokens:</span>
              <span className="font-medium">{tokenCount}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Pris per token:</span>
              <span className="font-medium">{property.price_per_token.toLocaleString()} NOK</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-nordic-blue">{totalAmount.toLocaleString()} NOK</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewOrder}
              className="w-full"
            >
              Forhåndsvis Ordre
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || tokenCount < 1 || !paymentMethod}
            >
              {isLoading ? "Behandler..." : "Bekreft Ordre"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};