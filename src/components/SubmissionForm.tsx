import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Upload, Loader2, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { generateBirthdayVideoWithCartoon } from "@/services/pixverseApi";
import { toast } from "sonner";

const formSchema = z.object({
  kidName: z.string().min(2, "Name must be at least 2 characters").max(50),
  parentEmail: z.string().email("Please enter a valid email"),
  dateOfBirth: z.string().min(1, "Please select a date"),
  cartoonFriend: z.string().min(1, "Please select a cartoon friend"),
});

type FormData = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  onSuccess?: () => void;
}

export function SubmissionForm({ onSuccess }: SubmissionFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCartoon, setSelectedCartoon] = useState<string>("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!photoPreview) {
      toast.error("Please upload a photo");
      return;
    }


    setIsSubmitting(true);
    let generatedVideoUrl: string | null = null;

    try {
      // Step 1: Generate AI video with cartoon character
      setIsGeneratingVideo(true);
      toast.info("Generating birthday video... ✨", {
        description: "This may take 30-60 seconds",
      });

      try {
        // Get cartoon name for prompt
        const cartoonNames: { [key: string]: string } = {
          'mottu-patlu': 'Motu Patlu',
          'little-krishna': 'Little Krishna',
          'doremon': 'Doraemon',
          'shinchan': 'Shinchan',
          'rudra': 'Rudra',
          'chotta-bheem': 'Chotta Bheem'
        };

        const cartoonName = cartoonNames[selectedCartoon] || selectedCartoon;

        // Generate video with ONLY person photo - AI will create cartoon from prompt
        generatedVideoUrl = await generateBirthdayVideoWithCartoon(
          photoPreview,
          null, // No cartoon image - AI generates from prompt
          data.kidName,
          cartoonName,
          data.dateOfBirth, // include date text to show in video
          (progress) => setVideoProgress(progress)
        );

        console.log("🎥 Video generated successfully:", generatedVideoUrl);
        toast.success("Video generated successfully! 🎥");
      } catch (videoError) {
        console.error("Video generation error:", videoError);
        toast.error("Video generation failed. Saving submission without video.");
      } finally {
        setIsGeneratingVideo(false);
      }

      // Step 2: Auto-approve and add directly to stream (approved_kids table)
      try {
        // Insert directly into approved_kids for immediate streaming
        const { error: approvedInsertError } = await supabase
          .from("approved_kids")
          .insert({
            kid_name: data.kidName,
            date_of_birth: data.dateOfBirth,
            photo_base64: photoPreview,
            cartoon_id: selectedCartoon,
            generated_video_url: generatedVideoUrl,
          });

        // If error is due to missing columns, save to localStorage for local testing
        if (approvedInsertError?.code === 'PGRST204' || approvedInsertError?.code === '42703') {
          console.warn("⚠️ Database columns missing. Saving to localStorage for local testing...");

          // Save to localStorage for immediate local streaming
          const localBirthday = {
            id: `local-${Date.now()}`,
            kid_name: data.kidName,
            date_of_birth: data.dateOfBirth,
            photo_base64: photoPreview,
            theme_id: 'rockstar',
            cartoon_id: selectedCartoon,
            generated_video_url: generatedVideoUrl,
            approved_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          };

          // Get existing local birthdays
          const existingData = localStorage.getItem('local_generated_birthdays');
          const localBirthdays = existingData ? JSON.parse(existingData) : [];

          // Add new birthday
          localBirthdays.push(localBirthday);

          // Save back to localStorage
          localStorage.setItem('local_generated_birthdays', JSON.stringify(localBirthdays));

          console.log("✅ Birthday saved to localStorage for local testing");
          console.log("📦 Local birthdays:", localBirthdays);

          toast.success("Birthday added to stream! 🎉", {
            description: "Streaming now! (Using local storage for testing)",
          });
        } else if (approvedInsertError) {
          throw approvedInsertError;
        } else {
          console.log("✅ Birthday added to stream with video!");
          toast.success("Birthday added to stream! 🎉", {
            description: "Your birthday video is now live!",
          });
        }

        reset();
        setPhotoPreview(null);
        setSelectedCartoon("");
        setVideoProgress(0);
        setIsGeneratingVideo(false);
        onSuccess?.();
      } catch (dbError: any) {
        console.error("Submission error:", dbError);

        // Final fallback: Save to localStorage if DB completely fails
        if (data.kidName && data.dateOfBirth && photoPreview) {
          const fallbackBirthday = {
            id: `local-${Date.now()}`,
            kid_name: data.kidName,
            date_of_birth: new Date(data.dateOfBirth).toISOString(),
            photo_base64: photoPreview,
            theme_id: 'rockstar',
            approved_at: new Date().toISOString()
          };
          const existing = JSON.parse(localStorage.getItem('local_generated_birthdays') || '[]');
          localStorage.setItem('local_generated_birthdays', JSON.stringify([fallbackBirthday, ...existing]));
          toast.success("Birthday saved locally! (Database offline)");
          reset();
          setPhotoPreview(null);

          onSuccess?.();
        } else {
          toast.error(`Failed to submit: ${dbError.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("General error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="text-base font-display">Photo</Label>
        <div
          className="relative aspect-square max-w-xs mx-auto rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors cursor-pointer overflow-hidden bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="w-12 h-12 mb-2 text-primary/50" />
              <p className="text-sm font-medium">Click to upload photo</p>
              <p className="text-xs opacity-70">Max 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        {photoPreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setPhotoPreview(null)}
          >
            Remove photo
          </Button>
        )}
      </div>

      {/* Choose a Cartoon Friend */}
      <div className="space-y-2">
        <Label htmlFor="cartoonFriend" className="text-base font-display">
          Choose a Cartoon Friend
        </Label>
        <Select
          value={selectedCartoon}
          onValueChange={(value) => {
            setSelectedCartoon(value);
            // Update form value for validation
            setValue("cartoonFriend", value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a cartoon character" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mottu-patlu">Mottu Patlu</SelectItem>
            <SelectItem value="little-krishna">Little Krishna</SelectItem>
            <SelectItem value="doremon">Doremon</SelectItem>
            <SelectItem value="shinchan">Shinchan</SelectItem>
            <SelectItem value="rudra">Rudra</SelectItem>
            <SelectItem value="chotta-bheem">Chotta Bheem</SelectItem>
          </SelectContent>
        </Select>
        {errors.cartoonFriend && (
          <p className="text-sm text-destructive">{errors.cartoonFriend.message}</p>
        )}
      </div>

      {/* Kid's Name */}
      <div className="space-y-2">
        <Label htmlFor="kidName" className="text-base font-display">
          Kid's Name
        </Label>
        <Input
          id="kidName"
          placeholder="Enter the birthday star's name"
          {...register("kidName")}
        />
        {errors.kidName && (
          <p className="text-sm text-destructive">{errors.kidName.message}</p>
        )}
      </div>

      {/* Parent's Email */}
      <div className="space-y-2">
        <Label htmlFor="parentEmail" className="text-base font-display">
          Parent's Email
        </Label>
        <Input
          id="parentEmail"
          type="email"
          placeholder="your@email.com"
          {...register("parentEmail")}
        />
        {errors.parentEmail && (
          <p className="text-sm text-destructive">{errors.parentEmail.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="text-base font-display">
          Birthday
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
        )}
      </div>

      {/* Video Generation Progress */}
      {isGeneratingVideo && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm font-medium">Generating birthday video...</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {videoProgress}% complete
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="party"
        size="xl"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <PartyPopper className="w-5 h-5" />
            Submit Birthday
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </Button>


    </form>
  );
}