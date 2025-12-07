import { useState, useCallback } from 'react';
import { Upload, Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile, compressImage } from '@/utils/imageUtils';
import { generateAndWaitForVideo } from '@/services/pixverseApi';
import type { VideoGenerationState } from '@/types/pixverse';

interface VideoGeneratorProps {
    onVideoGenerated: (videoUrl: string) => void;
    className?: string;
}

export function VideoGenerator({ onVideoGenerated, className = '' }: VideoGeneratorProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [state, setState] = useState<VideoGenerationState>({
        isGenerating: false,
        progress: 0,
        videoUrl: null,
        error: null,
        taskId: null,
    });

    // Handle file selection
    const handleFileSelect = useCallback(async (file: File) => {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setState(prev => ({ ...prev, error: validation.error || 'Invalid file' }));
            return;
        }

        try {
            // Compress and convert to base64
            const base64 = await compressImage(file);
            setSelectedImage(base64);
            setState(prev => ({ ...prev, error: null }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Failed to process image. Please try again.'
            }));
        }
    }, []);

    // Handle drag and drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);

    // Handle file input change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    }, [handleFileSelect]);

    // Generate video
    const handleGenerateVideo = useCallback(async () => {
        if (!selectedImage) return;

        setState(prev => ({
            ...prev,
            isGenerating: true,
            progress: 0,
            error: null,
            videoUrl: null,
        }));

        try {
            const videoUrl = await generateAndWaitForVideo(
                selectedImage,
                'Create a dynamic birthday celebration video with festive animations, balloons, and confetti',
                (progress) => {
                    setState(prev => ({ ...prev, progress }));
                }
            );

            setState(prev => ({
                ...prev,
                isGenerating: false,
                videoUrl,
                progress: 100,
            }));

            // Notify parent component
            onVideoGenerated(videoUrl);
        } catch (error) {
            setState(prev => ({
                ...prev,
                isGenerating: false,
                error: error instanceof Error ? error.message : 'Failed to generate video',
            }));
        }
    }, [selectedImage, onVideoGenerated]);

    // Reset state
    const handleReset = useCallback(() => {
        setSelectedImage(null);
        setState({
            isGenerating: false,
            progress: 0,
            videoUrl: null,
            error: null,
            taskId: null,
        });
    }, []);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            {!selectedImage && !state.videoUrl && (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${dragActive
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Upload Birthday Photo</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Drag and drop an image here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports: JPEG, PNG, WebP (Max 10MB)
                        </p>
                    </label>
                </div>
            )}

            {/* Image Preview */}
            {selectedImage && !state.videoUrl && (
                <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden border-2 border-border">
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-full h-auto max-h-96 object-contain bg-muted"
                        />
                        {!state.isGenerating && (
                            <button
                                onClick={handleReset}
                                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Generate Button */}
                    {!state.isGenerating && (
                        <Button
                            onClick={handleGenerateVideo}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Birthday Video
                        </Button>
                    )}
                </div>
            )}

            {/* Loading State */}
            {state.isGenerating && (
                <div className="space-y-4 p-6 rounded-xl bg-accent/50 border border-border">
                    <div className="flex items-center justify-center space-x-3">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-lg font-medium">Generating your video...</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${state.progress}%` }}
                        />
                    </div>

                    <p className="text-sm text-center text-muted-foreground">
                        {state.progress > 0 ? `${state.progress}% complete` : 'Starting generation...'}
                    </p>
                    <p className="text-xs text-center text-muted-foreground">
                        This may take 30-60 seconds. Please wait...
                    </p>
                </div>
            )}

            {/* Success State */}
            {state.videoUrl && (
                <div className="space-y-4 p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center justify-center space-x-3 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="text-lg font-medium">Video Generated Successfully!</span>
                    </div>

                    {/* Video Preview */}
                    <div className="rounded-lg overflow-hidden border-2 border-green-500/20">
                        <video
                            src={state.videoUrl}
                            controls
                            autoPlay
                            loop
                            muted
                            className="w-full h-auto max-h-96"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="flex-1"
                        >
                            Generate Another
                        </Button>
                        <Button
                            onClick={() => onVideoGenerated(state.videoUrl!)}
                            className="flex-1"
                        >
                            Use This Video
                        </Button>
                    </div>
                </div>
            )}

            {/* Error State */}
            {state.error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-destructive">Error</p>
                            <p className="text-sm text-destructive/80 mt-1">{state.error}</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="w-full mt-3"
                    >
                        Try Again
                    </Button>
                </div>
            )}
        </div>
    );
}
