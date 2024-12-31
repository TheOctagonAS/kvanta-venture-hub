import { Card } from "@/components/ui/card";
import { TradeButton } from "@/components/trade/TradeButton";

interface PropertyQuickInfoProps {
  property: {
    id: string;
    price_per_token: number;
    yield: number;
    max_tokens: number;
    tokens_sold: number;
  };
}

export const PropertyQuickInfo = ({ property }: PropertyQuickInfoProps) => {
  return (
    <Card className="sticky top-4 p-6 bg-white shadow-md border border-gray-100">
      <div className="space-y-6">
        <div>
          <h3 className="text-base text-gray-600 mb-1">
            Pris per token
          </h3>
          <p className="text-2xl font-bold text-nordic-blue">
            {property.price_per_token.toLocaleString()} NOK
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-gray-600 mb-1">
              Forventet årlig avkastning
            </h4>
            <p className="text-base font-semibold text-accent">
              {property.yield}%
            </p>
          </div>

          <div>
            <h4 className="text-sm text-gray-600 mb-1">
              Tilgjengelige tokens
            </h4>
            <p className="text-base">
              {property.max_tokens - property.tokens_sold} av{" "}
              {property.max_tokens}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TradeButton
            propertyId={property.id}
            tokenCount={1}
            pricePerToken={property.price_per_token}
            orderType="BUY"
            onSuccess={() => {}}
          />
          <TradeButton
            propertyId={property.id}
            tokenCount={1}
            pricePerToken={property.price_per_token}
            orderType="SELL"
            onSuccess={() => {}}
          />
        </div>
      </div>
    </Card>
  );
};