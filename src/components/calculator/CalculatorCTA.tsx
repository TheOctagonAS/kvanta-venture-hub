import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CalculatorCTA = () => {
  return (
    <div className="bg-[#E9F2FF] p-6 py-6 rounded-lg text-center">
      <p className="text-base mb-6 text-nordic-charcoal">
        Vil du realisere dette potensialet? Opprett bruker eller se eiendommer nå!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
        <Button 
          asChild 
          className="bg-[#345FF6] hover:bg-[#345FF6]/90 text-white px-6 py-6 text-base h-auto"
        >
          <Link to="/register">Opprett Bruker</Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          className="border-[#345FF6] text-[#345FF6] hover:bg-[#345FF6]/10 px-6 py-6 text-base h-auto"
        >
          <Link to="/eiendommer">Se Eiendommer</Link>
        </Button>
      </div>
      <Link 
        to="/les-mer" 
        className="text-sm text-[#345FF6] hover:underline"
      >
        Eller les mer om Kvanta.ai
      </Link>
    </div>
  );
};

export default CalculatorCTA;