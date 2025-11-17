import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function FindingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen  text-yellow-400 font-[Baloo Bhai 2] relative overflow-hidden">
      
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className=""
      >
        <Search size={60} className="text-yellow-400 drop-shadow-xl" />
      </motion.div>

      {/* Animated Searching Text */}
      <motion.h1 className="text-xl sm:text-4xl font-bold tracking-widest text-center">
        <motion.span
          animate={{
            opacity: [1, 0.3, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
        </motion.span>
      </motion.h1>

      {/* Subtle rotating background circles for depth */}
      <motion.div
        className="absolute rounded-full border-dashed border-4 border-yellow-400/40 w-64 h-64"
        animate={{
          rotate: 180,
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full border-4 border-dashed border-yellow-400/60 w-80 h-80"
        animate={{
          rotate: -180,
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
