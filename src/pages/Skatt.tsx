import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, FileDown, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface RentEarning {
  earned_amount: number;
  property: {
    name: string;
  };
}

const Skatt = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const { data: rentEarnings } = useQuery<RentEarning[]>({
    queryKey: ['rent-earnings', user?.id, currentYear],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('rent_earnings')
        .select(`
          earned_amount,
          property:properties(name)
        `)
        .eq('user_id', user.id)
        .eq('year', currentYear);

      if (error) throw error;
      return (data || []) as RentEarning[];
    },
    enabled: !!user,
  });

  const totalEarnings = (rentEarnings || []).reduce((sum, earning) => 
    sum + Number(earning.earned_amount), 0);

  const estimatedTax = totalEarnings * 0.22;

  const handleExportCSV = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-tax-report', {
        body: { user_id: user?.id, year: currentYear }
      });

      if (error) throw error;

      // Create blob from the CSV data
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kvanta_skatteoversikt_${currentYear}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('CSV-fil lastet ned');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Kunne ikke laste ned CSV-fil');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Skatteoversikt
            </h1>
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Dette er kun en veiledende oversikt. For nøyaktig skatteberegning, 
                kontakt en autorisert regnskapsfører eller skatterådgiver.
              </AlertDescription>
            </Alert>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Leieinntekter {currentYear}
                </h2>
                
                {rentEarnings && rentEarnings.length > 0 ? (
                  <div className="space-y-4">
                    {rentEarnings.map((earning, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <span>{earning.property.name}</span>
                        <span className="font-medium">
                          {Number(earning.earned_amount).toLocaleString()} NOK
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-2 font-semibold">
                      <span>Total leieinntekt</span>
                      <span>{totalEarnings.toLocaleString()} NOK</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Ingen leieinntekter registrert for {currentYear}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-lg">Estimert skatt (22%)</p>
                      <p className="font-semibold text-2xl text-primary">
                        {estimatedTax.toLocaleString()} NOK
                      </p>
                      <p className="text-sm text-gray-600">
                        Dette er et omtrentlig beløp. Faktisk skatt kan variere pga fradrag m.m.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-lg">Fradragsoversikt</p>
                      <p className="text-sm text-gray-600">
                        Her vil du kunne registrere fradragsberettigede utgifter som vedlikehold, 
                        forsikring og andre relevante kostnader. (Kommer snart)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Skatt;