import { FlickeringGrid } from "@/components/FlickeringGrid";
import { Hero } from "@/components/Hero";
import { StepsTimeline } from "@/components/home/StepsTimeline";
import { BenefitsGrid } from "@/components/home/BenefitsGrid";
import YieldCalculator from "@/components/YieldCalculator";
import { PartnersSection } from "@/components/home/PartnersSection";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <FlickeringGrid color="rgb(37, 99, 235)" maxOpacity={0.15} />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 space-y-12 sm:space-y-16">
          <Hero />
          <StepsTimeline />
          <BenefitsGrid />
          
          {/* Calculator section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-8"
          >
            <YieldCalculator />
          </motion.div>

          <PartnersSection />
        </div>
      </div>
    </div>
  );
};

export default Index;