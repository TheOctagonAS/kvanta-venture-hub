import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Skatt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Skatt på Tokenisert Eiendom (Norsk Regelverk)
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Denne informasjonen er kun veiledende, og erstatter ikke profesjonell skatterådgivning. 
              Du er selv ansvarlig for korrekt rapportering til Skatteetaten.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hvordan beskattes leieinntekter?
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  I Norge beskattes utleieinntekter som alminnelig inntekt (pt. 22%) i det år 
                  de er "opptjent" (periodisering).
                </li>
                <li>
                  Det vil si at selv om du ikke "claimer" (tar ut) leien, regnes den som 
                  skattepliktig inntekt når den er opptjent eller tilgjengelig for deg.
                </li>
                <li>
                  Du må rapportere brutto leie, evt. fradrag for kostnader, i skattemeldingen.
                </li>
              </ul>
              
              <p className="mt-6 text-sm text-gray-600 italic">
                Exakt rapportering kan variere. Sjekk Skatteetatens retningslinjer eller 
                kontakt en skatterådgiver.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Skatt;