import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SummaryStepProps {
  formData: any; // Update with proper typing
}

const SummaryStep = ({ formData }: SummaryStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'PENDING_REVIEW' })
        .eq('id', formData.propertyId);

      if (error) throw error;

      toast.success(
        "Property submitted for review. You will be notified once it's approved."
      );
      navigate('/minside');
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error("Failed to submit property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Your property listing will be reviewed by our team before it becomes visible to investors.
          Please ensure all information and documents are accurate and complete.
        </p>
      </div>

      {/* Display summary of the property details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Property Details</h3>
        <p><strong>Name:</strong> {formData.basicInfo.name}</p>
        <p><strong>Location:</strong> {formData.basicInfo.location}</p>
        <p><strong>Price per Token:</strong> {formData.basicInfo.pricePerToken}</p>
        <p><strong>Max Tokens:</strong> {formData.basicInfo.maxTokens}</p>
        <p><strong>Yield:</strong> {formData.basicInfo.yield}</p>
        <p><strong>Image URL:</strong> {formData.basicInfo.imageUrl}</p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit for Review"}
      </Button>
    </div>
  );
};

export default SummaryStep;
