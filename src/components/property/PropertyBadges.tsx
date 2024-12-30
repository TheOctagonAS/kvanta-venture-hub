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
          className="bg-[#9b59b6] text-white border-none font-medium text-sm"
        >
          <Star className="h-3 w-3 mr-1" />
          Fremhevet
        </Badge>
      )}
      
      <Badge 
        variant="secondary" 
        className="bg-nordic-softblue text-[#345FF6] border border-[#345FF6] font-medium text-sm"
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        APY: {yieldValue}%
      </Badge>
      
      {status === 'Coming Soon' && (
        <Badge 
          variant="secondary" 
          className="bg-yellow-100 text-yellow-600 border border-yellow-200 font-medium text-sm"
        >
          Kommer snart
        </Badge>
      )}
      
      {status === 'Sold Out' && (
        <Badge 
          variant="destructive" 
          className="bg-red-100 text-red-600 border border-red-200 font-medium text-sm"
        >
          <Ban className="h-3 w-3 mr-1" />
          Utsolgt
        </Badge>
      )}
    </div>
  );
};