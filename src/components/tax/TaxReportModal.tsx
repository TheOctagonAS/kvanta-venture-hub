import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Table } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TaxReportModalProps {
  rentEarnings: any[];
  deductions: any[];
  estimatedTax: number;
}

export const TaxReportModal = ({
  rentEarnings,
  deductions,
  estimatedTax,
}: TaxReportModalProps) => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text(`Kvanta Skatterapport ${currentYear}`, 20, 20);
      
      // Rent earnings section
      doc.setFontSize(14);
      doc.text("Leieinntekter", 20, 40);
      
      const rentData = rentEarnings.map((earning) => [
        earning.property.name,
        `${Number(earning.earned_amount).toLocaleString()} NOK`,
      ]);
      
      autoTable(doc, {
        startY: 45,
        head: [["Eiendom", "Opptjent leie"]],
        body: rentData,
      });
      
      // Deductions section
      const currentY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("Fradrag", 20, currentY);
      
      const deductionData = deductions.map((deduction) => [
        deduction.expense_type,
        `${Number(deduction.amount).toLocaleString()} NOK`,
      ]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [["Type", "Beløp"]],
        body: deductionData,
      });
      
      // Estimated tax section
      const taxY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("Estimert skatt", 20, taxY);
      doc.setFontSize(12);
      doc.text(`${estimatedTax.toLocaleString()} NOK`, 20, taxY + 10);
      
      // Disclaimer
      doc.setFontSize(10);
      doc.text(
        "Merk: Dette er kun en veiledende oversikt. Faktisk skatt kan variere.",
        20,
        taxY + 30
      );
      
      // Save PDF
      doc.save(`kvanta_skatterapport_${currentYear}.pdf`);
      toast.success("PDF lastet ned");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Kunne ikke generere PDF");
    }
  };

  const generateCSV = async () => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center gap-2">
          <FileDown className="h-4 w-4" />
          Last ned skatterapport
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Velg rapportformat</DialogTitle>
          <DialogDescription>
            Last ned skattedata i ønsket format
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={generatePDF}
            className="flex items-center justify-center gap-2"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            PDF Format
          </Button>
          <Button
            onClick={generateCSV}
            className="flex items-center justify-center gap-2"
            variant="outline"
          >
            <Table className="h-4 w-4" />
            CSV Format
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};