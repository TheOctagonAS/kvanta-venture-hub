import { Property } from "@/types/property";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderSummary } from "./OrderSummary";

interface OrderPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tokenCount: number;
  property: Property;
  paymentMethod: string | null;
}

export const OrderPreviewDialog = ({
  isOpen,
  onClose,
  tokenCount,
  property,
  paymentMethod,
}: OrderPreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ordresammendrag</DialogTitle>
          <DialogDescription>
            Vennligst bekreft ordreinformasjonen under
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <OrderSummary
            tokenCount={tokenCount}
            property={property}
            paymentMethod={paymentMethod}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};