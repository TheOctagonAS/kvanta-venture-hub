import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Wallet, ArrowRight, Link, Shield, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TransferHistory } from "./TransferHistory";
import { Separator } from "@/components/ui/separator";

interface DefiCollateralModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol?: string;
  propertyId: string;
  tokenCount?: number;
}

export const DefiCollateralModal = ({
  isOpen,
  onClose,
  tokenSymbol = "KVANTA",
  propertyId,
  tokenCount = 0,
}: DefiCollateralModalProps) => {
  const [step, setStep] = useState(1);
  const [metamaskAddress, setMetamaskAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const { user } = useAuth();

  const handleTransfer = async () => {
    if (!user || !metamaskAddress) return;

    try {
      setIsTransferring(true);
      
      // Log the transfer
      const { error } = await supabase
        .from('on_chain_transfers')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          tx_hash: `MOCK-TX-${Date.now()}`,
          from_address: 'KVANTA_CUSTODY',
          to_address: metamaskAddress,
          token_count: tokenCount,
        });

      if (error) throw error;

      toast.success('Tokens overført til din Metamask-lommebok');
      setStep(2);
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Kunne ikke overføre tokens');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bruk tokens som collateral i DeFi</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className={`transition-opacity duration-300 ${step === 1 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Trinn 1: Overfør tokens</h3>
              </div>
              <div className="pl-11">
                <p className="text-sm text-gray-600 mb-4">
                  Overfør tokens til din egen metamask-lommebok for å bruke dem som collateral.
                </p>
                <Input
                  placeholder="Din Metamask-adresse"
                  value={metamaskAddress}
                  onChange={(e) => setMetamaskAddress(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  onClick={handleTransfer}
                  disabled={!metamaskAddress || isTransferring}
                  className="w-full"
                >
                  {isTransferring ? "Overfører..." : "Overfør fra Kvanta custody"}
                </Button>
              </div>
            </div>

            <div className={`transition-opacity duration-300 ${step === 2 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Link className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Trinn 2: Koble til DeFi-app</h3>
              </div>
              <div className="pl-11">
                <p className="text-sm text-gray-600">
                  Gå til AAVE-liknende app og koble til din wallet.
                </p>
              </div>
            </div>

            <div className={`transition-opacity duration-300 ${step === 3 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Trinn 3: Supply token</h3>
              </div>
              <div className="pl-11">
                <p className="text-sm text-gray-600">
                  Legg til {tokenSymbol} under 'Collateral assets'.
                </p>
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Merk: Dette er kun mulig dersom AAVE har whitelistet {tokenSymbol}. 
                    Du gjør dette på eget ansvar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Overføringshistorikk</h3>
            <TransferHistory />
          </div>

          <div className="mt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Hva hvis prisen faller?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    Hvis prisen på tokens faller under en viss terskel, kan din posisjon bli likvidert. 
                    Dette betyr at dine tokens kan bli solgt for å dekke lånet. Det er viktig å 
                    overvåke prisene og opprettholde en sunn collateral ratio.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Hvordan fungerer likvidering?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    Likvidering skjer automatisk når verdien av din collateral faller under den 
                    påkrevde terskelen. For å unngå likvidering kan du enten legge til mer collateral 
                    eller betale tilbake deler av lånet.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};