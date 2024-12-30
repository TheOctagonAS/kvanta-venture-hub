import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormData>();

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const { error } = await supabase
        .from('properties')
        .insert({
          ...data,
          owner_id: user?.id,
          tokens_sold: 0
        });

      if (error) throw error;

      toast.success("Eiendom ble lagt til");
      navigate('/minside');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Kunne ikke legge til eiendom");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Liste ny eiendom</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Navn på eiendom</Label>
            <Input
              id="name"
              {...register("name", { required: "Navn er påkrevd" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Beliggenhet</Label>
            <Input
              id="location"
              {...register("location", { required: "Beliggenhet er påkrevd" })}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price_per_token">Pris per token (NOK)</Label>
            <Input
              id="price_per_token"
              type="number"
              {...register("price_per_token", { 
                required: "Pris er påkrevd",
                min: { value: 1, message: "Pris må være større enn 0" }
              })}
            />
            {errors.price_per_token && (
              <p className="text-red-500 text-sm mt-1">{errors.price_per_token.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="max_tokens">Antall tokens</Label>
            <Input
              id="max_tokens"
              type="number"
              {...register("max_tokens", { 
                required: "Antall tokens er påkrevd",
                min: { value: 1, message: "Må være minst 1 token" }
              })}
            />
            {errors.max_tokens && (
              <p className="text-red-500 text-sm mt-1">{errors.max_tokens.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="yield">Forventet avkastning (%)</Label>
            <Input
              id="yield"
              type="number"
              step="0.1"
              {...register("yield", { 
                required: "Avkastning er påkrevd",
                min: { value: 0, message: "Avkastning kan ikke være negativ" }
              })}
            />
            {errors.yield && (
              <p className="text-red-500 text-sm mt-1">{errors.yield.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image_url">Bilde URL</Label>
            <Input
              id="image_url"
              {...register("image_url")}
            />
          </div>

          <Button type="submit" className="w-full">
            Liste Eiendom
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ListeEiendom;