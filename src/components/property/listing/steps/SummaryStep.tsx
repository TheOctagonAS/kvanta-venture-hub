import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { defiService } from "@/services/defiService";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface SummaryStepProps {
  formData: any;
  propertyId: string;
}

const SummaryStep = ({ formData, propertyId }: SummaryStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // First, update property status to PENDING_REVIEW
      const { error: updateError } = await supabase
        .from('properties')
        .update({ 
          status: 'PENDING_REVIEW',
          name: formData.basicInfo.name,
          location: formData.basicInfo.location,
          image_url: formData.basicInfo.imageUrl,
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Deploy token and update property with token details
      const deploymentResult = await defiService.deployToken(propertyId);
      setTokenAddress(deploymentResult.tokenAddress);

      // Get owner's wallets to whitelist
      const { data: wallets, error: walletsError } = await supabase
        .from('wallets')
        .select('address')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (walletsError) throw walletsError;

      // Whitelist owner's wallets
      for (const wallet of wallets || []) {
        if (wallet.address) {
          await defiService.whitelistInvestor(propertyId, wallet.address);
        }
      }

      // Set property as active after successful token deployment and whitelisting
      const { error: activateError } = await supabase
        .from('properties')
        .update({ status: 'ACTIVE' })
        .eq('id', propertyId);

      if (activateError) throw activateError;

      setIsSubmitted(true);
      toast.success("Eiendommen er opprettet og tokens er generert");
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error("Kunne ikke opprette eiendommen");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360, 360] 
              }}
              transition={{ duration: 1 }}
              className="bg-green-100 p-4 rounded-full"
            >
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900">
            Eiendom opprettet!
          </h3>
          
          {tokenAddress && (
            <p className="text-gray-600">
              Dine tokens ligger på kontrakt: {tokenAddress}. 
              Inntil 150 investorer kan whitelistes.
            </p>
          )}

          <Alert className="mt-6 bg-blue-50">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Viktig informasjon om tokens</AlertTitle>
            <AlertDescription className="text-sm text-gray-600">
              Token utstedes på en EVM-kjede. Om/når du flytter token ut, husk at du 
              <em className="font-semibold"> kan </em> 
              handle på en Dex, men du tar ansvar for lovlighet.
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => navigate('/minside')}
            className="w-full max-w-sm mx-auto"
          >
            Gå til dashboard
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Gjennomgå informasjonen under før du sender inn eiendommen for vurdering.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Eiendomsdetaljer</h3>
        <p><strong>Navn:</strong> {formData.basicInfo.name}</p>
        <p><strong>Sted:</strong> {formData.basicInfo.location}</p>
        <p><strong>Ønsket tokenisering:</strong> {formData.basicInfo.desiredTokenization}%</p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            Sender inn...
          </span>
        ) : (
          "Send inn for vurdering"
        )}
      </Button>
    </div>
  );
};

export default SummaryStep;