import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentsAndDDProps {
  propertyId: string;
  status?: string;
}

export const DocumentsAndDD = ({ propertyId, status }: DocumentsAndDDProps) => {
  const { user } = useAuth();
  const isVisible = status === 'ACTIVE' || status === 'APPROVED';

  const { data: documents } = useQuery({
    queryKey: ['property-documents', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_documents')
        .select('*')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!propertyId && (!!user || isVisible),
  });

  const { data: ddAnswers } = useQuery({
    queryKey: ['property-dd-answers', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_dd_answers')
        .select('*')
        .eq('property_id', propertyId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!propertyId && (!!user || isVisible),
  });

  if (!isVisible && !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dokumenter og Due Diligence</h2>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Dokumenter</h3>
            {documents && documents.length > 0 ? (
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center space-x-2"
                    >
                      <span>{doc.doc_type}</span>
                      <Download className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Ingen dokumenter tilgjengelig</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Due Diligence</h3>
            {ddAnswers && ddAnswers.length > 0 ? (
              <dl className="space-y-4">
                {ddAnswers.map((qa) => (
                  <div key={qa.id}>
                    <dt className="font-medium text-gray-700">{qa.question}</dt>
                    <dd className="mt-1 text-gray-600">{qa.answer}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-gray-500">Ingen DD-informasjon tilgjengelig</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-500 italic">
              Dette er informasjon fra eieren. Kvanta.ai er ikke ansvarlig for riktigheten, gjør egen DD.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};