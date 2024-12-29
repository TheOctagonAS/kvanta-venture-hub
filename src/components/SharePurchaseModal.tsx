import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  onPurchase: (tokenCount: number) => void;
}

const TokenPurchaseModal = ({
  isOpen,
  onClose,
  propertyName,
  onPurchase,
}: TokenPurchaseModalProps) => {
  const [tokenCount, setTokenCount] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPurchase(tokenCount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto">
        <DialogHeader>
          <DialogTitle>Kjøp tokens i {propertyName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tokenCount" className="text-sm font-medium">
              Antall tokens
            </label>
            <Input
              id="tokenCount"
              type="number"
              min="1"
              value={tokenCount}
              onChange={(e) => setTokenCount(parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Bekreft kjøp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchaseModal;