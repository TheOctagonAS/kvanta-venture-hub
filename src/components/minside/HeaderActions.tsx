import { Button } from "@/components/ui/button";
import { ChartBar, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Portefølje
      </h1>
      <div className="flex gap-4">
        <Button
          onClick={() => navigate('/leie-og-avkastning')}
          className="flex items-center gap-2"
        >
          <ChartBar className="h-4 w-4" />
          Leie og Avkastning
        </Button>
        <Button
          onClick={() => navigate('/skatt')}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Receipt className="h-4 w-4" />
          Skatteoversikt
        </Button>
      </div>
    </div>
  );
};

export default HeaderActions;