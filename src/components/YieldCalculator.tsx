import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import YieldCards from "./calculator/YieldCards";
import GrowthChart from "./calculator/GrowthChart";
import CalculatorCTA from "./calculator/CalculatorCTA";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const YieldCalculator = () => {
  const [amount, setAmount] = useState<string>("100000");
  const [yields, setYields] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    compoundedYearly: 0,
  });
  const [growthData, setGrowthData] = useState<Array<{
    day: number;
    standard: number;
    compound: number;
  }>>([]);

  const APY = 8.5;

  useEffect(() => {
    const investment = parseFloat(amount) || 0;
    const apyRate = APY / 100;
    const dailyRate = apyRate / 365;

    const dailyYield = (investment * apyRate) / 365;
    const monthlyYield = (investment * apyRate) / 12;
    const yearlyYield = investment * apyRate;

    const compoundedAmount = investment * Math.pow(1 + dailyRate, 365);
    const compoundedYearlyYield = compoundedAmount - investment;

    setYields({
      daily: dailyYield,
      monthly: monthlyYield,
      yearly: yearlyYield,
      compoundedYearly: compoundedYearlyYield,
    });

    const data = [];
    for (let day = 0; day <= 30; day++) {
      const standardGrowth = investment + (dailyYield * day);
      const compoundGrowth = investment * Math.pow(1 + dailyRate, day);
      data.push({
        day,
        standard: standardGrowth,
        compound: compoundGrowth,
      });
    }
    setGrowthData(data);
  }, [amount]);

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString());
  };

  return (
    <div className="bg-[#f8fbff] p-4 rounded-lg">
      <Card className="bg-white shadow-sm">
        <CardHeader className="space-y-1 border-b border-gray-100 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-nordic-blue" />
              Kalkulator: Hva kan du tjene?
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-nordic-charcoal">Estimert årlig avkastning:</span>
                    <span className="text-lg font-bold text-nordic-blue">{APY}%</span>
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Beregnet av gj.snitt leie + antatt verdiøkning. (Historisk data, ingen garanti)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-gray-600">
            Juster beløpet nedenfor for å se et omtrentlig estimat basert på historisk avkastning.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">
          <div className="grid gap-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row md:items-end gap-4 p-4">
                <div className="flex-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    Investeringsbeløp (NOK)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg font-medium"
                  />
                </div>
                <div className="flex-1">
                  <Slider
                    defaultValue={[100000]}
                    max={5000000}
                    step={1000}
                    value={[parseFloat(amount) || 0]}
                    onValueChange={handleSliderChange}
                    className="[&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue [&>.block]:border-nordic-blue [&>.block]:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <YieldCards yields={yields} />
          <GrowthChart data={growthData} />
          <CalculatorCTA />
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldCalculator;