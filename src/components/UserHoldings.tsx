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

  const handleCollectRent = async () => {
    if (!user || !holdings) return;

    try {
      for (const holding of holdings) {
        const rentAmount = holding.token_count * 0.5;
        const newAccumulatedRent = (holding.accumulated_rent || 0) + rentAmount;
        
        const { error } = await supabase
          .from('user_holdings')
          .update({ accumulated_rent: newAccumulatedRent })
          .eq('id', holding.id);

        if (error) throw error;
      }

      await refetch();
      const totalRent = holdings.reduce((sum, holding) => sum + (holding.token_count * 0.5), 0);
      toast.success(`Du mottok ${totalRent.toFixed(2)} kr i daglig leie`);
    } catch (error) {
      console.error('Error collecting rent:', error);
      toast.error('Kunne ikke hente leie');
    }
  };

  if (!user) return null;

  const totalAccumulatedRent = holdings?.reduce(
    (sum, holding) => sum + (holding.accumulated_rent || 0),
    0
  ) || 0;

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
                  <TableHead className="text-right">Akkumulert leie (NOK)</TableHead>
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
                    <TableCell className="text-right">
                      {holding.accumulated_rent?.toFixed(2)} NOK
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-lg font-semibold">
                Total akkumulert leie: {totalAccumulatedRent.toFixed(2)} NOK
              </div>
              <Button onClick={handleCollectRent} variant="outline">
                Hent daglig leie
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