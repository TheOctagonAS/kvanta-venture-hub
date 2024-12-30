import { Property } from "@/types/property";
import { Building2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PropertyPreviewProps {
  property: Property;
}

export const PropertyPreview = ({ property }: PropertyPreviewProps) => {
  return (
    <Card className="overflow-hidden bg-white shadow-sm">
      <div className="relative aspect-video w-full">
        <img
          src={property.image_url || '/placeholder.svg'}
          alt={property.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Building2 className="h-3.5 w-3.5 mr-2" />
            <span>{property.property_type}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Forventet leieavkastning</span>
            <span className="font-semibold text-accent">{property.yield}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tilgjengelige tokens</span>
            <span className="font-semibold">
              {property.max_tokens - property.tokens_sold} / {property.max_tokens}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};