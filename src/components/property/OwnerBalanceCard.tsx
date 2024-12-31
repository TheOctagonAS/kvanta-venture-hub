import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { BalanceModal } from "../BalanceModal";

export const OwnerBalanceCard = () => {
  const { user } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ['owner-balance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_balance')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code === 'PGRST116') return { balance: 0 };
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleWithdrawSuccess = () => {
    refetchBalance();
  };

  return (
    <Card className="bg-white shadow-sm p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-6 w-6 text-nordic-blue" />
        <h2 className="text-xl font-semibold">Tilgjengelige midler</h2>
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-nordic-charcoal">
          {(balance?.balance || 0).toLocaleString()} NOK
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Inntekter fra tokensalg
        </div>
      </div>

      <Button
        onClick={() => setShowWithdrawModal(true)}
        className="w-full flex items-center justify-center gap-2"
      >
        <ArrowDownToLine className="h-4 w-4" />
        Uttak
      </Button>

      <BalanceModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        type="withdraw"
        onSuccess={handleWithdrawSuccess}
      />
    </Card>
  );
};