import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Shield } from "lucide-react";

const LesMer = () => {
  return (
    <div className="container mx-auto px-4 py-12 bg-[#f8f9fa]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-xl shadow-sm p-6 mt-10 mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-primary">
          Les mer om Kvanta.ai – din trygge vei til eiendomsinvestering
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          En enkel plattform for brøkdelsinvestering – start med bare noen få klikk.
        </p>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="text-gray-700 text-center mb-8">
            Kjøp og selg brøkdeler av kvalitetsikrede eiendommer i Norden. 
            Du bestemmer selv beløp, og kan begynne lavt. 
            Daglige leieinntekter – alt i en brukervennlig digital lommebok.
          </p>

          {/* Benefits section with icons */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center">
              <Check className="w-8 h-8 text-primary mb-2" />
              <span className="font-semibold">Enkelt</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-8 h-8 text-primary mb-2" />
              <span className="font-semibold">Trygt</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <ArrowRight className="w-8 h-8 text-primary mb-2" />
              <span className="font-semibold">Lønnsomt</span>
            </div>
          </div>

          <div className="bg-nordic-softblue rounded-lg p-4 text-center mb-4">
            <p className="text-gray-700">
              All data lagres sikkert i Supabase, og KYC sikrer at alle investorer er verifiserte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="font-semibold mb-2 text-primary">1. Opprett bruker</div>
              <p className="text-sm text-gray-600">Registrer deg enkelt med e-post</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="font-semibold mb-2 text-primary">2. Fullfør KYC</div>
              <p className="text-sm text-gray-600">Verifiser identiteten din</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="font-semibold mb-2 text-primary">3. Kjøp tokens</div>
              <p className="text-sm text-gray-600">Velg eiendom og antall tokens</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="font-semibold mb-2 text-primary">4. Motta inntekter</div>
              <p className="text-sm text-gray-600">Claim daily yield fra dine investeringer</p>
            </div>
          </div>

          {/* Token trading section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-primary text-center">
              Kjøp og salg av tokens – like enkelt som netthandel!
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Ønsker du å realisere gevinst? Ingen problem! Vår interne markedsplass gjør det enkelt å selge dine tokens når du måtte ønske. Med bare noen få klikk kan du:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Klikke på "Selg tokens"</li>
                <li>Velge antall tokens du ønsker å selge</li>
                <li>Bekrefte salget</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Som en bedriftskontrollert løsning sikrer vi at alle transaksjoner er trygge og transparente, samtidig som du har full kontroll over dine investeringer.
              </p>
            </div>
          </div>

          {/* CTA section */}
          <div className="text-center mt-12 space-y-4">
            <Link 
              to="/register" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold"
            >
              Registrer deg nå
            </Link>
            <p className="text-gray-600">Start din eiendomsreise i dag!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LesMer;