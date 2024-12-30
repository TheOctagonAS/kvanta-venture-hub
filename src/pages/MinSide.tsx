import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import UserProfile from "@/components/UserProfile";
import UserHoldings from "@/components/UserHoldings";
import Statistics from "@/components/Statistics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const MinSide = () => {
  const { user } = useAuth();

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
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-foreground dark:text-foreground-dark">Laster...</div>
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
          {!user ? (
            <div className="text-foreground dark:text-foreground-dark">Vennligst logg inn</div>
          ) : (
            <>
              <div className="bg-overlay dark:bg-overlay-dark rounded-lg shadow-sm border border-gray-200 dark:border-[#333] p-6">
                <UserProfile 
                  isKyc={profile?.is_kyc || false} 
                  onStartKYC={handleStartKYC} 
                />
              </div>
              
              {!profile?.is_kyc && (
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
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MinSide;