import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { KvantaLogo } from "./KvantaLogo";

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
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 py-2 px-4 group">
              <KvantaLogo />
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium shadow-sm"
              >
                Beta
              </Badge>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link to="/" className={`${isActive("/")} transition-colors duration-200`}>
              Forside
            </Link>
            <Link to="/eiendommer" className={`${isActive("/eiendommer")} transition-colors duration-200`}>
              Eiendommer
            </Link>
            {user ? (
              <>
                <Link to="/minside" className={`${isActive("/minside")} transition-colors duration-200`}>
                  Min side
                </Link>
                <Link to="/skatt" className={`${isActive("/skatt")} transition-colors duration-200`}>
                  Skatt
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="ml-4"
                >
                  Logg ut
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate("/auth/login")}
                className="text-primary hover:text-primary/90 hover:bg-primary/10"
              >
                Logg inn
              </Button>
            )}
          </div>

          <div className="sm:hidden flex items-center gap-4">
            {!user && (
              <Button
                variant="ghost"
                onClick={() => navigate("/auth/login")}
                className="text-primary hover:text-primary/90 hover:bg-primary/10"
              >
                Logg inn
              </Button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

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
            {user ? (
              <>
                <Link
                  to="/minside"
                  className={`${isActive("/minside")} block px-3 py-2 rounded-md text-base transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Min side
                </Link>
                <Link
                  to="/skatt"
                  className={`${isActive("/skatt")} block px-3 py-2 rounded-md text-base transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Skatt
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-2"
                >
                  Logg ut
                </Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;