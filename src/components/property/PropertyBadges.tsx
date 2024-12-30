import { TrendingUp, Ban, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PropertyBadgesProps = {
  yield: number;
  isSoldOut: boolean;
  status: string;
  isFeatured: boolean;
};

export const PropertyBadges = ({ yield: yieldValue, isSoldOut, status, isFeatured }: PropertyBadgesProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {isFeatured && (
        <Badge 
          variant="secondary" 
          className="bg-[#9b59b6] text-white border-none font-medium text-sm flex items-center"
        >
          <Star className="h-3 w-3 mr-1" />
          Fremhevet
        </Badge>
      )}
      
      <Badge 
        variant="outline" 
        className="bg-white text-[#345FF6] border border-[#345FF6] font-medium text-sm flex items-center"
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        APY: {yieldValue}%
      </Badge>
      
      {status === 'Coming Soon' ? (
        <Badge 
          variant="outline" 
          className="bg-[#FFF4C2] text-[#6B5E00] border border-[#FFD966] font-medium text-sm"
        >
          Kommer snart
        </Badge>
      ) : status === 'Active' ? (
        <Badge 
          variant="secondary" 
          className="bg-[#47C757] text-white border-none font-medium text-sm"
        >
          Aktiv
        </Badge>
      ) : status === 'Sold Out' && (
        <Badge 
          variant="destructive" 
          className="bg-red-100 text-red-600 border border-red-200 font-medium text-sm flex items-center"
        >
          <Ban className="h-3 w-3 mr-1" />
          Utsolgt
        </Badge>
      )}
    </div>
  );
};