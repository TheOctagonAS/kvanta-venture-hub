import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Home, ChartBar, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { BalanceModal } from "./BalanceModal";

interface Property {
  price_per_token: number;
  yield: number;
}

interface HoldingWithProperty {
  token_count: number;
  accumulated_rent: number;
  property: Property;
}

const PropertyOverview = () => {
  const { user } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
      
      // Transform the data to match our interface
      return (data || []).map(holding => ({
        token_count: holding.token_count,
        accumulated_rent: holding.accumulated_rent,
        property: holding.property[0] // Take first item since it's returned as an array
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

  const handleBalanceUpdate = async () => {
    await Promise.all([refetchBalance(), refetchHoldings()]);
  };

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

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-nordic-charcoal">Eiendomsoversikt</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
              <p className="text-2xl font-bold text-nordic-charcoal">
                {(userBalance?.balance || 0).toLocaleString()} NOK
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowDepositModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Innskudd
              </Button>
              <Button
                onClick={() => setShowWithdrawModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Minus className="h-4 w-4" /> Uttak
              </Button>
            </div>
          </div>
        </Card>

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

      {/* New Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 rounded-lg">
          <h3 className="text-base text-[#666] dark:text-gray-400 mb-1">Est. Eiendomsverdi</h3>
          <p className="text-lg font-semibold text-nordic-charcoal dark:text-gray-200">
            {calculateTotalValue().toLocaleString()} NOK
          </p>
        </div>
        <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 rounded-lg">
          <h3 className="text-base text-[#666] dark:text-gray-400 mb-1">Totalt avkastning</h3>
          <p className="text-lg font-semibold text-nordic-charcoal dark:text-gray-200">
            {calculateAverageYield()}%
          </p>
        </div>
        <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 rounded-lg">
          <h3 className="text-base text-[#666] dark:text-gray-400 mb-1">Totalt innestående</h3>
          <p className="text-lg font-semibold text-nordic-charcoal dark:text-gray-200">
            {(calculateTotalValue() + calculateTotalRent()).toLocaleString()} NOK
          </p>
        </div>
      </div>

      <BalanceModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        type="deposit"
        onSuccess={handleBalanceUpdate}
      />

      <BalanceModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        type="withdraw"
        onSuccess={handleBalanceUpdate}
      />
    </div>
  );
};

export default PropertyOverview;
