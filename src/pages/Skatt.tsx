import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Receipt, Info, Percent, DollarSign } from "lucide-react";

const Skatt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const TAX_RATE = 0.22; // 22% skattesats

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: rentEarnings } = useQuery({
    queryKey: ['rentEarnings', user?.id, currentYear],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('rent_earnings')
        .select(`
          *,
          property:properties(name)
        `)
        .eq('user_id', user.id)
        .eq('year', currentYear);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalEarnedAmount = rentEarnings?.reduce((sum, earning) => 
    sum + Number(earning.earned_amount), 0) || 0;
  
  const estimatedTax = totalEarnedAmount * TAX_RATE;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Skatt på Tokenisert Eiendom (Norsk Regelverk)
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Denne informasjonen er kun veiledende, og erstatter ikke profesjonell skatterådgivning. 
              Du er selv ansvarlig for korrekt rapportering til Skatteetaten.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hvordan beskattes leieinntekter?
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  I Norge beskattes utleieinntekter som alminnelig inntekt (pt. 22%) i det år 
                  de er "opptjent" (periodisering).
                </li>
                <li>
                  Det vil si at selv om du ikke "claimer" (tar ut) leien, regnes den som 
                  skattepliktig inntekt når den er opptjent eller tilgjengelig for deg.
                </li>
                <li>
                  Du må rapportere brutto leie, evt. fradrag for kostnader, i skattemeldingen.
                </li>
              </ul>
              
              <p className="mt-6 text-sm text-gray-600 italic">
                Exakt rapportering kan variere. Sjekk Skatteetatens retningslinjer eller 
                kontakt en skatterådgiver.
              </p>
            </div>

            <div className="mt-12">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Receipt className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    Din Skatteoversikt {currentYear}
                  </h2>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-lg">
                        Din skattepliktige leie: {totalEarnedAmount.toLocaleString()} NOK (foreløpig)
                      </p>
                      <p className="text-sm text-gray-600">
                        Dette beløpet er basert på opptjent leie, uavhengig av om du har tatt ut pengene.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <Percent className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-lg">
                        Beregnet Skatt (veiledende): {estimatedTax.toLocaleString()} NOK
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

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Eiendom</TableHead>
                      <TableHead className="text-right">Årets opptjente leie</TableHead>
                      <TableHead className="text-right">Uttatt leie</TableHead>
                      <TableHead className="text-right">Ikke uttatt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rentEarnings && rentEarnings.length > 0 ? (
                      rentEarnings.map((earning) => (
                        <TableRow key={earning.id}>
                          <TableCell>{earning.property.name}</TableCell>
                          <TableCell className="text-right">
                            {Number(earning.earned_amount).toLocaleString()} NOK
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(earning.withdrawn_amount).toLocaleString()} NOK
                          </TableCell>
                          <TableCell className="text-right">
                            {(Number(earning.earned_amount) - Number(earning.withdrawn_amount)).toLocaleString()} NOK
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          Ingen leieinntekter registrert for {currentYear}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Skatt;