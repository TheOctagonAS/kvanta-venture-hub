import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          Velkommen, {user.email}
        </CardTitle>
        <Button onClick={handleLogout} variant="outline">
          Logg ut
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">KYC-status: </span>
            {isKyc ? (
              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Verifisert
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">
                Ikke verifisert
              </span>
            )}
          </div>
        </div>

        {!isKyc && (
          <Button onClick={onStartKYC} className="w-full">
            Fullfør KYC
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;