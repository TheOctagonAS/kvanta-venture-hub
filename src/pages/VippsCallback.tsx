import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VippsCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleVippsCallback = async () => {
      const code = searchParams.get("code");
      if (!code) {
        toast.error("Ingen autorisasjonskode mottatt fra Vipps");
        navigate("/login");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('vipps-callback', {
          body: { code }
        });

        if (error) throw error;

        if (data.session) {
          // Set the session
          const { error: setSessionError } = await supabase.auth.setSession(data.session);
          if (setSessionError) throw setSessionError;
        }

        // Redirect to KYC page
        navigate(new URL(data.redirectUrl).pathname + new URL(data.redirectUrl).search);
      } catch (error) {
        console.error("Vipps authentication error:", error);
        toast.error("Det oppstod en feil under innlogging med Vipps");
        navigate("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    handleVippsCallback();
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