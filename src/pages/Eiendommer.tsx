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
  launch_date: string | null;
};

const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data as Property[];
};

const Eiendommer = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const filterOptions = [
    { id: 'all', label: 'Alle eiendommer' },
    { id: 'Residential', label: 'Bolig' },
    { id: 'Commercial', label: 'Næringseiendom' },
    { id: 'Multi-Family', label: 'Flermannsbolig' },
  ];

  const filteredProperties = properties?.filter(property => 
    selectedFilter === 'all' || property.property_type === selectedFilter
  );

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

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedFilter === filter.id
                  ? "bg-[#345FF6] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties?.map((property) => (
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
        onPurchase={async (tokenCount) => {
          if (!user || !selectedProperty) return;
          
          try {
            const { error } = await supabase.functions.invoke('trade', {
              body: {
                action: 'placeOrder',
                propertyId: selectedProperty.id,
                orderType: 'BUY',
                tokenCount,
                pricePerToken: selectedProperty.price_per_token
              }
            });

            if (error) throw error;

            toast.success("Ordre opprettet!");
            setSelectedProperty(null);
            queryClient.invalidateQueries({ queryKey: ['properties'] });
          } catch (error) {
            console.error('Error placing order:', error);
            toast.error("Kunne ikke opprette ordre");
          }
        }}
      />
    </div>
  );
};

export default Eiendommer;
