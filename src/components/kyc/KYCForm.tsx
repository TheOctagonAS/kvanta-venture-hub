import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { doPepCheck } from "@/utils/pepCheck";

interface FormData {
  personalNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
}

interface KYCFormProps {
  onComplete: () => void;
}

const KYCForm = ({ onComplete }: KYCFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPep, setIsPep] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personalNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personalNumber || !formData.firstName || !formData.lastName) {
      toast.error("Vennligst fyll ut alle påkrevde felt");
      return;
    }

    if (!/^\d{11}$/.test(formData.personalNumber)) {
      toast.error("Vennligst skriv inn et gyldig personnummer (11 siffer)");
      return;
    }

    setIsSubmitting(true);
    try {
      // Perform PEP check
      const pepCheckResult = await doPepCheck(isPep);
      if (!pepCheckResult.isClean) {
        toast.error(pepCheckResult.message);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Ingen bruker funnet");

      const fullName = `${formData.firstName} ${formData.lastName}`;
      const fullAddress = `${formData.address}, ${formData.postalCode} ${formData.city}`;

      // Insert KYC data
      const { error: kycError } = await supabase
        .from('kyc_data')
        .insert({
          user_id: user.id,
          full_name: fullName,
          address: fullAddress,
          personal_number: formData.personalNumber,
          is_pep: isPep
        });

      if (kycError) throw kycError;
      
      onComplete();
    } catch (error) {
      console.error("KYC submission failed:", error);
      toast.error("Kunne ikke lagre KYC-data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="personalNumber" className="text-[#333] dark:text-[#eee]">Personnummer *</Label>
          <Input
            id="personalNumber"
            placeholder="11 siffer"
            value={formData.personalNumber}
            onChange={(e) =>
              setFormData({ ...formData, personalNumber: e.target.value })
            }
            className="border-gray-300 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-[#eee]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="text-[#333] dark:text-[#eee]">Fornavn *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="border-gray-300 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-[#eee]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="text-[#333] dark:text-[#eee]">Etternavn *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="border-gray-300 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-[#eee]"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address" className="text-[#333] dark:text-[#eee]">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="border-gray-300 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-[#eee]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="postalCode" className="text-[#333] dark:text-[#eee]">Postnummer</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              className="border-gray-300 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-[#eee]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city" className="text-[#333] dark:text-[#eee]">Sted</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="border-gray-300 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-[#eee]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pep"
            checked={isPep}
            onCheckedChange={(checked) => setIsPep(checked as boolean)}
            className="border-gray-300 dark:border-gray-600"
          />
          <Label htmlFor="pep" className="text-sm text-gray-600 dark:text-gray-400">
            Er du en politisk eksponert person (PEP)?
          </Label>
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isSubmitting ? "Sender..." : "Neste"}
      </Button>
    </form>
  );
};

export default KYCForm;