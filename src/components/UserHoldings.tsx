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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import RentClaim from "./RentClaim";

type HoldingWithProperty = {
  id: string;
  token_count: number;
  property: {
    id: string;
    name: string;
    price_per_token: number;
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const UserHoldings = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery<HoldingWithProperty[]>({
    queryKey: ['holdings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          id,
          token_count,
          property:properties(
            id,
            name,
            price_per_token
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
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

  if (!user) return null;

  return (
    <div className="space-y-6">
      <RentClaim />
      
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

      {holdings && holdings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portefølje-fordeling</CardTitle>
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
