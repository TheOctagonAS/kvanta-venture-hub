import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, Banknote, ArrowUpRight, Wallet, Shield, TrendingUp, PiggyBank, Gift, RefreshCw, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import YieldCalculator from "@/components/YieldCalculator";
import { FlickeringGrid } from "@/components/FlickeringGrid";
import { Hero } from "@/components/Hero";
import { TimelineSection } from "@/components/home/TimelineSection";

const Index = () => {
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

  const platformBenefits = [
    {
      icon: <Gift className="w-9 h-9 text-[#345FF6]" />,
      title: "Daglige Utbetalinger",
      description: "Få din del av leieinntektene utbetalt hver dag, ikke vent på månedlige eller årlige utbetalinger"
    },
    {
      icon: <RefreshCw className="w-9 h-9 text-[#345FF6]" />,
      title: "Automatisk Reinvestering",
      description: "La pengene jobbe for deg med automatisk reinvestering av daglige utbetalinger"
    },
    {
      icon: <LineChart className="w-9 h-9 text-[#345FF6]" />,
      title: "Full Åpenhet",
      description: "Se alle transaksjoner og eiendomsdetaljer i sanntid på plattformen"
    }
  ];

  const investmentBenefits = [
    {
      icon: <Shield className="w-9 h-9 text-[#345FF6]" />,
      title: "Stabilitet og Forutsigbarhet",
      description: "Eiendom har historisk sett vært en av de mest stabile investeringsformene, med jevn verdistigning over tid."
    },
    {
      icon: <TrendingUp className="w-9 h-9 text-[#345FF6]" />,
      title: "To Inntektsstrømmer",
      description: "Få både løpende leieinntekter og langsiktig verdistigning på din investering."
    },
    {
      icon: <ArrowUpRight className="w-9 h-9 text-[#345FF6]" />,
      title: "Inflasjonsbeskyttelse",
      description: "Eiendomsverdier og leiepriser følger ofte inflasjonen, noe som beskytter verdien av investeringen din."
    },
    {
      icon: <PiggyBank className="w-9 h-9 text-[#345FF6]" />,
      title: "Passiv Inntekt",
      description: "La investeringen jobbe for deg med minimalt av egen innsats, takket være vår automatiserte plattform."
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <FlickeringGrid color="rgb(37, 99, 235)" maxOpacity={0.15} />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <Hero />

          {/* Features section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/90">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2 text-nordic-charcoal">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-nordic-charcoal/80 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Timeline section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-24"
          >
            <TimelineSection />
          </motion.div>

          {/* Calculator section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl mx-auto mb-24 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8"
          >
            <YieldCalculator />
          </motion.div>

          {/* Platform Benefits section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-nordic-charcoal">
              Fordeler med vår plattform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platformBenefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-white shadow-sm rounded-lg p-6 flex flex-col items-center text-center"
                >
                  <div className="mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base font-semibold text-nordic-charcoal mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-nordic-charcoal/80">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Investment Benefits Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-nordic-charcoal">
              Hvorfor investere i eiendom?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {investmentBenefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-white shadow-sm rounded-lg p-6 flex flex-col items-center text-center"
                >
                  <div className="mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base font-semibold text-nordic-charcoal mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-nordic-charcoal/80">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Partners Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-24 bg-[#f8f9fa] rounded-lg p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-nordic-charcoal">
              Støttet av ledende aktører i Norden
            </h2>
            <p className="text-nordic-charcoal/80 max-w-2xl mx-auto text-center mb-8">
              Vi samarbeider med etablerte eiendomsaktører og finansinstitusjoner for å sikre en trygg og transparent investeringsplattform.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-nordic-charcoal/60">
              (Her kommer partner-logos)
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
