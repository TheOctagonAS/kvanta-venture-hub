import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transfer {
  id: string;
  tx_hash: string;
  from_address: string;
  to_address: string;
  token_count: number;
  block_number: number | null;
  created_at: string;
  property: {
    name: string;
  };
}

export const TransferHistory = () => {
  const { user } = useAuth();

  const { data: transfers } = useQuery({
    queryKey: ['transfers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('on_chain_transfers')
        .select(`
          *,
          property:properties(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transfer[];
    },
    enabled: !!user,
  });

  if (!transfers?.length) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        Ingen overføringer ennå
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] w-full">
      <div className="space-y-3">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="flex items-start gap-3 text-sm">
            {transfer.from_address === 'KVANTA_CUSTODY' ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            ) : (
              <ArrowDownLeft className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
            )}
            <div>
              <p className="text-gray-700">
                {transfer.from_address === 'KVANTA_CUSTODY'
                  ? `Overførte ${transfer.token_count} tokens av ${transfer.property.name} til ${transfer.to_address.slice(0, 6)}...${transfer.to_address.slice(-4)}`
                  : `Mottok ${transfer.token_count} tokens av ${transfer.property.name} fra ${transfer.from_address.slice(0, 6)}...${transfer.from_address.slice(-4)}`}
              </p>
              <p className="text-xs text-gray-500">
                {transfer.block_number ? `Block #${transfer.block_number}` : 'Venter på bekreftelse'} • 
                {new Date(transfer.created_at).toLocaleDateString('nb-NO')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};