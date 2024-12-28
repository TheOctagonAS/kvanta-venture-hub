import { motion } from "framer-motion";
import { Building2, MapPin, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import TokenPurchaseModal from "../components/TokenPurchaseModal";
import { useAuth } from "../contexts/AuthContext";

const properties = [
  {
    id: 1,
    name: "Sentrumsleilighet i Oslo",
    location: "Grünerløkka, Oslo",
    tokenPrice: 1000,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    name: "Næringsbygg i Stockholm",
    location: "Södermalm, Stockholm",
    tokenPrice: 1500,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    name: "Hytte ved fjorden i Bergen",
    location: "Nordnes, Bergen",
    tokenPrice: 2000,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
  },
  {
    id: 4,
    name: "Kontorbygg i København",
    location: "Indre By, København",
    tokenPrice: 1200,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3",
  },
];

const Eiendommer = () => {
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null);
  const { addPropertyTokens } = useAuth();

  const handlePurchase = (tokenCount: number) => {
    if (selectedProperty) {
      console.log(`Kjøp ${tokenCount} tokens i ${selectedProperty.name}`);
      addPropertyTokens(selectedProperty.id, selectedProperty.name, tokenCount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
            Tilgjengelige Eiendommer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Utforsk våre nøye utvalgte eiendommer i Norden
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{property.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Coins className="h-4 w-4" />
                      <span>{property.tokenPrice} kr per token</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Kjøp tokens
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <TokenPurchaseModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        propertyName={selectedProperty?.name || ""}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default Eiendommer;