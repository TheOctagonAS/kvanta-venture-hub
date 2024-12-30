import { Home } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PropertyCountCardProps {
  count: number;
}

const PropertyCountCard = ({ count }: PropertyCountCardProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center gap-2 mb-2">
        <Home className="h-5 w-5 text-nordic-blue" />
        <h3 className="text-sm text-gray-600">Antall eiendommer</h3>
      </div>
      <p className="text-2xl font-bold text-nordic-charcoal">
        {count}
      </p>
    </Card>
  );
};

export default PropertyCountCard;