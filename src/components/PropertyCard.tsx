import { Card } from "@/components/ui/card";
import { PropertyImage } from "./property/PropertyImage";
import { PropertyBadges } from "./property/PropertyBadges";
import { PropertyDetails } from "./property/PropertyDetails";
import { TradeButton } from "./trade/TradeButton";
import { OrderBook } from "./trade/OrderBook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Property {
  id: string;
  name: string;
  location: string;
  price_per_token: number;
  image_url: string | null;
  yield: number;
  max_tokens: number;
  tokens_sold: number;
  launch_date: string | null;
}

interface PropertyCardProps {
  property: Property;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyCard = ({ property, onSelectProperty }: PropertyCardProps) => {
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const isSoldOut = property.tokens_sold >= property.max_tokens;

  return (
    <Card className="overflow-hidden relative group">
      <PropertyImage imageUrl={property.image_url} name={property.name} />
      <PropertyBadges yield={property.yield} isSoldOut={isSoldOut} />
      <PropertyDetails
        name={property.name}
        location={property.location}
        pricePerToken={property.price_per_token}
        tokensSold={property.tokens_sold}
        maxTokens={property.max_tokens}
      />
      
      <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <DialogTrigger asChild>
          <button 
            className="w-full bg-nordic-blue text-white py-2 hover:bg-nordic-darkblue transition-colors"
            disabled={isSoldOut}
          >
            {isSoldOut ? "Utsolgt" : "Handle tokens"}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{property.name} - Tokenhandel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <OrderBook 
              propertyId={property.id} 
              onOrderExecuted={() => setIsTradeDialogOpen(false)} 
            />
            <div className="grid grid-cols-2 gap-4">
              <TradeButton
                propertyId={property.id}
                tokenCount={1}
                pricePerToken={property.price_per_token}
                orderType="BUY"
                onSuccess={() => setIsTradeDialogOpen(false)}
              />
              <TradeButton
                propertyId={property.id}
                tokenCount={1}
                pricePerToken={property.price_per_token}
                orderType="SELL"
                onSuccess={() => setIsTradeDialogOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};