import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";

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

  const { data: holding, refetch, isLoading } = useQuery({
    queryKey: ['holdings-for-claim', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
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
      
      if (error) {
        toast.error("Kunne ikke hente holdings data");
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
    retry: 1,
  });

  const handleClaim = async () => {
    if (!user?.id || !holding) return;

    try {
      const dailyYield = holding.token_count * (holding.property.price_per_token * (holding.property.yield / 100) / 365);
      
      const { error } = await supabase
        .from('user_holdings')
        .update({ 
          last_claim_at: new Date().toISOString(),
          accumulated_rent: dailyYield
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refetch();
      toast.success("Utbetaling er krevd!");
    } catch (error: any) {
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

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-[#1f1f1f] shadow-lg">
        <CardContent className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-primary-dark" />
        </CardContent>
      </Card>
    );
  }

  if (!user || !holding) return null;

  return (
    <Card className="bg-white dark:bg-[#1f1f1f] shadow-lg">
      <CardHeader>
        <CardTitle className="text-nordic-charcoal dark:text-white">Claim Utbetaling</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleClaim}
          disabled={!canClaim()}
          className="w-full bg-nordic-blue hover:bg-nordic-blue/90 text-white"
        >
          {canClaim() ? "Claim daglig utbetaling" : "Allerede claimet i dag"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RentClaim;