import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <PropertyOverview />
        {isKyc ? (
          <Button
            onClick={() => navigate("/liste-eiendom")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Liste Eiendom
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/kyc")}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Fullfør KYC for å liste eiendom
          </Button>
        )}
      </div>
      
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