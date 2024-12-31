import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";

interface BasicInfoFormData {
  name: string;
  location: string;
  pricePerToken: string;
  maxTokens: string;
  yield: string;
  imageUrl: string;
}

interface BasicInfoStepProps {
  data: BasicInfoFormData;
  onUpdate: (data: BasicInfoFormData) => void;
}

const BasicInfoStep = ({ data, onUpdate }: BasicInfoStepProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BasicInfoFormData>({
    defaultValues: data,
  });

  const onSubmit = (formData: BasicInfoFormData) => {
    onUpdate(formData);
  };

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-4">
      <FormItem>
        <Label htmlFor="name">Navn på eiendom</Label>
        <Input
          id="name"
          {...register("name", { required: "Navn er påkrevd" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="location">Beliggenhet</Label>
        <Input
          id="location"
          {...register("location", { required: "Beliggenhet er påkrevd" })}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="pricePerToken">Pris per token (NOK)</Label>
        <Input
          id="pricePerToken"
          type="number"
          {...register("pricePerToken", {
            required: "Pris er påkrevd",
            min: { value: 1, message: "Pris må være større enn 0" },
          })}
        />
        {errors.pricePerToken && (
          <p className="text-red-500 text-sm mt-1">{errors.pricePerToken.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="maxTokens">Antall tokens</Label>
        <Input
          id="maxTokens"
          type="number"
          {...register("maxTokens", {
            required: "Antall tokens er påkrevd",
            min: { value: 1, message: "Må være minst 1 token" },
          })}
        />
        {errors.maxTokens && (
          <p className="text-red-500 text-sm mt-1">{errors.maxTokens.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="yield">Forventet avkastning (%)</Label>
        <Input
          id="yield"
          type="number"
          step="0.1"
          {...register("yield", {
            required: "Avkastning er påkrevd",
            min: { value: 0, message: "Avkastning kan ikke være negativ" },
          })}
        />
        {errors.yield && (
          <p className="text-red-500 text-sm mt-1">{errors.yield.message}</p>
        )}
      </FormItem>

      <FormItem>
        <Label htmlFor="imageUrl">Bilde URL</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
      </FormItem>
    </form>
  );
};

export default BasicInfoStep;