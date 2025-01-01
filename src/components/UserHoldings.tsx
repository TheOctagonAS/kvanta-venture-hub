import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Building2, Wallet, DollarSign, Percent, PiggyBank } from "lucide-react";
import { useState } from "react";
import { DefiCollateralModal } from "./defi/DefiCollateralModal";

type Property = {
  id: string;
  name: string;
  price_per_token: number;
  yield: number;
  image_url: string | null;
  on_chain_symbol?: string;
};

type HoldingWithProperty = {
  id: string;
  token_count: number;
  accumulated_rent: number;
  property: Property;
};

const UserHoldings = () => {
  const { user } = useAuth();
  const [selectedHolding, setSelectedHolding] = useState<HoldingWithProperty | null>(null);

  const { data: holdings } = useQuery({
    queryKey: ['holdings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_holdings')
        .select(`
          id,
          token_count,
          accumulated_rent,
          property:properties(
            id,
            name,
            price_per_token,
            yield,
            image_url,
            on_chain_symbol
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(holding => ({
        id: holding.id,
        token_count: holding.token_count,
        accumulated_rent: holding.accumulated_rent,
        property: holding.property[0]
      }));
    },
    enabled: !!user,
  });

  if (!user) return null;

  const calculateTotals = () => {
    if (!holdings) return { totalTokens: 0, totalValue: 0, totalRent: 0 };
    
    return holdings.reduce((acc, holding) => {
      const value = holding.token_count * holding.property.price_per_token;
      const dailyRent = (value * (holding.property.yield / 100)) / 365;
      
      return {
        totalTokens: acc.totalTokens + holding.token_count,
        totalValue: acc.totalValue + value,
        totalRent: acc.totalRent + holding.accumulated_rent,
      };
    }, { totalTokens: 0, totalValue: 0, totalRent: 0 });
  };

  const { totalTokens, totalValue, totalRent } = calculateTotals();

  return (
    <Card className="bg-white shadow-sm rounded-xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-nordic-blue" />
          <h2 className="text-xl font-semibold text-nordic-charcoal">Mine Eiendeler</h2>
        </div>
      </div>

      <div className="p-6">
        {holdings && holdings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holdings.map((holding) => {
              const value = holding.token_count * holding.property.price_per_token;
              const dailyRent = (value * (holding.property.yield / 100)) / 365;

              return (
                <div
                  key={holding.id}
                  className="bg-gradient-to-br from-white to-[#f9f9fc] rounded-lg border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="flex items-start p-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-lg border-2 border-nordic-blue overflow-hidden mr-3 flex-shrink-0">
                      {holding.property.image_url ? (
                        <img
                          src={holding.property.image_url}
                          alt={holding.property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-nordic-softblue flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-nordic-blue" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link 
                        to={`/property/${holding.property.id}`}
                        className="text-base font-medium text-nordic-charcoal hover:text-nordic-blue transition-colors"
                      >
                        {holding.property.name}
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Antall tokens</span>
                      <span className="text-lg font-semibold text-nordic-charcoal">
                        {holding.token_count.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Verdi</span>
                      <span className="text-lg font-semibold text-nordic-charcoal">
                        {value.toLocaleString()} NOK
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Daglig leie</span>
                      <span className="text-lg font-semibold text-accent">
                        {dailyRent.toFixed(2)} NOK
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total avkastning</span>
                      <span className="text-lg font-semibold text-accent">
                        {holding.accumulated_rent.toLocaleString()} NOK
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4 flex items-center justify-center gap-2 hover:bg-nordic-blue hover:text-white"
                      onClick={() => setSelectedHolding(holding)}
                    >
                      <Wallet className="h-4 w-4" />
                      DeFi
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Du har ingen tokens i porteføljen ennå
          </div>
        )}

        {holdings && holdings.length > 0 && (
          <div className="mt-8 p-4 bg-nordic-softblue rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-md">
                <span className="text-gray-600">Totalt antall tokens</span>
                <span className="text-lg font-semibold">{totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-md">
                <span className="text-gray-600">Total verdi</span>
                <span className="text-lg font-semibold">{totalValue.toLocaleString()} NOK</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-md">
                <span className="text-gray-600">Total avkastning</span>
                <span className="text-lg font-semibold">{totalRent.toLocaleString()} NOK</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <DefiCollateralModal
        isOpen={!!selectedHolding}
        onClose={() => setSelectedHolding(null)}
        tokenSymbol={selectedHolding?.property.on_chain_symbol}
        propertyId={selectedHolding?.property.id || ''}
        tokenCount={selectedHolding?.token_count || 0}
      />
    </Card>
  );
};

export default UserHoldings;