import { motion } from "framer-motion";
import { Eye, DollarSign, Shield, ArrowUp } from "lucide-react";

const KeyFeatures = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      <h2 className="text-2xl font-bold text-[#222] tracking-wide mb-8">
        Nøkkelfunksjoner i Din Lommebok
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400 hover:shadow-md transition-all duration-200 hover:scale-105">
          <div className="flex flex-col items-start">
            <Eye className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-[#222] tracking-wide mb-2">Full Oversikt</h3>
            <p className="text-sm text-[#555]">
              Se tokens, avkastning og eiendomsverdi i sanntid.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400 hover:shadow-md transition-all duration-200 hover:scale-105">
          <div className="flex flex-col items-start">
            <DollarSign className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-[#222] tracking-wide mb-2">Daglig Avkastning</h3>
            <p className="text-sm text-[#555]">
              Motta og claim leieinntekter når du vil.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400 hover:shadow-md transition-all duration-200 hover:scale-105">
          <div className="flex flex-col items-start">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-[#222] tracking-wide mb-2">Trygg og Transparent</h3>
            <p className="text-sm text-[#555]">
              Full historikk over kjøp, salg og inntekter.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400 hover:shadow-md transition-all duration-200 hover:scale-105">
          <div className="flex flex-col items-start">
            <ArrowUp className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-[#222] tracking-wide mb-2">Fleksibel Uttak</h3>
            <p className="text-sm text-[#555]">
              Overfør til bankkonto når som helst.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyFeatures;