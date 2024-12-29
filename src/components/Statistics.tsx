import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

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
      return (data || []) as HoldingWithProperty[];
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
    <Card>
      <CardHeader>
        <CardTitle>
          Statistikk & Prognoser
        </CardTitle>
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