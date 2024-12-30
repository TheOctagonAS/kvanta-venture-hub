interface PropertyDetailsProps {
  name: string;
  location: string;
  pricePerToken: number;
  tokensSold: number;
  maxTokens: number;
}

export const PropertyDetails = ({
  name,
  location,
  pricePerToken,
  tokensSold,
  maxTokens,
}: PropertyDetailsProps) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{location}</p>
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Pris per token: {pricePerToken.toLocaleString()} NOK
        </p>
        <p className="text-sm text-gray-600">
          Tokens solgt: {tokensSold} / {maxTokens}
        </p>
      </div>
    </div>
  );
};