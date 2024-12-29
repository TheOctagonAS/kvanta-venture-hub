import { motion } from "framer-motion";
import { Coins, Banknote } from "lucide-react";

const TokenToMoneyAnimation = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative flex items-center gap-8">
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-nordic-blue"
        >
          <Coins size={32} />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="h-0.5 w-12 bg-gradient-to-r from-nordic-blue to-accent"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-accent"
        >
          <Banknote size={32} />
        </motion.div>
      </div>
    </div>
  );
};

export default TokenToMoneyAnimation;