import { motion } from "framer-motion";
import { Eye, DollarSign, Shield, ArrowUp } from "lucide-react";
import BackgroundBeams from "@/components/BackgroundBeams";

const Lommebok = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-16 relative">
      <BackgroundBeams />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Din Digitale Lommebok – Eiendomsinvestering gjort enkelt
          </h1>
          <p className="text-lg text-gray-300">
            Få full oversikt over tokens, leieinntekter og fremtidig avkastning. 
            Opplev hvor trygt og lønnsomt eiendom kan være.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-8 space-y-4"
          >
            <h2 className="text-xl font-bold text-white">
              Hvorfor er dette så bra?
            </h2>
            <div className="space-y-4 text-gray-300">
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Nøkkelfunksjoner i Din Lommebok
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Full Oversikt</h3>
                </div>
                <p className="text-gray-300">
                  Se dine tokens, avkastning, og eiendomsverdi i sanntid.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Daglig Avkastning</h3>
                </div>
                <p className="text-gray-300">
                  Motta leie daglig, 'claim' dem når du vil, akkurat som i krypto-verdens staking.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Trygg og Transparent</h3>
                </div>
                <p className="text-gray-300">
                  All historikk er synlig. Se når du har kjøpt, solgt og claimet inntekter.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ArrowUp className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Fleksibel Uttak</h3>
                </div>
                <p className="text-gray-300">
                  Overfør leieinntekter til bankkontoen din når som helst.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lommebok;