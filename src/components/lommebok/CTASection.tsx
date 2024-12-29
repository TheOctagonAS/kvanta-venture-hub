import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-16 bg-blue-600 text-white rounded-xl p-8 max-w-2xl mx-auto text-center hover:scale-105 transition-transform duration-200"
    >
      <h2 className="text-2xl font-bold mb-4 tracking-wide">
        Klar til å begynne?
      </h2>
      <p className="text-lg mb-8">
        Opprett din digitale lommebok nå og start eiendomsreisen med bare noen få klikk.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Link to="/register">Opprett Bruker</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-blue-700 hover:border-transparent transition-colors"
        >
          <Link to="/eiendommer">Se Eiendommer</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default CTASection;