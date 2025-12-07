import { motion } from "framer-motion";

const decorations = [
  { emoji: "🎮", x: "5%", delay: 0 },
  { emoji: "⭐", x: "15%", delay: 0.5 },
  { emoji: "🎉", x: "25%", delay: 1 },
  { emoji: "🎂", x: "35%", delay: 1.5 },
  { emoji: "🌟", x: "45%", delay: 0.3 },
  { emoji: "🎁", x: "55%", delay: 0.8 },
  { emoji: "🏆", x: "65%", delay: 1.2 },
  { emoji: "✨", x: "75%", delay: 0.6 },
  { emoji: "🎈", x: "85%", delay: 1.4 },
  { emoji: "🦄", x: "95%", delay: 0.2 },
];

export const FloatingDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating emojis */}
      {decorations.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl md:text-3xl opacity-30"
          style={{ left: item.x }}
          initial={{ y: "100vh", rotate: 0 }}
          animate={{
            y: "-100px",
            rotate: 360,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
      
      {/* Neon glowing orbs */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-neon-cyan/10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-40 right-10 w-80 h-80 rounded-full bg-neon-purple/10 blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15] 
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-neon-pink/10 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-30" />
      
      {/* Scan line effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(transparent 0%, hsl(185 100% 50% / 0.03) 50%, transparent 100%)",
          backgroundSize: "100% 4px",
        }}
        animate={{ backgroundPositionY: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};