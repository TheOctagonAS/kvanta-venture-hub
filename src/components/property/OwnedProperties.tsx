import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { OwnerBalanceCard } from "./OwnerBalanceCard";

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
    <Card className="bg-white shadow-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-6 w-6 text-nordic-blue" />
        <h2 className="text-xl font-semibold">Mine Eiendommer</h2>
      </div>
      <div className="text-center text-gray-500 py-8">
        Du har ingen eiendommer ennå. Klikk 'Liste Eiendom' for å opprette.
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <OwnerBalanceCard />
      
      <Card className="bg-white shadow-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-6 w-6 text-nordic-blue" />
          <h2 className="text-xl font-semibold">Mine Eiendommer</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Navn</th>
                <th className="pb-2">Sted</th>
                <th className="pb-2">Tokens solgt</th>
                <th className="pb-2">Status</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {ownedProperties.map((property) => (
                <tr key={property.id} className="border-b last:border-0">
                  <td className="py-3">{property.name}</td>
                  <td className="py-3">{property.location}</td>
                  <td className="py-3">
                    {property.tokens_sold} / {property.max_tokens}
                  </td>
                  <td className="py-3">{property.status}</td>
                  <td className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      Detaljer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OwnedProperties;