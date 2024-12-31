import { ListOrdered, FileUpload, MessageSquare, CheckCircle, Globe, Users, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const TokenizationGuide = () => {
  const steps = [
    {
      icon: ListOrdered,
      title: "Fyll inn eiendomsinfo",
      description: "Start med å legge inn grunnleggende informasjon om eiendommen din."
    },
    {
      icon: FileUpload,
      title: "Last opp dokumenter",
      description: "Last opp nødvendige dokumenter som skjøte, verdivurdering og forsikringspapirer."
    },
    {
      icon: MessageSquare,
      title: "Svar på nøkkelspørsmål",
      description: "Besvar viktige spørsmål om eiendommen for due diligence."
    },
    {
      icon: CheckCircle,
      title: "Vent på godkjenning",
      description: "Vi gjennomgår dokumentene og informasjonen for kvalitetssikring."
    },
    {
      icon: Globe,
      title: "Din eiendom vises i Marketplace",
      description: "Etter godkjenning blir eiendommen synlig for potensielle investorer."
    },
    {
      icon: Users,
      title: "Investorer kan se dine filer og svar, og kjøpe tokens",
      description: "Investorer kan nå gjennomgå informasjonen og investere i eiendommen."
    }
  ];

  return (
    <Card className="p-6 bg-white">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Hvordan tokenisere eiendom?</h2>
          <p className="mt-2 text-gray-600">
            Følg disse enkle stegene for å tokenisere eiendommen din på plattformen vår.
          </p>
        </div>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TokenizationGuide;