import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CalculatorCTA = () => {
  return (
    <div className="bg-blue-50 p-4 py-3 sm:py-4 rounded text-center">
      <p className="text-base mb-4">
        Vil du realisere dette potensialet? Opprett bruker eller se eiendommer nå!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link to="/register">Opprett Bruker</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/eiendommer">Se Eiendommer</Link>
        </Button>
      </div>
    </div>
  );
};

export default CalculatorCTA;