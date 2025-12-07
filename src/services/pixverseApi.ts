// Pixverse.ai API Service - Using Backend Proxy
// Calls our Node.js backend which proxies requests to Pixverse API

import type { PixverseGenerateResponse, PixverseStatusResponse } from '@/types/pixverse';
import { createCompositeImage } from '@/utils/compositeImage';

const BACKEND_URL = 'http://localhost:3001';

/**
 * Upload image via backend proxy
 */
async function uploadImage(imageBase64: string): Promise<number> {
    try {
        // Remove data URL prefix if present
        const base64Data = imageBase64.includes('base64,')
            ? imageBase64.split('base64,')[1]
            : imageBase64;

        const response = await fetch(`${BACKEND_URL}/api/pixverse/upload-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Data,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Image upload failed:', errorData);
            throw new Error(errorData.error || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Image uploaded:', data);

        return data.Resp.img_id;
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        throw error;
    }
}

/**
 * Generate video from uploaded image via backend proxy
 */
export async function generateVideoFromImage(
    imageBase64: string,
    prompt?: string,
    duration = 4
): Promise<PixverseGenerateResponse> {
    try {
        // Step 1: Upload image first
        const imgId = await uploadImage(imageBase64);
        console.log('Got img_id:', imgId);

        // Step 2: Generate video using img_id
        const response = await fetch(`${BACKEND_URL}/api/pixverse/generate-video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                img_id: imgId,
                prompt: prompt || 'Create a dynamic birthday celebration video with festive animations',
                duration,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Video generation failed:', errorData);
            throw new Error(errorData.error || `Generation failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Video generation started:', data);

        return {
            id: String(data.Resp.video_id),
            status: 'pending',
        } as PixverseGenerateResponse;
    } catch (error) {
        console.error('❌ Error generating video:', error);
        throw error;
    }
}

/**
 * Check video generation status via backend proxy
 */
export async function checkVideoStatus(taskId: string): Promise<PixverseStatusResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/api/pixverse/status/${taskId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Status check failed: ${response.status}`);
        }

        const data = await response.json();
        const resp = data.Resp;

        // Map Pixverse status codes
        // 1: Generation successful, 5: In progress, 7: Moderation failed, 8: Generation failed
        let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';
        if (resp.status === 1) status = 'completed';
        else if (resp.status === 7 || resp.status === 8) status = 'failed';
        else if (resp.status === 5) status = 'processing';

        return {
            id: taskId,
            status: status,
            videoUrl: resp.url,
            progress: status === 'completed' ? 100 : status === 'processing' ? 50 : 0,
            error: status === 'failed' ? 'Video generation failed' : undefined,
        } as PixverseStatusResponse;
    } catch (error) {
        console.error('❌ Error checking video status:', error);
        throw error;
    }
}

/**
 * Poll for video completion
 */
export async function pollForVideoCompletion(
    taskId: string,
    onProgress?: (progress: number) => void,
    maxAttempts = 40
): Promise<string> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            attempts++;

            try {
                const status = await checkVideoStatus(taskId);

                if (onProgress && status.progress !== undefined) {
                    onProgress(status.progress);
                }

                if (status.status === 'completed' && status.videoUrl) {
                    clearInterval(interval);
                    resolve(status.videoUrl);
                } else if (status.status === 'failed') {
                    clearInterval(interval);
                    reject(new Error(status.error || 'Video generation failed'));
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Video generation timed out'));
                }
            } catch (error) {
                clearInterval(interval);
                reject(error);
            }
        }, 5000);
    });
}

/**
 * Complete workflow: Generate video and wait for completion
 */
export async function generateAndWaitForVideo(
    imageBase64: string,
    prompt?: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    const response = await generateVideoFromImage(imageBase64, prompt);

    if (!response.id) {
        throw new Error('No video ID returned from API');
    }

    const videoUrl = await pollForVideoCompletion(response.id, onProgress);
    return videoUrl;
}

/**
 * Generate birthday celebration video with person and cartoon character together
 */
export async function generateBirthdayVideoWithCartoon(
    personImageBase64: string,
    cartoonImageBase64: string | null,
    personName: string,
    cartoonName: string,
    dateText: string | null,
    onProgress?: (progress: number) => void
): Promise<string> {
    let prompt = '';

    // Conditional Prompts based on Character

    const dateLine = dateText ? ` and include a smaller caption showing the date: "${dateText}"` : '';

    if (cartoonName.toLowerCase().includes('doremon') || cartoonName.toLowerCase().includes('doraemon')) {
        // Doraemon-specific prompt: Doraemon left + static real person centered behind cake
        prompt = `Create a high-quality 6-second MP4 (H.264) 16:9 birthday celebration animation.

Use the uploaded Doraemon cartoon image as the animated Doraemon on the LEFT side of the frame. Doraemon should CLAP HANDS enthusiastically multiple times, display a BIG BRIGHT JOYFUL SMILE throughout, wave energetically, and do a small joyful jump/dance loop (playful, bouncy animation). The hand clapping should be prominent and repeated throughout the video with clear hand movements.

Use the uploaded real person photo as a photo-style cutout placed CENTERED behind a large birthday cake. The real person must remain exactly as in the photo (no face changes, no animation) and should not move — remain static behind the cake.

Scene elements: bright, colorful party background with balloons, falling confetti, streamers, and soft glowing party lights. The cake (center) has lit candles with subtle sparkles and a gentle flicker.

Effects: confetti falling around both characters, candle flame sparkles, and small celebratory particle effects near Doraemon. Keep the person unanimated and photorealistic.

    Text: prominently display animated party-style text: "🎉 Happy Birthday ${personName}! 🎉" integrated into the background with playful entrance animation${dateLine}. The birthday name and date should remain visible continuously throughout the entire 6 seconds (no breaks).

Camera: smooth slow zoom-in with a light sideways pan for cinematic motion.

Style: blend soft cel-shaded Doraemon animation with a real-photo cutout; Doraemon should be lively and cartoony with an extra cheerful expression while the person remains unchanged. 24–30 FPS, duration 6s, output MP4 H.264, aspect ratio 16:9. Produce two slight variations (neutral and warmer color grade).`;
    } else {
        // Default placeholder prompt for other cartoons (kept minimal)
        prompt = `Create a joyful 6-second 16:9 birthday animation featuring the selected cartoon and the uploaded person. The cartoon character should CLAP HANDS enthusiastically and display a BIG BRIGHT SMILE throughout the video. Place the cartoon on the LEFT and the real person centered behind a cake; keep the person static. Add confetti, balloons, candles, and display 'Happy Birthday ${personName}!'. Duration 6s.`;
    }

    // If a cartoon image is provided, create a composite (cartoon + person) so proxy receives a single image.
    // If no cartoon image is provided, upload the person image alone and let the generator create Doraemon from the prompt.
    let targetImageBase64 = personImageBase64;
    if (cartoonImageBase64) {
        try {
            targetImageBase64 = await createCompositeImage(cartoonImageBase64, personImageBase64);
        } catch (err) {
            console.warn('Failed to create composite image, falling back to person image only', err);
            targetImageBase64 = personImageBase64;
        }
    }

    const response = await generateVideoFromImage(targetImageBase64, prompt, 6);

    if (!response.id) {
        throw new Error('No video ID returned from API');
    }

    const videoUrl = await pollForVideoCompletion(response.id, onProgress);
    return videoUrl;
}
