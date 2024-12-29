import { Clock, Calendar, TrendingUp } from "lucide-react";

interface YieldCardsProps {
  yields: {
    daily: number;
    monthly: number;
    yearly: number;
    compoundedYearly: number;
  };
}

const YieldCards = ({ yields }: YieldCardsProps) => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2">
      <div className="min-w-[150px] max-w-[150px] bg-nordic-softblue p-3 rounded-lg flex flex-col items-center justify-between border border-blue-100 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <Clock className="w-4 h-4 text-nordic-blue" />
          <p className="text-xs text-gray-600">Daglig</p>
        </div>
        <p className="text-lg font-bold text-nordic-blue">
          {yields.daily.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
      </div>

      <div className="min-w-[150px] max-w-[150px] bg-nordic-softblue p-3 rounded-lg flex flex-col items-center justify-between border border-blue-100 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <Calendar className="w-4 h-4 text-nordic-blue" />
          <p className="text-xs text-gray-600">Månedlig</p>
        </div>
        <p className="text-lg font-bold text-nordic-blue">
          {yields.monthly.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
      </div>

      <div className="min-w-[150px] max-w-[150px] bg-nordic-softblue p-3 rounded-lg flex flex-col items-center justify-between border border-blue-100 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <TrendingUp className="w-4 h-4 text-nordic-blue" />
          <p className="text-xs text-gray-600">Årlig</p>
        </div>
        <p className="text-lg font-bold text-nordic-blue">
          {yields.yearly.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
        <p className="text-[10px] text-gray-600 mt-1">Uten reinvestering</p>
      </div>

      <div className="min-w-[150px] max-w-[150px] bg-nordic-softblue p-3 rounded-lg flex flex-col items-center justify-between border border-blue-100 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <TrendingUp className="w-4 h-4 text-nordic-blue" />
          <p className="text-xs text-gray-600">Årlig m/reinv.</p>
        </div>
        <p className="text-lg font-bold text-nordic-blue">
          {yields.compoundedYearly.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
        <p className="text-[10px] text-gray-600 mt-1">Med daglig reinvestering</p>
      </div>
    </div>
  );
};

export default YieldCards;