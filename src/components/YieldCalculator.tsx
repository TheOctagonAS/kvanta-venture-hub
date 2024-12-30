import { useState, useEffect } from "react";
import { Gift, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CalculatorHeader from "./calculator/CalculatorHeader";
import InvestmentInput from "./calculator/InvestmentInput";
import YieldCards from "./calculator/YieldCards";
import GrowthChart from "./calculator/GrowthChart";
import CalculatorCTA from "./calculator/CalculatorCTA";

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

  const APY = 8.5;
  const PROPERTY_APPRECIATION = 5.0;
  const REINVESTMENT_BOOST = 1.15;

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
    for (let year = 0; year <= 5; year++) {
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
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <CalculatorHeader />
      
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          <InvestmentInput 
            amount={amount}
            setAmount={setAmount}
            handleSliderChange={handleSliderChange}
          />

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-[#47C757]/10 to-[#47C757]/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#47C757]/20">
                    <Gift className="w-5 h-5 text-[#47C757]" />
                  </div>
                  <div>
                    <p className="text-sm text-nordic-charcoal mb-1">Total årlig avkastning*</p>
                    <p className="text-2xl font-bold text-[#47C757]">
                      {yields.compoundedYearly.toLocaleString('nb-NO', {
                        style: 'currency',
                        currency: 'NOK',
                        maximumFractionDigits: 0
                      })}
                      <span className="text-sm font-normal text-gray-500 ml-2">per år</span>
                    </p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs bg-white p-2 shadow-lg rounded-lg border">
                      <p className="text-sm">
                        Basert på {APY}% årlig leieavkastning og {PROPERTY_APPRECIATION}% årlig verdiøkning på eiendommen, med reinvestering av utbytte
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <YieldCards yields={yields} />
          </div>

          <div className="space-y-6">
            <GrowthChart data={growthData} />
            <CalculatorCTA />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        *Basert på {APY}% årlig leieavkastning og {PROPERTY_APPRECIATION}% årlig verdiøkning, med reinvestering av utbytte. Faktisk avkastning kan variere.
      </p>
    </div>
  );
};

export default YieldCalculator;