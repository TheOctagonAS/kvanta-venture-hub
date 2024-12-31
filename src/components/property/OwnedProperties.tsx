import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building } from "lucide-react";
import { Property } from "@/types/property";

const OwnedProperties = () => {
  const { user } = useAuth();

  const { data: ownedProperties } = useQuery<Property[]>({
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
    <Card className="bg-white shadow-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-6 w-6 text-nordic-blue" />
        <h2 className="text-xl font-semibold">Mine Eiendommer</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Eiendom</TableHead>
            <TableHead>Beliggenhet</TableHead>
            <TableHead className="text-right">Pris per token</TableHead>
            <TableHead className="text-right">Solgte tokens</TableHead>
            <TableHead className="text-right">Avkastning</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ownedProperties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.name}</TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell className="text-right">
                {property.price_per_token.toLocaleString()} NOK
              </TableCell>
              <TableCell className="text-right">
                {property.tokens_sold.toLocaleString()} / {property.max_tokens.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {property.yield}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OwnedProperties;