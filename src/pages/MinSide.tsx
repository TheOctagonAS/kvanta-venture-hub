import { motion } from "framer-motion";

const MinSide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
            Min Side
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Administrer din portefølje og se dine investeringer
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default MinSide;