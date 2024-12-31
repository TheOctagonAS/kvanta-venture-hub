import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

interface BasicInfoFormData {
  name: string;
  location: string;
  desiredTokenization: string;
  maxTokens: string;
  imageUrl: string;
}

interface BasicInfoStepProps {
  data: BasicInfoFormData;
  onUpdate: (data: BasicInfoFormData) => void;
  onPropertyCreated?: (id: string) => void;
}

const BasicInfoStep = ({ data, onUpdate, onPropertyCreated }: BasicInfoStepProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<BasicInfoFormData>({
    defaultValues: data,
  });

  const onSubmit = async (formData: BasicInfoFormData) => {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert([{
          name: formData.name,
          location: formData.location,
          max_tokens: parseInt(formData.maxTokens),
          image_url: formData.imageUrl,
          status: 'PENDING_REVIEW'
        }])
        .select()
        .single();

      if (error) throw error;

      if (property && onPropertyCreated) {
        onPropertyCreated(property.id);
      }

      onUpdate(formData);
      
      toast({
        title: "Eiendom opprettet",
        description: "Grunnleggende informasjon er lagret",
      });
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Feil ved opprettelse",
        description: "Kunne ikke opprette eiendom. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-6">
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
        <Label htmlFor="desiredTokenization">Ønsket belåning / andel (%)</Label>
        <Input
          id="desiredTokenization"
          type="number"
          {...register("desiredTokenization", {
            required: "Ønsket belåning er påkrevd",
            min: { value: 1, message: "Må være større enn 0%" },
            max: { value: 100, message: "Kan ikke være mer enn 100%" }
          })}
        />
        {errors.desiredTokenization && (
          <p className="text-red-500 text-sm mt-1">{errors.desiredTokenization.message}</p>
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
        <p className="text-sm text-gray-500 mt-1">
          Dette tallet kan bli justert av Kvanta.ai basert på verdivurdering
        </p>
        {errors.maxTokens && (
          <p className="text-red-500 text-sm mt-1">{errors.maxTokens.message}</p>
        )}
      </FormItem>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <Label className="text-gray-600">Pris per token</Label>
          <p className="text-sm text-gray-500 mt-1">
            Blir satt av Kvanta.ai etter verdivurdering
          </p>
        </div>

        <div>
          <Label className="text-gray-600">Forventet avkastning</Label>
          <p className="text-sm text-gray-500 mt-1">
            Dette fastsettes av Kvanta.ai
          </p>
        </div>
      </div>

      <FormItem>
        <Label htmlFor="imageUrl">Bilde URL</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
      </FormItem>
    </form>
  );
};

export default BasicInfoStep;