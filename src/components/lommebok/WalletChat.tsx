import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const WalletChat = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6 relative"
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img 
            src="/placeholder.svg" 
            alt="User avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="font-medium mb-1">Du</div>
          <div className="text-gray-600">
            Hvordan kan jeg følge med på avkastningen min fra eiendomsinvesteringene?
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-nordic-softblue overflow-hidden flex-shrink-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-nordic-blue" />
        </div>
        <div className="flex-1">
          <div className="font-medium mb-1">Kvanta Assistant</div>
          <div className="text-gray-600">
            I din digitale lommebok kan du enkelt følge med på:
            <ul className="mt-2 space-y-2">
              <li>• Daglig opptjent leieinntekt</li>
              <li>• Total verdiøkning på eiendomstokens</li>
              <li>• Reinvestert avkastning og compound effekt</li>
              <li>• Historisk utvikling av porteføljen din</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full">
        <div className="bg-[#2A2F2B] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-lg">
          <span className="text-gray-300">Still et spørsmål til Kvanta Assistant</span>
          <Sparkles className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </motion.div>
  );
};

export default WalletChat;