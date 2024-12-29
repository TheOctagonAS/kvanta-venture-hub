import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      toast.error("Vennligst koble til Supabase via integrasjonsmenyen øverst til høyre.");
      return;
    }

    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Feil e-post eller passord.");
        } else {
          toast.error("En feil oppstod under innlogging. Prøv igjen senere.");
        }
        return;
      }

      if (data.user) {
        login(data.user.email || "", password);
        toast.success("Innlogging vellykket!");
        navigate("/minside");
      }
    } catch (error) {
      toast.error("En feil oppstod under innlogging. Prøv igjen senere.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Logg inn
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured() && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vennligst koble til Supabase via integrasjonsmenyen øverst til høyre.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
              disabled={isLoading || !isSupabaseConfigured()}
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
              disabled={isLoading || !isSupabaseConfigured()}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isSupabaseConfigured()}
          >
            {isLoading ? "Logger inn..." : "Logg inn"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;