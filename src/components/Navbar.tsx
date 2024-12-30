import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { KvantaLogo } from "./KvantaLogo";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-semibold" : "text-gray-400 hover:text-white dark:text-[#ccc] dark:hover:text-white transition-colors duration-200";
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
    <nav className="bg-white dark:bg-[#1a1a1a] shadow-sm border-b border-gray-200 dark:border-[#2a2a2a] sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 py-2 px-4 group">
              <KvantaLogo className="text-primary dark:text-white" />
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
            <Link to="/minside" className={`${isActive("/minside")} transition-colors duration-200`}>
              Min side
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title={theme === 'dark' ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-[#bbb]" />
              )}
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="ml-4 dark:text-white dark:border-[#2a2a2a] dark:hover:bg-gray-800"
              >
                Logg ut
              </Button>
            )}
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-[#ccc] hover:text-primary dark:hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-[#1a1a1a] border-t dark:border-[#2a2a2a]">
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
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-[#ccc] transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-white" />
                    <span>Lys modus</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-[#bbb]" />
                    <span>Mørk modus</span>
                  </>
                )}
              </Button>
            </div>
            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full mt-2 dark:text-white dark:border-[#2a2a2a] dark:hover:bg-gray-800"
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