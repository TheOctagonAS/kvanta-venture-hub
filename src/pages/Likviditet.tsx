import { Button } from "@/components/ui/button";
import { Building, ArrowRight } from "lucide-react";

const Likviditet = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Belåne din Eiendom – få umiddelbar likviditet
            </h1>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            Har du en bolig, næringsbygg eller fritidsbolig? Selg en andel (f.eks. 10%) 
            til investorer for rask kapital, mot en månedlig nedbetaling + rente.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <Button 
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => console.log("Start prosessen clicked")}
            >
              Start prosessen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Likviditet;