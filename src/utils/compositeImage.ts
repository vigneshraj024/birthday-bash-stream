/**
 * Combine two images side-by-side into a single composite image
 */
export async function createCompositeImage(
    image1Base64: string,
    image2Base64: string,
    maxWidth = 1920,
    maxHeight = 1080
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img1 = new Image();
        const img2 = new Image();
        let loadedCount = 0;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === 2) {
                try {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    // Calculate dimensions - place images side by side
                    const totalWidth = img1.width + img2.width;
                    const maxHeightImg = Math.max(img1.height, img2.height);

                    // Scale down if needed
                    let scale = 1;
                    if (totalWidth > maxWidth || maxHeightImg > maxHeight) {
                        scale = Math.min(maxWidth / totalWidth, maxHeight / maxHeightImg);
                    }

                    canvas.width = totalWidth * scale;
                    canvas.height = maxHeightImg * scale;

                    // Fill with white background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw first image (person) on left
                    const img1Width = img1.width * scale;
                    const img1Height = img1.height * scale;
                    const img1Y = (canvas.height - img1Height) / 2; // Center vertically
                    ctx.drawImage(img1, 0, img1Y, img1Width, img1Height);

                    // Draw second image (cartoon) on right
                    const img2Width = img2.width * scale;
                    const img2Height = img2.height * scale;
                    const img2X = img1Width;
                    const img2Y = (canvas.height - img2Height) / 2; // Center vertically
                    ctx.drawImage(img2, img2X, img2Y, img2Width, img2Height);

                    // Convert to base64
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                } catch (error) {
                    reject(error);
                }
            }
        };

        img1.onload = onImageLoad;
        img2.onload = onImageLoad;
        img1.onerror = () => reject(new Error('Failed to load first image'));
        img2.onerror = () => reject(new Error('Failed to load second image'));

        img1.src = image1Base64;
        img2.src = image2Base64;
    });
}

/**
 * Load an image from URL and convert to base64
 */
export async function loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
        img.src = url;
    });
}
