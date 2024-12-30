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
    const subscription = supabase
      .from('user_holdings')
      .on('INSERT', () => {
        refetch();
      })
      .on('UPDATE', () => {
        refetch();
      })
      .on('DELETE', () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [refetch]);

  return (
    <div>
      {holdings?.map((holding) => (
        <div key={holding.id}>
          <h3>{holding.properties.name}</h3>
          <p>Location: {holding.properties.location}</p>
          <p>Price per Token: {holding.properties.price_per_token}</p>
          <p>Yield: {holding.properties.yield}</p>
        </div>
      ))}
    </div>
  );
};
