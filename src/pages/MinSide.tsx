import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import LoginForm from "@/components/LoginForm";
import UserProfile from "@/components/UserProfile";
import UserHoldings from "@/components/UserHoldings";
import Statistics from "@/components/Statistics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";

const MinSide = () => {
  const { user } = useAuth();

  const { data: profile, refetch: refetchProfile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleStartKYC = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_kyc: true })
        .eq('id', user.id);

      if (error) throw error;

      await refetchProfile();
      toast.success("KYC-verifisering fullført!");
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error("Kunne ikke fullføre KYC-verifisering");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Laster...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          DeFi Eiendom - Din Tokeniserte Portefølje
        </h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {!user ? (
            <LoginForm />
          ) : (
            <>
              <UserProfile isKyc={profile?.is_kyc || false} onStartKYC={handleStartKYC} />
              
              {!profile?.is_kyc && (
                <Alert className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-800">
                  <AlertDescription>
                    KYC-verifisering kreves for å kjøpe tokens
                  </AlertDescription>
                </Alert>
              )}
              
              <UserHoldings />
              <Statistics />
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MinSide;