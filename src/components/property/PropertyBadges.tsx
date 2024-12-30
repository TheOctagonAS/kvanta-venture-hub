import { TrendingUp, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PropertyBadgesProps = {
  yield: number;
  isSoldOut: boolean;
};

export const PropertyBadges = ({ yield: yieldValue, isSoldOut }: PropertyBadgesProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <Badge 
        variant="secondary" 
        className="bg-nordic-softblue text-nordic-blue border border-nordic-blue font-medium text-sm dark:bg-[#2a2a2a] dark:border-nordic-blue/50"
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        APY: {yieldValue}%
      </Badge>
      
      {isSoldOut && (
        <Badge 
          variant="destructive" 
          className="bg-red-100 text-red-600 border border-red-200 font-medium text-sm dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400"
        >
          <Ban className="h-3 w-3 mr-1" />
          Utsolgt
        </Badge>
      )}
    </div>
  );
};