import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, Gift, Info } from "lucide-react";
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-nordic-charcoal mb-8">
        Hvor langt kan investeringen* din gå?
      </h2>
      
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 rounded-full bg-nordic-softblue">
              <Home className="w-6 h-6 text-nordic-blue" />
            </div>
            <div className="flex-1">
              <p className="text-lg text-nordic-charcoal">
                Når du investerer for
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-bold border-none shadow-none p-0 h-auto w-48"
                />
                <span className="text-2xl font-bold text-nordic-charcoal">NOK</span>
              </div>
            </div>
          </div>

          <Slider
            defaultValue={[100000]}
            max={5000000}
            step={1000}
            value={[parseFloat(amount) || 0]}
            onValueChange={handleSliderChange}
            className="mb-8 [&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue [&>.block]:border-nordic-blue [&>.block]:bg-white"
          />

          <div className="flex items-center gap-4 p-4 bg-[#f8fbff] rounded-lg mb-6">
            <div className="p-2 rounded-full bg-[#47C757]/10">
              <Gift className="w-6 h-6 text-[#47C757]" />
            </div>
            <div className="flex-1">
              <p className="text-lg text-nordic-charcoal">Du tjener*</p>
              <p className="text-3xl font-bold text-[#47C757]">
                {yields.yearly.toLocaleString('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                })}
                <span className="text-base font-normal text-gray-500 ml-2">per år</span>
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-5 h-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-[200px]">
                    Basert på {APY}% årlig avkastning fra leieinntekter og antatt verdiøkning
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-6">
            <YieldCards yields={yields} />
            <GrowthChart data={growthData} />
            <CalculatorCTA />
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 text-center">
        *Alle beregninger er basert på {APY}% årlig avkastning. Faktisk avkastning kan variere.
      </p>
    </div>
  );
};

export default YieldCalculator;