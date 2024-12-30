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
import { Bank, CreditCard, Smartphone } from "lucide-react";

type PaymentMethod = "bank_account" | "card" | "vipps" | null;

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod;
}

export const PaymentMethodSelector = ({
  onSelect,
  selectedMethod,
}: PaymentMethodSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (method: PaymentMethod) => {
    onSelect(method);
    setIsOpen(false);
    toast.info("Dette er en test-versjon. Ekte betalinger kommer snart.");
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "bank_account":
        return <Bank className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "vipps":
        return <Smartphone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {selectedMethod ? (
            <span className="flex items-center gap-2">
              {getMethodIcon(selectedMethod)}
              {selectedMethod === "bank_account" && "Bankkonto"}
              {selectedMethod === "card" && "Kort (kommer snart)"}
              {selectedMethod === "vipps" && "Vipps (kommer snart)"}
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
            <Bank className="h-4 w-4" />
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
            <Smartphone className="h-4 w-4" />
            Vipps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};