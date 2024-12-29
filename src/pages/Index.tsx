import { motion } from "framer-motion";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Banknote, ArrowUpRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import YieldCalculator from "@/components/YieldCalculator";
import { FlickeringGrid } from "@/components/FlickeringGrid";

const Index = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: "Daglige Utbetalinger",
      description: "Motta din andel av leieinntektene hver dag, ikke månedlig eller årlig"
    },
    {
      icon: <Banknote className="w-10 h-10 text-primary" />,
      title: "Lav Terskel",
      description: "Start med så lite som 1000 kr og bygg porteføljen din gradvis"
    },
    {
      icon: <ArrowUpRight className="w-10 h-10 text-primary" />,
      title: "Renters Rente",
      description: "Reinvester daglige utbetalinger automatisk for å øke avkastningen"
    },
    {
      icon: <Wallet className="w-10 h-10 text-primary" />,
      title: "Enkel Likviditet",
      description: "Selg tokens når du vil, ingen bindingstid eller låste perioder"
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <FlickeringGrid color="rgb(37, 99, 235)" maxOpacity={0.15} />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-32"
          >
            <Badge variant="secondary" className="mb-4">
              Nå i Beta
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
              Kjøp eiendom like enkelt som å handle på nett
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Invester i førsteklasses eiendommer og motta daglig leieinntekt
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {!user && (
                <>
                  <Link to="/register">
                    <MovingBorderButton>
                      Opprett bruker
                    </MovingBorderButton>
                  </Link>
                  <Link to="/login">
                    <MovingBorderButton
                      className="bg-transparent backdrop-blur-none border-slate-800"
                    >
                      Logg inn
                    </MovingBorderButton>
                  </Link>
                </>
              )}
              {user && (
                <Link to="/eiendommer">
                  <MovingBorderButton>
                    Se eiendommer
                  </MovingBorderButton>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Features section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/80">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Calculator section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl mx-auto mb-24"
          >
            <YieldCalculator />
          </motion.div>

          {/* Les mer button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center mb-24"
          >
            <Link to="/les-mer">
              <MovingBorderButton
                className="bg-transparent backdrop-blur-none border-slate-800"
              >
                Les mer om Kvanta.ai
              </MovingBorderButton>
            </Link>
          </motion.div>

          {/* Why choose section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="backdrop-blur-sm bg-white/80 rounded-xl p-8 shadow-lg mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-primary">
              Hvorfor velge Kvanta.ai?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2 text-lg">Daglige Utbetalinger</h3>
                <p className="text-gray-600">
                  Få din del av leieinntektene utbetalt hver dag, ikke vent på månedlige eller årlige utbetalinger
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2 text-lg">Automatisk Reinvestering</h3>
                <p className="text-gray-600">
                  La pengene jobbe for deg med automatisk reinvestering av daglige utbetalinger
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2 text-lg">Full Åpenhet</h3>
                <p className="text-gray-600">
                  Se alle transaksjoner og eiendomsdetaljer i sanntid på plattformen
                </p>
              </div>
            </div>
          </motion.div>

          {/* Partners section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Støttet av ledende aktører i Norden
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vi samarbeider med etablerte eiendomsaktører og finansinstitusjoner for å sikre en trygg og transparent investeringsplattform.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;