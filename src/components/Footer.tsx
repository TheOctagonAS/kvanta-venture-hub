import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 text-gray-600">
          <h3 className="font-semibold text-lg">Hahn Holding AS</h3>
          <p className="text-sm">Org: 924 652 640</p>
          
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>Mosseveien 10, 0193 Oslo</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4" />
            <a 
              href="mailto:hahn.julian@gmail.com" 
              className="hover:text-primary transition-colors"
            >
              hahn.julian@gmail.com
            </a>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <a 
              href="tel:+4799224078" 
              className="hover:text-primary transition-colors"
            >
              +47 99 22 40 78
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;