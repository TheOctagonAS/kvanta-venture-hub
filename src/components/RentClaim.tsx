import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

type Property = {
  price_per_token: number;
  yield: number;
};

type HoldingWithProperty = {
  token_count: number;
  property: Property;
  last_claim_at: string | null;
};

const RentClaim = () => {
  const { user } = useAuth();

  const { data: holding } = useQuery<HoldingWithProperty | null>({
    queryKey: ['holdings-for-claim', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          token_count,
          last_claim_at,
          property:properties(
            price_per_token,
            yield
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        token_count: data.token_count,
        last_claim_at: data.last_claim_at,
        property: data.property[0]
      } as HoldingWithProperty;
    },
    enabled: !!user,
  });

  const handleClaim = async () => {
    if (!user || !holding) return;

    try {
      const { error } = await supabase
        .from('user_holdings')
        .update({ last_claim_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success("Utbetaling er krevd!");
    } catch (error) {
      console.error('Error claiming rent:', error);
      toast.error("Kunne ikke kreve utbetaling");
    }
  };

  const canClaim = () => {
    if (!holding?.last_claim_at) return true;
    const daysSinceLastClaim = differenceInDays(
      new Date(),
      new Date(holding.last_claim_at)
    );
    return daysSinceLastClaim >= 1;
  };

  if (!user || !holding) return null;

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Claim Utbetaling</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleClaim}
          disabled={!canClaim()}
          className="w-full"
        >
          {canClaim() ? "Claim daglig utbetaling" : "Allerede claimet i dag"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RentClaim;