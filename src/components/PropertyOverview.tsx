import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserHolding } from "@/types/UserHolding";

interface HoldingWithProperty extends UserHolding {
  properties: {
    price_per_token: number;
    yield: number;
    name: string;
    location: string;
  };
}

export const PropertyOverview = () => {
  const { data: holdings, refetch } = useQuery<HoldingWithProperty[]>({
    queryKey: ['holdings'],
    queryFn: async () => {
      const { data: holdings, error } = await supabase
        .from('user_holdings')
        .select(`
          *,
          properties (
            price_per_token,
            yield,
            name,
            location
          )
        `);

      if (error) throw error;
      return holdings;
    }
  });

  useEffect(() => {
    const channel = supabase.channel('user_holdings_changes');
    
    channel
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_holdings' 
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [refetch]);

  return (
    <div>
      {holdings?.map((holding) => (
        <div key={holding.id}>
          <h3>{holding.properties.name}</h3>
          <p>Location: {holding.properties.location}</p>
          <p>Price per Token: {holding.properties.price_per_token}</p>
          <p>Yield: {holding.properties.yield}%</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyOverview;