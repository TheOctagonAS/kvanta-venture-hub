import { Building2, Ban, Bell, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { PropertyBadges } from "./property/PropertyBadges";
import { PropertyImage } from "./property/PropertyImage";
import { PropertyDetails } from "./property/PropertyDetails";

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
    launch_date: string | null;
  };
  onSelectProperty: (property: PropertyCardProps['property']) => void;
};

export const PropertyCard = ({ property, onSelectProperty }: PropertyCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<string>("");
  const [isNotifying, setIsNotifying] = useState(false);

  const availableTokens = property.max_tokens - property.tokens_sold;
  const ratio = property.tokens_sold / property.max_tokens;
  const isSoldOut = availableTokens === 0;
  
  const calculateIsLive = (launchDate: string | null): boolean => {
    if (!launchDate) return true;
    return new Date(launchDate) <= new Date();
  };

  const isLive = calculateIsLive(property.launch_date);

  const calculateCountdown = (launchDate: string | null) => {
    if (!launchDate) return "";
    
    const now = new Date();
    const launch = new Date(launchDate);
    const diffTime = launch.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "";
    return `${diffDays} dager`;
  };

  useEffect(() => {
    if (!isLive && property.launch_date) {
      const updateCountdown = () => {
        setCountdown(calculateCountdown(property.launch_date));
      };
      
      updateCountdown();
      const timer = setInterval(updateCountdown, 60000);
      return () => clearInterval(timer);
    }
  }, [isLive, property.launch_date]);

  const handleNotifyMe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsNotifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      <Card className="h-full flex flex-col bg-white dark:bg-[#1f1f1f] hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden border border-transparent dark:border-[#333]">
        {!isLive && (
          <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-sm flex flex-col items-center justify-center px-4">
            <div className="w-[80%] md:w-full flex flex-col items-center">
                <Lock className="h-8 w-8 md:h-12 md:w-12 text-nordic-blue mb-2" />
                <div className="text-center">
                  <span className="text-sm md:text-base text-nordic-blue font-medium block">
                    Kommer snart!
                  </span>
                  <div className="mt-2 bg-white dark:bg-[#1f1f1f] rounded-lg px-3 py-1 shadow-sm">
                    <span className="text-xs md:text-sm text-nordic-blue">
                      Går live om: {countdown}
                    </span>
                  </div>
                </div>
                <motion.p 
                  className="text-xs md:text-sm text-nordic-charcoal dark:text-[#eee] text-center max-w-[80%] mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Forhåndsinfo: Eiendommen blir tilgjengelig {countdown}. Følg med for å sikre deg tokens tidlig!
                </motion.p>
            </div>
          </div>
        )}
        
        <PropertyBadges yield={property.yield} isSoldOut={isSoldOut} />
        <PropertyImage imageUrl={property.image_url} propertyName={property.name} />
        
        <CardHeader className="pb-2 p-3 sm:p-6">
          <CardTitle className="text-xl font-bold text-nordic-charcoal dark:text-[#eee]">
            {property.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow p-3 sm:p-6 pt-0">
          <PropertyDetails 
            location={property.location}
            pricePerToken={property.price_per_token}
            availableTokens={availableTokens}
            ratio={ratio}
          />
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 p-3 sm:p-6 pt-4">
          {isLive ? (
            <Button
              className={`w-full ${
                isSoldOut 
                  ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                  : 'bg-nordic-blue hover:bg-nordic-blue/90'
              } text-white`}
              onClick={() => {
                if (isSoldOut) {
                  toast.error("Beklager, denne eiendommen er utsolgt");
                  return;
                }
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
              disabled={isSoldOut}
            >
              {isSoldOut ? (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Utsolgt
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Kjøp andeler
                </>
              )}
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
          <p className="text-xs text-nordic-gray dark:text-[#ccc] italic text-center">
            *APY er estimert årlig avkastning, ikke garantert.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};