import { Property } from "@/types/property";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "./OrderSummary";

interface OrderPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tokenCount: number;
  property: Property;
  paymentMethod: string | null;
}

export const OrderPreviewDialog = ({
  isOpen,
  onClose,
  onConfirm,
  tokenCount,
  property,
  paymentMethod,
}: OrderPreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bekreft ordre</DialogTitle>
          <DialogDescription>
            Du er i ferd med å kjøpe tokens i {property.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <OrderSummary
            tokenCount={tokenCount}
            property={property}
            paymentMethod={paymentMethod}
          />
          {paymentMethod === 'algorand' && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <p>Ved å bekrefte denne ordren vil du:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Initiere en ASA token-overføring</li>
                <li>Motta {tokenCount} tokens i {property.name}</li>
                <li>Transaksjonen vil bli registrert på Algorand blockchain</li>
              </ul>
            </div>
          )}
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={onConfirm}>
            Bekreft ordre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};