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
        </div>
      </motion.div>
    </div>
  );
};

export default Lommebok;