import { useState } from "react";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type TaxDeduction = Database["public"]["Tables"]["tax_deductions"]["Row"];

interface DeductionsCardProps {
  propertyId: string;
}

export const DeductionsCard = ({ propertyId }: DeductionsCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newExpenseType, setNewExpenseType] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const currentYear = new Date().getFullYear();

  const { data: deductions = [] } = useQuery<TaxDeduction[]>({
    queryKey: ["tax-deductions", user?.id, currentYear],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tax_deductions")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", currentYear);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalDeductions = deductions.reduce(
    (sum, deduction) => sum + Number(deduction.amount),
    0
  );

  const handleAddDeduction = async () => {
    if (!user || !newExpenseType || !newAmount) {
      toast.error("Vennligst fyll ut alle felt");
      return;
    }

    try {
      const { error } = await supabase.from("tax_deductions").insert({
        user_id: user.id,
        property_id: propertyId,
        year: currentYear,
        expense_type: newExpenseType,
        amount: Number(newAmount),
      });

      if (error) throw error;

      toast.success("Fradrag lagt til");
      setNewExpenseType("");
      setNewAmount("");
      queryClient.invalidateQueries({ queryKey: ["tax-deductions"] });
    } catch (error) {
      console.error("Error adding deduction:", error);
      toast.error("Kunne ikke legge til fradrag");
    }
  };

  const handleDeleteDeduction = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tax_deductions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Fradrag slettet");
      queryClient.invalidateQueries({ queryKey: ["tax-deductions"] });
    } catch (error) {
      console.error("Error deleting deduction:", error);
      toast.error("Kunne ikke slette fradrag");
    }
  };

  return (
    <div className="bg-secondary/10 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <DollarSign className="h-5 w-5 text-primary mt-1" />
        <div>
          <p className="font-medium text-lg">Fradragsoversikt</p>
          <p className="text-sm text-gray-600">
            Registrer fradragsberettigede utgifter som vedlikehold,
            forsikring og andre relevante kostnader.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-4">
          {deductions.map((deduction) => (
            <div
              key={deduction.id}
              className="flex items-center justify-between bg-white p-2 rounded"
            >
              <span>{deduction.expense_type}</span>
              <div className="flex items-center gap-2">
                <span>{Number(deduction.amount).toLocaleString()} NOK</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDeduction(deduction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t">
            <div className="flex justify-between font-medium">
              <span>Totale fradrag</span>
              <span>{totalDeductions.toLocaleString()} NOK</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="expenseType">Type utgift</Label>
                <Input
                  id="expenseType"
                  value={newExpenseType}
                  onChange={(e) => setNewExpenseType(e.target.value)}
                  placeholder="F.eks. vedlikehold"
                />
              </div>
              <div>
                <Label htmlFor="amount">Beløp (NOK)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <Button
              onClick={handleAddDeduction}
              className="w-full"
              disabled={!newExpenseType || !newAmount}
            >
              <Plus className="h-4 w-4 mr-2" />
              Legg til fradrag
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};