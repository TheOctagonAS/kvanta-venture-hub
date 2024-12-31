import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface SummaryStepProps {
  formData: {
    basicInfo: {
      name: string;
      location: string;
      pricePerToken: string;
      maxTokens: string;
      yield: string;
    };
    documents: {
      deed: File | null;
      valuation: File | null;
      insurance: File | null;
    };
    dueDiligence: {
      hasCurrentTenant: boolean;
      livingArea: string;
      monthlyRent: string;
      constructionYear: string;
      lastRenovation: string;
    };
  };
}

const SummaryStep = ({ formData }: SummaryStepProps) => {
  const { basicInfo, documents, dueDiligence } = formData;

  const formatCurrency = (value: string) => {
    return Number(value).toLocaleString("nb-NO", {
      style: "currency",
      currency: "NOK",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900">
          Oppsummering
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Gjennomgå informasjonen før du publiserer
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Eiendomsinformasjon</h4>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Navn</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {basicInfo.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Beliggenhet</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {basicInfo.location}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Pris per token</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {formatCurrency(basicInfo.pricePerToken)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Antall tokens</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {basicInfo.maxTokens}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Forventet avkastning</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {basicInfo.yield}%
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Opplastede dokumenter</h4>
          <ul className="space-y-3">
            {Object.entries(documents).map(([key, file]) => (
              <li key={key} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  {file?.name || "Ingen fil lastet opp"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-4">Due Diligence</h4>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Boligareal</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {dueDiligence.livingArea} kvm
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Byggeår</dt>
              <dd className="text-sm font-medium text-gray-900 mt-1">
                {dueDiligence.constructionYear}
              </dd>
            </div>
            {dueDiligence.hasCurrentTenant && (
              <div>
                <dt className="text-sm text-gray-500">Månedlig leieinntekt</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">
                  {formatCurrency(dueDiligence.monthlyRent)}
                </dd>
              </div>
            )}
            {dueDiligence.lastRenovation && (
              <div>
                <dt className="text-sm text-gray-500">Siste renovering</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">
                  {dueDiligence.lastRenovation}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </Card>
    </div>
  );
};

export default SummaryStep;