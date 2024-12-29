import { Building2, MapPin, Coins, TrendingUp, Lock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    is_live?: boolean;
  };
  onSelectProperty: (property: PropertyCardProps['property']) => void;
};

export const PropertyCard = ({ property, onSelectProperty }: PropertyCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState("35 dager");
  const [isNotifying, setIsNotifying] = useState(false);

  const availableTokens = property.max_tokens - property.tokens_sold;
  const ratio = property.tokens_sold / property.max_tokens;
  const isLive = property.is_live !== false;

  // Simple countdown effect (temporary solution)
  useEffect(() => {
    if (!isLive) {
      const days = 35;
      const hours = 0;
      const minutes = 0;
      
      // Update countdown every minute
      const timer = setInterval(() => {
        setCountdown(`${days} dager, ${hours} timer, ${minutes} minutter`);
      }, 60000);

      return () => clearInterval(timer);
    }
  }, [isLive]);

  const handleNotifyMe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsNotifying(true);
    try {
      // Here we could implement the notification signup logic
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Du vil bli varslet når eiendommen blir tilgjengelig!");
    } catch (error) {
      toast.error("Kunne ikke registrere varsling. Prøv igjen senere.");
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
        {!isLive && (
          <>
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center px-4">
              <div className="w-[80%] md:w-full flex flex-col items-center">
                <Lock className="h-8 w-8 md:h-12 md:w-12 text-nordic-blue mb-2" />
                <div className="text-center">
                  <span className="text-sm md:text-base text-nordic-blue font-medium block">
                    Kommer snart!
                  </span>
                  <div className="mt-2 bg-white rounded-lg px-3 py-1 shadow-sm">
                    <span className="text-xs md:text-sm text-nordic-blue">
                      Går live om: {countdown}
                    </span>
                  </div>
                </div>
                <motion.p 
                  className="text-xs md:text-sm text-nordic-charcoal text-center max-w-[80%] mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Forhåndsinfo: Eiendommen blir tilgjengelig om 35 dager. Følg med for å sikre deg tokens tidlig!
                </motion.p>
              </div>
            </div>
          </>
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
          {isLive ? (
            <Button
              className="w-full bg-nordic-blue hover:bg-nordic-blue/90 text-white"
              onClick={() => {
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
          ) : (
            <Button
              className="w-full bg-nordic-blue/50 hover:bg-nordic-blue/60 text-white cursor-not-allowed"
              onClick={handleNotifyMe}
              disabled={isNotifying}
            >
              <Bell className="mr-2 h-4 w-4" />
              {isNotifying ? "Registrerer..." : "Påminn meg"}
            </Button>
          )}
          <p className="text-xs text-nordic-gray italic text-center">
            *APY er estimert årlig avkastning, ikke garantert.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};