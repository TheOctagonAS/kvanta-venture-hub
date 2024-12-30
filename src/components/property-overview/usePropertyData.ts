import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface Property {
  price_per_token: number;
  yield: number;
}

interface HoldingWithProperty {
  token_count: number;
  accumulated_rent: number;
  property: Property;
}

export const usePropertyData = () => {
  const { user } = useAuth();

  const { data: holdings, refetch: refetchHoldings } = useQuery({
    queryKey: ['holdings-overview', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          token_count,
          accumulated_rent,
          property:properties(
            price_per_token,
            yield
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return (data || []).map(holding => ({
        token_count: holding.token_count,
        accumulated_rent: holding.accumulated_rent,
        property: holding.property[0]
      })) as HoldingWithProperty[];
    },
    enabled: !!user,
  });

  const { data: userBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_balance')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const calculateTotalValue = () => {
    if (!holdings) return 0;
    return holdings.reduce((total, holding) => 
      total + (holding.token_count * holding.property.price_per_token), 0);
  };

  const calculateTotalRent = () => {
    if (!holdings) return 0;
    return holdings.reduce((total, holding) => 
      total + (holding.accumulated_rent || 0), 0);
  };

  const calculateAverageYield = () => {
    if (!holdings || holdings.length === 0) return 0;
    const totalYield = holdings.reduce((sum, holding) => 
      sum + (holding.property.yield || 0), 0);
    return (totalYield / holdings.length).toFixed(1);
  };

  return {
    holdings,
    userBalance,
    refetchHoldings,
    refetchBalance,
    calculateTotalValue,
    calculateTotalRent,
    calculateAverageYield,
  };
};