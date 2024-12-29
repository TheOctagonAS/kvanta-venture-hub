import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginForm from "@/components/LoginForm";
import UserProfile from "@/components/UserProfile";
import UserHoldings from "@/components/UserHoldings";

const MinSide = () => {
  const { user } = useAuth();
  const [isKyc, setIsKyc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{ id: user.id, is_kyc: false }]);

          if (createError) throw createError;
          setIsKyc(false);
        } else {
          setIsKyc(profile.is_kyc);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Kunne ikke hente profil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleStartKYC = async () => {
    if (!user) {
      toast.error('Kunne ikke starte KYC-prosessen');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_kyc: true })
        .eq('id', user.id);

      if (error) throw error;

      setIsKyc(true);
      toast.success("KYC-verifisering fullført!");
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error('Kunne ikke oppdatere KYC-status');
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
      <main className="container mx-auto px-4 py-16">
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
              <UserProfile isKyc={isKyc} onStartKYC={handleStartKYC} />
              <UserHoldings />
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MinSide;