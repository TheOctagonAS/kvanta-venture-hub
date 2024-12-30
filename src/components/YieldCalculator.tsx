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
    year: number;
    standard: number;
    compound: number;
  }>>([]);

  const APY = 8.5; // Rental yield
  const PROPERTY_APPRECIATION = 5.0; // Annual property value appreciation rate
  const REINVESTMENT_BOOST = 1.15; // Additional growth factor for reinvestment

  useEffect(() => {
    const investment = parseFloat(amount) || 0;
    const rentalRate = APY / 100;
    const appreciationRate = PROPERTY_APPRECIATION / 100;
    
    // Daily rates for yield calculations
    const dailyRentalRate = rentalRate / 365;
    const dailyAppreciationRate = appreciationRate / 365;
    const totalDailyRate = (dailyRentalRate + dailyAppreciationRate) * REINVESTMENT_BOOST;

    const dailyYield = (investment * rentalRate) / 365;
    const monthlyYield = (investment * rentalRate) / 12;
    const yearlyYield = investment * rentalRate;

    // Calculate compounded returns including both rental income, property appreciation, and reinvestment effects
    const compoundedAmount = investment * Math.pow(1 + totalDailyRate, 365);
    const compoundedYearlyYield = compoundedAmount - investment;

    setYields({
      daily: dailyYield,
      monthly: monthlyYield,
      yearly: yearlyYield,
      compoundedYearly: compoundedYearlyYield,
    });

    // Generate growth data for the chart with enhanced compound effect
    const data = [];
    for (let year = 0; year <= 5; year++) { // Changed to 5 years
      // Standard growth includes both rental income and property appreciation
      const standardRentalGrowth = investment + (yearlyYield * year);
      const standardAppreciationGrowth = investment * Math.pow(1 + appreciationRate, year);
      const standardTotal = standardRentalGrowth + (standardAppreciationGrowth - investment);

      // Enhanced compound growth with reinvestment boost
      const compoundGrowth = investment * Math.pow(1 + (rentalRate + appreciationRate) * REINVESTMENT_BOOST, year);
      
      data.push({
        year,
        standard: standardTotal,
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
              <p className="text-lg text-nordic-charcoal">Total årlig avkastning*</p>
              <p className="text-3xl font-bold text-[#47C757]">
                {yields.compoundedYearly.toLocaleString('nb-NO', {
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
                    Basert på {APY}% årlig leieavkastning og {PROPERTY_APPRECIATION}% årlig verdiøkning på eiendommen, med reinvestering av utbytte
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
        *Basert på {APY}% årlig leieavkastning og {PROPERTY_APPRECIATION}% årlig verdiøkning, med reinvestering av utbytte. Faktisk avkastning kan variere.
      </p>
    </div>
  );
};

export default YieldCalculator;