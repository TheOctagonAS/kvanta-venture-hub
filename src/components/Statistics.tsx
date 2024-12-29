import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Statistics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Statistikk & Prognoser
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500 py-8">
          Kommer snart: Detaljert statistikk og prognoser for din portefølje
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;