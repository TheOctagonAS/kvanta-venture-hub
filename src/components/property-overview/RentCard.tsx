import { ChartBar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RentCardProps {
  totalRent: number;
}

const RentCard = ({ totalRent }: RentCardProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ChartBar className="h-5 w-5 text-nordic-blue" />
            <h3 className="text-sm text-gray-600">Leiesaldo</h3>
          </div>
          <p className="text-2xl font-bold text-nordic-charcoal">
            {totalRent.toLocaleString()} NOK
          </p>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Totalt tjent i leie</h3>
          <p className="text-2xl font-bold text-accent">
            {totalRent.toLocaleString()} NOK
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RentCard;