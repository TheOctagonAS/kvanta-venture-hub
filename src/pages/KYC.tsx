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
  const [isPep, setIsPep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  };

  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Fullfør KYC – steg for steg</h1>

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
                  <Input id="fullName" required placeholder="Ola Nordmann" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ssn">Fødselsnummer (11 siffer)</Label>
                  <Input 
                    id="ssn" 
                    required 
                    placeholder="12345678901"
                    pattern="\d{11}"
                    title="Vennligst skriv inn et gyldig 11-sifret fødselsnummer"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" required placeholder="Kongens gate 1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="postalCode">Postnummer</Label>
                    <Input 
                      id="postalCode" 
                      required 
                      placeholder="0123"
                      pattern="\d{4}"
                      title="Vennligst skriv inn et gyldig 4-sifret postnummer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">Poststed</Label>
                    <Input id="city" required placeholder="Oslo" />
                  </div>
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
                  Jeg bekrefter at jeg er en politisk eksponert person (PEP)
                </Label>
              </div>
            </div>

            {/* BankID Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2>BankID-signering</h2>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  For å fullføre KYC-prosessen må du signere med BankID.
                  Dette steget vil bli aktivert når all informasjon er fylt ut.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Behandler..." : "Fullfør KYC-verifisering"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYC;