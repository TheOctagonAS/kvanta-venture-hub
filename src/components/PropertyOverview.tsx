import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Home, ChartBar, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

type HoldingWithProperty = {
  token_count: number;
  accumulated_rent: number;
  property: {
    price_per_token: number;
  };
};

const PropertyOverview = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery<HoldingWithProperty[]>({
    queryKey: ['holdings-overview', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          token_count,
          accumulated_rent,
          property:properties(
            price_per_token
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
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

  const handleDeposit = () => {
    toast.info("Innskudd-funksjonalitet kommer snart");
  };

  const handleWithdraw = () => {
    toast.info("Uttak-funksjonalitet kommer snart");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-nordic-charcoal">Eiendomsoversikt</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Account Value Box */}
        <Card className="p-6 bg-white">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-nordic-blue" />
                <h3 className="text-sm text-gray-600">Kontoverdi</h3>
              </div>
              <p className="text-2xl font-bold text-nordic-charcoal">
                {calculateTotalValue().toLocaleString()} NOK
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Tilgjengelig saldo</h3>
              <p className="text-2xl font-bold text-nordic-charcoal">0 NOK</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDeposit}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Innskudd
              </Button>
              <Button
                onClick={handleWithdraw}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Minus className="h-4 w-4" /> Uttak
              </Button>
            </div>
          </div>
        </Card>

        {/* Rent Balance Box */}
        <Card className="p-6 bg-white">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChartBar className="h-5 w-5 text-nordic-blue" />
                <h3 className="text-sm text-gray-600">Leiesaldo</h3>
              </div>
              <p className="text-2xl font-bold text-nordic-charcoal">
                {calculateTotalRent().toLocaleString()} NOK
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Totalt tjent i leie</h3>
              <p className="text-2xl font-bold text-accent">
                {calculateTotalRent().toLocaleString()} NOK
              </p>
            </div>
          </div>
        </Card>

        {/* Property Count Box */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-5 w-5 text-nordic-blue" />
            <h3 className="text-sm text-gray-600">Antall eiendommer</h3>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {holdings?.length || 0}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PropertyOverview;