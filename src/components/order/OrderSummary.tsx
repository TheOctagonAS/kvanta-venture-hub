import { Property } from "@/types/property";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  tokenCount: number;
  property: Property;
  paymentMethod: string | null;
}

export const OrderSummary = ({ tokenCount, property, paymentMethod }: OrderSummaryProps) => {
  const totalAmount = tokenCount * property.price_per_token;
  
  // Mock ALGO conversion rate (1 ALGO = 25 NOK for this example)
  const mockAlgoRate = 25;
  const estimatedAlgoCost = totalAmount / mockAlgoRate;

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
        <>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Betalingsmetode:</span>
            <span className="font-medium capitalize">
              {paymentMethod.replace('_', ' ')}
            </span>
          </div>
          {paymentMethod === 'algorand' && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <div className="text-sm text-gray-600">
                <p>ASA Token Transfer</p>
                <p className="mt-1">Estimert kostnad: ~{estimatedAlgoCost.toFixed(2)} ALGO</p>
                <p className="text-xs mt-1 text-gray-500">
                  (Estimert kurs: 1 ALGO = {mockAlgoRate} NOK)
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};