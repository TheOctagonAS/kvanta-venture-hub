import { motion } from "framer-motion";

const Lommebok = () => {
  return (
    <div className="min-h-screen bg-[#f8fbff] py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Din Digitale Lommebok – Eiendomsinvestering gjort enkelt
          </h1>
          <p className="text-lg text-gray-600">
            Få full oversikt over tokens, leieinntekter og fremtidig avkastning. 
            Opplev hvor trygt og lønnsomt eiendom kan være.
          </p>
          
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
        </div>
      </motion.div>
    </div>
  );
};

export default Lommebok;