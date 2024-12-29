import { motion } from "framer-motion";
import { Sparkles, Infinity } from "lucide-react";

const TokenToMoneyAnimation = () => {
  return (
    <div className="flex justify-center items-center py-12 mt-8 border-t border-nordic-softblue">
      <div className="relative flex items-center gap-12">
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="text-nordic-blue"
        >
          <motion.div
            whileHover={{ rotate: 12 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles size={36} />
          </motion.div>
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
          initial={{ scale: 0.8 }}
          animate={{
            scale: [0.8, 1.1, 0.8],
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
            animate={{ rotate: 360 }}
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