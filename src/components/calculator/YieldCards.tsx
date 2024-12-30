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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-nordic-softblue/50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm font-medium text-nordic-charcoal">Daglig</p>
        </div>
        <p className="text-xl font-bold text-nordic-blue">
          {yields.daily.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
      </div>

      <div className="bg-nordic-softblue/50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm font-medium text-nordic-charcoal">Månedlig</p>
        </div>
        <p className="text-xl font-bold text-nordic-blue">
          {yields.monthly.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
      </div>

      <div className="bg-nordic-softblue/50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm font-medium text-nordic-charcoal">Årlig med reinvestering</p>
        </div>
        <p className="text-xl font-bold text-nordic-blue">
          {yields.compoundedYearly.toLocaleString('nb-NO', { 
            style: 'currency', 
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
      </div>
    </div>
  );
};

export default YieldCards;