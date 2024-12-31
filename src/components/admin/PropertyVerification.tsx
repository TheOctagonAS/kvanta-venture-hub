import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PropertyVerificationProps {
  property: any; // TODO: Add proper typing
}

export const PropertyVerification = ({ property }: PropertyVerificationProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'APPROVED' })
        .eq('id', property.id);

      if (error) throw error;
      
      toast.success("Property approved successfully");
      queryClient.invalidateQueries({ queryKey: ['pending-properties'] });
    } catch (error) {
      console.error('Error approving property:', error);
      toast.error("Failed to approve property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: 'REJECTED',
          rejection_reason: rejectionReason
        })
        .eq('id', property.id);

      if (error) throw error;
      
      toast.success("Property rejected");
      queryClient.invalidateQueries({ queryKey: ['pending-properties'] });
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast.error("Failed to reject property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">{property.name}</h3>
      <p className="text-gray-600 mb-4">{property.location}</p>

      <Accordion type="single" collapsible>
        <AccordionItem value="documents">
          <AccordionTrigger>Documents</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {property.property_documents?.map((doc: any) => (
                <li key={doc.id} className="flex items-center space-x-2">
                  <span>{doc.doc_type}</span>
                  <a 
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dd">
          <AccordionTrigger>Due Diligence</AccordionTrigger>
          <AccordionContent>
            <dl className="space-y-4">
              {property.property_dd_answers?.map((qa: any) => (
                <div key={qa.id}>
                  <dt className="font-medium">{qa.question}</dt>
                  <dd className="mt-1 text-gray-600">{qa.answer}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-4">
        <Textarea
          placeholder="Reason for rejection (required if rejecting)"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="mb-4"
        />

        <div className="flex space-x-4">
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            onClick={handleReject}
            disabled={isSubmitting}
            variant="destructive"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};