import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Shield, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const KYC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    personalNumber: "",
  });
  const [isPep, setIsPep] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankID, setShowBankID] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!gdprConsent) {
      toast.error("Du må godta brukervilkårene for å fortsette");
      return;
    }

    if (!/^\d{11}$/.test(formData.personalNumber)) {
      toast.error("Vennligst skriv inn et gyldig fødselsnummer (11 siffer)");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Ingen bruker funnet");

      // Insert KYC data
      const { error: kycError } = await supabase
        .from('kyc_data')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          address: formData.address,
          personal_number: formData.personalNumber,
          is_pep: isPep
        });

      if (kycError) throw kycError;
      
      setShowBankID(true);
    } catch (error) {
      console.error("KYC submission failed:", error);
      toast.error("Kunne ikke lagre KYC-data");
    } finally {
      setIsSubmitting(false);
    }
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

        const { error } = await supabase
          .from('profiles')
          .update({ is_kyc: true })
          .eq('id', user.id);

        if (error) throw error;

        toast.success("KYC-verifisering fullført!");
        navigate("/minside");
      } catch (error) {
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
          <h1 className="text-2xl font-bold mb-6">Fullfør KYC – steg for steg</h1>

          {!showBankID ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personalia Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                  <User className="h-5 w-5" />
                  <h2>Personalia</h2>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Fullt navn</Label>
                    <Input 
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Ola Nordmann"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="personalNumber">Fødselsnummer (11 siffer)</Label>
                    <Input 
                      id="personalNumber"
                      value={formData.personalNumber}
                      onChange={(e) => setFormData({ ...formData, personalNumber: e.target.value })}
                      required
                      placeholder="12345678901"
                      pattern="\d{11}"
                      title="Vennligst skriv inn et gyldig 11-sifret fødselsnummer"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Kongens gate 1"
                    />
                  </div>
                </div>
              </div>

              {/* PEP Check Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                  <Shield className="h-5 w-5" />
                  <h2>PEP-sjekk</h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pep"
                    checked={isPep}
                    onCheckedChange={(checked) => setIsPep(checked as boolean)}
                  />
                  <Label htmlFor="pep" className="text-sm text-gray-600">
                    Er du en politisk eksponert person (PEP)?
                  </Label>
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gdpr"
                    checked={gdprConsent}
                    onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                    required
                  />
                  <Label htmlFor="gdpr" className="text-sm text-gray-600">
                    Jeg samtykker til at Kvanta.ai lagrer mine opplysninger
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                Neste
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2>BankID-signering</h2>
              </div>
              
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