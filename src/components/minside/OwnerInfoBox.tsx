import { UserPlus, Building2, Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OwnerInfoBox = () => {
  const steps = [
    {
      id: "kyc",
      title: "1. KYC",
      icon: UserPlus,
      content: "Fullfør KYC-verifisering for å komme i gang."
    },
    {
      id: "list",
      title: "2. List Eiendom",
      icon: Building2,
      content: "List eiendommen din ved å fylle ut nødvendig informasjon."
    },
    {
      id: "invest",
      title: "3. Investor-kjøp",
      icon: Users,
      content: "Investorer kan nå kjøpe tokens i eiendommen din på markedsplassen."
    },
    {
      id: "withdraw",
      title: "4. Uttak av midler",
      icon: Wallet,
      content: "Følg med på salget i 'Mine Eiendommer' og ta ut midler når du ønsker."
    }
  ];

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">
        Hvordan funker det for deg som eier?
      </h3>
      
      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-50/50">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="data-[state=active]:bg-white data-[state=active]:text-primary relative group"
            >
              <span className="relative z-10">{step.title}</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/5 to-primary/10 transition-opacity duration-300 rounded-md" />
            </TabsTrigger>
          ))}
        </TabsList>
        
        {steps.map((step) => (
          <TabsContent
            key={step.id}
            value={step.id}
            className="mt-4 p-4 bg-gray-50/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <step.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-gray-700">{step.content}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default OwnerInfoBox;