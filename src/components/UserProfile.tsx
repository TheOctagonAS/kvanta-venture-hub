import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
          <p className="text-gray-700">
            KYC-status:{" "}
            <span
              className={`font-semibold ${
                isKyc ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isKyc ? "Verifisert" : "Ikke verifisert"}
            </span>
          </p>
          <p className="text-gray-700 mt-2">
            Total opptjent leie: {user.accumulatedRent || 0} kr
          </p>
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