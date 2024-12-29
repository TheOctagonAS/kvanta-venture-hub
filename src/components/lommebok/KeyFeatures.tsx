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
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Nøkkelfunksjoner i Din Lommebok
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Full Oversikt</h3>
          </div>
          <p className="text-gray-600">
            Se dine tokens, avkastning, og eiendomsverdi i sanntid.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Daglig Avkastning</h3>
          </div>
          <p className="text-gray-600">
            Motta leie daglig, 'claim' dem når du vil, akkurat som i krypto-verdens staking.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Trygg og Transparent</h3>
          </div>
          <p className="text-gray-600">
            All historikk er synlig. Se når du har kjøpt, solgt og claimet inntekter.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <ArrowUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Fleksibel Uttak</h3>
          </div>
          <p className="text-gray-600">
            Overfør leieinntekter til bankkontoen din når som helst.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyFeatures;