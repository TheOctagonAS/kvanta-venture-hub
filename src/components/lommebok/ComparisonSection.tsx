import { motion } from "framer-motion";
import { TrendingUp, ArrowDownUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ComparisonSection = () => {
  return (
    <>
      <Separator className="my-16 bg-gray-300" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Hvorfor Eiendom er Fremtidens Investering
        </h2>
        <p className="text-gray-600 mb-12">
          Eiendom har over tid vist seg å være stabilt, med mulighet for jevn verdistigning. 
          Kombinert med daglige leieinntekter gir dette en unik kombinasjon av trygghet og lønnsomhet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Eiendom</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700">Stabil verdiutvikling over tid</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700">Fysisk sikkerhet i eiendommen</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700">Jevne leieinntekter</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <ArrowDownUp className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900">Tradisjonelle Aksjer</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700">Høyere volatilitet</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700">Usikker utbyttebetaling</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700">Mer påvirket av markedssvingninger</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-gray-700 font-medium">
          Med Kvanta.ai sin tokenisering får du alle fordelene ved eiendomsinvestering, 
          men med den enkelheten og tilgjengeligheten som moderne teknologi muliggjør.
        </p>
      </motion.div>
    </>
  );
};

export default ComparisonSection;