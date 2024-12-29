import { motion } from "framer-motion";
import { Sparkles, Infinity } from "lucide-react";

const TokenToMoneyAnimation = () => {
  return (
    <div className="flex justify-center items-center py-12 mt-8 border-t border-nordic-softblue">
      <div className="relative flex items-center gap-12">
        <motion.div
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="text-nordic-blue"
        >
          <Sparkles className="rotate-0 hover:rotate-12 transition-transform" size={36} />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="h-0.5 w-16 bg-gradient-to-r from-nordic-blue via-accent to-nordic-blue"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="text-accent"
        >
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Infinity size={36} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenToMoneyAnimation;