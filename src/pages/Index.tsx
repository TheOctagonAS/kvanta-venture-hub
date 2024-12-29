import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Coins, LineChart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import YieldCalculator from "@/components/YieldCalculator";

const Index = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <Building2 className="w-10 h-10 text-primary" />,
      title: "Tokenisert Eiendom",
      description: "Invester i brøkdeler av kvalitetssikrede eiendommer i Norden"
    },
    {
      icon: <Coins className="w-10 h-10 text-primary" />,
      title: "Leieinntekter",
      description: "Motta din andel av leieinntektene månedlig"
    },
    {
      icon: <LineChart className="w-10 h-10 text-primary" />,
      title: "Porteføljeoversikt",
      description: "Følg investeringene dine i sanntid via dashbordet"
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Sikker Plattform",
      description: "Regulert av Finanstilsynet med fokus på sikkerhet"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            Nå i Beta
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
            Investér i eiendom, enkelt og trygt
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kvanta.ai gjør det mulig å kjøpe brøkdeler av eiendom i Norden. Start din investeringsreise med så lite som 1000 kr.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!user && (
              <>
                <Link to="/register">
                  <Button size="lg" variant="default">
                    Opprett bruker
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg">
                    Logg inn
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <Link to="/eiendommer">
                <Button size="lg">
                  Se eiendommer
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <YieldCalculator />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 bg-nordic-softblue rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-primary">
            Om Kvanta.ai
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <h3 className="font-semibold mb-2 text-lg">Nordisk Fokus</h3>
              <p className="text-gray-600">
                Spesialisert på eiendomsmarkedet i Norge, Sverige, Danmark og Finland
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="font-semibold mb-2 text-lg">Demokratisering</h3>
              <p className="text-gray-600">
                Gjør eiendomsinvestering tilgjengelig for alle i Norden
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="font-semibold mb-2 text-lg">Transparent</h3>
              <p className="text-gray-600">
                Full åpenhet om kostnader, inntekter og verdiutvikling
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Støttet av ledende aktører i Norden
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vi samarbeider med etablerte eiendomsaktører og finansinstitusjoner for å sikre en trygg og transparent investeringsplattform.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
