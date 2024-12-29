import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ChartBar } from "lucide-react";

type Property = {
  price_per_token: number;
  yield: number;
};

type HoldingWithProperty = {
  token_count: number;
  property: Property;
};

const Statistics = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery<HoldingWithProperty[]>({
    queryKey: ['holdings-with-yield', user?.id],
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
      return (data || []).map(holding => ({
        token_count: holding.token_count,
        property: holding.property[0]
      })) as HoldingWithProperty[];
    },
    enabled: !!user,
  });

  const calculateDailyPayout = () => {
    if (!holdings) return 0;
    
    return holdings.reduce((total, holding) => {
      const annualYield = (holding.token_count * holding.property.price_per_token * (holding.property.yield / 100));
      return total + (annualYield / 365);
    }, 0);
  };

  const dailyPayout = calculateDailyPayout();

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ChartBar className="h-6 w-6 text-blue-600" />
          <CardTitle>
            Statistikk & Prognoser
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">
            Beregnet daglig utbetaling: {dailyPayout.toFixed(2)} kr
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            *Simulert avkastning, ikke garantert.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;