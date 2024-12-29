import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Coins, ArrowDownToLine, Clock } from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const Lommebok = () => {
  const features = [
    {
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: "Din Digitale Lommebok",
      description: "En sikker og oversiktlig måte å holde styr på dine eiendomsinvesteringer. Her ser du alle dine tokens og deres verdi i sanntid."
    },
    {
      icon: <Coins className="w-8 h-8 text-primary" />,
      title: "Automatiske Leieinntekter",
      description: "Leieinntektene fra eiendommene du eier tokens i blir automatisk fordelt og lagt til i din lommebok hver dag."
    },
    {
      icon: <ArrowDownToLine className="w-8 h-8 text-primary" />,
      title: "Enkel Utbetaling",
      description: "Du kan når som helst ta ut dine opptjente leieinntekter. Pengene overføres direkte til din bankkonto."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Sanntids Oppdateringer",
      description: "Følg med på dine investeringer i sanntid. Se hvordan verdien utvikler seg og hvor mye du tjener i leieinntekter."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundBeamsWithCollision className="absolute inset-0">
        <div className="relative z-20 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-6">
              Din Digitale Lommebok
            </h1>
            <p className="text-lg mb-8">
              Lommeboken er ditt personlige finansielle kontrollsenter i Kvanta.ai. Her kan du enkelt holde oversikt over dine investeringer, leieinntekter og verdistigning i sanntid.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full backdrop-blur-sm border-neutral-800 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="backdrop-blur-sm border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Sikkerhet i Fokus
                </h3>
                <p>
                  Din lommebok er beskyttet med samme teknologi som brukes av ledende finansinstitusjoner. 
                  Alle transaksjoner er kryptert og verifisert gjennom vår blockchain-teknologi, 
                  noe som sikrer at dine investeringer og inntekter er trygge og sporbare.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Lommebok;