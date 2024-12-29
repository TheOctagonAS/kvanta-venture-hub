import { motion } from "framer-motion";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-nordic-softblue to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-nordic-charcoal tracking-heading">
            Velkommen til Kvanta.ai
          </h1>
          <p className="text-nordic-gray text-center mb-8">
            Tilgjengelig og trygg eiendomsinvestering for alle
          </p>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;