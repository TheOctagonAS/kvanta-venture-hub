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
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast.error("E-postadressen er allerede registrert.");
        } else {
          toast.error("En feil oppstod under registrering. Prøv igjen senere.");
        }
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: authData.user.id, is_kyc: false }]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Kunne ikke opprette brukerprofil.");
          return;
        }

        toast.success("Bruker opprettet! Du kan nå logge inn.");
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("En uventet feil oppstod. Prøv igjen senere.");
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