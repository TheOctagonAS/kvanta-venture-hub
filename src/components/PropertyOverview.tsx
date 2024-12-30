import { useState } from "react";
import { usePropertyData } from "./property-overview/usePropertyData";
import AccountValueCard from "./property-overview/AccountValueCard";
import RentCard from "./property-overview/RentCard";
import PropertyCountCard from "./property-overview/PropertyCountCard";
import StatisticsRow from "./property-overview/StatisticsRow";
import { BalanceModal } from "./BalanceModal";

const PropertyOverview = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const {
    holdings,
    userBalance,
    refetchHoldings,
    refetchBalance,
    calculateTotalValue,
    calculateTotalRent,
    calculateAverageYield,
  } = usePropertyData();

  const handleBalanceUpdate = async () => {
    await Promise.all([refetchBalance(), refetchHoldings()]);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-nordic-charcoal">Eiendomsoversikt</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <AccountValueCard
          totalValue={calculateTotalValue()}
          userBalance={userBalance?.balance}
          onDepositClick={() => setShowDepositModal(true)}
          onWithdrawClick={() => setShowWithdrawModal(true)}
        />
        <RentCard totalRent={calculateTotalRent()} />
        <PropertyCountCard count={holdings?.length || 0} />
      </div>

      <StatisticsRow
        totalValue={calculateTotalValue()}
        averageYield={calculateAverageYield()}
        totalBalance={calculateTotalValue() + calculateTotalRent()}
      />

      <BalanceModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        type="deposit"
        onSuccess={handleBalanceUpdate}
      />

      <BalanceModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        type="withdraw"
        onSuccess={handleBalanceUpdate}
      />
    </div>
  );
};

export default PropertyOverview;