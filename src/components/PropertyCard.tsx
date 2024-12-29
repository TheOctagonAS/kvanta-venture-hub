import { Building2, MapPin, Coins, TrendingUp, Lock } from "lucide-react";
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
    is_live?: boolean; // New optional property to determine if the property is live
  };
  onSelectProperty: (property: PropertyCardProps['property']) => void;
};

export const PropertyCard = ({ property, onSelectProperty }: PropertyCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const availableTokens = property.max_tokens - property.tokens_sold;
  const ratio = property.tokens_sold / property.max_tokens;
  const isLive = property.is_live !== false; // If is_live is undefined or true, treat as live

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
        {!isLive && (
          <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Lock className="h-12 w-12 text-nordic-blue mb-2" />
            <span className="text-nordic-blue font-medium">Kommer snart!</span>
          </div>
        )}
        
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
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-nordic-charcoal">
            {property.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center gap-2 text-nordic-gray">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{property.location}</span>
          </div>
          <div className="flex items-center gap-2 text-nordic-blue">
            <Coins className="h-4 w-4" />
            <span className="font-medium">
              {property.price_per_token} kr per token
            </span>
          </div>
          
          <div>
            <div className="h-2 bg-nordic-softblue rounded-full overflow-hidden">
              <div 
                className="bg-nordic-blue h-full transition-all duration-300"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
            <p className="text-sm text-nordic-gray mt-2">
              {availableTokens} andeler igjen
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 pt-4">
          <Button
            className={`w-full bg-nordic-blue hover:bg-nordic-blue/90 text-white ${!isLive ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => {
              if (!isLive) return;
              if (!user) {
                navigate("/login");
                return;
              }
              if (!user.isKYC) {
                toast.error("Du må fullføre KYC før du kan kjøpe andeler");
                navigate("/minside");
                return;
              }
              onSelectProperty(property);
            }}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Kjøp andeler
          </Button>
          <p className="text-xs text-nordic-gray italic text-center">
            *APY er estimert årlig avkastning, ikke garantert.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};