import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Banknote, ArrowUpRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";

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

export const FeaturesSection = () => {
  return (
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
  );
};