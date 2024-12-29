import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const UserHoldings = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery({
    queryKey: ['holdings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          *,
          property:properties(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Mine eierandeler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {holdings && holdings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Eiendom</TableHead>
                <TableHead className="text-right">Antall tokens</TableHead>
                <TableHead className="text-right">Estimert verdi (NOK)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell className="font-medium">
                    {holding.property.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.token_count}
                  </TableCell>
                  <TableCell className="text-right">
                    {(holding.token_count * holding.property.price_per_token).toLocaleString()} NOK
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Du eier ingen tokens ennå
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserHoldings;