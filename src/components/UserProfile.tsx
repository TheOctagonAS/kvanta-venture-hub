import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import KYCModal from "./KYCModal";

const UserProfile = ({ isKyc, onStartKYC }: { isKyc: boolean; onStartKYC: () => Promise<void> }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Du er nå logget ut");
    navigate("/");
  };

  const handleKYCClick = () => {
    navigate("/kyc");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-nordic-charcoal dark:text-foreground-dark">
          Velkommen, {user.email}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-nordic-gray dark:text-[#ddd]">KYC-status: </span>
          {isKyc ? (
            <span className="flex items-center gap-1 text-accent dark:text-accent-dark font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Verifisert
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <XCircle className="h-4 w-4" />
              Ikke verifisert
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {!isKyc && (
          <Button 
            onClick={handleKYCClick}
            variant="default"
            className="bg-primary hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90"
          >
            Fullfør KYC
          </Button>
        )}
        <Button 
          onClick={handleLogout} 
          variant="outline"
          className="border-gray-200 dark:border-[#333] dark:text-foreground-dark dark:hover:bg-[#2a2a2a]"
        >
          Logg ut
        </Button>
      </div>

      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onComplete={onStartKYC}
      />
    </div>
  );
};

export default UserProfile;