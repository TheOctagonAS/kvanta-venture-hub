import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-semibold" : "text-gray-600 hover:text-primary";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Kvanta.ai
          </Link>
          
          <div className="flex space-x-8">
            <Link to="/" className={`${isActive("/")} transition-colors duration-200`}>
              Forside
            </Link>
            <Link to="/eiendommer" className={`${isActive("/eiendommer")} transition-colors duration-200`}>
              Eiendommer
            </Link>
            <Link to="/minside" className={`${isActive("/minside")} transition-colors duration-200`}>
              Min side
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;