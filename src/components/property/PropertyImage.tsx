interface PropertyImageProps {
  imageUrl: string | null;
  name: string;
}

export const PropertyImage = ({ imageUrl, name }: PropertyImageProps) => {
  return (
    <div className="relative aspect-[16/9]">
      <img
        src={imageUrl || '/placeholder.svg'}
        alt={name}
        className="object-cover w-full h-full"
      />
    </div>
  );
};