import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Star, Users } from "lucide-react";
import { PropertyImage } from "@/components/property/PropertyImage";
import { TradeButton } from "@/components/trade/TradeButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
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

  const isLive = property.launch_date && new Date(property.launch_date) <= new Date();
  const isSoldOut = property.tokens_sold >= property.max_tokens;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/eiendommer')}
              className="mb-4"
            >
              ← Back to Properties
            </Button>
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

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-medium">Commercial</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-nordic-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Occupancy</p>
                    <p className="font-medium">100%</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                  />
                ))}
                <span className="text-gray-600 ml-2">(12 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 p-6 bg-white dark:bg-gray-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg text-gray-600 dark:text-gray-400">
                  Price per token
                </h3>
                <p className="text-3xl font-bold text-nordic-blue">
                  {property.price_per_token.toLocaleString()} NOK
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-600 dark:text-gray-400">
                    Projected Annual Return
                  </h4>
                  <p className="text-2xl font-semibold text-accent">
                    {property.yield}%
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-600 dark:text-gray-400">
                    Available Tokens
                  </h4>
                  <p className="text-lg font-medium">
                    {property.max_tokens - property.tokens_sold} of{" "}
                    {property.max_tokens}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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