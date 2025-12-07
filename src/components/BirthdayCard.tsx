import { motion } from "framer-motion";
import { Cake, Star, Crown, Rocket, Zap, TreePine, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type BirthdayTheme = "rockstar" | "princess" | "space" | "superhero" | "safari" | "unicorn";

interface Kid {
  id: string;
  kid_name: string;
  date_of_birth: string;
  photo_base64: string;
  theme_id?: BirthdayTheme;
  cartoon_id?: string;
  generated_video_url?: string;
}

interface BirthdayCardProps {
  kid: Kid;
  displayCounter?: number;
  isActive?: boolean;
  index?: number;
}

export const themeConfig = {
  rockstar: {
    gradient: "gradient-rockstar",
    icon: Zap,
    label: "Rock Star",
    textColor: "text-primary-foreground",
    decorations: ["⚡", "🎸", "🤘", "🔥"],
    bgImage: "/backgrounds/bg-rockstar.jpg",
    overlayColor: "from-orange-500/70 via-red-500/60 to-yellow-500/70",
  },
  princess: {
    gradient: "gradient-princess",
    icon: Crown,
    label: "Princess",
    textColor: "text-party-purple",
    decorations: ["👑", "💖", "✨", "🦋"],
    bgImage: "/backgrounds/bg-princess.jpg",
    overlayColor: "from-pink-400/70 via-purple-400/60 to-pink-300/70",
  },
  space: {
    gradient: "gradient-space",
    icon: Rocket,
    label: "Space Explorer",
    textColor: "text-primary-foreground",
    decorations: ["🚀", "⭐", "🌙", "🛸"],
    bgImage: "/backgrounds/bg-rockstar.jpg",
    overlayColor: "from-indigo-600/70 via-purple-700/60 to-blue-800/70",
  },
  superhero: {
    gradient: "gradient-superhero",
    icon: Zap,
    label: "Superhero",
    textColor: "text-primary-foreground",
    decorations: ["💥", "⚡", "🦸", "🌟"],
    bgImage: "/backgrounds/bg-superhero.jpg",
    overlayColor: "from-red-500/70 via-blue-600/60 to-yellow-500/70",
  },
  safari: {
    gradient: "gradient-safari",
    icon: TreePine,
    label: "Safari",
    textColor: "text-primary-foreground",
    decorations: ["🦁", "🐘", "🌴", "🦒"],
    bgImage: "/backgrounds/bg-princess.jpg",
    overlayColor: "from-amber-500/70 via-green-500/60 to-orange-400/70",
  },
  unicorn: {
    gradient: "gradient-unicorn",
    icon: Sparkles,
    label: "Unicorn",
    textColor: "text-party-purple",
    decorations: ["🦄", "🌈", "⭐", "💜"],
    bgImage: "/backgrounds/bg-princess.jpg",
    overlayColor: "from-violet-400/70 via-pink-400/60 to-cyan-400/70",
  },
};

export function BirthdayCard({ kid, isActive = true, index = 0 }: BirthdayCardProps) {
  // Fallback to rockstar theme if theme_id is missing or invalid
  const theme = (kid.theme_id && themeConfig[kid.theme_id]) ? kid.theme_id : 'rockstar';
  const config = themeConfig[theme];
  const Icon = config.icon;
  const isEven = index % 2 === 0;

  const formattedDate = new Date(kid.date_of_birth).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative w-full h-full rounded-3xl overflow-hidden shadow-float`}
    >
      {/* Show fullscreen video if it exists */}
      {kid.generated_video_url ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video
            src={kid.generated_video_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <>



          {/* Floating decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ display: 'none' }}>
            {config.decorations.map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-20, -100],
                  x: [0, (i % 2 === 0 ? 20 : -20)],
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  left: `${15 + i * 20}%`,
                  bottom: "10%",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          {/* Main content - Split Layout */}
          <div className={`relative z-10 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-center h-full p-4 sm:p-6 md:p-10 gap-6 md:gap-12`}>

            {/* Left Side: Photo & Balloons */}
            <div className="relative flex-shrink-0">
              {/* Neon Ring & Photo */}
              <motion.div
                className="relative z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {/* Neon Ring */}
                <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${config.overlayColor} blur-md opacity-70 animate-pulse-neon`} />
                <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${config.overlayColor} opacity-100`} />

                <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  {kid.generated_video_url ? (
                    <video
                      src={kid.generated_video_url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={kid.photo_base64}
                      alt={`${kid.kid_name}'s birthday`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </motion.div>

              {/* Balloons around photo */}
              <motion.div
                className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 text-4xl sm:text-6xl z-20"
                animate={{ y: [-10, 10, -10], rotate: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🎈
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 text-4xl sm:text-6xl z-20"
                animate={{ y: [10, -10, 10], rotate: [10, -10, 10] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                🎈
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-8 sm:-right-12 text-3xl sm:text-5xl z-0"
                animate={{ x: [-5, 5, -5], rotate: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                🎈
              </motion.div>
            </div>

            {/* Right Side: Text Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">


              <h2 className="text-3xl sm:text-5xl md:text-7xl font-festive leading-tight text-gradient-gold drop-shadow-lg animate-pulse-neon mb-2">
                Happy<br className="hidden md:block" /> Birthday
              </h2>

              <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-gradient-silver drop-shadow-xl mb-4">
                {kid.kid_name}!
              </h1>

              <div className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-medium text-white/90 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Cake className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                <span className="drop-shadow-md">{formattedDate}</span>
              </div>
            </div>

            {/* Confetti overlay */}
            <div className="absolute inset-0 bg-confetti-pattern opacity-30 pointer-events-none" />
          </div>
        </>
      )}
    </motion.div>
  );
}