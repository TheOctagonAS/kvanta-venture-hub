import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface DueDiligenceFormData {
  hasCurrentTenant: boolean;
  livingArea: string;
  monthlyRent: string;
  constructionYear: string;
  lastRenovation: string;
}

interface DueDiligenceStepProps {
  data: DueDiligenceFormData;
  onUpdate: (data: DueDiligenceFormData) => void;
}

const DueDiligenceStep = ({ data, onUpdate }: DueDiligenceStepProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DueDiligenceFormData>({
    defaultValues: data,
  });

  const hasCurrentTenant = watch("hasCurrentTenant");

  const onSubmit = (formData: DueDiligenceFormData) => {
    onUpdate(formData);
  };

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900">
          Due Diligence
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Vi trenger noen flere detaljer om eiendommen
        </p>
      </div>

      <FormItem className="flex items-center justify-between">
        <div>
          <Label htmlFor="hasCurrentTenant" className="text-base">
            Er det leietaker i boligen?
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Informer om det er en eksisterende leiekontrakt
          </p>
        </div>
        <Switch
          id="hasCurrentTenant"
          checked={hasCurrentTenant}
          onCheckedChange={(checked) => setValue("hasCurrentTenant", checked)}
        />
      </FormItem>

      {hasCurrentTenant && (
        <FormItem>
          <Label htmlFor="monthlyRent">Månedlig leieinntekt (NOK)</Label>
          <Input
            id="monthlyRent"
            type="number"
            {...register("monthlyRent", {
              required: "Månedlig leie er påkrevd",
              min: { value: 0, message: "Må være et positivt beløp" },
            })}
          />
          {errors.monthlyRent && (
            <p className="text-red-500 text-sm mt-1">{errors.monthlyRent.message}</p>
          )}
        </FormItem>
      )}

      <FormItem>
        <Label htmlFor="livingArea">Boligareal (kvm)</Label>
        <Input
          id="livingArea"
          type="number"
          {...register("livingArea", {
            required: "Boligareal er påkrevd",
            min: { value: 1, message: "Må være større enn 0" },
          })}
        />
        {errors.livingArea && (
          <p className="text-red-500 text-sm mt-1">{errors.livingArea.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="constructionYear">Byggeår</Label>
        <Input
          id="constructionYear"
          type="number"
          {...register("constructionYear", {
            required: "Byggeår er påkrevd",
            min: { value: 1800, message: "Ugyldig byggeår" },
            max: { value: new Date().getFullYear(), message: "Kan ikke være i fremtiden" },
          })}
        />
        {errors.constructionYear && (
          <p className="text-red-500 text-sm mt-1">{errors.constructionYear.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="lastRenovation">Siste renovering (årstall)</Label>
        <Input
          id="lastRenovation"
          type="number"
          {...register("lastRenovation", {
            min: { 
              value: 1800, 
              message: "Ugyldig årstall" 
            },
            max: { 
              value: new Date().getFullYear(), 
              message: "Kan ikke være i fremtiden" 
            },
          })}
        />
        {errors.lastRenovation && (
          <p className="text-red-500 text-sm mt-1">{errors.lastRenovation.message}</p>
        )}
      </FormItem>
    </form>
  );
};

export default DueDiligenceStep;