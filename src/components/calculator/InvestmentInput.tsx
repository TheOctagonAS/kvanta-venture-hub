import React from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Home } from "lucide-react";

interface InvestmentInputProps {
  amount: string;
  setAmount: (value: string) => void;
  handleSliderChange: (value: number[]) => void;
}

const InvestmentInput = ({ amount, setAmount, handleSliderChange }: InvestmentInputProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="p-2 rounded-full bg-gradient-to-br from-nordic-softblue to-nordic-blue/20">
          <Home className="w-6 h-6 text-nordic-blue" />
        </div>
        <div className="flex-1">
          <p className="text-base text-nordic-charcoal mb-2">
            Investeringsbeløp
          </p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold border-none shadow-none p-0 h-auto w-40 focus:ring-0"
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
        className="mb-6 [&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue [&>.block]:border-nordic-blue [&>.block]:bg-white"
      />
    </div>
  );
};

export default InvestmentInput;