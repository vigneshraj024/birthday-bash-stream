/**
 * Add text overlay to an image
 * This ensures text appears in the generated video since AI models are unreliable at text generation
 */
export async function addTextToImage(
    imageBase64: string,
    personName: string,
    dateText?: string | null
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            try {
                // Create canvas with same dimensions as image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Configure text styling
                const fontSize = Math.floor(img.height * 0.12); // 12% of image height
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                // Birthday message
                const birthdayText = `Happy Birthday ${personName}!`;

                // Measure text width for background
                const textMetrics = ctx.measureText(birthdayText);
                const textWidth = textMetrics.width;
                const textHeight = fontSize * 1.4;

                // Position at top center with padding
                const x = canvas.width / 2;
                const y = img.height * 0.05; // 5% from top

                // Draw semi-transparent background for readability
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(
                    x - textWidth / 2 - 20,
                    y - 10,
                    textWidth + 40,
                    textHeight + 20
                );

                // Draw text with gradient
                const gradient = ctx.createLinearGradient(
                    x - textWidth / 2,
                    y,
                    x + textWidth / 2,
                    y
                );
                gradient.addColorStop(0, '#FFD700'); // Gold
                gradient.addColorStop(0.5, '#FFA500'); // Orange
                gradient.addColorStop(1, '#FF6347'); // Tomato red

                ctx.fillStyle = gradient;
                ctx.fillText(birthdayText, x, y);

                // Add white stroke for better visibility
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.strokeText(birthdayText, x, y);

                // Add date text if provided
                if (dateText) {
                    const dateFontSize = Math.floor(fontSize * 0.5);
                    ctx.font = `${dateFontSize}px Arial, sans-serif`;
                    const dateY = y + textHeight + 10;

                    // Semi-transparent background for date
                    const dateMetrics = ctx.measureText(dateText);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                    ctx.fillRect(
                        x - dateMetrics.width / 2 - 15,
                        dateY - 5,
                        dateMetrics.width + 30,
                        dateFontSize + 10
                    );

                    // Date text
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(dateText, x, dateY);
                }

                // Convert to base64
                resolve(canvas.toDataURL('image/jpeg', 0.95));
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageBase64;
    });
}
