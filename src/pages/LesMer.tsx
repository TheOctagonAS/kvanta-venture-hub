import { motion } from "framer-motion";

const LesMer = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-xl shadow-lg p-8 mt-10 mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-primary">
          Les mer om Kvanta.ai
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          En trygg og enkel plattform for brøkdelsinvestering i eiendom
        </p>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <p className="text-gray-700 text-center">
            Med Kvanta.ai kan du enkelt kjøpe og selge brøkdeler av attraktive eiendommer med bare noen få klikk. 
            Du bestemmer selv hvor mye du vil investere, og kan starte med et lite beløp.
          </p>

          <div className="bg-nordic-softblue rounded-lg p-4 text-center">
            <p className="text-gray-700">
              All data lagres sikkert i Supabase, og KYC sikrer at alle investorer er verifiserte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
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
        </div>
      </motion.div>
    </div>
  );
};

export default LesMer;