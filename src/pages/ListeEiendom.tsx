import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ListeEiendom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    estimatedValue: "",
    maxTokens: "",
    pricePerToken: "",
    yield: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Du må være logget inn");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("properties").insert({
        name: formData.name,
        location: formData.location,
        price_per_token: parseFloat(formData.pricePerToken),
        yield: parseFloat(formData.yield),
        max_tokens: parseInt(formData.maxTokens),
        tokens_sold: 0,
        status: "Coming Soon",
        image_url: formData.imageUrl,
        owner_id: user.id,
      });

      if (error) throw error;

      toast.success("Eiendom opprettet!");
      navigate("/minside");
    } catch (error: any) {
      console.error("Error creating property:", error);
      toast.error(error.message || "Kunne ikke opprette eiendom");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Registrer ny eiendom</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Eiendomsnavn</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Beliggenhet</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="estimatedValue">Verdianslag (NOK)</Label>
            <Input
              id="estimatedValue"
              name="estimatedValue"
              type="number"
              min="0"
              value={formData.estimatedValue}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="maxTokens">Antall tokens</Label>
            <Input
              id="maxTokens"
              name="maxTokens"
              type="number"
              min="1"
              value={formData.maxTokens}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="pricePerToken">Pris per token (NOK)</Label>
            <Input
              id="pricePerToken"
              name="pricePerToken"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerToken}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="yield">Forventet avkastning (%)</Label>
            <Input
              id="yield"
              name="yield"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.yield}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Bildelink</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Lagrer..." : "Lagre"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ListeEiendom;