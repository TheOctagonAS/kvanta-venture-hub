import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { Building2, TrendingUp } from "lucide-react";

interface RentData {
  date: string;
  amount: number;
}

const LeieOgAvkastning = () => {
  const { user } = useAuth();

  const { data: rentHistory } = useQuery({
    queryKey: ['rent-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          accumulated_rent,
          last_claim_at,
          property:properties(
            price_per_token,
            yield
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Generate daily data for the last 30 days
      const dailyData: RentData[] = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), i);
        const formattedDate = format(date, 'dd.MM.yyyy', { locale: nb });
        
        // Calculate daily rent based on holdings
        const dailyRent = (data || []).reduce((total, holding) => {
          if (!holding.property[0]) return total;
          const value = holding.property[0].price_per_token;
          const yield_rate = holding.property[0].yield;
          return total + (value * (yield_rate / 100)) / 365;
        }, 0);

        return {
          date: formattedDate,
          amount: dailyRent
        };
      }).reverse();

      return dailyData;
    },
    enabled: !!user
  });

  const { data: holdings } = useQuery({
    queryKey: ['holdings-value', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          token_count,
          property:properties(
            price_per_token,
            yield
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const calculateTotalValue = () => {
    if (!holdings) return 0;
    return holdings.reduce((total, holding) => {
      if (!holding.property[0]) return total;
      return total + (holding.token_count * holding.property[0].price_per_token);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Leie og Avkastning
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mottatt Leie Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-nordic-blue" />
              <CardTitle>Mottatt Leie</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rentHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0066FF" 
                    name="Daglig leie (NOK)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Oversikt Avkastning Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-nordic-blue" />
              <CardTitle>Oversikt Avkastning</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total porteføljeverdi</p>
                <p className="text-2xl font-bold">
                  {calculateTotalValue().toLocaleString()} NOK
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Estimert årlig leieinntekt</p>
                <p className="text-2xl font-bold text-nordic-blue">
                  {((calculateTotalValue() * 0.05)).toLocaleString()} NOK
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeieOgAvkastning;