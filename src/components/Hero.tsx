import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { vippsService } from "@/services/vippsService";

function Hero() {
  const { user } = useAuth();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["trygt", "enkelt", "lønnsomt", "transparent", "smart", "tilgjengelig"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const handleVippsLogin = () => {
    window.location.href = vippsService.getVippsLoginUrl();
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 py-12 lg:py-20 items-center justify-center flex-col">
          <div>
            <Link to="/les-mer">
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-4 bg-white/80 hover:bg-white/90 backdrop-blur-sm text-nordic-charcoal font-medium rounded-full shadow-lg hover:shadow-xl transition-all border border-nordic-charcoal/10"
              >
                Les mer om Kvanta.ai <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl md:text-6xl max-w-2xl tracking-tighter text-center font-regular text-nordic-charcoal px-2">
              <span>Vipps + BankID =</span>
              <br />
              <span className="font-semibold">rask og sikker onboarding</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed tracking-tight text-nordic-charcoal/80 max-w-xl text-center px-4">
              Start eiendomsreisen med bare 1000 kr. Opprett bruker og få <span className="font-bold">daglige</span> leieinntekter og verdistigning rett i din lommebok gjennom vår sikre, tokenbaserte plattform.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {!user && (
              <>
                <Button 
                  onClick={handleVippsLogin}
                  size="lg" 
                  className="w-full gap-4 bg-[#ff5b24] hover:bg-[#ff5b24]/90 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Bruk Vipps <ArrowUpRight className="w-4 h-4" />
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">eller</span>
                  </div>
                </div>
                <Link to="/register" className="w-full">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full gap-4 border-2 hover:bg-gray-50 text-nordic-charcoal font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Bruk e-post / passord <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-sm text-center text-gray-600 mt-2">
                  Dette henter dine data fra Vipps. Du må fortsatt BankID-signere for endelig KYC.
                </p>
              </>
            )}
            {user && (
              <Link to="/eiendommer" className="w-full">
                <Button 
                  size="lg" 
                  className="w-full gap-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Se eiendommer <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };