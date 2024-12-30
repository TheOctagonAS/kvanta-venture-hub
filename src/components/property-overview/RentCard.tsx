import { ChartBar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
          <Link 
            to="/skatt" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
          >
            Se skatteoversikt <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Totalt tjent i leie</h3>
          <p className="text-2xl font-bold text-accent">
            {totalRent.toLocaleString()} NOK
          </p>
          <div className="mt-3 text-sm text-gray-600">
            Husk at du må skatte av opptjent leie{" "}
            <Link 
              to="/les-mer" 
              className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Les mer <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RentCard;