import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const TOKEN_PRICE = 1000; // NOK

const UserHoldings = () => {
  const { user } = useAuth();

  const { data: holdings, refetch } = useQuery({
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

  const handleSimulateRent = () => {
    if (user && holdings) {
      const totalTokens = holdings.reduce(
        (sum, holding) => sum + holding.token_count,
        0
      );
      const dailyRent = totalTokens * 0.5;
      // addRentIncome(dailyRent);
      toast.success(`Du mottok ${dailyRent} kr i daglig leie`);
    }
  };

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
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Eiendom</TableHead>
                  <TableHead className="text-right">Antall tokens</TableHead>
                  <TableHead className="text-right">Verdi (NOK)</TableHead>
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
                      {(holding.token_count * TOKEN_PRICE).toLocaleString()} NOK
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSimulateRent} variant="outline">
                Simuler daglig leieinntekt
              </Button>
            </div>
          </div>
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