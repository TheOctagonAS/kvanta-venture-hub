import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, FileDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { TaxableRentCard } from "@/components/tax/TaxableRentCard";
import { EstimatedTaxCard } from "@/components/tax/EstimatedTaxCard";
import { DeductionsCard } from "@/components/tax/DeductionsCard";
import { Database } from "@/integrations/supabase/types";

type RentEarning = Database["public"]["Tables"]["rent_earnings"]["Row"] & {
  property: Pick<Database["public"]["Tables"]["properties"]["Row"], "name" | "id">;
};

type TaxDeduction = Database["public"]["Tables"]["tax_deductions"]["Row"];

const Skatt = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const { data: rentEarnings } = useQuery<RentEarning[]>({
    queryKey: ["rent-earnings", user?.id, currentYear],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("rent_earnings")
        .select(`
          earned_amount,
          property:properties(name, id)
        `)
        .eq("user_id", user.id)
        .eq("year", currentYear);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: deductions } = useQuery<TaxDeduction[]>({
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

  const totalEarnings = (rentEarnings || []).reduce(
    (sum, earning) => sum + Number(earning.earned_amount),
    0
  );

  const totalDeductions = (deductions || []).reduce(
    (sum, deduction) => sum + Number(deduction.amount),
    0
  );

  const handleExportCSV = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-tax-report",
        {
          body: { user_id: user?.id, year: currentYear },
        }
      );

      if (error) throw error;

      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kvanta_skatteoversikt_${currentYear}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("CSV-fil lastet ned");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Kunne ikke laste ned CSV-fil");
    }
  };

  if (!user) return null;

  const firstProperty = rentEarnings?.[0]?.property;

  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Skatteoversikt
            </h1>

            <div className="bg-blue-100 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Skattesesong {currentYear}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Nåværende status</span>
                  <span>
                    {totalEarnings.toLocaleString()} NOK inntekt registrert
                  </span>
                </div>
                <Progress value={25} className="h-2" />
                <p className="text-sm text-gray-500">
                  Ferdig utfylt: 25% (Kommer snart: Registrering av fradrag)
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Vi hjelper deg å samle nøkkeltall, men du er selv ansvarlig for
              skattemeldingen.
            </p>

            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Dette er kun en veiledende oversikt. For nøyaktig skatteberegning,
                kontakt en autorisert regnskapsfører eller skatterådgiver.
              </AlertDescription>
            </Alert>
          </div>

          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <TaxableRentCard rentEarnings={rentEarnings || []} />
                <EstimatedTaxCard
                  totalEarnings={totalEarnings}
                  totalDeductions={totalDeductions}
                />
              </div>

              <div>
                <DeductionsCard propertyId={firstProperty?.id || ""} />
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <Button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Last ned skattedata (CSV)
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Last ned en CSV-fil med detaljert oversikt over leieinntekter
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Skatt;