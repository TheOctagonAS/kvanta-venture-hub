import { motion } from "framer-motion";
import Header from "@/components/lommebok/Header";
import WhySection from "@/components/lommebok/WhySection";
import KeyFeatures from "@/components/lommebok/KeyFeatures";
import ComparisonSection from "@/components/lommebok/ComparisonSection";
import CTASection from "@/components/lommebok/CTASection";

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
          <Header />
          <WhySection />
          <KeyFeatures />
          <ComparisonSection />
          <CTASection />
        </div>
      </motion.div>
    </div>
  );
};

export default Lommebok;