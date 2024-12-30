import { InfoIcon, DollarSign } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EstimatedTaxCardProps {
  totalEarnings: number;
}

export const EstimatedTaxCard = ({ totalEarnings }: EstimatedTaxCardProps) => {
  const estimatedTax = totalEarnings * 0.22;

  return (
    <div className="bg-primary/10 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <DollarSign className="h-5 w-5 text-primary mt-1" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-lg">Estimert skatt (22%)</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Formel: Opptjent leie x 22% (2023-sats)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="font-semibold text-2xl text-primary">
            {estimatedTax.toLocaleString()} NOK
          </p>
          <p className="text-sm text-gray-600">
            Dette er et omtrentlig beløp. Faktisk skatt kan variere pga fradrag
            m.m.
          </p>
        </div>
      </div>
    </div>
  );
};