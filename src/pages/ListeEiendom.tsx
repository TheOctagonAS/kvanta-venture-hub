import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Building2 } from "lucide-react";

interface PropertyFormData {
  name: string;
  location: string;
  price_per_token: number;
  max_tokens: number;
  yield: number;
  image_url: string;
}

const ListeEiendom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormData>();

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('properties')
        .insert({
          ...data,
          owner_id: user.id,
          status: 'Coming Soon',
          tokens_sold: 0
        });

      if (error) throw error;

      toast({
        title: "Suksess!",
        description: "Eiendom opprettet",
      });

      navigate('/minside');
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke opprette eiendom. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-white shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-6 w-6 text-nordic-blue" />
          <h1 className="text-2xl font-semibold">Registrer ny eiendom</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Eiendomsnavn</label>
            <Input
              {...register("name", { required: "Eiendomsnavn er påkrevd" })}
              placeholder="Skriv inn eiendomsnavn"
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beliggenhet</label>
            <Input
              {...register("location", { required: "Beliggenhet er påkrevd" })}
              placeholder="Skriv inn beliggenhet"
              className="w-full"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pris per token (NOK)</label>
            <Input
              type="number"
              {...register("price_per_token", { 
                required: "Pris per token er påkrevd",
                min: { value: 1, message: "Pris må være større enn 0" }
              })}
              placeholder="0"
              className="w-full"
            />
            {errors.price_per_token && (
              <p className="text-red-500 text-sm mt-1">{errors.price_per_token.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Antall tokens</label>
            <Input
              type="number"
              {...register("max_tokens", { 
                required: "Antall tokens er påkrevd",
                min: { value: 1, message: "Antall må være større enn 0" }
              })}
              placeholder="1000"
              className="w-full"
            />
            {errors.max_tokens && (
              <p className="text-red-500 text-sm mt-1">{errors.max_tokens.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Forventet avkastning (%)</label>
            <Input
              type="number"
              step="0.1"
              {...register("yield", { 
                required: "Forventet avkastning er påkrevd",
                min: { value: 0, message: "Avkastning kan ikke være negativ" }
              })}
              placeholder="5.0"
              className="w-full"
            />
            {errors.yield && (
              <p className="text-red-500 text-sm mt-1">{errors.yield.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bildelenke</label>
            <Input
              {...register("image_url")}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
            {errors.image_url && (
              <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Lagre eiendom
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ListeEiendom;