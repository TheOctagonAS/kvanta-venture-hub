import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

interface OrderBookProps {
  propertyId: string;
  onOrderExecuted?: () => void;
}

export const OrderBook = ({ propertyId, onOrderExecuted }: OrderBookProps) => {
  const { user } = useAuth();

  const { data: orders, refetch } = useQuery({
    queryKey: ['orders', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('property_id', propertyId)
        .eq('status', 'OPEN')
        .eq('order_type', 'SELL')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleExecuteOrder = async (orderId: string) => {
    if (!user) {
      toast.error("Du må være logget inn for å handle");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('trade', {
        body: {
          action: 'executeOrder',
          orderId
        }
      });

      if (error) throw error;

      toast.success("Ordre utført");
      refetch();
      onOrderExecuted?.();
    } catch (error) {
      console.error('Execute order error:', error);
      toast.error("Kunne ikke utføre ordre");
    }
  };

  if (!orders?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        Ingen aktive salgsordre
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Antall tokens</TableHead>
          <TableHead>Pris per token</TableHead>
          <TableHead>Total</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.token_count}</TableCell>
            <TableCell>{order.price_per_token} NOK</TableCell>
            <TableCell>{order.token_count * order.price_per_token} NOK</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteOrder(order.id)}
                disabled={order.user_id === user?.id}
              >
                {order.user_id === user?.id ? "Din ordre" : "Kjøp"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};