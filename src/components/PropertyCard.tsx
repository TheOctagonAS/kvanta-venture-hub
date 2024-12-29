import { Building2, MapPin, Coins, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type PropertyCardProps = {
  property: {
    id: string;
    name: string;
    location: string;
    price_per_token: number;
    image_url: string | null;
    yield: number;
    max_tokens: number;
    tokens_sold: number;
  };
  onSelectProperty: (property: PropertyCardProps['property']) => void;
};

export const PropertyCard = ({ property, onSelectProperty }: PropertyCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const availableTokens = property.max_tokens - property.tokens_sold;
  const ratio = property.tokens_sold / property.max_tokens;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 z-10 bg-nordic-softblue text-nordic-blue border border-nordic-blue font-medium text-sm"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          APY: {property.yield}%
        </Badge>
        
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.image_url || '/placeholder.svg'}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl font-bold">{property.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="font-semibold text-lg">{property.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Coins className="h-4 w-4" />
              <span className="font-semibold text-lg text-primary">
                {property.price_per_token} kr per token
              </span>
            </div>
            
            <div className="mt-2 mb-2">
              <div className="h-2 bg-gray-200 rounded overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {availableTokens} tokens igjen
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => {
              if (!user) {
                navigate("/login");
                return;
              }
              if (!user.isKYC) {
                toast.error("Du må fullføre KYC før du kan kjøpe tokens");
                navigate("/minside");
                return;
              }
              onSelectProperty(property);
            }}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Kjøp tokens
          </Button>
          <p className="text-xs text-gray-500 italic text-center">
            *APY er estimert årlig avkastning, ikke garantert.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};