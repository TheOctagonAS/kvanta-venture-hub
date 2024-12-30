import { MapPin, Coins } from "lucide-react";

type PropertyDetailsProps = {
  location: string;
  pricePerToken: number;
  availableTokens: number;
  ratio: number;
};

export const PropertyDetails = ({ location, pricePerToken, availableTokens, ratio }: PropertyDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-nordic-gray dark:text-[#ddd]">
        <MapPin className="h-4 w-4" />
        <span className="font-medium">{location}</span>
      </div>
      <div className="flex items-center gap-2 text-nordic-blue">
        <Coins className="h-4 w-4" />
        <span className="font-medium">
          {pricePerToken} kr per token
        </span>
      </div>
      
      <div>
        <div className="h-2 bg-nordic-softblue dark:bg-[#2a2a2a] rounded-full overflow-hidden">
          <div 
            className="bg-nordic-blue h-full transition-all duration-300"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <p className="text-sm text-nordic-gray dark:text-[#ddd] mt-2">
          {availableTokens} andeler igjen
        </p>
      </div>
    </div>
  );
};