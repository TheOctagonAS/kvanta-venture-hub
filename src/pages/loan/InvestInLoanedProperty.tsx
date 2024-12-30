import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Calendar, Percent } from "lucide-react";
import { toast } from "sonner";

const InvestInLoanedProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: loanProperties, isLoading } = useQuery({
    queryKey: ['loan-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_loan_requests (
            requested_amount,
            interest_rate,
            repayment_months,
            monthly_payment
          )
        `)
        .eq('property_type', 'loan')
        .eq('status', 'Active');

      if (error) throw error;
      return data;
    },
  });

  const handleInvest = async (propertyId: string) => {
    if (!user) {
      toast.error("Du må være logget inn for å investere");
      navigate("/login");
      return;
    }

    // Check KYC status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_kyc')
      .eq('id', user.id)
      .single();

    if (!profile?.is_kyc) {
      toast.error("Du må verifisere din identitet før du kan investere");
      navigate("/kyc");
      return;
    }

    // Redirect to order page with property ID
    navigate(`/orders/buy?propertyId=${propertyId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Invester i Belånt Eiendom</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanProperties?.map((property) => {
          const loanRequest = property.property_loan_requests[0];
          if (!loanRequest) return null;

          const percentageOfProperty = (loanRequest.requested_amount / property.price_per_token / property.max_tokens) * 100;

          return (
            <Card key={property.id} className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{property.name}</h3>
                <p className="text-gray-600">{property.location}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{loanRequest.requested_amount.toLocaleString()} NOK i tokens</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Percent className="h-4 w-4" />
                  <span>{loanRequest.interest_rate}% årlig rente</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{loanRequest.repayment_months} måneder nedbetalingstid</span>
                </div>
              </div>

              <div className="pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Bli långiver</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invester i {property.name}</DialogTitle>
                      <DialogDescription className="pt-4 space-y-4">
                        <p>
                          Ved å kjøpe tokens i denne eiendommen blir du en långiver og eier effektivt {percentageOfProperty.toFixed(1)}% av eiendommen 
                          inntil lånet er tilbakebetalt.
                        </p>
                        <p>
                          Låntaker vil betale tilbake {loanRequest.monthly_payment?.toLocaleString()} NOK per måned 
                          over {loanRequest.repayment_months} måneder, inkludert {loanRequest.interest_rate}% årlig rente.
                        </p>
                        <p className="text-sm text-gray-500">
                          Merk: Dette er en investering med sikkerhet i eiendom. Ved mislighold av lånet 
                          har du rettigheter i henhold til din eierandel.
                        </p>
                        <Button 
                          className="w-full" 
                          onClick={() => handleInvest(property.id)}
                        >
                          Kjøp tokens
                        </Button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InvestInLoanedProperty;