import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { vippsService } from "@/services/vippsService";
import VippsLogo from "../assets/vipps-logo.svg";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vipps-mobilepay-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        brand?: string;
        language?: string;
        variant?: string;
        rounded?: string;
        verb?: string;
        stretched?: string;
        branded?: string;
        loading?: string;
      };
    }
  }
}

const LoginForm = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleVippsLogin = () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error("Du må godta både personvernreglene og brukervilkårene for å fortsette");
      return;
    }
    window.location.href = vippsService.getVippsLoginUrl();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error("Du må godta både personvernreglene og brukervilkårene for å fortsette");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success("Logget inn!");
    } catch (error: any) {
      toast.error(error.message || "Kunne ikke logge inn");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="border-gray-600 data-[state=checked]:bg-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-200">
            Jeg har lest{" "}
            <Link to="/personvernreglene" className="text-blue-400 hover:underline">
              personvernreglene
            </Link>{" "}
            og gir mitt samtykke til å lagre informasjonen spesifisert i retningslinjene.
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy"
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
            className="border-gray-600 data-[state=checked]:bg-blue-500"
          />
          <label htmlFor="privacy" className="text-sm text-gray-200">
            Jeg har lest og godtar{" "}
            <Link to="/brukervilkarene" className="text-blue-400 hover:underline">
              brukervilkårene
            </Link>
            .
          </label>
        </div>
      </div>

      <div onClick={handleVippsLogin} className="w-full flex justify-center cursor-pointer">
        <button className="bg-[#FF5B24] hover:bg-[#ff4a0a] text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center">
          <img src={VippsLogo} alt="Vipps" className="h-5 w-auto mr-2" />
          Logg inn med Vipps
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#25262B] px-2 text-gray-400">Eller</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Logger inn..." : "Logg inn med e-post"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-300">
          Har du ikke bruker?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Registrer deg her
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;