/**
 * Combine two images into a beautiful composite for birthday videos
 * Creates a 16:9 canvas with vibrant gradient background
 */
export async function createCompositeImage(
    cartoonBase64: string,
    personBase64: string,
    maxWidth = 1920,
    maxHeight = 1080
): Promise<string> {
    return new Promise((resolve, reject) => {
        const cartoonImg = new Image();
        const personImg = new Image();
        const bgImg = new Image();
        let loadedCount = 0;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === 3) { // Wait for all 3 images
                try {
                    // Create 16:9 canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    // Set 16:9 aspect ratio
                    canvas.width = 1920;
                    canvas.height = 1080;

                    // Draw the sonic waves background image to fill the entire canvas
                    // If bgImg failed to load (width will be 0), use gradient fallback
                    if (bgImg.width > 0) {
                        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                    } else {
                        // Gradient fallback if background image failed to load
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                        gradient.addColorStop(0, '#FF6B9D');    // Pink
                        gradient.addColorStop(0.25, '#C44569'); // Deep pink
                        gradient.addColorStop(0.5, '#FFA07A');  // Light coral
                        gradient.addColorStop(0.75, '#FFD700'); // Gold
                        gradient.addColorStop(1, '#FF1493');    // Deep pink
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    // Calculate sizes for images (make them larger and centered)
                    const maxImgHeight = canvas.height * 0.8; // Use 80% of canvas height
                    const spacing = 100; // Space between images

                    // Scale cartoon to fit
                    let cartoonScale = maxImgHeight / cartoonImg.height;
                    let cartoonWidth = cartoonImg.width * cartoonScale;
                    let cartoonHeight = cartoonImg.height * cartoonScale;

                    // Scale person to fit
                    let personScale = maxImgHeight / personImg.height;
                    let personWidth = personImg.width * personScale;
                    let personHeight = personImg.height * personScale;

                    // Calculate positions (centered with spacing)
                    const totalWidth = cartoonWidth + personWidth + spacing;
                    const startX = (canvas.width - totalWidth) / 2;

                    const cartoonX = startX;
                    const cartoonY = (canvas.height - cartoonHeight) / 2;

                    const personX = startX + cartoonWidth + spacing;
                    const personY = (canvas.height - personHeight) / 2;

                    // Draw cartoon character with shadow
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctx.shadowBlur = 20;
                    ctx.shadowOffsetX = 10;
                    ctx.shadowOffsetY = 10;

                    // Draw rounded rectangle for cartoon
                    ctx.save();
                    ctx.beginPath();
                    const radius = 20;
                    ctx.moveTo(cartoonX + radius, cartoonY);
                    ctx.lineTo(cartoonX + cartoonWidth - radius, cartoonY);
                    ctx.quadraticCurveTo(cartoonX + cartoonWidth, cartoonY, cartoonX + cartoonWidth, cartoonY + radius);
                    ctx.lineTo(cartoonX + cartoonWidth, cartoonY + cartoonHeight - radius);
                    ctx.quadraticCurveTo(cartoonX + cartoonWidth, cartoonY + cartoonHeight, cartoonX + cartoonWidth - radius, cartoonY + cartoonHeight);
                    ctx.lineTo(cartoonX + radius, cartoonY + cartoonHeight);
                    ctx.quadraticCurveTo(cartoonX, cartoonY + cartoonHeight, cartoonX, cartoonY + cartoonHeight - radius);
                    ctx.lineTo(cartoonX, cartoonY + radius);
                    ctx.quadraticCurveTo(cartoonX, cartoonY, cartoonX + radius, cartoonY);
                    ctx.closePath();
                    ctx.clip();

                    // Draw the character image directly (preserve transparency)
                    ctx.drawImage(cartoonImg, cartoonX, cartoonY, cartoonWidth, cartoonHeight);
                    ctx.restore();

                    // Draw person photo with shadow (preserve transparency from background removal)
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(personX + radius, personY);
                    ctx.lineTo(personX + personWidth - radius, personY);
                    ctx.quadraticCurveTo(personX + personWidth, personY, personX + personWidth, personY + radius);
                    ctx.lineTo(personX + personWidth, personY + personHeight - radius);
                    ctx.quadraticCurveTo(personX + personWidth, personY + personHeight, personX + personWidth - radius, personY + personHeight);
                    ctx.lineTo(personX + radius, personY + personHeight);
                    ctx.quadraticCurveTo(personX, personY + personHeight, personX, personY + personHeight - radius);
                    ctx.lineTo(personX, personY + radius);
                    ctx.quadraticCurveTo(personX, personY, personX + radius, personY);
                    ctx.closePath();
                    ctx.clip();

                    // Draw the person image directly (no white background fill to preserve transparency)
                    ctx.drawImage(personImg, personX, personY, personWidth, personHeight);
                    ctx.restore();

                    // Reset shadow
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;

                    // Convert to base64
                    resolve(canvas.toDataURL('image/jpeg', 0.95));
                } catch (error) {
                    reject(error);
                }
            }
        };

        cartoonImg.onload = onImageLoad;
        personImg.onload = onImageLoad;
        bgImg.onload = onImageLoad;

        cartoonImg.onerror = () => reject(new Error('Failed to load cartoon image'));
        personImg.onerror = () => reject(new Error('Failed to load person image'));
        bgImg.onerror = () => {
            console.warn('Failed to load sonic waves background, using gradient fallback');
            // If background fails, still proceed with gradient fallback
            loadedCount++; // Count as loaded to proceed
        };

        cartoonImg.src = cartoonBase64;
        personImg.src = personBase64;
        bgImg.src = '/backgrounds/bg-sonic-waves.png';
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
