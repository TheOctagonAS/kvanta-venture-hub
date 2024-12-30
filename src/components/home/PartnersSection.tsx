import { motion } from "framer-motion";

export const PartnersSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mb-24 bg-[#f8f9fa] rounded-lg p-8"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-nordic-charcoal">
        Støttet av ledende aktører i Norden
      </h2>
      <p className="text-nordic-charcoal/80 max-w-2xl mx-auto text-center mb-8">
        Vi samarbeider med etablerte eiendomsaktører og finansinstitusjoner for å sikre en trygg og transparent investeringsplattform.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-nordic-charcoal/60">
        (Her kommer partner-logos)
      </div>
    </motion.div>
  );
};