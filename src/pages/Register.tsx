import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      toast.error("En registrering er allerede i gang. Vennligst vent.");
      return;
    }

    setIsLoading(true);

    try {
      // First, verify the referral code if provided
      if (referralCode) {
        const { data: referralData, error: referralError } = await supabase
          .from('referral_codes')
          .select('user_id')
          .eq('code', referralCode.toUpperCase())
          .single();

        if (referralError) {
          toast.error("Ugyldig vervekode");
          return;
        }

        // Store the referrer's ID for later use
        const referrerId = referralData.user_id;

        // Register the new user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          if (signUpError.message.includes('rate_limit')) {
            toast.error("Vennligst vent litt før du prøver igjen (ca. 1 minutt)");
            return;
          }
          throw signUpError;
        }

        if (!authData.user) {
          throw new Error("No user data returned after signup");
        }

        // Create referral reward
        const { error: rewardError } = await supabase
          .from('referral_rewards')
          .insert([
            {
              referrer_id: referrerId,
              referred_id: authData.user.id,
              amount: 250,
              status: 'PENDING'
            }
          ]);

        if (rewardError) {
          console.error("Error creating referral reward:", rewardError);
        }
      } else {
        // Register without referral code
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        if (!authData.user) {
          throw new Error("No user data returned after signup");
        }
      }

      toast.success("Registrering vellykket! Sjekk e-posten din for verifisering.");
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message.includes("already registered")) {
        toast.error("E-postadressen er allerede registrert");
      } else if (error.message.includes("rate_limit")) {
        toast.error("Vennligst vent litt før du prøver igjen (ca. 1 minutt)");
      } else {
        toast.error("Det oppstod en feil under registrering. Vennligst prøv igjen.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Opprett bruker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-post
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="din@epost.no"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Passord
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="referralCode" className="text-sm font-medium">
                Vervekode (valgfritt)
              </label>
              <Input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Oppretter bruker..." : "Opprett bruker"}
            </Button>
            <div className="text-center mt-4">
              <Link 
                to="/" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Allerede bruker? Logg inn
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;