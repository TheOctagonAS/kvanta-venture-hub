import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserHoldings from "@/components/UserHoldings";
import StatisticsRow from "@/components/property-overview/StatisticsRow";
import { usePropertyData } from "@/components/property-overview/usePropertyData";
import OwnedProperties from "@/components/property/OwnedProperties";
import OwnerInfoBox from "./OwnerInfoBox";

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

      <OwnerInfoBox />

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">DeFi Muligheter</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Bruk dine eiendomstokens som sikkerhet
            </h3>
            <p className="text-blue-700 mb-4">
              Du kan nå bruke dine eiendomstokens som sikkerhet i DeFi-protokoller. 
              Velg en eiendom fra listen nedenfor og klikk på "DeFi" knappen for å komme i gang.
            </p>
          </div>
        </div>

        <UserHoldings />
      </div>
      
      {isKyc && <OwnedProperties />}
    </div>
  );
};

export default MainContent;