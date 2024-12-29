import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Coins } from "lucide-react";

type Property = {
  price_per_token: number;
  yield: number;
};

type HoldingWithProperty = {
  id: string;
  token_count: number;
  property: Property;
};

const RentClaim = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: holdings, error: holdingsError } = await supabase
        .from('user_holdings')
        .select(`
          id,
          token_count,
          property:properties (
            price_per_token,
            yield
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (holdingsError) throw holdingsError;

      let totalRent = 0;

      if (holdings) {
        const dailyRent = (
          holdings.token_count *
          holdings.property.yield /
          365 /
          100 *
          holdings.property.price_per_token
        );

        totalRent += dailyRent;

        const { error: updateError } = await supabase
          .from('user_holdings')
          .update({
            accumulated_rent: dailyRent,
            last_claim_at: new Date().toISOString()
          })
          .eq('id', holdings.id);

        if (updateError) throw updateError;
      }

      toast.success(
        `Du har claimet ${totalRent.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} kr i daglig yield!`
      );

      queryClient.invalidateQueries({ queryKey: ['holdings'] });
    } catch (error) {
      console.error('Error claiming rent:', error);
      toast.error('Kunne ikke hente yield-utbetaling. Prøv igjen senere.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Coins className="h-5 w-5" />
          DeFi Eiendom
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleClaim}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {isLoading ? (
            "Prosesserer claim..."
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              Claim dagens yield
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RentClaim;