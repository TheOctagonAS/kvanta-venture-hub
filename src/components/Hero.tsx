import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function Hero() {
  const { user } = useAuth();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["transparent", "enkelt", "lønnsomt", "trygt", "smart"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative w-full min-h-[80vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-background-dark">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 py-16">
          <Link to="/les-mer">
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white/80 hover:text-white font-medium rounded-full border border-white/10 transition-all"
            >
              Les mer om Kvanta.ai <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex flex-col items-center gap-6 max-w-3xl text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white/90">
              <span className="block">Eiendomsinvestering</span>
              <span className="block">gjort</span>
              <div className="h-[1.2em] relative mt-2">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute inset-0 text-primary"
                    initial={{ opacity: 0, y: 40 }}
                    animate={
                      titleNumber === index
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -40 }
                    }
                    transition={{ 
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  >
                    {title}
                  </motion.span>
                ))}
              </div>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              Start eiendomsreisen med bare 1000 kr. Opprett bruker og få daglige leieinntekter og verdistigning rett i din lommebok gjennom vår sikre, tokenbaserte plattform.
            </p>
          </div>

          <div className="flex flex-row gap-4 mt-4">
            {!user ? (
              <>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white/80 hover:text-white font-medium rounded-full border border-white/10 transition-all"
                  >
                    Logg inn
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-all"
                  >
                    Se eiendommer <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/eiendommer">
                <Button 
                  size="lg" 
                  className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-all"
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