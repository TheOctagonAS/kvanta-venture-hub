import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

const UserProfile = ({ isKyc, onStartKYC }: { isKyc: boolean; onStartKYC: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Du er nå logget ut");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Velkommen, {user.email}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-gray-700">KYC-status: </span>
          {isKyc ? (
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Verifisert
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <XCircle className="h-4 w-4" />
              Ikke verifisert
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {!isKyc && (
          <Button onClick={onStartKYC} variant="default">
            Fullfør KYC
          </Button>
        )}
        <Button onClick={handleLogout} variant="outline">
          Logg ut
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;