import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { doPepCheck } from "@/utils/pepCheck";

interface PrePopulatedData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

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
  prePopulatedData?: PrePopulatedData;
}

const KYCForm = ({ onComplete, prePopulatedData }: KYCFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPep, setIsPep] = useState(false);
  
  // Split pre-populated name into first and last name
  const nameParts = prePopulatedData?.name ? prePopulatedData.name.split(' ') : ['', ''];
  const [firstName, ...lastNameParts] = nameParts;
  const lastName = lastNameParts.join(' ');

  // Split pre-populated address
  const addressParts = prePopulatedData?.address ? prePopulatedData.address.split(',') : [''];
  const streetAddress = addressParts[0] || '';
  const postalInfo = addressParts[1]?.trim().split(' ') || ['', ''];
  const postalCode = postalInfo[0] || '';
  const city = postalInfo.slice(1).join(' ') || '';

  const [formData, setFormData] = useState<FormData>({
    personalNumber: "",
    firstName: firstName || "",
    lastName: lastName || "",
    address: streetAddress || "",
    postalCode: postalCode || "",
    city: city || "",
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
          <Label htmlFor="personalNumber">Personnummer *</Label>
          <Input
            id="personalNumber"
            placeholder="11 siffer"
            value={formData.personalNumber}
            onChange={(e) =>
              setFormData({ ...formData, personalNumber: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Fornavn *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Etternavn *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postnummer</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Sted</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>
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
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sender..." : "Neste"}
      </Button>
    </form>
  );
};

export default KYCForm;