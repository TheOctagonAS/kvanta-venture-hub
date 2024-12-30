import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { algorandService } from "@/services/AlgorandService";
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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleConnect = async () => {
    if (!user) {
      toast.error("Du må være logget inn");
      return;
    }

    setIsLoading(true);
    try {
      const address = await algorandService.connectWallet();
      
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

        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Kobler til..." : "Koble til Algorand Wallet"}
          </Button>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};