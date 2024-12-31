import { TrendingUp, Ban, Star, Clock, CheckCircle, XCircle } from "lucide-react";
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
      
      {status === 'PENDING_REVIEW' ? (
        <Badge 
          variant="outline" 
          className="bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium text-sm flex items-center"
        >
          <Clock className="h-3 w-3 mr-1" />
          Under gjennomgang
        </Badge>
      ) : status === 'APPROVED' ? (
        <Badge 
          variant="secondary" 
          className="bg-green-100 text-green-700 border border-green-200 font-medium text-sm flex items-center"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Verifisert
        </Badge>
      ) : status === 'REJECTED' ? (
        <Badge 
          variant="destructive" 
          className="bg-red-100 text-red-600 border border-red-200 font-medium text-sm flex items-center"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Avvist
        </Badge>
      ) : status === 'Coming Soon' ? (
        <Badge 
          variant="outline" 
          className="bg-[#FFF4C2] text-[#6B5E00] border border-[#FFD966] font-medium text-sm"
        >
          Kommer snart
        </Badge>
      ) : isSoldOut && (
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