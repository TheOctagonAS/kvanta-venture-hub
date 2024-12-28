import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            Velkommen til Kvanta.ai
          </h1>
          <p className="text-xl sm:text-2xl text-blue-700 mb-8">
            Eiendomsinvestering for alle i Norden
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Vi gjør det enkelt å investere i eiendom, uansett hvor du befinner deg i Norden.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;