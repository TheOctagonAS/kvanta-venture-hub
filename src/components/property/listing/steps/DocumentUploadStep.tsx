import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploadStepProps {
  data: {
    deed: File | null;
    valuation: File | null;
    insurance: File | null;
  };
  onUpdate: (data: any) => void;
  propertyId?: string;
}

const REQUIRED_DOCUMENTS = [
  {
    id: "deed",
    name: "Tinglyst skjøte",
    description: "Last opp dokumentasjon på eierskap",
  },
  {
    id: "valuation",
    name: "Verdivurdering / takstrapport",
    description: "Oppdatert verdivurdering av eiendommen",
  },
  {
    id: "insurance",
    name: "Forsikringsdokument",
    description: "Gyldig forsikringsbevis",
  },
];

const DocumentUploadStep = ({ data, onUpdate }: DocumentUploadStepProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleFileChange = async (documentId: string, file: File | null) => {
    if (!file) {
      onUpdate({ [documentId]: null });
      return;
    }

    setUploading(prev => ({ ...prev, [documentId]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-documents')
        .getPublicUrl(filePath);

      onUpdate({ 
        [documentId]: {
          name: file.name,
          url: publicUrl,
          type: documentId
        }
      });

      toast({
        title: "Dokument lastet opp",
        description: `${file.name} ble lastet opp`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Feil ved opplasting",
        description: "Kunne ikke laste opp dokumentet. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [documentId]: false }));
    }
  };

  const renderUploadZone = (documentId: string, name: string, description: string) => {
    const file = data[documentId as keyof typeof data];
    const isUploading = uploading[documentId];

    return (
      <div
        key={documentId}
        className="relative"
        onMouseEnter={() => setHoveredId(documentId)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div
          className={`
            p-6 border-2 border-dashed rounded-lg transition-colors
            ${file ? "border-green-500 bg-green-50" : "border-gray-300"}
            ${hoveredId === documentId ? "border-blue-500" : ""}
            ${isUploading ? "opacity-50" : ""}
          `}
        >
          <div className="flex items-start gap-4">
            {file ? (
              <File className="w-8 h-8 text-green-500" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{name}</h4>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
              
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  {file.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="file"
                id={documentId}
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileChange(documentId, file);
                }}
                disabled={isUploading}
              />
              
              {file ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleFileChange(documentId, null)}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Label
                  htmlFor={documentId}
                  className={`cursor-pointer text-sm text-blue-600 hover:text-blue-800 ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? "Laster opp..." : "Last opp fil"}
                </Label>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Last opp dokumenter
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Vi trenger følgende dokumenter for å verifisere eiendommen
        </p>
      </div>

      {REQUIRED_DOCUMENTS.map((doc) =>
        renderUploadZone(doc.id, doc.name, doc.description)
      )}
    </div>
  );
};

export default DocumentUploadStep;