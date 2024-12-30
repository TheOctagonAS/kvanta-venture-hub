import { DollarSign, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccountValueCardProps {
  totalValue: number;
  userBalance: number | undefined;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
}

const AccountValueCard = ({
  totalValue,
  userBalance,
  onDepositClick,
  onWithdrawClick,
}: AccountValueCardProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-nordic-blue" />
            <h3 className="text-sm text-gray-600">Kontoverdi</h3>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {totalValue.toLocaleString()} NOK
          </p>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Tilgjengelig saldo</h3>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {(userBalance || 0).toLocaleString()} NOK
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onDepositClick}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Innskudd
          </Button>
          <Button
            onClick={onWithdrawClick}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Minus className="h-4 w-4" /> Uttak
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AccountValueCard;