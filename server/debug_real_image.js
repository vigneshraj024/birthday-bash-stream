
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const API_KEY = 'sk-8755922f136b65fcdb09d6f2eaee0572';
const IMAGE_PATH = 'C:/Users/HP/.gemini/antigravity/brain/3504489a-9484-423e-a268-f2c728bda39a/uploaded_image_1765146417902.png';

async function runDebug() {
    console.log('🚀 Starting Real Image Debug Script...');

    if (!fs.existsSync(IMAGE_PATH)) {
        console.error('❌ Image file not found:', IMAGE_PATH);
        return;
    }

    // 1. Upload
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'real_test.png', contentType: 'image/png' });

    console.log('📤 Uploading REAL image...');
    const uploadRes = await fetch('https://app-api.pixverse.ai/openapi/v2/image/upload', {
        method: 'POST',
        headers: { 'API-KEY': API_KEY, ...formData.getHeaders() },
        body: formData
    });

    const uploadData = await uploadRes.json();
    if (uploadData.ErrCode !== 0) { console.error('Upload Failed', uploadData); return; }

    const imgId = uploadData.Resp.img_id;
    console.log(`✅ Uploaded img_id: ${imgId}`);

    // 2. Kitchen Sink Generation
    console.log(`\n🧪 Testing Kitchen Sink Payload`);
    try {
        const body = {
            img_id: parseInt(imgId),
            prompt: 'A joyous high quality 5 second video of a celebration.',
            negative_prompt: 'distortion, blurry, low quality',
            duration: 5,
            aspect_ratio: '16:9',
            model: 'v3.5', // Try v3.5 as it appeared in many docs
            quality: '540p',
            motion_mode: 'normal',
            seed: 123456
        };
        console.log('Sending:', JSON.stringify(body, null, 2));

        const res = await fetch('https://app-api.pixverse.ai/openapi/v2/video/img/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'API-KEY': API_KEY },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log(`Result:`, JSON.stringify(data, null, 2));

        if (data.ErrCode === 0) console.log('🎉 SUCCESS!');
    } catch (e) {
        console.error(`Error:`, e.message);
    }
}

runDebug();
