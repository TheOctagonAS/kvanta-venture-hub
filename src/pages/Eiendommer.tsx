import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, MapPin, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import TokenPurchaseModal from "../components/TokenPurchaseModal";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type Property = {
  id: string;
  name: string;
  location: string;
  price_per_token: number;
  image_url: string | null;
  yield: number;
};

const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*');
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data as Property[];
};

const Eiendommer = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const handlePurchase = async (tokenCount: number) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.isKYC) {
      toast.error("Du må fullføre KYC før du kan kjøpe tokens");
      navigate("/minside");
      return;
    }

    try {
      // Check if user already has holdings for this property
      const { data: existingHoldings } = await supabase
        .from('user_holdings')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', selectedProperty?.id)
        .single();

      if (existingHoldings) {
        // Update existing holdings
        const { error: updateError } = await supabase
          .from('user_holdings')
          .update({ 
            token_count: existingHoldings.token_count + tokenCount 
          })
          .eq('id', existingHoldings.id);

        if (updateError) throw updateError;
      } else {
        // Insert new holdings
        const { error: insertError } = await supabase
          .from('user_holdings')
          .insert({
            user_id: user.id,
            property_id: selectedProperty?.id,
            token_count: tokenCount
          });

        if (insertError) throw insertError;
      }

      toast.success("Kjøp fullført!");
      setSelectedProperty(null); // Close modal
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      toast.error("Kunne ikke fullføre kjøpet");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Laster eiendommer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-red-600">Kunne ikke laste eiendommer</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
            Tilgjengelige Eiendommer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Utforsk våre nøye utvalgte eiendommer i Norden
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties?.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
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
                  </div>
                </CardContent>
                <CardFooter>
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
                      setSelectedProperty(property);
                    }}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Kjøp tokens
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <TokenPurchaseModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        propertyName={selectedProperty?.name || ""}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default Eiendommer;