import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Building2, ChartBar, Receipt } from "lucide-react";
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
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-nordic-charcoal mb-2">Min portefølje</h1>
          <p className="text-gray-600">Velkommen tilbake{profile?.is_kyc ? "!" : ", fullfør KYC for å komme i gang"}</p>
        </div>
        <div className="flex gap-4">
          {isKyc && (
            <Button 
              onClick={() => navigate('/liste-eiendom')}
              className="flex items-center gap-2 bg-nordic-blue text-white hover:bg-nordic-blue/90"
            >
              <Plus className="h-4 w-4" />
              Liste Eiendom
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/leie-og-avkastning')}
            className="flex items-center gap-2"
          >
            <ChartBar className="h-4 w-4" />
            Leie og Avkastning
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/skatt')}
            className="flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            Skatteoversikt
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Est. Eiendomsverdi</p>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {calculateTotalValue().toLocaleString()} NOK
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Totalt avkastning</p>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {calculateAverageYield().toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Totalt innestående</p>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {calculateTotalRent().toLocaleString()} NOK
          </p>
        </div>
      </div>

      {/* DeFi Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-nordic-charcoal">DeFi Muligheter</h2>
        <div className="bg-gradient-to-r from-[#E9F2FF] to-[#F5F8FF] p-6 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-nordic-charcoal mb-2">
                Bruk dine eiendomstokens som sikkerhet
              </h3>
              <p className="text-gray-600 max-w-2xl">
                Du kan nå bruke dine eiendomstokens som sikkerhet i DeFi-protokoller. 
                Få tilgang til likviditet uten å selge dine tokens.
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-nordic-blue hover:bg-nordic-blue/90 text-white flex items-center gap-2 shadow-md"
              onClick={() => {
                const firstHolding = document.querySelector('[data-defi-button]');
                if (firstHolding) {
                  (firstHolding as HTMLButtonElement).click();
                }
              }}
            >
              <Wallet className="h-5 w-5" />
              Start DeFi Utlån
            </Button>
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="space-y-8">
        <UserHoldings />
        {isKyc && <OwnedProperties />}
      </div>
    </div>
  );
};

export default MainContent;