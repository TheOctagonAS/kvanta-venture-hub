import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserHoldings from "@/components/UserHoldings";
import StatisticsRow from "@/components/property-overview/StatisticsRow";
import { usePropertyData } from "@/components/property-overview/usePropertyData";

interface MainContentProps {
  isKyc: boolean;
  onStartKYC: () => Promise<void>;
}

const MainContent = ({ isKyc, onStartKYC }: MainContentProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    calculateTotalValue,
    calculateAverageYield,
    calculateTotalRent,
    holdings 
  } = usePropertyData();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-nordic-charcoal">Min portefølje</h1>
        {isKyc && (
          <Button 
            onClick={() => navigate('/liste-eiendom')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Liste Eiendom
          </Button>
        )}
      </div>

      <StatisticsRow
        totalValue={calculateTotalValue()}
        averageYield={calculateAverageYield()}
        totalBalance={calculateTotalRent()}
      />

      <UserHoldings />
    </div>
  );
};

export default MainContent;