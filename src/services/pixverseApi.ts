// Pixverse.ai API Service - Using Backend Proxy
// Calls our Node.js backend which proxies requests to Pixverse API

import type { PixverseGenerateResponse, PixverseStatusResponse } from '@/types/pixverse';
import { createCompositeImage } from '@/utils/compositeImage';

// Use environment variable for backend URL, fallback to localhost in development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


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
    onProgress?: (progress: number) => void
): Promise<string> {
    // Character-specific descriptions for accurate rendering
    const characterDescriptions: { [key: string]: string } = {
        'Shinchan': `Shinchan (Shinnosuke Nohara), the iconic 5-year-old Japanese anime character with these EXACT features:
- VERY THICK, BOLD BLACK EYEBROWS (his most distinctive feature)
- Small beady black eyes
- Simple round head with minimal facial details
- Wearing his signature RED SHORT-SLEEVED SHIRT and YELLOW SHORTS
- Chibi-style proportions (large head, small body)
- Mischievous, cheeky expression with a wide grin
- Simple cartoon style typical of Japanese anime
- NO realistic features, pure cartoon/anime style`,

        'Doraemon': `Doraemon, the blue robotic cat with:
- Round blue body with white face and belly
- Large round eyes with black pupils
- Red nose and white whiskers
- No ears (distinctive feature)
- Red collar with golden bell
- White hands with no fingers (round mittens)
- Cheerful, friendly expression`,

        'Motu Patlu': `Motu and Patlu duo:
- Motu: chubby character in orange outfit, always smiling
- Patlu: thin character in yellow outfit with glasses
- Both in simple Indian cartoon style`,

        'Little Krishna': `Little Krishna (Bal Krishna):
- Young boy with blue skin
- Peacock feather in hair
- Yellow dhoti (traditional Indian garment)
- Flute in hand
- Playful, divine appearance`,

        'Chotta Bheem': `Chotta Bheem:
- Young Indian boy with brown skin
- Orange dhoti
- Strong, muscular build for a child
- Confident, heroic expression
- Black hair`,

        'Rudra': `Rudra:
- Young Indian superhero character
- Dynamic action pose
- Colorful costume with cape`
    };

    // Get character-specific description or use generic
    const characterDesc = characterDescriptions[cartoonName] || `${cartoonName} cartoon character in authentic style`;

    // Enhanced prompt with character-specific details
    const prompt = `Create a vibrant 6-second birthday celebration video in 16:9.

MAIN FOCUS - Animate the Real Person:
The uploaded real person is the STAR celebrating their birthday. Animate them:
- Waving, smiling, clapping with joy
- Natural happy celebratory movements
- Keep face photorealistic but add celebration animation
- Positioned prominently in center-right

Supporting - ${cartoonName} Cartoon Character:
On the LEFT side, add ${characterDesc}
The character should be:
- Celebrating enthusiastically, waving and dancing happily
- In AUTHENTIC cartoon/anime style (NOT realistic)
- Clearly recognizable with all distinctive features
- Animated with joyful movements

Scene & Background:
- Festive party background with colorful balloons, confetti, streamers, and party lights
- Birthday cake with flickering candles in the foreground
- IMPORTANT: Display large, prominent text in the BACKGROUND: "HAPPY BIRTHDAY ${personName.toUpperCase()}"
- The text should be:
  * Positioned on the back wall/background behind the person
  * Large, bold, colorful letters (gold, rainbow, or neon style)
  * Clearly visible and readable
  * Part of the party decoration on the wall
  * With festive styling (balloons, stars, sparkles around it)

Camera: Smooth gentle zoom-in
Effects: Confetti falling, soft glowing lights, colorful particles
Additional text overlay: "🎉" emojis and celebration effects

Style: Fun, lively celebration. Real person should feel alive and celebrating, not static. Cartoon character must be in pure cartoon/anime style. 6 seconds, 16:9, 24-30 FPS.`;


    // Use ONLY person image - AI will generate cartoon from prompt
    const response = await generateVideoFromImage(personImageBase64, prompt, 6);

    if (!response.id) {
        throw new Error('No video ID returned from API');
    }

    const videoUrl = await pollForVideoCompletion(response.id, onProgress);
    return videoUrl;
}
