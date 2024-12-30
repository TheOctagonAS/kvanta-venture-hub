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
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import RentClaim from "./RentClaim";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

type Property = {
  id: string;
  name: string;
  price_per_token: number;
};

type HoldingWithProperty = {
  id: string;
  token_count: number;
  property: Property;
  accumulated_rent: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const UserHoldings = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery({
    queryKey: ['holdings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          id,
          token_count,
          accumulated_rent,
          property:properties(
            id,
            name,
            price_per_token
          )
        `)
        .eq('user_id', user.id);
      
      if (error) {
        toast.error("Kunne ikke hente holdings data");
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  const calculatePortfolioData = () => {
    if (!holdings) return [];
    
    const totalValue = holdings.reduce((sum, holding) => 
      sum + (holding.token_count * holding.property.price_per_token), 0);

    return holdings.map((holding) => {
      const value = holding.token_count * holding.property.price_per_token;
      return {
        name: holding.property.name,
        value,
        percentage: ((value / totalValue) * 100).toFixed(1)
      };
    });
  };

  const portfolioData = calculatePortfolioData();
  const totalAccumulatedRent = holdings?.reduce((sum, holding) => sum + Number(holding.accumulated_rent), 0) || 0;

  if (!user) return null;

  return (
    <div className="space-y-6">
      <RentClaim />
      
      <Card className="bg-white dark:bg-[#1f1f1f] shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-nordic-blue" />
            <CardTitle className="text-xl font-semibold text-nordic-charcoal dark:text-white">
              Din DeFi Portefølje
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {holdings && holdings.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-nordic-gray dark:text-gray-400">Total akkumulert leie</p>
                <p className="text-2xl font-semibold text-nordic-charcoal dark:text-white">
                  {totalAccumulatedRent.toLocaleString()} NOK
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-nordic-charcoal dark:text-gray-400">Eiendom</TableHead>
                    <TableHead className="text-right text-nordic-charcoal dark:text-gray-400">Antall tokens</TableHead>
                    <TableHead className="text-right text-nordic-charcoal dark:text-gray-400">Verdi (NOK)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell className="font-medium text-nordic-charcoal dark:text-white">
                        {holding.property.name}
                      </TableCell>
                      <TableCell className="text-right text-nordic-charcoal dark:text-white">
                        {holding.token_count}
                      </TableCell>
                      <TableCell className="text-right text-nordic-charcoal dark:text-white">
                        {(holding.token_count * holding.property.price_per_token).toLocaleString()} NOK
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-center text-nordic-gray dark:text-gray-400 py-8">
              Du har ingen tokens i porteføljen ennå
            </p>
          )}
        </CardContent>
      </Card>

      {holdings && holdings.length > 0 && (
        <Card className="bg-white dark:bg-[#1f1f1f] shadow-lg">
          <CardHeader>
            <CardTitle className="text-nordic-charcoal dark:text-white">Porteføljefordeling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toLocaleString()} NOK`} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserHoldings;