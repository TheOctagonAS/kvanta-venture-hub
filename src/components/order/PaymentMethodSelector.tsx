import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Banknote, CreditCard, Phone, Wallet } from "lucide-react";
import { WalletConnectionDialog } from "./WalletConnectionDialog";

type PaymentMethod = "bank_account" | "card" | "vipps" | "algorand" | null;

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod;
}

export const PaymentMethodSelector = ({
  onSelect,
  selectedMethod,
}: PaymentMethodSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  const handleSelect = (method: PaymentMethod) => {
    if (method === "algorand") {
      setShowWalletDialog(true);
      return;
    }
    onSelect(method);
    setIsOpen(false);
    toast.info("Dette er en test-versjon. Ekte betalinger kommer snart.");
  };

  const handleWalletSuccess = () => {
    onSelect("algorand");
    setIsOpen(false);
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "bank_account":
        return <Banknote className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "vipps":
        return <Phone className="h-4 w-4" />;
      case "algorand":
        return <Wallet className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case "bank_account":
        return "Bankkonto";
      case "card":
        return "Kort (kommer snart)";
      case "vipps":
        return "Vipps (kommer snart)";
      case "algorand":
        return "Krypto-lommebok (Algorand)";
      default:
        return "Legg til betalingsmetode";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {selectedMethod ? (
              <span className="flex items-center gap-2">
                {getMethodIcon(selectedMethod)}
                {getMethodLabel(selectedMethod)}
              </span>
            ) : (
              "Legg til betalingsmetode"
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Velg betalingsmetode</DialogTitle>
            <DialogDescription>
              OBS: Kommer snart – vi bruker BankID/Vipps for identitet og betaling.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleSelect("bank_account")}
            >
              <Banknote className="h-4 w-4" />
              Bankkonto
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              disabled
              onClick={() => handleSelect("card")}
            >
              <CreditCard className="h-4 w-4" />
              Kort (Visa/Mastercard)
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              disabled
              onClick={() => handleSelect("vipps")}
            >
              <Phone className="h-4 w-4" />
              Vipps
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={() => handleSelect("algorand")}
            >
              <Wallet className="h-4 w-4" />
              Krypto-lommebok (Algorand)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WalletConnectionDialog
        isOpen={showWalletDialog}
        onClose={() => setShowWalletDialog(false)}
        onSuccess={handleWalletSuccess}
      />
    </>
  );
};