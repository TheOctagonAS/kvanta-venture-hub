import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Banknote, ArrowUpRight, Wallet, Home, TrendingUp, Shield, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import YieldCalculator from "@/components/YieldCalculator";
import { FlickeringGrid } from "@/components/FlickeringGrid";
import { Hero } from "@/components/Hero";
import VippsLogo from "../assets/vipps-logo.svg";

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

  const investmentBenefits = [
    {
      icon: <Home className="w-12 h-12 text-primary mb-4" />,
      title: "Stabilitet og Forutsigbarhet",
      description: "Eiendom har historisk sett vært en av de mest stabile investeringsformene, med jevn verdistigning over tid."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary mb-4" />,
      title: "To Inntektsstrømmer",
      description: "Få både løpende leieinntekter og langsiktig verdistigning på din investering."
    },
    {
      icon: <Shield className="w-12 h-12 text-primary mb-4" />,
      title: "Inflasjonsbeskyttelse",
      description: "Eiendomsverdier og leiepriser følger ofte inflasjonen, noe som beskytter verdien av investeringen din."
    },
    {
      icon: <PiggyBank className="w-12 h-12 text-primary mb-4" />,
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-nordic-charcoal mb-6">
              Eiendomsinvestering for alle i Norden
            </h1>
            <p className="text-xl text-nordic-charcoal/80 mb-8 max-w-2xl">
              Start din eiendomsreise i dag med så lite som 1000 kr. Få daglige utbetalinger og full kontroll over investeringene dine.
            </p>
            <Link to="/register">
              <button className="bg-[#FF5B24] hover:bg-[#ff4a0a] text-white text-lg px-8 py-4 rounded-full transition-all flex items-center justify-center">
                <img src={VippsLogo} alt="Vipps" className="h-5 w-auto mr-2" />
                Registrer med Vipps
              </button>
            </Link>
          </div>

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

          {/* Calculator section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl mx-auto mb-24 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8"
          >
            <YieldCalculator />
          </motion.div>

          {/* Why choose section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="backdrop-blur-sm bg-white/90 rounded-xl p-8 shadow-lg mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-nordic-charcoal">
              Hvorfor velge Kvanta.ai?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2 text-lg text-nordic-charcoal">Daglige Utbetalinger</h3>
                <p className="text-nordic-charcoal/80">
                  Få din del av leieinntektene utbetalt hver dag, ikke vent på månedlige eller årlige utbetalinger
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2 text-lg text-nordic-charcoal">Automatisk Reinvestering</h3>
                <p className="text-nordic-charcoal/80">
                  La pengene jobbe for deg med automatisk reinvestering av daglige utbetalinger
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="font-semibold mb-2 text-lg text-nordic-charcoal">Full Åpenhet</h3>
                <p className="text-nordic-charcoal/80">
                  Se alle transaksjoner og eiendomsdetaljer i sanntid på plattformen
                </p>
              </div>
            </div>
          </motion.div>

          {/* New Investment Benefits Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-white rounded-xl p-8 shadow-lg mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-nordic-charcoal">
              Hvorfor investere i eiendom?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {investmentBenefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 rounded-lg border border-nordic-softblue hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-3 text-lg text-nordic-charcoal">
                    {benefit.title}
                  </h3>
                  <p className="text-nordic-charcoal/80">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Partners section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-nordic-charcoal">
              Støttet av ledende aktører i Norden
            </h2>
            <p className="text-nordic-charcoal/80 max-w-2xl mx-auto">
              Vi samarbeider med etablerte eiendomsaktører og finansinstitusjoner for å sikre en trygg og transparent investeringsplattform.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
