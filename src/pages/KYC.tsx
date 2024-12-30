import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import KYCForm from "@/components/kyc/KYCForm";
import { useQueryClient } from "@tanstack/react-query";

const KYC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showBankID, setShowBankID] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Get pre-populated data from URL params
  const prePopulatedData = {
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
    address: searchParams.get('address') || '',
  };

  const handleKYCComplete = () => {
    setShowBankID(true);
  };

  const handleBankIDClick = async () => {
    const confirmBankID = window.confirm(
      "BankID-prosess vil i fremtiden linke til faktisk BankID API. For nå, klikk 'Ok' for å mock signering."
    );

    if (confirmBankID) {
      setIsSubmitting(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Ingen bruker funnet");

        // Update profiles table to set is_kyc to true
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_kyc: true })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Invalidate and refetch profile data
        await queryClient.invalidateQueries({ queryKey: ['profile'] });

        toast.success("KYC-verifisering fullført!");
        navigate("/minside");
      } catch (error: any) {
        console.error("KYC verification failed:", error);
        toast.error("Kunne ikke fullføre KYC-verifisering");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">
            {showBankID ? "BankID-verifisering" : "KYC-verifisering"}
          </h1>

          {!showBankID ? (
            <KYCForm onComplete={handleKYCComplete} prePopulatedData={prePopulatedData} />
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 mb-6">
                For å fullføre KYC-prosessen, må du signere med BankID.
              </p>

              <Button 
                onClick={handleBankIDClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Behandler..." : "Start BankID"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYC;