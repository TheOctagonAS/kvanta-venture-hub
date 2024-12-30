interface YieldCardsProps {
  yields: {
    daily: number;
    monthly: number;
    yearly: number;
    compoundedYearly: number;
  };
}

const YieldCards = ({ yields }: YieldCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-white dark:bg-[#2a2a2a] p-3 rounded-lg shadow-sm dark:border dark:border-[#333]">
        <h4 className="text-sm font-medium mb-1 dark:text-[#fff]">Daglig avkastning</h4>
        <p className="text-lg font-bold text-nordic-blue dark:text-[#ccc]">
          {formatCurrency(yields.daily)}
        </p>
      </div>
      <div className="bg-white dark:bg-[#2a2a2a] p-3 rounded-lg shadow-sm dark:border dark:border-[#333]">
        <h4 className="text-sm font-medium mb-1 dark:text-[#fff]">Månedlig avkastning</h4>
        <p className="text-lg font-bold text-nordic-blue dark:text-[#ccc]">
          {formatCurrency(yields.monthly)}
        </p>
      </div>
      <div className="bg-white dark:bg-[#2a2a2a] p-3 rounded-lg shadow-sm dark:border dark:border-[#333]">
        <h4 className="text-sm font-medium mb-1 dark:text-[#fff]">Årlig avkastning</h4>
        <p className="text-lg font-bold text-nordic-blue dark:text-[#ccc]">
          {formatCurrency(yields.yearly)}
        </p>
      </div>
      <div className="bg-white dark:bg-[#2a2a2a] p-3 rounded-lg shadow-sm dark:border dark:border-[#333]">
        <h4 className="text-sm font-medium mb-1 dark:text-[#fff]">Med reinvestering</h4>
        <p className="text-lg font-bold text-accent dark:text-[#ccc]">
          {formatCurrency(yields.compoundedYearly)}
        </p>
      </div>
    </div>
  );
};

export default YieldCards;