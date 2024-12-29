import { motion } from "framer-motion";
import { TrendingUp, ArrowDownUp } from "lucide-react";

const ComparisonSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-16 bg-white rounded-xl shadow-sm p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Hvorfor Eiendom er Fremtidens Investering
      </h2>
      <p className="text-gray-600 mb-8">
        Eiendom har over tid vist seg å være stabilt, med mulighet for jevn verdistigning. 
        Kombinert med daglige leieinntekter gir dette en unik kombinasjon av trygghet og lønnsomhet.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Eiendom</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Stabil verdiutvikling over tid
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Fysisk sikkerhet i eiendommen
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Jevne leieinntekter
            </li>
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tradisjonelle Aksjer</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Høyere volatilitet
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Usikker utbyttebetaling
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Mer påvirket av markedssvingninger
            </li>
          </ul>
        </div>
      </div>

      <p className="text-gray-600 font-medium">
        Med Kvanta.ai sin tokenisering får du alle fordelene ved eiendomsinvestering, 
        men med den enkelheten og tilgjengeligheten som moderne teknologi muliggjør.
      </p>
    </motion.div>
  );
};

export default ComparisonSection;