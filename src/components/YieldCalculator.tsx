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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-nordic-blue to-accent bg-clip-text text-transparent">
          Utforsk Investeringspotensialet
        </h2>
        <p className="text-lg text-nordic-gray max-w-2xl mx-auto">
          Se hvordan investeringen din kan vokse over tid med eiendomsutleie og verdiøkning
        </p>
      </div>
      
      <Card className="bg-white shadow-lg border-0 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="p-3 rounded-full bg-gradient-to-br from-nordic-softblue to-nordic-blue/20">
              <Home className="w-8 h-8 text-nordic-blue" />
            </div>
            <div className="flex-1">
              <p className="text-lg text-nordic-charcoal mb-2">
                Investeringsbeløp
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-3xl font-bold border-none shadow-none p-0 h-auto w-48 focus:ring-0"
                />
                <span className="text-3xl font-bold text-nordic-charcoal">NOK</span>
              </div>
            </div>
          </div>

          <Slider
            defaultValue={[100000]}
            max={5000000}
            step={1000}
            value={[parseFloat(amount) || 0]}
            onValueChange={handleSliderChange}
            className="mb-10 [&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue [&>.block]:border-nordic-blue [&>.block]:bg-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-1 md:col-span-4 bg-gradient-to-r from-[#47C757]/10 to-[#47C757]/5 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-[#47C757]/20">
                    <Gift className="w-6 h-6 text-[#47C757]" />
                  </div>
                  <div>
                    <p className="text-lg text-nordic-charcoal mb-1">Total årlig avkastning*</p>
                    <p className="text-4xl font-bold text-[#47C757]">
                      {yields.compoundedYearly.toLocaleString('nb-NO', {
                        style: 'currency',
                        currency: 'NOK',
                        maximumFractionDigits: 0
                      })}
                      <span className="text-base font-normal text-gray-500 ml-2">per år</span>
                    </p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Basert på {APY}% årlig leieavkastning og {PROPERTY_APPRECIATION}% årlig verdiøkning på eiendommen, med reinvestering av utbytte
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Yield Cards */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-5 h-5 text-[#47C757]" />
                <p className="text-sm font-medium text-nordic-charcoal">Daglig</p>
              </div>
              <p className="text-2xl font-bold text-[#47C757]">
                {yields.daily.toLocaleString('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                })}
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-5 h-5 text-[#47C757]" />
                <p className="text-sm font-medium text-nordic-charcoal">Månedlig</p>
              </div>
              <p className="text-2xl font-bold text-[#47C757]">
                {yields.monthly.toLocaleString('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                })}
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-5 h-5 text-[#47C757]" />
                <p className="text-sm font-medium text-nordic-charcoal">Årlig</p>
              </div>
              <p className="text-2xl font-bold text-[#47C757]">
                {yields.yearly.toLocaleString('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                })}
              </p>
            </div>
          </div>

          <div className="space-y-8">
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