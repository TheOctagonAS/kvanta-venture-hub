import { ArrowUpRight, Search, CreditCard, CalendarClock, Wallet2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Search className="w-6 h-6 text-primary" />,
    title: "Registrer deg",
    description: "Start din reise med Kvanta ved å registrere deg med Vipps"
  },
  {
    icon: <CreditCard className="w-6 h-6 text-primary" />,
    title: "Utforsk eiendommer",
    description: "Bla gjennom vårt utvalg av nøye utvalgte eiendommer"
  },
  {
    icon: <CalendarClock className="w-6 h-6 text-primary" />,
    title: "Velg betalingsmetode",
    description: "Koble til din foretrukne betalingsmetode"
  },
  {
    icon: <Wallet2 className="w-6 h-6 text-primary" />,
    title: "Motta utbetalinger",
    description: "Få daglige leieinntekter direkte til din lommebok"
  }
];

export const StepsTimeline = () => {
  return (
    <div className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-nordic-charcoal">
          Kom i gang med Kvanta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-nordic-softblue flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-nordic-charcoal">{step.title}</h3>
              <p className="text-sm text-center text-nordic-gray">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowUpRight className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-6 h-6 text-primary/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};