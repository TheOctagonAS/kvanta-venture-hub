import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export interface LoanFormData {
  propertyType: string;
  estimatedValue: string;
  requestedAmount: string;
  repaymentMonths: string;
  interestRate: number;
  ownershipDeclaration: boolean;
}

interface LoanPropertyFormProps {
  formData: LoanFormData;
  onChange: (data: Partial<LoanFormData>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

const LoanPropertyForm = ({ formData, onChange, onSubmit, isSubmitting }: LoanPropertyFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="propertyType">Eiendomstype</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => onChange({ propertyType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Velg eiendomstype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESIDENTIAL">Bolig</SelectItem>
              <SelectItem value="COMMERCIAL">Næringseiendom</SelectItem>
              <SelectItem value="VACATION">Fritidsbolig</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimatedValue">Verdianslag (NOK)</Label>
          <Input
            id="estimatedValue"
            type="number"
            placeholder="f.eks. 5000000"
            value={formData.estimatedValue}
            onChange={(e) => onChange({ estimatedValue: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="requestedAmount">Ønsket lånebeløp (NOK)</Label>
          <Input
            id="requestedAmount"
            type="number"
            placeholder="f.eks. 500000"
            value={formData.requestedAmount}
            onChange={(e) => onChange({ requestedAmount: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="repaymentMonths">Nedbetalingstid (måneder)</Label>
          <Select
            value={formData.repaymentMonths}
            onValueChange={(value) => onChange({ repaymentMonths: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Velg nedbetalingstid" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 måneder</SelectItem>
              <SelectItem value="24">24 måneder</SelectItem>
              <SelectItem value="36">36 måneder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Rente (%): {formData.interestRate}%</Label>
          <Slider
            value={[formData.interestRate]}
            onValueChange={([value]) => onChange({ interestRate: value })}
            min={5}
            max={10}
            step={0.5}
            className="mt-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="ownershipDeclaration"
            checked={formData.ownershipDeclaration}
            onCheckedChange={(checked) => 
              onChange({ ownershipDeclaration: checked as boolean })
            }
          />
          <Label htmlFor="ownershipDeclaration" className="text-sm">
            Jeg bekrefter at jeg eier denne eiendommen
          </Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sender..." : "Fortsett"}
      </Button>
    </form>
  );
};

export default LoanPropertyForm;