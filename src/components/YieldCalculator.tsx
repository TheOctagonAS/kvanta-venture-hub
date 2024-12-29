import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Calendar, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const YieldCalculator = () => {
  const [amount, setAmount] = useState<string>("100000");
  const [apy, setApy] = useState<string>("5");
  const [yields, setYields] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });

  useEffect(() => {
    const investment = parseFloat(amount) || 0;
    const apyRate = parseFloat(apy) / 100;

    setYields({
      daily: (investment * apyRate) / 365,
      monthly: (investment * apyRate) / 12,
      yearly: investment * apyRate,
    });
  }, [amount, apy]);

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString());
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="space-y-1 border-b border-gray-100 bg-nordic-lightgray">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6 text-nordic-blue" />
          Se potensielt daglig/månedlig/årlig avkastning
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6">
        <div className="grid gap-4">
          <div className="space-y-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Investeringsbeløp (NOK)
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-lg font-medium"
              />
            </div>
            <Slider
              defaultValue={[100000]}
              max={1000000}
              step={1000}
              value={[parseFloat(amount) || 0]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Estimert APY
            </label>
            <Select value={apy} onValueChange={setApy}>
              <SelectTrigger className="w-full bg-white border border-gray-200 hover:border-nordic-blue transition-colors">
                <SelectValue placeholder="Velg APY" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="5" className="hover:bg-nordic-softblue cursor-pointer py-3 px-4">
                  5%
                </SelectItem>
                <SelectItem value="8" className="hover:bg-nordic-softblue cursor-pointer py-3 px-4">
                  8%
                </SelectItem>
                <SelectItem value="10" className="hover:bg-nordic-softblue cursor-pointer py-3 px-4">
                  10%
                </SelectItem>
                <SelectItem value="12" className="hover:bg-nordic-softblue cursor-pointer py-3 px-4">
                  12%
                </SelectItem>
                <SelectItem value="15" className="hover:bg-nordic-softblue cursor-pointer py-3 px-4">
                  15%
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Daglig avkastning</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.daily.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Månedlig avkastning</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.monthly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-nordic-softblue p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-nordic-blue" />
              <p className="text-sm text-gray-600">Årlig avkastning</p>
            </div>
            <p className="text-2xl font-bold text-nordic-blue">
              {yields.yearly.toLocaleString('nb-NO', { 
                style: 'currency', 
                currency: 'NOK',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YieldCalculator;