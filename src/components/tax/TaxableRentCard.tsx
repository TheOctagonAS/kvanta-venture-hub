import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database } from "@/integrations/supabase/types";

type RentEarning = Database["public"]["Tables"]["rent_earnings"]["Row"] & {
  property: Pick<Database["public"]["Tables"]["properties"]["Row"], "name" | "id">;
};

interface TaxableRentCardProps {
  rentEarnings: RentEarning[];
}

export const TaxableRentCard = ({ rentEarnings }: TaxableRentCardProps) => {
  const totalEarnings = rentEarnings.reduce(
    (sum, earning) => sum + Number(earning.earned_amount),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Skattepliktig leie</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Dette beløpet er basert på opptjent leie, uavhengig av uttak.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {rentEarnings && rentEarnings.length > 0 ? (
        <div className="space-y-3">
          {rentEarnings.map((earning, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>{earning.property.name}</span>
              <span className="font-medium">
                {Number(earning.earned_amount).toLocaleString()} NOK
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 font-semibold">
            <span>Total leieinntekt</span>
            <span>{totalEarnings.toLocaleString()} NOK</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Ingen leieinntekter registrert for 2024</p>
      )}
    </div>
  );
};