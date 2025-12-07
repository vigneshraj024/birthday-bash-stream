import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Sparkles, Video } from "lucide-react";
import { BirthdayCard, BirthdayTheme } from "./BirthdayCard";
import { DateTabs } from "./DateTabs";
import { VideoGenerator } from "./VideoGenerator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Playlist of all birthday music tracks - plays continuously in loop
const MUSIC_PLAYLIST = [
  "/audio/birthday-1.mp3",
  "/audio/birthday-2.mp3",
  "/audio/birthday-3.mp3",
  "/audio/birthday-4.mp3",
  "/audio/birthday-bollywood.mp3",
  "/audio/birthday_bum.mp3",
];

interface ApprovedKid {
  id: string;
  kid_name: string;
  date_of_birth: string;
  photo_base64: string;
  theme_id: BirthdayTheme;
  cartoon_id?: string;
  generated_video_url?: string;
}

interface BirthdayStreamProps {
  approvedKids: ApprovedKid[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showDateTabs?: boolean;
}

export function BirthdayStream({ approvedKids, selectedDate, onDateSelect, showDateTabs = false }: BirthdayStreamProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Sound enabled by default
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);

  // Track total number of displays for continuous alternating pattern
  const [displayCounter, setDisplayCounter] = useState(0);

  // Generated video state
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);

  // Filter kids by selected date (MM-DD) AND only show those with generated videos
  const filteredKids = approvedKids
    .filter(kid => {
      const kidDate = format(new Date(kid.date_of_birth), "MM-dd");
      const selectedDateStr = format(selectedDate, "MM-dd");
      const hasGeneratedVideo = kid.generated_video_url && kid.generated_video_url.trim() !== '';
      // Only show birthdays that match the date AND have a generated video
      return kidDate === selectedDateStr && hasGeneratedVideo;
    })
    .slice(0, 25); // Limit to 25 per day

  const currentKid = filteredKids[currentIndex];



  // Initialize playlist audio - single instance throughout component lifecycle
  useEffect(() => {
    const playNextTrack = () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % MUSIC_PLAYLIST.length;
      if (audioRef.current) {
        audioRef.current.src = MUSIC_PLAYLIST[trackIndexRef.current];
        audioRef.current.play().catch(console.error);
      }
    };

    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_PLAYLIST[0]);
      audioRef.current.volume = 0.5;
      audioRef.current.addEventListener('ended', playNextTrack);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', playNextTrack);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Control audio based on whether there are kids to show
  useEffect(() => {
    if (!audioRef.current) return;

    if (filteredKids.length > 0 && !isMuted) {
      // Play audio when there are birthdays
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay - will play on user interaction
      });
    } else {
      // Stop audio when no birthdays for this date
      audioRef.current.pause();
    }
  }, [filteredKids.length, selectedDate, isMuted]);

  // Toggle audio - called directly from button click for better browser support
  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  }, [isMuted]);

  // Calculate kid counts per day for tabs - only count those with generated videos
  const kidCounts = approvedKids
    .filter(kid => kid.generated_video_url && kid.generated_video_url.trim() !== '')
    .reduce((acc, kid) => {
      const dateKey = format(new Date(kid.date_of_birth), "MM-dd");
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || filteredKids.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredKids.length);
      setDisplayCounter(prev => prev + 1);
    }, 10000); // 10 seconds per slide (longer for video appreciation)

    return () => clearInterval(interval);
  }, [isPlaying, filteredKids.length]);

  // Reset index when date changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedDate]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev =>
      prev === 0 ? filteredKids.length - 1 : prev - 1
    );
    setDisplayCounter(prev => prev + 1);
  }, [filteredKids.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev =>
      (prev + 1) % filteredKids.length
    );
    setDisplayCounter(prev => prev + 1);
  }, [filteredKids.length]);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-0">
      {/* Main Banner - Square on mobile, 16:9 on larger screens */}
      <div className="relative aspect-[3/4] sm:aspect-video bg-muted rounded-2xl sm:rounded-3xl overflow-hidden shadow-float">
        {filteredKids.length > 0 && currentKid ? (
          <>
            {/* Birthday Card Display */}
            <BirthdayCard
              kid={currentKid}
              displayCounter={displayCounter}
            />


            {/* Progress dots only inside banner */}
            {filteredKids.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {filteredKids.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${index === currentIndex
                      ? "bg-card w-4 sm:w-6"
                      : "bg-card/50 hover:bg-card/70"
                      }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <span className="text-4xl sm:text-6xl mb-2 sm:mb-4">🎂</span>
            <p className="text-base sm:text-lg font-display">No birthdays for this day</p>
            <p className="text-xs sm:text-sm opacity-70">Check another date!</p>
          </div>
        )}
      </div>

      {/* Controls Bar - Outside banner for easy tapping */}
      {filteredKids.length > 0 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
            onClick={handlePrevious}
            disabled={filteredKids.length <= 1}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
            onClick={toggleAudio}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
            onClick={handleNext}
            disabled={filteredKids.length <= 1}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      )}



      {/* Date Tabs - Only show if controlled internally */}
      {showDateTabs && (
        <DateTabs
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          kidCounts={kidCounts}
        />
      )}
    </div>
  );
}

// Export kid counts calculation for parent use - only count those with generated videos
export function calculateKidCounts(approvedKids: { date_of_birth: string; generated_video_url?: string }[]) {
  return approvedKids
    .filter(kid => kid.generated_video_url && kid.generated_video_url.trim() !== '')
    .reduce((acc, kid) => {
      const dateKey = format(new Date(kid.date_of_birth), "MM-dd");
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
}
