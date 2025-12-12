import { removeBackground } from '@imgly/background-removal';

/**
 * Remove background from an image using AI
 * @param imageBase64 - Base64 encoded image
 * @returns Base64 encoded image with transparent background
 */
export async function removeImageBackground(imageBase64: string): Promise<string> {
    try {
        console.log('🎨 Removing background from image...');

        // Convert base64 to blob
        const response = await fetch(imageBase64);
        const blob = await response.blob();

        // Remove background using AI
        const resultBlob = await removeBackground(blob, {
            model: 'isnet', // Full precision model for best quality background removal
            output: {
                format: 'image/png',
                quality: 0.9,
            },
        });

        // Convert result blob back to base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('✅ Background removed successfully!');
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(resultBlob);
        });
    } catch (error) {
        console.error('❌ Failed to remove background:', error);
        throw error;
    }
}

/**
 * Remove background with progress callback
 * @param imageBase64 - Base64 encoded image
 * @param onProgress - Progress callback (0-100)
 * @returns Base64 encoded image with transparent background
 */
export async function removeImageBackgroundWithProgress(
    imageBase64: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    try {
        console.log('🎨 Removing background from image...');

        if (onProgress) onProgress(10);

        // Convert base64 to blob
        const response = await fetch(imageBase64);
        const blob = await response.blob();

        if (onProgress) onProgress(30);

        // Remove background using AI
        const resultBlob = await removeBackground(blob, {
            model: 'isnet', // Full precision model for best quality
            output: {
                format: 'image/png',
                quality: 0.9,
            },
            progress: (key, current, total) => {
                // Map progress to 30-90 range
                const progressPercent = 30 + ((current / total) * 60);
                if (onProgress) onProgress(Math.round(progressPercent));
            },
        });

        if (onProgress) onProgress(95);

        // Convert result blob back to base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('✅ Background removed successfully!');
                if (onProgress) onProgress(100);
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(resultBlob);
        });
    } catch (error) {
        console.error('❌ Failed to remove background:', error);
        throw error;
    }
}
