import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";

const navigation = [
  { name: 'Eiendommer', href: '/eiendommer' },
  { name: 'Invester i Belånt Eiendom', href: '/loan/invest' },
  { name: 'Leie og Avkastning', href: '/leie-og-avkastning' },
  { name: 'Likviditet', href: '/likviditet' },
  { name: 'Les Mer', href: '/les-mer' },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-nordic-lake">
                Nordic Tokenized Real Estate
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/minside" className="w-full">Min Side</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/lommebok" className="w-full">Lommebok</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Logg ut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Logg inn</Button>
                </Link>
                <Link to="/register">
                  <Button>Registrer</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/minside"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Min Side
                </Link>
                <Link
                  to="/lommebok"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lommebok
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  Logg ut
                </button>
              </>
            ) : (
              <div className="space-y-1 px-3 py-2">
                <Link
                  to="/login"
                  className="block text-base font-medium text-gray-500 hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logg inn
                </Link>
                <Link
                  to="/register"
                  className="block text-base font-medium text-gray-500 hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrer
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;