import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

const OwnerInfoBox = () => {
  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-3">
            Hvordan funker det for deg som eier?
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <span>Fullfør KYC-verifisering for å komme i gang.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>List eiendommen din ved å fylle ut nødvendig informasjon.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>Investorer kan nå kjøpe tokens i eiendommen din på markedsplassen.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <span>Følg med på salget i "Mine Eiendommer" og ta ut midler når du ønsker.</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default OwnerInfoBox;