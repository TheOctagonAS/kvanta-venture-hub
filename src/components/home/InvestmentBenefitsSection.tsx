import { Shield, TrendingUp, ArrowUpRight, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

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

export const InvestmentBenefitsSection = () => {
  return (
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
  );
};