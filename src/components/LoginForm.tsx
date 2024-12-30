import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { vippsService } from "@/services/vippsService";

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

  const handleVippsLogin = () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error("Du må godta både personvernreglene og brukervilkårene for å fortsette");
      return;
    }
    window.location.href = vippsService.getVippsLoginUrl();
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
        <vipps-mobilepay-button
          type="button"
          brand="vipps"
          language="no"
          variant="primary"
          rounded="true"
          verb="login"
          stretched="false"
          branded="true"
        />
      </div>

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