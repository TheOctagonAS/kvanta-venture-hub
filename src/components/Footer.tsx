import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto px-4">
        <div className="py-24 flex flex-col items-center space-y-6 text-nordic-charcoal">
          <h3 className="font-semibold text-2xl mb-2">Hahn Holding AS</h3>
          
          <div className="flex flex-col items-center space-y-4">
            <p className="text-base">
              Org: <span className="text-nordic-gray">924 652 640</span>
            </p>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-nordic-blue" />
              <span className="text-base">Mosseveien 10, 0193 Oslo</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-nordic-blue" />
              <a 
                href="mailto:hahn.julian@gmail.com" 
                className="text-base hover:text-nordic-blue transition-colors"
              >
                hahn.julian@gmail.com
              </a>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-nordic-blue" />
              <a 
                href="tel:+4799224078" 
                className="text-base hover:text-nordic-blue transition-colors"
              >
                +47 99 22 40 78
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 bg-nordic-lightgray"></div>
    </footer>
  );
};

export default Footer;