import { motion } from "framer-motion";
import PropertyOverview from "../PropertyOverview";
import UserProfile from "../UserProfile";
import UserHoldings from "../UserHoldings";
import Statistics from "../Statistics";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MainContentProps {
  isKyc: boolean;
  onStartKYC: () => Promise<void>;
}

const MainContent = ({ isKyc, onStartKYC }: MainContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <PropertyOverview />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <UserProfile 
          isKyc={isKyc} 
          onStartKYC={onStartKYC} 
        />
      </div>
      
      {!isKyc && (
        <Alert className="bg-yellow-100 border-yellow-200 text-yellow-700">
          <AlertDescription>
            KYC-verifisering kreves for å kjøpe tokens
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <UserHoldings />
        </div>
        <div className="space-y-6">
          <Statistics />
        </div>
      </div>
    </motion.div>
  );
};

export default MainContent;