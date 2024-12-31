import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Star, Users, Calendar, Phone, Briefcase } from "lucide-react";
import { PropertyImage } from "@/components/property/PropertyImage";
import { TradeButton } from "@/components/trade/TradeButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceHistoryChart } from "@/components/property/PriceHistoryChart";
import { Separator } from "@/components/ui/separator";
import { BackToProperties } from "@/components/property/BackToProperties";
import { DocumentsAndDD } from "@/components/property/DocumentsAndDD";
import { toast } from "sonner";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) {
        throw new Error("No property ID provided");
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching property:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Property not found");
      }

      return data;
    },
    enabled: !!id,
  });

  if (error) {
    toast.error("Could not load property details");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading property</h1>
          <Button onClick={() => navigate('/eiendommer')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToProperties />
      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-nordic-charcoal mb-2">
              {property.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
            <PropertyImage imageUrl={property.image_url} name={property.name} />
          </div>

          <PriceHistoryChart propertyId={id} />

          {/* Property Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Property Details */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Eiendomsdetaljer</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Eiendomstype</p>
                    <p className="text-base">{property.property_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Utleiegrad</p>
                    <p className="text-base">100%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Byggeår</p>
                    <p className="text-base">{property.year_built || "N/A"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Column - Sponsor Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Selgerinfo</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Organisasjonsnummer</p>
                    <p className="text-base">123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Kontakt</p>
                    <p className="text-base">+47 123 45 678</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Vurderinger</h3>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(12)</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    "Veldig fornøyd med investeringen og oppfølgingen fra selger."
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Documents and Due Diligence Section */}
          <DocumentsAndDD propertyId={property.id} status={property.status} />
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 p-6 bg-white shadow-md border border-gray-100">
            <div className="space-y-6">
              <div>
                <h3 className="text-base text-gray-600 mb-1">
                  Pris per token
                </h3>
                <p className="text-2xl font-bold text-nordic-blue">
                  {property.price_per_token.toLocaleString()} NOK
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-600 mb-1">
                    Forventet årlig avkastning
                  </h4>
                  <p className="text-base font-semibold text-accent">
                    {property.yield}%
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-600 mb-1">
                    Tilgjengelige tokens
                  </h4>
                  <p className="text-base">
                    {property.max_tokens - property.tokens_sold} av{" "}
                    {property.max_tokens}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TradeButton
                  propertyId={property.id}
                  tokenCount={1}
                  pricePerToken={property.price_per_token}
                  orderType="BUY"
                  onSuccess={() => {}}
                />
                <TradeButton
                  propertyId={property.id}
                  tokenCount={1}
                  pricePerToken={property.price_per_token}
                  orderType="SELL"
                  onSuccess={() => {}}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;