import { Property } from "@/types/property";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  tokenCount: number;
  property: Property;
  paymentMethod: string | null;
}

export const OrderSummary = ({ tokenCount, property, paymentMethod }: OrderSummaryProps) => {
  const totalAmount = tokenCount * property.price_per_token;

  return (
    <div className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Antall tokens:</span>
        <span className="font-medium">{tokenCount}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-600">Pris per token:</span>
        <span className="font-medium">{property.price_per_token.toLocaleString()} NOK</span>
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total:</span>
        <span className="text-nordic-blue">{totalAmount.toLocaleString()} NOK</span>
      </div>
      {paymentMethod && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Betalingsmetode:</span>
          <span className="font-medium capitalize">
            {paymentMethod.replace('_', ' ')}
          </span>
        </div>
      )}
    </div>
  );
};