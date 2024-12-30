import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderActions from "@/components/minside/HeaderActions";
import MainContent from "@/components/minside/MainContent";

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
        <HeaderActions />
        <MainContent 
          isKyc={profile?.is_kyc || false}
          onStartKYC={handleStartKYC}
        />
      </main>
    </div>
  );
};

export default MinSide;