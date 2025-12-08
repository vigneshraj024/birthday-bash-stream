
// Standalone PixVerse Video Generator
// Usage: node server/test_pixverse.js

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load API Key from .env
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const API_KEY = process.env.PIXVERSE_API_KEY;

if (!API_KEY) {
    console.error('❌ Error: PIXVERSE_API_KEY not found in server/.env');
    process.exit(1);
}

// 2. Configuration
// Change this to the path of the image you want to test
const IMAGE_PATH = 'C:/Users/HP/.gemini/antigravity/brain/3504489a-9484-423e-a268-f2c728bda39a/uploaded_image_1765146417902.png';

const PROMPT = "A high-quality 5-second birthday celebration video. Doraemon clapping hands happily on the left. A real person standing still in the center behind a cake. Party background.";

async function generateFromScratch() {
    console.log('🚀 Starting Generation from Scratch...');
    console.log(`🔑 Using Key: ${API_KEY.substring(0, 5)}...`);

    // Step A: Upload Image
    if (!fs.existsSync(IMAGE_PATH)) {
        console.error(`❌ Image not found at: ${IMAGE_PATH}`);
        return;
    }

    const formData = new FormData();
    formData.append('image', fs.readFileSync(IMAGE_PATH), { filename: 'test_image.png', contentType: 'image/png' });

    console.log('1️⃣ Uploading image...');
    const uploadRes = await fetch('https://app-api.pixverse.ai/openapi/v2/image/upload', {
        method: 'POST',
        headers: {
            'API-KEY': API_KEY,
            ...formData.getHeaders()
        },
        body: formData
    });

    const uploadData = await uploadRes.json();
    if (uploadData.ErrCode !== 0) {
        console.error('❌ Upload Failed:', uploadData);
        return;
    }

    const imgId = uploadData.Resp.img_id;
    console.log(`✅ Image Uploaded! ID: ${imgId}`);

    // Step B: Generate Video (The Working Configuration)
    console.log('2️⃣ Requesting Video Generation...');

    // This payload contains the required fields we discovered
    const payload = {
        img_id: parseInt(imgId),
        prompt: PROMPT,
        duration: 5,            // Fixed to 5
        aspect_ratio: "16:9",
        model: "v3.5",          // REQUIRED
        quality: "540p",        // REQUIRED
        motion_mode: "normal",  // REQUIRED
        negative_prompt: "distortion, blurry, low quality"
    };

    const genRes = await fetch('https://app-api.pixverse.ai/openapi/v2/video/img/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API-KEY': API_KEY
        },
        body: JSON.stringify(payload)
    });

    const genData = await genRes.json();

    if (genData.ErrCode !== 0) {
        console.error('❌ Generation Failed:', genData);
    } else {
        console.log('🎉 Generation Success!');
        console.log('Video ID:', genData.Resp.video_id);
        console.log('Full Response:', JSON.stringify(genData, null, 2));
    }
}

generateFromScratch();
