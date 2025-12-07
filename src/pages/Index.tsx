import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PartyPopper, Send, Shield, Sparkles, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BirthdayStream, calculateKidCounts } from "@/components/BirthdayStream";
import { DateTabs } from "@/components/DateTabs";
import { Confetti } from "@/components/Confetti";
import { FloatingDecorations } from "@/components/FloatingDecorations";
import { supabase } from "@/integrations/supabase/client";
import type { BirthdayTheme } from "@/components/BirthdayCard";

interface ApprovedKid {
  id: string;
  kid_name: string;
  date_of_birth: string;
  photo_base64: string;
  theme_id: BirthdayTheme;
  cartoon_id?: string;
  generated_video_url?: string;
}

const Index = () => {
  const [approvedKids, setApprovedKids] = useState<ApprovedKid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Initial fetch
    const fetchApprovedKids = async () => {
      const { data, error } = await supabase
        .from("approved_kids")
        .select("*")
        .order("approved_at", { ascending: false });

      let kids: ApprovedKid[] = [];

      if (error) {
        console.error("Error fetching approved kids:", error);
      } else {
        // map data to ensure theme_id exists (migration fallback)
        kids = (data || []).map((kid: any) => ({
          ...kid,
          theme_id: kid.theme_id || 'rockstar',
          cartoon_id: kid.cartoon_id || null,
          generated_video_url: kid.generated_video_url || null
        })) as ApprovedKid[];
      }

      // Merge with local generated birthdays (for preview without DB migration)
      try {
        const localData = localStorage.getItem('local_generated_birthdays');
        console.log("📦 Raw localStorage data:", localData);

        const localBirthdays = JSON.parse(localData || '[]');
        console.log("📥 Parsed local birthdays:", localBirthdays);

        if (localBirthdays.length > 0) {
          console.log("🔄 Merging local birthdays with Supabase data...");
          // Add local ones at the beginning
          kids = [...localBirthdays, ...kids];
        } else {
          console.log("⚠️ No local birthdays found in storage");
        }
      } catch (e) {
        console.error("❌ Error loading local birthdays:", e);
      }

      console.log("📋 Final approved kids list:", kids);
      setApprovedKids(kids);
      setIsLoading(false);
    };

    fetchApprovedKids();

    // Set up real-time subscription
    const channel = supabase
      .channel("approved_kids_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "approved_kids",
        },
        () => {
          // Refetch on any change
          fetchApprovedKids();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const kidCounts = calculateKidCounts(approvedKids);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
      {/* Background decorations */}
      <FloatingDecorations />
      <Confetti />

      {/* Header with JioStar Logo */}
      <header className="relative z-10 py-3 md:py-4 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="gaming-card flex items-center justify-between px-4 md:px-6 py-2 md:py-3 animate-pulse-neon">
            <div className="flex items-center gap-3 md:gap-4">
              <img
                src="/logos/jiostar-logo.png"
                alt="JioStar"
                className="h-10 md:h-14 w-auto object-contain drop-shadow-[0_0_10px_hsl(185_100%_50%/0.3)]"
              />
              <div className="hidden sm:block border-l border-primary/30 pl-3 md:pl-4">
                <h1 className="text-base md:text-xl font-display font-bold text-gradient-gaming tracking-wider">
                  BIRTHDAY STREAM
                </h1>
                <p className="text-xs text-muted-foreground">
                  🎮 Level up your celebration!
                </p>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3">
              <Button variant="outline" size="sm" className="border-primary/30 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-all" asChild>
                <Link to="/admin">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="hidden sm:inline ml-1">Admin</span>
                </Link>
              </Button>
              <Button variant="default" size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground glow-primary hover:opacity-90" asChild>
                <Link to="/submit">
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Submit</span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-6 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Compact Title */}
          <motion.div
            className="text-center py-4 md:py-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold inline-flex items-center gap-2 tracking-wider">
              <span className="text-gradient-gaming">TODAY'S BIRTHDAY STARS</span>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="drop-shadow-[0_0_10px_hsl(45_100%_55%/0.8)]"
              >
                🏆
              </motion.span>
            </h2>
          </motion.div>

          {/* Date Tabs - Above Banner for visibility */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-4"
          >
            <DateTabs
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              kidCounts={kidCounts}
            />
          </motion.div>

          {/* Birthday Stream Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-transparent border-t-primary border-r-secondary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ boxShadow: "0 0 30px hsl(185 100% 50% / 0.4)" }}
                />
                <p className="text-muted-foreground mt-4 font-display tracking-wide">LOADING...</p>
              </div>
            ) : (
              <BirthdayStream
                approvedKids={approvedKids}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.section
            className="mt-8 md:mt-12 text-center px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="gaming-card relative p-5 md:p-8 max-w-2xl mx-auto overflow-hidden">
              {/* Neon corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-neon-pink/50 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/50 rounded-br-xl" />

              {/* Glow effects */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />

              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-5xl mb-3 block drop-shadow-[0_0_20px_hsl(45_100%_55%/0.6)]"
                >
                  🎁
                </motion.div>

                <h3 className="text-lg md:text-2xl font-display font-bold mb-2 text-gradient-gold tracking-wide">
                  UNLOCK YOUR BIRTHDAY CELEBRATION!
                </h3>

                <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-md mx-auto">
                  Submit your photo and get featured in our epic birthday stream!
                  Choose from awesome themes like <span className="text-primary font-semibold">Rockstar</span>,
                  <span className="text-secondary font-semibold"> Princess</span>, and more!
                </p>

                <Button
                  size="lg"
                  className="text-sm md:text-base px-5 md:px-6 py-4 md:py-5 bg-gradient-to-r from-primary via-secondary to-neon-pink text-primary-foreground font-display tracking-wide glow-primary hover:scale-105 transition-all"
                  asChild
                >
                  <Link to="/submit">
                    <PartyPopper className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    START NOW
                  </Link>
                </Button>

                {/* Stats badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 mt-5 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                    <Heart className="w-3 h-3 text-neon-pink" />
                    <span className="text-foreground">Made with love</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span className="text-foreground">6 Themes</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30">
                    <Star className="w-3 h-3 text-secondary" />
                    <span className="text-foreground">Free</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer with Xangam Group */}
      <footer className="relative z-10 py-4 md:py-6 border-t border-border/30 bg-card/20 backdrop-blur-sm mt-auto">
        <motion.div
          className="flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs md:text-sm text-muted-foreground font-display tracking-wide">POWERED BY</p>
          <a
            href="https://xangamgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity group"
          >
            <img
              src="/logos/xangam-logo.png"
              alt="Xangam Group"
              className="h-8 md:h-10 w-auto object-contain group-hover:drop-shadow-[0_0_10px_hsl(185_100%_50%/0.4)] transition-all"
            />
          </a>
        </motion.div>
      </footer>
    </div>
  );
};

export default Index;
