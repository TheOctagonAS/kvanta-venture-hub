import { Shield, TrendingUp, ArrowUpRight, PiggyBank, Gift, RefreshCw, LineChart, Building } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Stabilitet",
    description: "Eiendom har historisk sett vært en av de mest stabile investeringsformene"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "To inntektsstrømmer",
    description: "Få både løpende leieinntekter og langsiktig verdistigning"
  },
  {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: "Inflasjonsbeskyttelse",
    description: "Eiendomsverdier og leiepriser følger ofte inflasjonen"
  },
  {
    icon: <PiggyBank className="w-8 h-8 text-primary" />,
    title: "Passiv inntekt",
    description: "La investeringen jobbe for deg med minimalt av egen innsats"
  },
  {
    icon: <Gift className="w-8 h-8 text-primary" />,
    title: "Daglige utbetalinger",
    description: "Få din del av leieinntektene utbetalt hver dag"
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-primary" />,
    title: "Automatisk reinvestering",
    description: "La pengene jobbe for deg med automatisk reinvestering"
  },
  {
    icon: <LineChart className="w-8 h-8 text-primary" />,
    title: "Full åpenhet",
    description: "Se alle transaksjoner og eiendomsdetaljer i sanntid"
  },
  {
    icon: <ArrowUpRight className="w-8 h-8 text-primary" />,
    title: "Enkel likviditet",
    description: "Selg tokens når du vil, ingen bindingstid"
  }
];

export const BenefitsGrid = () => {
  return (
    <div className="w-full py-12 bg-gradient-to-b from-white to-[#f8f9fa]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-nordic-charcoal">
            Hvorfor investere i eiendom?
          </h2>
          <p className="text-nordic-gray max-w-2xl mx-auto">
            Fordeler med tokenisert eiendomsinvestering gjennom Kvanta
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-nordic-charcoal">{benefit.title}</h3>
              <p className="text-sm text-nordic-gray">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};