import { Gift, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface YieldSummaryProps {
  yields: {
    daily: number;
    monthly: number;
    yearly: number;
    compoundedYearly: number;
  };
  APY: number;
  PROPERTY_APPRECIATION: number;
}

const YieldSummary = ({ yields, APY, PROPERTY_APPRECIATION }: YieldSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="col-span-1 md:col-span-4 bg-gradient-to-r from-[#47C757]/5 to-[#47C757]/10 shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#47C757]/10">
              <Gift className="w-6 h-6 text-[#47C757]" />
            </div>
            <div>
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
      </div>

      {[
        { label: "Daglig", value: yields.daily },
        { label: "Månedlig", value: yields.monthly },
        { label: "Årlig", value: yields.yearly }
      ].map((item, index) => (
        <div key={index} className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-[#47C757]" />
            <p className="text-sm font-medium text-nordic-charcoal">{item.label}</p>
          </div>
          <p className="text-2xl font-bold text-[#47C757]">
            {item.value.toLocaleString('nb-NO', {
              style: 'currency',
              currency: 'NOK',
              maximumFractionDigits: 0
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default YieldSummary;