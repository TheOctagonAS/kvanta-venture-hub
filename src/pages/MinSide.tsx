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
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="text-gray-600">Laster...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          DeFi Eiendom - Din Tokeniserte Portefølje
        </h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {!user ? (
            <LoginForm />
          ) : (
            <>
              {/* Top Row */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <UserProfile isKyc={profile?.is_kyc || false} onStartKYC={handleStartKYC} />
              </div>
              
              {!profile?.is_kyc && (
                <Alert className="bg-yellow-100 border-yellow-200 text-yellow-700">
                  <AlertDescription>
                    KYC-verifisering kreves for å kjøpe tokens
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Two Column Layout */}
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