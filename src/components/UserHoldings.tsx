import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Building2, Wallet } from "lucide-react";
import { useState } from "react";
import { DefiCollateralModal } from "./defi/DefiCollateralModal";

type Property = {
  id: string;
  name: string;
  price_per_token: number;
  yield: number;
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
    <Card className="bg-white shadow-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6 text-nordic-blue" />
        <h2 className="text-xl font-semibold">Mine Eiendeler</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Eiendom</TableHead>
            <TableHead className="text-right">Antall tokens</TableHead>
            <TableHead className="text-right">Verdi (NOK)</TableHead>
            <TableHead className="text-right">Daglig leie</TableHead>
            <TableHead className="text-right">Total avkastning</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings && holdings.length > 0 ? (
            holdings.map((holding) => {
              const value = holding.token_count * holding.property.price_per_token;
              const dailyRent = (value * (holding.property.yield / 100)) / 365;

              return (
                <TableRow key={holding.id}>
                  <TableCell>
                    <Link 
                      to={`/property/${holding.property.id}`}
                      className="text-nordic-blue hover:underline"
                    >
                      {holding.property.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.token_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {value.toLocaleString()} NOK
                  </TableCell>
                  <TableCell className="text-right">
                    {dailyRent.toFixed(2)} NOK
                  </TableCell>
                  <TableCell className="text-right">
                    {holding.accumulated_rent.toLocaleString()} NOK
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      onClick={() => setSelectedHolding(holding)}
                    >
                      <Wallet className="h-4 w-4" />
                      DeFi
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                Du har ingen tokens i porteføljen ennå
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {holdings && holdings.length > 0 && (
          <TableFooter>
            <TableRow className="font-semibold">
              <TableCell>Sum</TableCell>
              <TableCell className="text-right">
                {totalTokens.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {totalValue.toLocaleString()} NOK
              </TableCell>
              <TableCell className="text-right">
                {((totalValue * (holdings[0]?.property.yield || 0) / 100) / 365).toFixed(2)} NOK
              </TableCell>
              <TableCell className="text-right">
                {totalRent.toLocaleString()} NOK
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

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