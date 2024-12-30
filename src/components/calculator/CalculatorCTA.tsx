import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { vippsService } from "@/services/vippsService";
import VippsLogo from "../../assets/vipps-logo.svg";

const CalculatorCTA = () => {
  const handleVippsLogin = () => {
    window.location.href = vippsService.getVippsLoginUrl();
  };

  return (
    <div className="bg-[#E9F2FF] p-6 py-6 rounded-lg text-center">
      <p className="text-base mb-6 text-nordic-charcoal">
        Vil du realisere dette potensialet? Opprett bruker eller se eiendommer nå!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
        <button
          onClick={handleVippsLogin}
          className="bg-[#FF5B24] hover:bg-[#ff4a0a] text-white font-medium px-8 py-4 rounded-full transition-all flex items-center justify-center shadow-lg hover:shadow-xl text-lg"
        >
          <img src={VippsLogo} alt="Vipps" className="h-6 w-auto mr-3" />
          Registrer med Vipps
        </button>
        <Button 
          asChild 
          variant="outline" 
          className="border-[#345FF6] text-[#345FF6] hover:bg-[#345FF6]/10 px-8 py-7 text-lg h-auto rounded-full"
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