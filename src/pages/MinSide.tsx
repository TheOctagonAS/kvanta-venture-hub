import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

const MinSide = () => {
  const { user, startKYC, addRentIncome, logout } = useAuth();
  const navigate = useNavigate();
  const [isKyc, setIsKyc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Create new profile if it doesn't exist
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{ id: user.id, is_kyc: false }]);

          if (createError) throw createError;
          setIsKyc(false);
        } else {
          setIsKyc(profile.is_kyc);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Kunne ikke hente profil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleStartKYC = async () => {
    if (!user || !isSupabaseConfigured()) {
      toast.error('Kunne ikke starte KYC-prosessen');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_kyc: true })
        .eq('id', user.id);

      if (error) throw error;

      setIsKyc(true);
      startKYC();
      toast.success("KYC-verifisering fullført!");
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error('Kunne ikke oppdatere KYC-status');
    }
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

  const handleLogout = () => {
    logout();
    toast.success("Du er nå logget ut");
    navigate("/");
  };

  // Mock token price for value calculation
  const TOKEN_PRICE = 1000; // NOK

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Laster...</div>
      </div>
    );
  }

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
            <LoginForm />
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Velkommen, {user.email}
                  </CardTitle>
                  <Button onClick={handleLogout} variant="outline">
                    Logg ut
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      KYC Status:{" "}
                      <span
                        className={`font-semibold ${
                          isKyc ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {isKyc ? "Verifisert" : "Ikke verifisert"}
                      </span>
                    </p>
                    <p className="text-gray-700 mt-2">
                      Total opptjent leie: {user.accumulatedRent || 0} kr
                    </p>
                  </div>

                  {!isKyc && (
                    <Button onClick={handleStartKYC} className="w-full">
                      Fullfør KYC
                    </Button>
                  )}

                  {isKyc && (
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