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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm text-gray-600">Daglig avkastning</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-nordic-blue">
            {yields.daily.toLocaleString('nb-NO', { 
              style: 'currency', 
              currency: 'NOK',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      </div>
      <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm text-gray-600">Månedlig avkastning</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-nordic-blue">
            {yields.monthly.toLocaleString('nb-NO', { 
              style: 'currency', 
              currency: 'NOK',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      </div>
      <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm text-gray-600">Årlig avkastning</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-nordic-blue">
            {yields.yearly.toLocaleString('nb-NO', { 
              style: 'currency', 
              currency: 'NOK',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </p>
          <p className="text-xs text-gray-600 mt-2">Uten reinvestering</p>
        </div>
      </div>
      <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-nordic-blue" />
          <p className="text-sm text-gray-600">Årlig avkastning med reinvestering</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-nordic-blue">
            {yields.compoundedYearly.toLocaleString('nb-NO', { 
              style: 'currency', 
              currency: 'NOK',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </p>
          <p className="text-xs text-gray-600 mt-2">Med daglig reinvestering</p>
        </div>
      </div>
    </div>
  );
};

export default YieldCards;