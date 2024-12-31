import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import BasicInfoStep from "./steps/BasicInfoStep";
import DocumentUploadStep from "./steps/DocumentUploadStep";
import DueDiligenceStep from "./steps/DueDiligenceStep";
import SummaryStep from "./steps/SummaryStep";
import WizardProgress from "./WizardProgress";

type WizardStep = {
  title: string;
  description: string;
};

const STEPS: WizardStep[] = [
  {
    title: "Eiendomsinformasjon",
    description: "Fyll inn grunnleggende informasjon om eiendommen",
  },
  {
    title: "Dokumenter",
    description: "Last opp nødvendige dokumenter",
  },
  {
    title: "Due Diligence",
    description: "Besvar spørsmål om eiendommen",
  },
  {
    title: "Oppsummering",
    description: "Gjennomgå og publiser",
  },
];

const PropertyListingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      location: "",
      pricePerToken: "",
      maxTokens: "",
      yield: "",
      imageUrl: "",
    },
    documents: {
      deed: null,
      valuation: null,
      insurance: null,
    },
    dueDiligence: {
      hasCurrentTenant: false,
      livingArea: "",
      monthlyRent: "",
      constructionYear: "",
      lastRenovation: "",
    },
  });

  const updateFormData = (step: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            onUpdate={(data) => updateFormData("basicInfo", data)}
          />
        );
      case 1:
        return (
          <DocumentUploadStep
            data={formData.documents}
            onUpdate={(data) => updateFormData("documents", data)}
          />
        );
      case 2:
        return (
          <DueDiligenceStep
            data={formData.dueDiligence}
            onUpdate={(data) => updateFormData("dueDiligence", data)}
          />
        );
      case 3:
        return <SummaryStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto p-6">
        <WizardProgress steps={STEPS} currentStep={currentStep} />
        
        <div className="mt-8">{renderStep()}</div>

        <div className="mt-6 flex justify-between">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Tilbake
            </Button>
          )}
          
          <div className="ml-auto">
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? (
                "Publiser"
              ) : (
                <>
                  Neste
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PropertyListingWizard;