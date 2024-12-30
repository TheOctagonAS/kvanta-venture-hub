import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw";
  onSuccess: () => void;
}

export const BalanceModal = ({ isOpen, onClose, type, onSuccess }: BalanceModalProps) => {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !method) {
      toast.error("Vennligst fyll ut alle felt");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Ugyldig beløp");
      return;
    }

    try {
      const { data: existingBalance } = await supabase
        .from('user_balance')
        .select('*')
        .single();

      if (!existingBalance) {
        // Create initial balance record
        await supabase
          .from('user_balance')
          .insert([
            { balance: type === 'deposit' ? numAmount : -numAmount }
          ]);
      } else {
        // Update existing balance
        const newBalance = type === 'deposit' 
          ? existingBalance.balance + numAmount 
          : existingBalance.balance - numAmount;
        
        if (type === 'withdraw' && newBalance < 0) {
          toast.error("Utilstrekkelig saldo");
          return;
        }

        await supabase
          .from('user_balance')
          .update({ balance: newBalance })
          .eq('id', existingBalance.id);
      }

      toast.success(`${type === 'deposit' ? 'Innskudd' : 'Uttak'} fullført`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Noe gikk galt");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'deposit' ? 'Innskudd' : 'Uttak'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Beløp (NOK)
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="method" className="text-sm font-medium">
              Velg {type === 'deposit' ? 'kilde' : 'metode'}
            </label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Velg metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bankkonto</SelectItem>
                <SelectItem value="vipps">Vipps</SelectItem>
                <SelectItem value="crypto">Krypto-lommebok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            OBS: Kommer snart – vi integrerer BankID/Vipps for reelle transaksjoner.
          </div>

          <Button type="submit" className="w-full">
            Bekreft {type === 'deposit' ? 'innskudd' : 'uttak'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};