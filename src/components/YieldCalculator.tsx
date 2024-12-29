import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

const YieldCalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [apy, setApy] = useState<string>("5");
  const [yields, setYields] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });

  useEffect(() => {
    const investment = parseFloat(amount) || 0;
    const apyRate = parseFloat(apy) / 100;

    setYields({
      daily: (investment * apyRate) / 365,
      monthly: (investment * apyRate) / 12,
      yearly: investment * apyRate,
    });
  }, [amount, apy]);

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Se potensielt daglig/månedlig/årlig avkastning
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Investeringsbeløp (NOK)
            </label>
            <Input
              type="number"
              placeholder="F.eks. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Estimert APY
            </label>
            <Select value={apy} onValueChange={setApy}>
              <SelectTrigger>
                <SelectValue placeholder="Velg APY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="8">8%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="15">15%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-nordic-softblue p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Daglig avkastning</p>
            <p className="text-xl font-semibold">
              {yields.daily.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-nordic-softblue p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Månedlig avkastning</p>
            <p className="text-xl font-semibold">
              {yields.monthly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-nordic-softblue p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Årlig avkastning</p>
            <p className="text-xl font-semibold">
              {yields.yearly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YieldCalculator;