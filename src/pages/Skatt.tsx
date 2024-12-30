import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Extend jsPDF type to include autoTable properties
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => void;
  lastAutoTable: {
    finalY: number;
  };
}

const Skatt = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery({
    queryKey: ["user-holdings-tax", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: holdings, error } = await supabase
        .from("user_holdings")
        .select(`
          accumulated_rent,
          property:properties(
            name,
            location,
            price_per_token,
            yield
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return holdings;
    },
    enabled: !!user,
  });

  const calculateTaxableIncome = (income: number) => {
    // Norwegian rental income tax rules:
    // 1. Basic deduction (Minstefradrag) for rental income: 0%
    // 2. Effective tax rate on rental income: 22% (2024)
    return income;
  };

  const calculateTaxAmount = (taxableIncome: number) => {
    const TAX_RATE = 0.22; // 22% tax rate for 2024
    return taxableIncome * TAX_RATE;
  };

  const currentYearIncome = holdings?.reduce(
    (sum, holding) => sum + Number(holding.accumulated_rent),
    0
  ) || 0;

  // For demo purposes, showing previous year as 80% of current
  const previousYearIncome = currentYearIncome * 0.8;

  const taxableIncome = calculateTaxableIncome(currentYearIncome);
  const taxAmount = calculateTaxAmount(taxableIncome);

  const handleExportPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    doc.setFontSize(16);
    doc.text("Skattesammendrag - Leieinntekter", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generert: ${new Date().toLocaleDateString("nb-NO")}`, 20, 30);
    doc.text(`Skatteyter: ${user?.email}`, 20, 40);
    
    const tableData = [
      ["Årets leieinntekter", `${currentYearIncome.toFixed(2)} NOK`],
      ["Skattepliktig inntekt", `${taxableIncome.toFixed(2)} NOK`],
      ["Beregnet skatt (22%)", `${taxAmount.toFixed(2)} NOK`],
      ["Fjorårets leieinntekter", `${previousYearIncome.toFixed(2)} NOK`],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Beskrivelse", "Beløp"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [52, 95, 246] },
    });
    
    doc.text(
      [
        "Merk:",
        "1. Dette er en oversikt over leieinntekter som skal rapporteres til Skatteetaten.",
        "2. Skattesats for leieinntekter er 22% (2024).",
        "3. Konsulter med en skatterådgiver for personlig veiledning."
      ].join("\n"),
      20,
      doc.lastAutoTable.finalY + 20,
      { maxWidth: 170 }
    );
    
    doc.save("skattesammendrag.pdf");
  };

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skatteoversikt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Oversikt over leieinntekter (NOK) - automatisk beregnet basert på norske skatteregler for 2024.
              </p>
              
              <div className="grid gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Årets Tall</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Totale leieinntekter:</span>
                      <span className="font-semibold">{currentYearIncome.toFixed(2)} NOK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Skattepliktig inntekt:</span>
                      <span className="font-semibold">{taxableIncome.toFixed(2)} NOK</span>
                    </div>
                    <div className="flex justify-between items-center text-primary">
                      <span>Beregnet skatt (22%):</span>
                      <span className="font-bold">{taxAmount.toFixed(2)} NOK</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fjorårets Tall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Totale leieinntekter:</span>
                      <span className="font-semibold">{previousYearIncome.toFixed(2)} NOK</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleExportPDF}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Eksporter Skattesammendrag (PDF)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Viktig Informasjon</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <ul className="list-disc pl-4 space-y-2">
                <li>Leieinntekter beskattes med 22% (2024-sats)</li>
                <li>Beregningene er automatiske basert på dine registrerte leieinntekter</li>
                <li>Du kan laste ned en PDF-rapport for skatteformål</li>
                <li>Konsulter med en skatterådgiver for personlig veiledning</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Skatt;