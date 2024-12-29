import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import TokenPurchaseModal from "../components/TokenPurchaseModal";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PropertyCard } from "@/components/PropertyCard";

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
      const { data: existingHoldings } = await supabase
        .from('user_holdings')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', selectedProperty?.id)
        .single();

      if (existingHoldings) {
        const { error: updateError } = await supabase
          .from('user_holdings')
          .update({ 
            token_count: existingHoldings.token_count + tokenCount 
          })
          .eq('id', existingHoldings.id);

        if (updateError) throw updateError;
      } else {
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
      setSelectedProperty(null);
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
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={setSelectedProperty}
            />
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