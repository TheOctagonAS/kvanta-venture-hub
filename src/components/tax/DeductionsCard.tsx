import { DollarSign } from "lucide-react";

export const DeductionsCard = () => {
  return (
    <div className="bg-secondary/10 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <DollarSign className="h-5 w-5 text-primary mt-1" />
        <div>
          <p className="font-medium text-lg">Fradragsoversikt</p>
          <p className="text-sm text-gray-600">
            Her vil du kunne registrere fradragsberettigede utgifter som
            vedlikehold, forsikring og andre relevante kostnader. (Kommer snart)
          </p>
        </div>
      </div>
    </div>
  );
};