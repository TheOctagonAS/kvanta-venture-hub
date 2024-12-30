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
    <div className="w-full max-w-lg mx-auto bg-[#f8fbff] dark:bg-[#101010]/50 p-2 rounded-lg">
      <Card className="bg-white dark:bg-[#1a1a1a] shadow-sm">
        <CardHeader className="space-y-1 border-b border-gray-100 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#333] dark:text-[#eee]">
              <Calculator className="w-4 h-4 text-nordic-blue" />
              Kalkulator
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium text-[#333] dark:text-[#eee]">Årlig avkastning:</span>
                    <span className="font-bold text-nordic-blue">{APY}%</span>
                    <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px]">
                  <p className="text-xs">
                    Beregnet av gj.snitt leie + antatt verdiøkning
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 p-3">
          <div className="grid gap-2">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block text-[#333] dark:text-[#eee]">
                    Investeringsbeløp (NOK)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-base font-medium dark:bg-[#2a2a2a] dark:text-[#eee] dark:border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <Slider
                    defaultValue={[100000]}
                    max={5000000}
                    step={1000}
                    value={[parseFloat(amount) || 0]}
                    onValueChange={handleSliderChange}
                    className="[&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue dark:[&>.relative]:bg-[#2a2a2a] [&>.block]:border-nordic-blue [&>.block]:bg-white dark:[&>.block]:bg-[#eee]"
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