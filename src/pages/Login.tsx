import { motion } from "framer-motion";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#1C1C1C] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#25262B] p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-white">
            Registrer deg med Vipps
          </h1>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;