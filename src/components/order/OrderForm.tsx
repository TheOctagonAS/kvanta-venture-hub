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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      if (paymentMethod === "algorand") {
        // Mock Algorand transaction
        const txResult = await algorandService.signTransaction({
          from: "MOCK-USER-ADDRESS",
          to: "MOCK-CONTRACT-ADDRESS",
          amount: tokenCount * property.price_per_token,
          note: `Purchase ${tokenCount} tokens of ${property.name}`
        });

        console.log("Mock Algorand transaction completed:", txResult);
      }

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
          <Label>Pris per token</Label>
          <div className="text-lg font-semibold bg-[#f8f9fa] p-4 rounded-lg">
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
          <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
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

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ordresammendrag</DialogTitle>
            <DialogDescription>
              Vennligst bekreft ordreinformasjonen under
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-[#f8f9fa] p-4 rounded-lg">
              <p>Du er i ferd med å kjøpe:</p>
              <ul className="list-none space-y-2 mt-2">
                <li className="flex justify-between">
                  <span>Antall tokens:</span>
                  <span className="font-medium">{tokenCount}</span>
                </li>
                <li className="flex justify-between">
                  <span>Pris per token:</span>
                  <span className="font-medium">{property.price_per_token.toLocaleString()} NOK</span>
                </li>
                <Separator className="my-2" />
                <li className="flex justify-between font-bold">
                  <span>Total sum:</span>
                  <span>{totalAmount.toLocaleString()} NOK</span>
                </li>
                <li className="flex justify-between mt-2">
                  <span>Betalingsmetode:</span>
                  <span className="font-medium capitalize">
                    {paymentMethod?.replace('_', ' ') || 'Ikke valgt'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};