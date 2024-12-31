import { MapPin } from "lucide-react";

interface PropertyHeaderProps {
  name: string;
  location: string;
}

export const PropertyHeader = ({ name, location }: PropertyHeaderProps) => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nordic-charcoal mb-2">
        {name}
      </h1>
      <div className="flex items-center text-gray-600 mb-6">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{location}</span>
      </div>
    </div>
  );
};