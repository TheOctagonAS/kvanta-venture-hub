import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-semibold" : "text-gray-600 hover:text-primary";
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      toast.success("Du er nå logget ut");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Kunne ikke logge ut");
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 bg-[#2F4ECC] rounded-full overflow-hidden">
                  <Home className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-[28px] font-medium text-[#345FF6] tracking-tight font-sans">
                  Kvanta
                </span>
                <span className="text-sm font-medium text-[#345FF6] ml-0.5 -mb-0.5">
                  .ai
                </span>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-white/80 text-nordic-charcoal font-medium text-xs">
              Beta
            </Badge>
          </div>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link to="/" className={`${isActive("/")} transition-colors duration-200`}>
              Forside
            </Link>
            <Link to="/eiendommer" className={`${isActive("/eiendommer")} transition-colors duration-200`}>
              Eiendommer
            </Link>
            <Link to="/minside" className={`${isActive("/minside")} transition-colors duration-200`}>
              Min side
            </Link>
            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="ml-4"
              >
                Logg ut
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <Link
              to="/"
              className={`${isActive("/")} block px-3 py-2 rounded-md text-base transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Forside
            </Link>
            <Link
              to="/eiendommer"
              className={`${isActive("/eiendommer")} block px-3 py-2 rounded-md text-base transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Eiendommer
            </Link>
            <Link
              to="/minside"
              className={`${isActive("/minside")} block px-3 py-2 rounded-md text-base transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Min side
            </Link>
            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full mt-2"
              >
                Logg ut
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;