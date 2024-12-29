type PropertyImageProps = {
  imageUrl: string | null;
  propertyName: string;
};

export const PropertyImage = ({ imageUrl, propertyName }: PropertyImageProps) => {
  return (
    <div className="relative h-48 overflow-hidden">
      <img
        src={imageUrl || '/placeholder.svg'}
        alt={propertyName}
        className="w-full h-full object-cover"
      />
    </div>
  );
};