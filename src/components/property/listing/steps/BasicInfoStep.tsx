import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface BasicInfoFormData {
  name: string;
  location: string;
  desiredTokenization: string;
  imageUrl: string;
}

interface BasicInfoStepProps {
  data: BasicInfoFormData;
  onUpdate: (data: BasicInfoFormData) => void;
  onPropertyCreated?: (id: string) => void;
}

const BasicInfoStep = ({ data, onUpdate, onPropertyCreated }: BasicInfoStepProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BasicInfoFormData>({
    defaultValues: data,
  });

  const [calculatedTokens, setCalculatedTokens] = useState<number | null>(null);
  const desiredTokenization = watch("desiredTokenization");

  // Simulate property value calculation (this would be replaced with actual valuation)
  const estimatedPropertyValue = 5000000; // 5 million NOK
  const pricePerToken = 1000; // 1000 NOK per token

  useEffect(() => {
    if (desiredTokenization) {
      const percentage = parseFloat(desiredTokenization);
      if (!isNaN(percentage)) {
        const tokenizedValue = (estimatedPropertyValue * percentage) / 100;
        const tokens = Math.floor(tokenizedValue / pricePerToken);
        setCalculatedTokens(tokens);
      }
    }
  }, [desiredTokenization]);

  const onSubmit = async (formData: BasicInfoFormData) => {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert([{
          name: formData.name,
          location: formData.location,
          max_tokens: calculatedTokens || 0,
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
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 stroke-blue-600" />
        <AlertDescription className="text-blue-800">
          Priser og avkastningsprosent settes endelig av Kvanta.ai basert på verdivurdering. 
          Vi tar kontakt for å avtale takst / verdivurdering. Du eier fremdeles 100% av eiendommen til alt er godkjent og publisert.
        </AlertDescription>
      </Alert>

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
        <Label htmlFor="desiredTokenization">Andel av eiendom til tokens (%)</Label>
        <Input
          id="desiredTokenization"
          type="number"
          {...register("desiredTokenization", {
            required: "Ønsket andel er påkrevd",
            min: { value: 1, message: "Må være større enn 0%" },
            max: { value: 100, message: "Kan ikke være mer enn 100%" }
          })}
        />
        {errors.desiredTokenization && (
          <p className="text-red-500 text-sm mt-1">{errors.desiredTokenization.message}</p>
        )}
        {calculatedTokens !== null && (
          <p className="text-sm text-gray-600 mt-2">
            Beregnede tokens: {calculatedTokens} 
            <br />
            (Basert på estimert eiendomsverdi og token-pris som fastsettes av Kvanta.ai)
          </p>
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
