
import fetch from 'node-fetch';
import FormData from 'form-data';

const API_KEY = 'sk-8755922f136b65fcdb09d6f2eaee0572';

async function runDebug() {
    console.log('🚀 Starting Debug Script...');

    // 1. Upload Image
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(testImageBase64, 'base64');
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    console.log('\n📤 Uploading image...');
    const uploadRes = await fetch('https://app-api.pixverse.ai/openapi/v2/image/upload', {
        method: 'POST',
        headers: {
            'API-KEY': API_KEY,
            ...formData.getHeaders(),
        },
        body: formData
    });

    const uploadData = await uploadRes.json();
    console.log('Upload Result:', JSON.stringify(uploadData, null, 2));

    if (uploadData.ErrCode !== 0) {
        console.error('❌ Upload failed');
        return;
    }

    const imgId = uploadData.Resp.img_id;
    const imgUrl = uploadData.Resp.img_url;
    console.log(`✅ Got img_id: ${imgId} (Type: ${typeof imgId})`);
    console.log(`✅ Got img_url: ${imgUrl}`);

    // Attempt 14: Longer Prompt + negative_prompt + image_url (Endpoint: /video/img/generate)
    console.log('\n🎬 Attempt 14: Longer Prompt + negative_prompt + image_url');
    try {
        const res14 = await fetch('https://app-api.pixverse.ai/openapi/v2/video/img/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'API-KEY': API_KEY },
            body: JSON.stringify({
                image_url: imgUrl,
                prompt: 'A high quality cinematic video of a beautiful landscape with moving clouds and sunlight.',
                negative_prompt: 'blurry, low quality, distortion',
                model: 'v2',
                duration: 5,
                aspect_ratio: '16:9'
            })
        });
        const data14 = await res14.json();
        console.log('Attempt 14 Result:', JSON.stringify(data14, null, 2));
    } catch (e) {
        console.error('Attempt 14 Error:', e.message);
    }

    // Attempt 15: Different Endpoint /video/generate (instead of /video/img/generate)
    console.log('\n🎬 Attempt 15: Endpoint /video/generate with image params');
    try {
        const res15 = await fetch('https://app-api.pixverse.ai/openapi/v2/video/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'API-KEY': API_KEY },
            body: JSON.stringify({
                image: imgUrl,
                prompt: 'A high quality cinematic video of a beautiful landscape.',
                model: 'v2',
                duration: 5,
                aspect_ratio: '16:9'
            })
        });
        const data15 = await res15.json(); // May be 404
        console.log('Attempt 15 Result:', JSON.stringify(data15, null, 2));
    } catch (e) {
        console.error('Attempt 15 Error:', e.message);
    }

    // Attempt 16: Attempt with "image" = BASE64 (Directly) ??
    // Usually APIs warn about size, but worth a try with small image?
    // No, 400013 says incorrect type. Base64 is string.
}

runDebug();
