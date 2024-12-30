import { KvantaLogo } from "./KvantaLogo";

const Footer = () => {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="container mx-auto px-4">
        <div className="py-6">
          <div className="flex flex-col items-center space-y-4">
            <KvantaLogo />
            <div className="text-center">
              <h3 className="font-medium text-sm mb-1">Kvanta Technologies AS</h3>
              <p className="text-xs text-gray-400">
                Org.nr: 924 652 640
              </p>
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Kvanta Technologies AS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;