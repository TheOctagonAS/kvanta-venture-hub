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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {selectedMethod ? (
            <span className="flex items-center">
              {selectedMethod === "bank_account" && "Bankkonto (placeholder)"}
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
            className="justify-start"
            onClick={() => handleSelect("bank_account")}
          >
            Bankkonto
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            disabled
            onClick={() => handleSelect("card")}
          >
            Kort (Visa/Mastercard)
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            disabled
            onClick={() => handleSelect("vipps")}
          >
            Vipps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};