import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import GrowthChart from "./calculator/GrowthChart";
import CalculatorCTA from "./calculator/CalculatorCTA";
import CalculatorHeader from "./calculator/CalculatorHeader";
import YieldSummary from "./calculator/YieldSummary";

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
      <h2 className="text-2xl font-bold text-nordic-charcoal mt-10 mb-10">
        Hvor langt kan investeringen* din gå?
      </h2>
      
      <Card className="bg-white/95 shadow-lg border-0 backdrop-blur-sm">
        <CardContent className="p-8">
          <CalculatorHeader 
            amount={amount}
            onAmountChange={setAmount}
            onSliderChange={handleSliderChange}
          />

          <YieldSummary 
            yields={yields}
            APY={APY}
            PROPERTY_APPRECIATION={PROPERTY_APPRECIATION}
          />

          <div className="space-y-6">
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
