import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="font-medium text-lg mb-1">Hahn Holding AS</h3>
              <p className="text-sm text-gray-400">
                Org: <span>924 652 640</span>
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Mosseveien 10, 0193 Oslo</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <a 
                  href="mailto:hahn.julian@gmail.com" 
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  hahn.julian@gmail.com
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <a 
                  href="tel:+4799224078" 
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  +47 99 22 40 78
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;