import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { vippsService } from "@/services/vippsService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VippsCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleVippsLogin = async () => {
      const code = searchParams.get("code");
      if (!code) {
        toast.error("Ingen autorisasjonskode mottatt fra Vipps");
        navigate("/login");
        return;
      }

      try {
        const vippsProfile = await vippsService.handleVippsCallback(code);
        
        if (!vippsProfile.email) {
          toast.error("E-post er påkrevd for å logge inn");
          navigate("/login");
          return;
        }

        // Check if user exists
        const { data: { user }, error: signInError } = await supabase.auth.signInWithEmail({
          email: vippsProfile.email,
          password: crypto.randomUUID(), // This won't be used since we're using Vipps
        });

        if (signInError?.message.includes("Invalid login credentials")) {
          // User doesn't exist, create new account
          const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
            email: vippsProfile.email,
            password: crypto.randomUUID(),
            options: {
              data: {
                phone: vippsProfile.phone_number,
                name: vippsProfile.name,
              }
            }
          });

          if (signUpError) throw signUpError;

          // Create profile for new user
          if (newUser) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: newUser.id,
                  is_kyc: false,
                }
              ]);

            if (profileError) throw profileError;
          }

          toast.success("Konto opprettet med Vipps");
        } else if (signInError) {
          throw signInError;
        }

        toast.success("Innlogging vellykket");
        navigate("/minside");
      } catch (error) {
        console.error("Vipps authentication error:", error);
        toast.error("Det oppstod en feil under innlogging med Vipps");
        navigate("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    handleVippsLogin();
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Logger inn med Vipps...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default VippsCallback;