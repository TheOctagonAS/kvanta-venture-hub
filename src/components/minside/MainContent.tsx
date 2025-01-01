import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Building2, ChartBar, Receipt, DollarSign, Percent, PiggyBank, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserHoldings from "@/components/UserHoldings";
import { usePropertyData } from "@/components/property-overview/usePropertyData";
import OwnedProperties from "@/components/property/OwnedProperties";

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-nordic-charcoal mb-2">Din Portefølje</h1>
        <p className="text-sm text-gray-600">
          Oversikt over dine eiendomsandeler, avkastning og DeFi-muligheter
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-nordic-blue" />
            <span className="text-sm text-gray-600">Est. Eiendomsverdi</span>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {calculateTotalValue().toLocaleString()} NOK
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="h-5 w-5 text-nordic-blue" />
            <span className="text-sm text-gray-600">Total avkastning</span>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {calculateAverageYield().toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="h-5 w-5 text-nordic-blue" />
            <span className="text-sm text-gray-600">Total innestående</span>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {calculateTotalRent().toLocaleString()} NOK
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-nordic-blue" />
            <span className="text-sm text-gray-600">Daglig leie</span>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {(calculateTotalRent() / 365).toFixed(0)} NOK
          </p>
        </div>
      </div>

      {/* DeFi Section */}
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
            className="bg-nordic-blue hover:bg-nordic-blue/90 text-white flex items-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:translate-y-[-1px]"
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        {isKyc && (
          <Button 
            onClick={() => navigate('/liste-eiendom')}
            className="flex items-center gap-2 bg-nordic-blue text-white hover:bg-nordic-blue/90 transition-all duration-200 hover:shadow-lg hover:translate-y-[-1px]"
          >
            <Plus className="h-4 w-4" />
            Liste Eiendom
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => navigate('/leie-og-avkastning')}
          className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
        >
          <ChartBar className="h-4 w-4" />
          Leie og Avkastning
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/skatt')}
          className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
        >
          <Receipt className="h-4 w-4" />
          Skatteoversikt
        </Button>
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