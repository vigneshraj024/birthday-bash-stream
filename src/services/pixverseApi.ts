// Pixverse.ai API Service - Using Backend Proxy
// Calls our Node.js backend which proxies requests to Pixverse API

import type { PixverseGenerateResponse, PixverseStatusResponse } from '@/types/pixverse';
import { createCompositeImage } from '@/utils/compositeImage';
import { addTextToImage } from '@/utils/addTextToImage';

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
    duration = 5  // Pixverse API only supports 5 or 8 seconds
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
                duration: 5
            }),
        });

        console.log('video generator::', `${BACKEND_URL}/api/pixverse/generate-video`)

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

    const lowerName = cartoonName.toLowerCase();

    if (lowerName.includes('doremon') || lowerName.includes('doraemon')) {
        // Doraemon
        prompt = `Create a high-quality 5-second MP4 16:9 birthday celebration animation.

Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake (lit candles). The person must NOT change.

On the LEFT side, animate "Doraemon" (Blue robotic cat).
Appearance: Classic blue body, white belly, red nose, red collar with bell. He should look happy and excited.
Action: Doraemon is JUMPING with joy, CLAPPING his hands, and WAVING energetically at the person to celebrate.

Scene: Bright, colorful party background with balloons, falling confetti, and streamers.

CRITICAL TEXT REQUIREMENT: Display LARGE, BOLD, HIGHLY VISIBLE text on the wall/background that reads: "Happy Birthday ${personName}!" The text MUST be clearly readable, use bright contrasting colors (rainbow gradient or gold), and be positioned prominently in the upper portion of the background. ${dateLine ? `Also include smaller text showing: "${dateText}"` : ''}

Style: Blend soft cel-shaded animation with real-photo cutout. 24fps.`;

    } else if (lowerName.includes('little krishna') || lowerName.includes('krishna')) {
        // Little Krishna
        prompt = `Create a high-quality 5-second MP4 16:9 birthday celebration animation.

Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake (lit candles). The person must NOT change.

On the LEFT side, animate "Little Krishna" (Lord Krishna as a child).
Appearance: LIGHT BLUE SKIN, yellow dhoti, peacock feather in hair, jewelry. Holding a flute.
Action: Krishna is DANCING joyfully, playing his flute briefly, then stopping to CLAP and BLESS the person with a smile.

Scene: Divine Vrindavan garden party with soft glowing lights and sparkles.

CRITICAL TEXT REQUIREMENT: Display LARGE, GLOWING, MAGICAL text floating in the sky/background that reads: "Happy Birthday ${personName}!" The text MUST be clearly visible with divine golden glow effect, large font size, and positioned prominently above or behind the characters. ${dateLine ? `Also include smaller glowing text: "${dateText}"` : ''}

Style: High-quality 3D animated style, divine atmosphere.`;

    } else if (lowerName.includes('mottu') || lowerName.includes('motu')) {
        // Motu Patlu
        prompt = `Create a high-quality 5-second MP4 16:9 birthday celebration animation.

Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake. The person must NOT change.

On the LEFT side, animate "Motu and Patlu" (Indian cartoon duo).
Appearance: Motu (Fat, red tunic, blue sash, mustache) and Patlu (Thin, yellow tunic, glasses).
Action: Both Motu and Patlu are DANCING joyfully and CLAPPING their hands to celebrate. They are smiling and looking at the person.

Scene: Vibrant town market background (Furfuri Nagar style) with party decorations.

CRITICAL TEXT REQUIREMENT: Display LARGE, BOLD, COLORFUL text on a banner or wall in the background that reads: "Happy Birthday ${personName}!" The text MUST be clearly readable, use vibrant multi-colored letters, large font, and be prominently visible in the scene. ${dateLine ? `Include smaller text banner: "${dateText}"` : ''}

Style: High-quality 3D animation (CGI), bright colors.`;

    } else if (lowerName.includes('shinchan')) {
        // Shinchan
        prompt = `Create a high-quality 5-second MP4 16:9 birthday celebration animation.

Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake. The person must NOT change.

On the LEFT side, animate "Shinchan Nohara".
Appearance: Small boy, red t-shirt, yellow shorts, thick black eyebrows.
Action: Shinchan is JUMPING excitedly and doing his signature "Action Kamen" pose to celebrate. He is laughing and waving.

Scene: Colorful living room or park background with crayons/doodles style.

CRITICAL TEXT REQUIREMENT: Display LARGE, BOLD, CARTOON-STYLE text written on the wall/background that reads: "Happy Birthday ${personName}!" The text MUST be in thick black outline with bright fill colors, very large and clearly visible, positioned prominently on the wall behind the scene. ${dateLine ? `Add smaller cartoon text: "${dateText}"` : ''}

Style: 2D Anime style, flat colors, thick outlines.`;

    } else if (lowerName.includes('rudra')) {
        // Rudra
        prompt = `Create a high-quality 5-second MP4 16:9 birthday celebration animation.

Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake. The person must NOT change.

On the LEFT side, animate "Rudra" (Prince of Magic).
Appearance: Young magical boy prince, red and gold outfit, spiky hair, holding a magic wand.
Action: Rudra casts a gentle magic spell with his wand, sending sparkles towards the birthday cake, then smiles and waves.

Scene: Magical palace background with floating magic particles.

CRITICAL TEXT REQUIREMENT: Display LARGE, GLOWING, MAGICAL text floating in the air that reads: "Happy Birthday ${personName}!" The text MUST be clearly visible with bright magical glow, sparkle effects, large size, and positioned prominently in the upper background. ${dateLine ? `Include smaller magical text: "${dateText}"` : ''}

Style: 3D CGI animation, glossy, magical effects.`;

    } else if (lowerName.includes('bheem')) {
        // Chotta Bheem
        prompt = `Create a high-quality 5-second MP4 16:9 birthday celebration animation.

Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake. The person must NOT change.

On the LEFT side, animate "Chotta Bheem".
Appearance: Strong kid, orange dhoti, no shirt, wristbands, tilak on forehead.
Action: Bheem is standing heroically, giving a big THUMBS UP and WAVING his hand to wish happy birthday. He has a confident smile.

Scene: Dholakpur village setting with festive banners.

CRITICAL TEXT REQUIREMENT: Display LARGE, BOLD text on a festive banner in the background that reads: "Happy Birthday ${personName}!" The text MUST be in bright orange/gold colors, very large font, clearly readable, and prominently displayed on banners or walls in the village scene. ${dateLine ? `Add smaller banner text: "${dateText}"` : ''}

Style: 2D detailed animation, vibrant colors.`;

    } else {
        // Default
        prompt = `Create a joyful 5-second 16:9 birthday animation featuring the selected cartoon and the uploaded person.
Use the uploaded real person photo as a static photo-cutout centered behind a festive birthday cake.
On the LEFT side, animate the cartoon character CLAPPING HANDS and celebrating.

CRITICAL TEXT REQUIREMENT: Display LARGE, BOLD, COLORFUL text in the background that reads: "Happy Birthday ${personName}!" The text MUST be clearly visible, use bright contrasting colors, large font size, and be prominently positioned in the upper background. ${dateLine ? `Include smaller text: "${dateText}"` : ''}`;
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

    // Add "Happy Birthday" text overlay to ensure it appears in the video
    // AI models are unreliable at generating text from prompts, so we add it directly to the image
    try {
        targetImageBase64 = await addTextToImage(targetImageBase64, personName, dateText);
        console.log('✅ Added birthday text overlay to image');
    } catch (err) {
        console.warn('Failed to add text overlay, proceeding without it', err);
    }

    const response = await generateVideoFromImage(targetImageBase64, prompt, 5);

    if (!response.id) {
        throw new Error('No video ID returned from API');
    }

    const videoUrl = await pollForVideoCompletion(response.id, onProgress);
    return videoUrl;
}
