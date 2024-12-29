import { motion } from "framer-motion";

const WhySection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12 max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-900">
        Hvorfor er dette så bra?
      </h2>
      <div className="space-y-4 text-gray-600">
        <p>
          Eiendom er historisk stabilt, nå tokenisert for enkel tilgang. Dette er fremtidens måte å investere i eiendom på, 
          med alle fordelene fra tradisjonell eiendomsinvestering, men uten kompleksiteten.
        </p>
        <p>
          Daglige leieinntekter rett i din lommebok, ingen stress. Du kan følge med på inntektene dine i sanntid og 
          se hvordan investeringen din vokser dag for dag.
        </p>
        <p>
          Ingen komplisert papirarbeid – alt håndteres digitalt. Vi har modernisert hele prosessen slik at du kan 
          fokusere på det som virkelig betyr noe: avkastningen din.
        </p>
      </div>
    </motion.div>
  );
};

export default WhySection;