import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, TrendingUp, Calendar, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YieldCalculator = () => {
  const [amount, setAmount] = useState<string>("100000");
  const [yields, setYields] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    compoundedYearly: 0,
  });
  const [growthData, setGrowthData] = useState<Array<{
    day: number;
    standard: number;
    compound: number;
  }>>([]);

  const APY = 8.5;

  useEffect(() => {
    const investment = parseFloat(amount) || 0;
    const apyRate = APY / 100;
    const dailyRate = apyRate / 365;

    const dailyYield = (investment * apyRate) / 365;
    const monthlyYield = (investment * apyRate) / 12;
    const yearlyYield = investment * apyRate;

    const compoundedAmount = investment * Math.pow(1 + dailyRate, 365);
    const compoundedYearlyYield = compoundedAmount - investment;

    setYields({
      daily: dailyYield,
      monthly: monthlyYield,
      yearly: yearlyYield,
      compoundedYearly: compoundedYearlyYield,
    });

    // Calculate growth data for the chart
    const data = [];
    for (let day = 0; day <= 30; day++) {
      const standardGrowth = investment + (dailyYield * day);
      const compoundGrowth = investment * Math.pow(1 + dailyRate, day);
      data.push({
        day,
        standard: standardGrowth,
        compound: compoundGrowth,
      });
    }
    setGrowthData(data);
  }, [amount]);

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0].toString());
  };

  return (
    <div className="bg-[#f8fbff] p-6 rounded-lg">
      <Card className="bg-white shadow-sm">
        <CardHeader className="space-y-1 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6 text-nordic-blue" />
            Kalkulator: Hva kan du tjene?
          </CardTitle>
          <p className="text-base text-gray-600">
            Juster beløpet nedenfor for å se et omtrentlig estimat basert på historisk leieavkastning og verdistigning.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Investeringsbeløp (NOK)
              </label>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-lg font-medium"
                />
                <div className="w-full">
                  <Slider
                    defaultValue={[100000]}
                    max={5000000}
                    step={1000}
                    value={[parseFloat(amount) || 0]}
                    onValueChange={handleSliderChange}
                    className="[&>.relative>.absolute]:bg-nordic-blue [&>.relative]:bg-nordic-softblue [&>.block]:border-nordic-blue [&>.block]:bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-nordic-softblue rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Estimert årlig avkastning: <span className="font-semibold">{APY}%</span>
                  <br />
                  <span className="text-xs">
                    (4.5% gjennomsnittlig leieavkastning + 4% historisk verdistigning)
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Dette estimatet er basert på historisk gjennomsnittlig avkastning fra næringseiendom i Norge de siste 10 årene. 
                  Merk at historisk avkastning ikke er en garanti for fremtidig avkastning. Verdien av investeringen kan både øke og synke, 
                  og du kan tape deler av eller hele det investerte beløpet.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-nordic-blue" />
                <p className="text-sm text-gray-600">Daglig avkastning</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-nordic-blue">
                  {yields.daily.toLocaleString('nb-NO', { 
                    style: 'currency', 
                    currency: 'NOK',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
            <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-nordic-blue" />
                <p className="text-sm text-gray-600">Månedlig avkastning</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-nordic-blue">
                  {yields.monthly.toLocaleString('nb-NO', { 
                    style: 'currency', 
                    currency: 'NOK',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
            <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-nordic-blue" />
                <p className="text-sm text-gray-600">Årlig avkastning</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-nordic-blue">
                  {yields.yearly.toLocaleString('nb-NO', { 
                    style: 'currency', 
                    currency: 'NOK',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
                <p className="text-xs text-gray-600 mt-2">Uten reinvestering</p>
              </div>
            </div>
            <div className="bg-nordic-softblue p-6 rounded-lg flex flex-col justify-between h-full border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-nordic-blue" />
                <p className="text-sm text-gray-600">Årlig avkastning med reinvestering</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-nordic-blue">
                  {yields.compoundedYearly.toLocaleString('nb-NO', { 
                    style: 'currency', 
                    currency: 'NOK',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
                <p className="text-xs text-gray-600 mt-2">Med daglig reinvestering</p>
              </div>
            </div>
          </div>

          {/* Growth Simulation Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Simulert vekst over tid</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <XAxis 
                    dataKey="day" 
                    label={{ value: 'Dager', position: 'bottom' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('nb-NO', {
                        style: 'currency',
                        currency: 'NOK',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value: number) => 
                      new Intl.NumberFormat('nb-NO', {
                        style: 'currency',
                        currency: 'NOK',
                        maximumFractionDigits: 0
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="standard" 
                    stroke="#345FF6" 
                    name="Uten reinvestering"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="compound" 
                    stroke="#47C757" 
                    name="Med reinvestering"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldCalculator;