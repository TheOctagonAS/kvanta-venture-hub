interface StatisticsRowProps {
  totalValue: number;
  averageYield: number;
  totalBalance: number;
}

const StatisticsRow = ({ totalValue, averageYield, totalBalance }: StatisticsRowProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 rounded-lg">
        <h3 className="text-base text-[#666] dark:text-gray-400 mb-1">Est. Eiendomsverdi</h3>
        <p className="text-lg font-semibold text-nordic-charcoal dark:text-gray-200">
          {totalValue.toLocaleString()} NOK
        </p>
      </div>
      <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 rounded-lg">
        <h3 className="text-base text-[#666] dark:text-gray-400 mb-1">Totalt avkastning</h3>
        <p className="text-lg font-semibold text-nordic-charcoal dark:text-gray-200">
          {averageYield.toFixed(1)}%
        </p>
      </div>
      <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 rounded-lg">
        <h3 className="text-base text-[#666] dark:text-gray-400 mb-1">Totalt innestående</h3>
        <p className="text-lg font-semibold text-nordic-charcoal dark:text-gray-200">
          {totalBalance.toLocaleString()} NOK
        </p>
      </div>
    </div>
  );
};

export default StatisticsRow;