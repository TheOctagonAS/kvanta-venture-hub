import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="bg-nordic-softblue p-8 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Din Digitale Lommebok: Fremtidens Eiendomsverktøy
        </h1>
        <p className="text-xl mt-4 text-gray-600">
          Hold oversikt over tokens, avkastning og daglige leieinntekter – alt i en enkel og sikker plattform.
        </p>
      </div>
    </motion.div>
  );
};

export default Header;