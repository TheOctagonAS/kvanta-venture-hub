import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/order/OrderForm";
import { PropertyPreview } from "@/components/order/PropertyPreview";

const OrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!propertyId,
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate('/eiendommer')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-[#E9F2FF] text-nordic-charcoal"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Tilbake
      </Button>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nordic-charcoal mb-2">
            {property.name}
          </h1>
          <p className="text-gray-600">{property.location}</p>
          <h2 className="text-xl text-nordic-gray mt-4">
            Kjøp tokens i {property.name}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <PropertyPreview property={property} />
          <OrderForm property={property} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;