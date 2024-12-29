import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => Promise<void>;
}

const KYCModal = ({ isOpen, onClose, onComplete }: KYCModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personalNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.personalNumber || !formData.firstName || !formData.lastName) {
      toast.error("Vennligst fyll ut alle påkrevde felt");
      return;
    }

    // Validate Norwegian personal number format (11 digits)
    if (!/^\d{11}$/.test(formData.personalNumber)) {
      toast.error("Vennligst skriv inn et gyldig personnummer (11 siffer)");
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete();
      toast.success("KYC-verifisering fullført!");
      onClose();
    } catch (error) {
      console.error("KYC verification failed:", error);
      toast.error("Kunne ikke fullføre KYC-verifisering");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>KYC-verifisering</DialogTitle>
          <DialogDescription>
            Fyll ut informasjonen under for å verifisere din identitet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Verifiserer..." : "Fullfør verifisering"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KYCModal;