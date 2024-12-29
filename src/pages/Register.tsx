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

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error("No session after signup");

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            is_kyc: false
          }
        ]);

      if (profileError) throw profileError;

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