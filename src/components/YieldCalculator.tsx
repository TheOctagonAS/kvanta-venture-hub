import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, TrendingUp, Calendar, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const YieldCalculator = () => {
  const [amount, setAmount] = useState<string>("100000");
  const [yields, setYields] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    compoundedYearly: 0,
  });

  const APY = 8.5; // Optimistic estimate as default

  useEffect(() => {
    const investment = parseFloat(amount) || 0;
    const apyRate = APY / 100;
    const dailyRate = apyRate / 365;

    // Calculate simple interest returns
    const dailyYield = (investment * apyRate) / 365;
    const monthlyYield = (investment * apyRate) / 12;
    const yearlyYield = investment * apyRate;

    // Calculate compound interest (reinvesting daily returns)
    const compoundedAmount = investment * Math.pow(1 + dailyRate, 365);
    const compoundedYearlyYield = compoundedAmount - investment;

    setYields({
      daily: dailyYield,
      monthly: monthlyYield,
      yearly: yearlyYield,
      compoundedYearly: compoundedYearlyYield,
    });
  }, [amount]);

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString());
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="space-y-1 border-b border-gray-100 bg-nordic-lightgray">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6 text-nordic-blue" />
          Se potensielt daglig/månedlig/årlig avkastning
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6">
        <div className="grid gap-4">
          <div className="space-y-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Investeringsbeløp (NOK)
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-lg font-medium"
              />
            </div>
            <Slider
              defaultValue={[100000]}
              max={1000000}
              step={1000}
              value={[parseFloat(amount) || 0]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>
          <div className="space-y-2">
            <div className="bg-nordic-softblue rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                Estimert årlig avkastning: <span className="font-semibold">{APY}%</span>
                <br />
                <span className="text-xs">
                  (4.5% gjennomsnittlig leieavkastning + 4% historisk verdistigning)
                </span>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Dette estimatet er basert på historisk gjennomsnittlig avkastning fra næringseiendom i Norge de siste 10 årene. 
                Merk at historisk avkastning ikke er en garanti for fremtidig avkastning. Verdien av investeringen kan både øke og synke, 
                og du kan tape deler av eller hele det investerte beløpet.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Daglig avkastning</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.daily.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Månedlig avkastning</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.monthly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Årlig avkastning</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.yearly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
            <p className="text-xs text-gray-600 mt-2">Uten reinvestering</p>
          </div>
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Årlig avkastning med reinvestering</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.compoundedYearly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
            <p className="text-xs text-gray-600 mt-2">Med daglig reinvestering</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YieldCalculator;