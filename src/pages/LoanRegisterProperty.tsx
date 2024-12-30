import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import KYCModal from "@/components/KYCModal";

const LoanRegisterProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: "",
    estimatedValue: "",
    requestedAmount: "",
    repaymentMonths: "12",
    interestRate: 5,
    ownershipDeclaration: false,
  });

  const createLoanProperty = async (loanRequestId: string) => {
    const tokenCount = 500; // Fixed number of tokens
    const pricePerToken = Math.floor(Number(formData.requestedAmount) / tokenCount);
    
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        name: `Loan Property ${loanRequestId.slice(0, 8)}`,
        location: "Norway", // Default location
        price_per_token: pricePerToken,
        max_tokens: tokenCount,
        property_type: "loan",
        yield: formData.interestRate,
      })
      .select()
      .single();

    if (propertyError) throw propertyError;

    // Create initial user holdings for the property owner
    const { error: holdingsError } = await supabase
      .from('user_holdings')
      .insert({
        user_id: user?.id,
        property_id: property.id,
        token_count: tokenCount,
      });

    if (holdingsError) throw holdingsError;

    return property;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Du må være logget inn for å fortsette");
      return;
    }

    if (!formData.ownershipDeclaration) {
      toast.error("Du må bekrefte at du eier eiendommen");
      return;
    }

    // Check if user is KYC verified
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_kyc')
      .eq('id', user.id)
      .single();

    if (!profile?.is_kyc) {
      setIsKYCModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create loan request
      const { data: loanRequest, error } = await supabase
        .from('property_loan_requests')
        .insert({
          user_id: user.id,
          property_type: formData.propertyType,
          estimated_value: parseFloat(formData.estimatedValue),
          requested_amount: parseFloat(formData.requestedAmount),
          repayment_months: parseInt(formData.repaymentMonths),
          interest_rate: formData.interestRate,
          ownership_declaration: formData.ownershipDeclaration,
        })
        .select()
        .single();

      if (error) throw error;

      // Create property and mint tokens
      await createLoanProperty(loanRequest.id);

      toast.success("Søknaden din er mottatt og tokens er opprettet!");
      navigate("/minside");
    } catch (error: any) {
      console.error("Error submitting loan request:", error);
      toast.error("Kunne ikke sende søknaden. Prøv igjen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Registrer eiendom for belåning</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyType">Eiendomstype</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg eiendomstype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESIDENTIAL">Bolig</SelectItem>
                    <SelectItem value="COMMERCIAL">Næringseiendom</SelectItem>
                    <SelectItem value="VACATION">Fritidsbolig</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimatedValue">Verdianslag (NOK)</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  placeholder="f.eks. 5000000"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="requestedAmount">Ønsket lånebeløp (NOK)</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  placeholder="f.eks. 500000"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="repaymentMonths">Nedbetalingstid (måneder)</Label>
                <Select
                  value={formData.repaymentMonths}
                  onValueChange={(value) => setFormData({ ...formData, repaymentMonths: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg nedbetalingstid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 måneder</SelectItem>
                    <SelectItem value="24">24 måneder</SelectItem>
                    <SelectItem value="36">36 måneder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rente (%): {formData.interestRate}%</Label>
                <Slider
                  value={[formData.interestRate]}
                  onValueChange={([value]) => setFormData({ ...formData, interestRate: value })}
                  min={5}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ownershipDeclaration"
                  checked={formData.ownershipDeclaration}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, ownershipDeclaration: checked as boolean })
                  }
                />
                <Label htmlFor="ownershipDeclaration" className="text-sm">
                  Jeg bekrefter at jeg eier denne eiendommen
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sender..." : "Fortsett"}
            </Button>
          </form>
        </div>
      </div>

      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onComplete={async () => {
          setIsKYCModalOpen(false);
          // Retry form submission after KYC
          handleSubmit(new Event('submit') as any);
        }}
      />
    </div>
  );
};

export default LoanRegisterProperty;