import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import KYCModal from "@/components/KYCModal";
import LoanPropertyForm from "@/components/loan/LoanPropertyForm";
import { createLoanProperty, submitLoanRequest } from "@/services/loanPropertyService";
import { supabase } from "@/integrations/supabase/client";

const LoanRegisterProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: "",
    estimatedValue: "",
    requestedAmount: "",
    repaymentMonths: "12",
    interestRate: 5,
    ownershipDeclaration: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Du må være logget inn for å fortsette");
      return;
    }

    if (!formData.ownershipDeclaration) {
      toast.error("Du må bekrefte at du eier eiendommen");
      return;
    }

    // Check if user is KYC verified
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_kyc')
      .eq('id', user.id)
      .single();

    if (!profile?.is_kyc) {
      setIsKYCModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const loanRequest = await submitLoanRequest(user.id, formData);
      await createLoanProperty(
        loanRequest.id,
        user.id,
        parseFloat(formData.requestedAmount),
        formData.interestRate
      );

      toast.success("Søknaden din er mottatt og tokens er opprettet!");
      navigate("/minside");
    } catch (error: any) {
      console.error("Error submitting loan request:", error);
      toast.error("Kunne ikke sende søknaden. Prøv igjen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Registrer eiendom for belåning</h1>
          
          <LoanPropertyForm
            formData={formData}
            onChange={(newData) => setFormData({ ...formData, ...newData })}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onComplete={async () => {
          setIsKYCModalOpen(false);
          // Retry form submission after KYC
          handleSubmit(new Event('submit') as any);
        }}
      />
    </div>
  );
};

export default LoanRegisterProperty;