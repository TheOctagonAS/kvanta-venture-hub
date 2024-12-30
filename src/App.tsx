import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Eiendommer from "./pages/Eiendommer";
import MinSide from "./pages/MinSide";
import LesMer from "./pages/LesMer";
import Lommebok from "./pages/Lommebok";
import KYC from "./pages/KYC";
import PropertyDetail from "./pages/PropertyDetail";
import OrderPage from "./pages/OrderPage";
import LeieOgAvkastning from "./pages/LeieOgAvkastning";
import Skatt from "./pages/Skatt";
import VippsCallback from "./pages/VippsCallback";
import ListeEiendom from "./pages/ListeEiendom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/eiendommer" element={<Eiendommer />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/orders/buy" element={<OrderPage />} />
                <Route path="/minside" element={<MinSide />} />
                <Route path="/les-mer" element={<LesMer />} />
                <Route path="/lommebok" element={<Lommebok />} />
                <Route path="/kyc" element={<KYC />} />
                <Route path="/liste-eiendom" element={<ListeEiendom />} />
                <Route path="/leie-og-avkastning" element={<LeieOgAvkastning />} />
                <Route path="/skatt" element={<Skatt />} />
                <Route path="/auth/vipps/callback" element={<VippsCallback />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;