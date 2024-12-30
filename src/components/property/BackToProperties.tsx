import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackToProperties = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/eiendommer')}
      className="flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-nordic-charcoal bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
    >
      <ChevronLeft className="h-4 w-4 text-nordic-blue" />
      Tilbake til Eiendommer
    </button>
  );
};