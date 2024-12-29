import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Shield, Coins, UserPlus, ShieldCheck, Banknote } from "lucide-react";

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="flex flex-col items-center">
                <Rocket className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Enkelt</h3>
                <p className="text-sm text-gray-600">
                  Start din eiendomsreise med få klikk. Ingen kompliserte prosesser.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Trygt</h3>
                <p className="text-sm text-gray-600">
                  Kvalitetssikrede eiendommer og sikker plattform for dine investeringer.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="flex flex-col items-center">
                <Coins className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lønnsomt</h3>
                <p className="text-sm text-gray-600">
                  Daglige leieinntekter og potensial for verdistigning over tid.
                </p>
              </div>
            </div>
          </div>

        {/* How it works section */}
          <div className="mt-16 mb-12">
            <h3 className="text-2xl font-semibold text-center mb-3">Hvordan det virker</h3>
            <p className="text-gray-600 text-center mb-8">
              Få avkastning på eiendom i fire enkle trinn.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="flex flex-col items-center">
                  <UserPlus className="w-8 h-8 text-primary mb-2" />
                  <div className="font-semibold mb-1">1. Opprett bruker</div>
                  <p className="text-sm text-gray-600">Registrer deg enkelt med e-post</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                  <div className="font-semibold mb-1">2. Fullfør KYC</div>
                  <p className="text-sm text-gray-600">Sikre trygg investering</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="flex flex-col items-center">
                  <Coins className="w-8 h-8 text-primary mb-2" />
                  <div className="font-semibold mb-1">3. Kjøp tokens</div>
                  <p className="text-sm text-gray-600">Velg eiendom, antall tokens</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="flex flex-col items-center">
                  <Banknote className="w-8 h-8 text-primary mb-2" />
                  <div className="font-semibold mb-1">4. Motta inntekter</div>
                  <p className="text-sm text-gray-600">Daglige leieutbetalinger</p>
                </div>
              </div>
            </div>

        {/* New Token Trading Box */}
            <div className="bg-white p-4 shadow-sm rounded mt-6">
              <h3 className="text-xl font-semibold mb-4 text-primary text-center">
                Kjøp og salg av tokens – raskt og fleksibelt
              </h3>
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Klikk "Kjøp tokens" eller "Selg tokens"</li>
                  <li>Velg antall tokens</li>
                  <li>Bekreft handle</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Gevinst kan realiseres når du vil, alt via intern markedsplass.
                </p>
              </div>
            </div>

        {/* Security & Technology Banner */}
        <div className="bg-[#E9F2FF] rounded-lg px-4 py-3 text-[#345FF6] mb-8">
          <h3 className="font-semibold mb-2">Sikkerhet & Teknologi</h3>
          <p className="leading-relaxed">
            Data lagres i Supabase, mens transaksjoner og eierskap sikres gjennom blockchain og smarte kontrakter. 
            KYC sikrer verifiserte investorer, og alle prosesser – fra kjøp til utbetaling av leieinntekter – 
            skjer automatisk via smarte kontrakter. Du har full oversikt i lommeboken.
          </p>
        </div>

        {/* CTA section */}
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center mt-12">
          <h3 className="text-2xl font-semibold mb-3">Klar for å starte?</h3>
          <p className="text-lg mb-6">
            Bli med nå og få daglige leieinntekter fra dine eiendomstokens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Opprett bruker
            </Link>
            <Link
              to="/eiendommer"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Se Eiendommer
            </Link>
          </div>
          <p className="text-sm text-white/90 italic">
            Din eiendomsreise begynner her!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LesMer;
