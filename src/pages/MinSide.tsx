import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const MinSide = () => {
  const { user, login, startKYC, addRentIncome } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    toast.success("Innlogging vellykket!");
  };

  const handleStartKYC = () => {
    startKYC();
    toast.success("KYC-verifisering fullført!");
  };

  const handleSimulateRent = () => {
    if (user) {
      const totalTokens = user.ownedProperties.reduce(
        (sum, property) => sum + property.tokenCount,
        0
      );
      const dailyRent = totalTokens * 0.5;
      addRentIncome(dailyRent);
      toast.success(`Du mottok ${dailyRent} kr i daglig leie`);
    }
  };

  // Mock token price for value calculation
  const TOKEN_PRICE = 1000; // NOK

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {!user ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Logg inn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      E-post
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="din@epost.no"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Passord
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Logg inn
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Velkommen, {user.email}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      KYC Status:{" "}
                      <span
                        className={`font-semibold ${
                          user.isKYC ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {user.isKYC ? "Verifisert" : "Ikke verifisert"}
                      </span>
                    </p>
                    <p className="text-gray-700 mt-2">
                      Total opptjent leie: {user.accumulatedRent || 0} kr
                    </p>
                  </div>

                  {!user.isKYC && (
                    <Button onClick={handleStartKYC} className="w-full">
                      Start KYC
                    </Button>
                  )}

                  {user.isKYC && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-green-600 font-semibold"
                    >
                      KYC bekreftet!
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Mine eierandeler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.ownedProperties.length > 0 ? (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Eiendom</TableHead>
                            <TableHead className="text-right">Antall tokens</TableHead>
                            <TableHead className="text-right">Verdi (NOK)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.ownedProperties.map((property) => (
                            <TableRow key={property.id}>
                              <TableCell className="font-medium">
                                {property.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {property.tokenCount}
                              </TableCell>
                              <TableCell className="text-right">
                                {(property.tokenCount * TOKEN_PRICE).toLocaleString()} NOK
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-end mt-4">
                        <Button onClick={handleSimulateRent} variant="outline">
                          Simuler daglig leieinntekt
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Du eier ingen tokens ennå
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MinSide;