import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RATE_LIMIT_SECONDS = 15;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit
    const now = Date.now();
    const timeSinceLastAttempt = (now - lastAttemptTime) / 1000;
    
    if (timeSinceLastAttempt < RATE_LIMIT_SECONDS) {
      const remainingSeconds = Math.ceil(RATE_LIMIT_SECONDS - timeSinceLastAttempt);
      toast.error(`Vennligst vent ${remainingSeconds} sekunder før du prøver igjen.`);
      return;
    }

    setIsLoading(true);
    setLastAttemptTime(now);

    try {
      // Step 1: Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_kyc: false // Set initial KYC status
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Step 2: Create the user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              is_kyc: false
            }
          ]);

        if (profileError) throw profileError;

        toast.success("Registrering vellykket! Du kan nå logge inn.");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message.includes("already registered")) {
        toast.error("E-postadressen er allerede registrert");
      } else if (error.message.includes("rate_limit")) {
        toast.error("Vennligst vent litt før du prøver igjen.");
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