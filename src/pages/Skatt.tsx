import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TaxableRentCard } from "@/components/tax/TaxableRentCard";
import { EstimatedTaxCard } from "@/components/tax/EstimatedTaxCard";
import { DeductionsCard } from "@/components/tax/DeductionsCard";
import { TaxReportModal } from "@/components/tax/TaxReportModal";
import { RentEarningsChart } from "@/components/tax/RentEarningsChart";
import { Database } from "@/integrations/supabase/types";

type RentEarning = Database["public"]["Tables"]["rent_earnings"]["Row"] & {
  property: Pick<Database["public"]["Tables"]["properties"]["Row"], "name" | "id">;
};

type TaxDeduction = Database["public"]["Tables"]["tax_deductions"]["Row"];

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Des"
];

const Skatt = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const { data: rentEarnings = [] } = useQuery<RentEarning[]>({
    queryKey: ["rent-earnings", user?.id, currentYear],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("rent_earnings")
        .select(`
          *,
          property:properties(name, id)
        `)
        .eq("user_id", user.id)
        .eq("year", currentYear);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

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

  const monthlyData = monthNames.map((month, index) => ({
    month,
    earned_amount: rentEarnings.reduce((sum, earning) => sum + Number(earning.earned_amount) / 12, 0),
    withdrawn_amount: rentEarnings.reduce((sum, earning) => sum + Number(earning.withdrawn_amount) / 12, 0),
  }));

  const totalEarnings = rentEarnings.reduce(
    (sum, earning) => sum + Number(earning.earned_amount),
    0
  );

  const totalDeductions = deductions.reduce(
    (sum, deduction) => sum + Number(deduction.amount),
    0
  );

  const taxableIncome = Math.max(0, totalEarnings - totalDeductions);
  const estimatedTax = taxableIncome * 0.22;

  if (!user) return null;

  const firstProperty = rentEarnings[0]?.property;

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

            <RentEarningsChart rentEarnings={monthlyData} />

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
                <TaxableRentCard rentEarnings={rentEarnings} />
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
              <TaxReportModal
                rentEarnings={rentEarnings}
                deductions={deductions}
                estimatedTax={estimatedTax}
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Last ned en detaljert oversikt over leieinntekter og fradrag
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Skatt;