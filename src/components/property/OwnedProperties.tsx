import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const OwnedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: ownedProperties } = useQuery({
    queryKey: ['owned-properties', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!ownedProperties?.length) return (
    <Card className="bg-white shadow-sm p-6 rounded-lg border-2 border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-6 w-6 text-nordic-blue" />
        <h2 className="text-xl font-semibold">Eiendommer jeg eier</h2>
      </div>
      <div className="text-center text-gray-500 py-8">
        Du har ingen eiendommer ennå. Klikk 'Liste Eiendom' for å opprette.
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm p-6 rounded-lg border-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-nordic-blue" />
            <h2 className="text-xl font-semibold">Eiendommer jeg eier</h2>
          </div>
          <Button
            onClick={() => navigate('/liste-eiendom')}
            className="bg-nordic-blue hover:bg-nordic-blue/90 text-white"
          >
            Liste ny eiendom
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedProperties.map((property) => (
            <Card 
              key={property.id} 
              className="p-4 bg-gradient-to-br from-white to-[#f9f9fc] hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 border-nordic-blue">
                  <img
                    src={property.image_url || '/placeholder.svg'}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-nordic-charcoal truncate">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Tokens solgt: {property.tokens_sold} / {property.max_tokens}
                    </div>
                    <Progress 
                      value={(property.tokens_sold / property.max_tokens) * 100} 
                      className="h-2 bg-gray-100"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="w-full mt-2 hover:bg-nordic-blue/5"
                    >
                      Administrer eiendom
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OwnedProperties;