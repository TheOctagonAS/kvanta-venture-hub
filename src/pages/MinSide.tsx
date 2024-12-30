import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import UserProfile from "@/components/UserProfile";
import UserHoldings from "@/components/UserHoldings";
import Statistics from "@/components/Statistics";
import PropertyOverview from "@/components/PropertyOverview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartBar, Receipt } from "lucide-react";

const MinSide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: profile, refetch: refetchProfile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [profileResponse, kycResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('kyc_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (profileResponse.error) {
        throw profileResponse.error;
      }

      if (kycResponse.error && kycResponse.error.code !== 'PGRST116') {
        throw kycResponse.error;
      }

      return {
        ...profileResponse.data,
        kyc_data: kycResponse.data
      };
    },
    enabled: !!user,
  });

  const handleStartKYC = async () => {
    await refetchProfile();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="text-gray-600">Laster...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Portefølje
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/leie-og-avkastning')}
              className="flex items-center gap-2"
            >
              <ChartBar className="h-4 w-4" />
              Leie og Avkastning
            </Button>
            <Button
              onClick={() => navigate('/skatt')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Receipt className="h-4 w-4" />
              Skatteoversikt
            </Button>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <PropertyOverview />
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <UserProfile 
              isKyc={profile?.is_kyc || false} 
              onStartKYC={handleStartKYC} 
            />
          </div>
          
          {!profile?.is_kyc && (
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
      </main>
    </div>
  );
};

export default MinSide;