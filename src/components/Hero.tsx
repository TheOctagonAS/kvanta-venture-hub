import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
              <span>Eiendomsinvestering gjort</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-primary"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed tracking-tight text-nordic-charcoal/80 max-w-xl text-center px-4">
              Start eiendomsreisen med bare 1000 kr. Opprett bruker og få <span className="font-bold">daglige</span> leieinntekter og verdistigning rett i din lommebok gjennom vår sikre, tokenbaserte plattform.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="gap-4 bg-white/80 hover:bg-white/90 backdrop-blur-sm text-nordic-charcoal font-medium rounded-full shadow-lg hover:shadow-xl transition-all border border-nordic-charcoal/10"
                  >
                    Logg inn <Wallet className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="gap-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Opprett bruker <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/eiendommer">
                <Button 
                  size="lg" 
                  className="gap-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
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