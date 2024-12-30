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

interface OrderFormProps {
  property: Property;
}

export const OrderForm = ({ property }: OrderFormProps) => {
  const [tokenCount, setTokenCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Du må være logget inn for å handle tokens");
      return;
    }

    setIsLoading(true);
    try {
      await tokenService.buyTokens(
        property.id,
        tokenCount,
        property.price_per_token
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

  const totalAmount = tokenCount * property.price_per_token;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tokenCount">Antall tokens</Label>
          <Input
            id="tokenCount"
            type="number"
            min="1"
            max={property.max_tokens - property.tokens_sold}
            value={tokenCount}
            onChange={(e) => setTokenCount(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="space-y-2">
          <Label>Pris per token</Label>
          <div className="text-lg font-semibold">
            {property.price_per_token.toLocaleString()} NOK
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Totalt beløp</span>
            <span className="text-xl font-bold text-nordic-blue">
              {totalAmount.toLocaleString()} NOK
            </span>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || tokenCount < 1}
          >
            {isLoading ? "Behandler..." : "Bekreft kjøp"}
          </Button>
        </div>
      </form>
    </Card>
  );
};