import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface CalculatorHeaderProps {
  amount: string;
  onAmountChange: (value: string) => void;
  onSliderChange: (value: number[]) => void;
}

const CalculatorHeader = ({ amount, onAmountChange, onSliderChange }: CalculatorHeaderProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-nordic-softblue/50">
          <Home className="w-6 h-6 text-nordic-blue" />
        </div>
        <div className="flex-1">
          <p className="text-lg text-nordic-charcoal mb-2">
            Når du investerer for
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="text-2xl font-bold border-none shadow-none p-0 h-auto w-48 focus-visible:ring-0"
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
        onValueChange={onSliderChange}
        className="mb-8 [&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue/50 [&>.block]:border-nordic-blue [&>.block]:bg-white"
      />
    </>
  );
};

export default CalculatorHeader;