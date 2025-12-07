// Pixverse.ai API Types

export interface PixverseGenerateRequest {
    image: string; // Base64 encoded image or URL
    prompt?: string; // Optional text prompt to guide video generation
    duration?: number; // Video duration in seconds (if supported)
    aspectRatio?: string; // e.g., "16:9", "9:16", "1:1"
}

export interface PixverseGenerateResponse {
    id: string; // Task/Job ID
    status: 'pending' | 'processing' | 'completed' | 'failed';
    videoUrl?: string; // URL to the generated video (when completed)
    progress?: number; // Progress percentage (0-100)
    error?: string; // Error message if failed
    createdAt?: string;
    completedAt?: string;
}

export interface PixverseStatusResponse {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    videoUrl?: string;
    progress?: number;
    error?: string;
}

export interface VideoGenerationState {
    isGenerating: boolean;
    progress: number;
    videoUrl: string | null;
    error: string | null;
    taskId: string | null;
}
