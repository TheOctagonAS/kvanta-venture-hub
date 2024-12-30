import { Gift, RefreshCw, LineChart } from "lucide-react";
import { motion } from "framer-motion";

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

export const PlatformBenefitsSection = () => {
  return (
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
  );
};