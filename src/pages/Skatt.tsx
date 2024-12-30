import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Skatt = () => {
  const { user } = useAuth();

  const { data: holdings } = useQuery({
    queryKey: ["user-holdings-tax", user?.id],
    queryFn: async () => {
      const { data: holdings, error } = await supabase
        .from("user_holdings")
        .select(`
          accumulated_rent,
          property:properties(
            name,
            location
          )
        `)
        .eq("user_id", user?.id);

      if (error) throw error;
      return holdings;
    },
    enabled: !!user,
  });

  const currentYearIncome = holdings?.reduce(
    (sum, holding) => sum + Number(holding.accumulated_rent),
    0
  ) || 0;

  // For demo purposes, showing previous year as 80% of current
  const previousYearIncome = currentYearIncome * 0.8;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Skattesammendrag - Leieinntekter", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generert: ${new Date().toLocaleDateString("nb-NO")}`, 20, 30);
    doc.text(`Skatteyter: ${user?.email}`, 20, 40);
    
    const tableData = [
      ["Årets leieinntekter", `${currentYearIncome.toFixed(2)} NOK`],
      ["Fjorårets leieinntekter", `${previousYearIncome.toFixed(2)} NOK`],
    ];

    (doc as any).autoTable({
      startY: 50,
      head: [["Beskrivelse", "Beløp"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [52, 95, 246] },
    });
    
    doc.text(
      "Merk: Dette er en oversikt over leieinntekter som skal rapporteres til Skatteetaten.",
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Skatteoversikt
            </h1>
            <p className="text-gray-600 mb-6">
              Oversikt over leieinntekter (NOK) - du er ansvarlig for å rapportere til Skatteetaten.
            </p>
            
            <div className="grid gap-6 mb-6">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-2">Årets inntekt</h3>
                <p className="text-2xl font-bold text-primary">
                  {currentYearIncome.toFixed(2)} NOK
                </p>
              </div>
              
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-2">Fjorårets inntekt</h3>
                <p className="text-2xl font-bold text-primary">
                  {previousYearIncome.toFixed(2)} NOK
                </p>
              </div>
            </div>

            <Button
              onClick={handleExportPDF}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Eksporter PDF
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Skatt;