import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Banknote, ArrowUpRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import YieldCalculator from "@/components/YieldCalculator";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4">
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

        {/* Features section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
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

        {/* Calculator section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <YieldCalculator />
        </motion.div>

        {/* New "Les mer" section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mt-10 mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-primary">
            Les mer om Kvanta.ai
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            En trygg og enkel plattform for brøkdelsinvestering i eiendom
          </p>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-gray-700 text-center">
              Med Kvanta.ai kan du enkelt kjøpe og selge brøkdeler av attraktive eiendommer med bare noen få klikk. 
              Du bestemmer selv hvor mye du vil investere, og kan starte med et lite beløp.
            </p>

            <div className="bg-nordic-softblue rounded-lg p-4 text-center">
              <p className="text-gray-700">
                All data lagres sikkert i Supabase, og KYC sikrer at alle investorer er verifiserte.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="font-semibold mb-2 text-primary">1. Opprett bruker</div>
                <p className="text-sm text-gray-600">Registrer deg enkelt med e-post</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="font-semibold mb-2 text-primary">2. Fullfør KYC</div>
                <p className="text-sm text-gray-600">Verifiser identiteten din</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="font-semibold mb-2 text-primary">3. Kjøp tokens</div>
                <p className="text-sm text-gray-600">Velg eiendom og antall tokens</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="font-semibold mb-2 text-primary">4. Motta inntekter</div>
                <p className="text-sm text-gray-600">Claim daily yield fra dine investeringer</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-nordic-softblue rounded-xl p-8 shadow-lg mb-24"
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
      </main>
    </div>
  );
};

export default Index;
