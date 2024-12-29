import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import SharePurchaseModal from "../components/SharePurchaseModal";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PropertyCard } from "@/components/PropertyCard";

type Property = {
  id: string;
  name: string;
  location: string;
  price_per_token: number;
  image_url: string | null;
  yield: number;
  max_tokens: number;
  tokens_sold: number;
};

const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('id, name, location, price_per_token, image_url, yield, max_tokens, tokens_sold');
  
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
  const queryClient = useQueryClient();
  
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const handlePurchase = async (tokenCount: number) => {
    if (!user || !selectedProperty) return;

    try {
      // Check if purchase would exceed max tokens
      if (selectedProperty.tokens_sold + tokenCount > selectedProperty.max_tokens) {
        toast.error("Ikke nok tilgjengelige tokens for dette kjøpet");
        return;
      }

      // Get existing holdings
      const { data: existingHoldings } = await supabase
        .from('user_holdings')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', selectedProperty.id)
        .maybeSingle();

      // Start a transaction by using multiple updates
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
        // Create new holdings
        const { error: insertError } = await supabase
          .from('user_holdings')
          .insert({
            user_id: user.id,
            property_id: selectedProperty.id,
            token_count: tokenCount
          });

        if (insertError) throw insertError;
      }

      // Update tokens_sold in properties table
      const { error: propertyUpdateError } = await supabase
        .from('properties')
        .update({ 
          tokens_sold: selectedProperty.tokens_sold + tokenCount 
        })
        .eq('id', selectedProperty.id);

      if (propertyUpdateError) throw propertyUpdateError;

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      await queryClient.invalidateQueries({ queryKey: ['holdings'] });

      toast.success("Kjøp fullført!");
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      toast.error("Kunne ikke fullføre kjøpet");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nordic-lightgray flex items-center justify-center">
        <div className="text-nordic-gray animate-pulse">Laster eiendommer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-nordic-lightgray flex items-center justify-center">
        <div className="text-red-600">Kunne ikke laste eiendommer</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nordic-lightgray">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-nordic-charcoal tracking-heading mb-6">
            Tilgjengelige Eiendommer
          </h1>
          <p className="text-xl text-nordic-gray max-w-2xl mx-auto">
            Utforsk våre nøye utvalgte eiendommer i Norden. Invester trygt og enkelt med tokenisert eiendom.
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

      <SharePurchaseModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        propertyName={selectedProperty?.name || ""}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default Eiendommer;