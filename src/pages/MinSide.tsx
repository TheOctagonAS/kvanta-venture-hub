import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import UserProfile from "@/components/UserProfile";
import UserHoldings from "@/components/UserHoldings";
import Statistics from "@/components/Statistics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const MinSide = () => {
  const { user } = useAuth();

  const { data: profile, refetch: refetchProfile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
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

      return {
        ...profileResponse.data,
        kyc_data: kycResponse.data
      };
    },
    enabled: !!user?.id,
    retry: 1,
  });

  const handleStartKYC = async () => {
    await refetchProfile();
  };

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-6">
            <UserProfile 
              isKyc={profile?.is_kyc || false} 
              onStartKYC={handleStartKYC} 
            />
          </div>
          
          {profile && !profile.is_kyc && (
            <Alert className="bg-yellow-100/90 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-200">
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