import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WalletConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WalletConnectionDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: WalletConnectionDialogProps) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Du må være logget inn");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ algo_address: address })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Lommebok tilkoblet");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Kunne ikke koble til lommebok");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Koble til Algorand-lommebok</DialogTitle>
          <DialogDescription>
            Denne funksjonen lar deg betale med krypto i fremtiden, men krever foreløpig en innlogging med BankID for verifisering.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="address">Algorand-adresse</Label>
            <Input
              id="address"
              placeholder="Oppgi din Algorand-adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kobler til..." : "Koble til"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};