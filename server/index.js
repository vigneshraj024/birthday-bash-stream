import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const PIXVERSE_API_KEY = process.env.PIXVERSE_API_KEY;

// Middleware - CORS configuration
app.use(cors({
    origin: [
        'https://birthday-bash-frontend.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'API-KEY', 'Ai-trace-id'],
    optionsSuccessStatus: 200
}));

app.options('*', cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Pixverse proxy server is running' });
});


// ---------------------------------------------------------------------------
// 📤 1) UPLOAD IMAGE → Pixverse
// ---------------------------------------------------------------------------
app.post('/api/pixverse/upload-image', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        console.log('📤 Uploading image to Pixverse...');

        const base64Data = image.includes('base64,')
            ? image.split('base64,')[1]
            : image;

        const imageBuffer = Buffer.from(base64Data, 'base64');

        const formData = new FormData();
        formData.append('image', imageBuffer, {
            filename: 'upload.jpg',
            contentType: 'image/jpeg'
        });

        const traceId = `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const response = await fetch(
            'https://app-api.pixverse.ai/openapi/v2/image/upload',
            {
                method: 'POST',
                headers: {
                    'API-KEY': PIXVERSE_API_KEY,
                    'Ai-trace-id': traceId,
                    ...formData.getHeaders(),
                },
                body: formData,
            }
        );

        const responseText = await response.text();
        console.log('📄 Upload response status:', response.status);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            return res.status(500).json({
                error: 'Pixverse returned invalid JSON',
                raw: responseText
            });
        }

        if (data.ErrCode !== 0) {
            return res.status(400).json({ error: data.ErrMsg || 'Upload failed' });
        }

        res.json(data);

    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ---------------------------------------------------------------------------
// 🎬 2) GENERATE VIDEO FROM IMAGE (MAIN ENDPOINT)
// ---------------------------------------------------------------------------
app.post('/api/pixverse/generate-video', async (req, res) => {
    try {
        const { img_id, prompt, duration } = req.body;

        if (!img_id) {
            return res.status(400).json({ error: 'img_id is required' });
        }

        console.log('🎬 Generating video with img_id:', img_id);

        const traceId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // ⭐ Correct PixVerse request body ⭐
        const requestBody = {
            img_id: parseInt(img_id),
            prompt: prompt || 'Create a joyful birthday celebration video',
            duration: parseInt(duration) || 5,  // INTEGER: 5 or 8 seconds only
            aspect_ratio: "16:9",
            model: "v3.5",  // REQUIRED: Debugging confirmed v3.5 works
            quality: "540p", // REQUIRED: Default quality
            motion_mode: "normal", // REQUIRED: Default motion
            negative_prompt: "distortion, blurry, low quality" // Recommended default
        };

        console.log("📤 Request to PixVerse:", requestBody);

        const response = await fetch(
            'https://app-api.pixverse.ai/openapi/v2/video/img/generate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API-KEY': PIXVERSE_API_KEY,
                    'Ai-trace-id': traceId
                },
                body: JSON.stringify(requestBody)
            }
        );

        const data = await response.json();
        console.log("📽 Video generation result:", data);

        if (data.ErrCode !== 0) {
            return res.status(400).json({
                error: data.ErrMsg || 'Video generation failed',
                raw: data
            });
        }

        res.json(data);

    } catch (error) {
        console.error('❌ Generation error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ---------------------------------------------------------------------------
// 🔍 3) CHECK VIDEO STATUS
// ---------------------------------------------------------------------------
app.get('/api/pixverse/status/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        console.log('🔍 Checking video status:', videoId);

        const traceId = `status-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const response = await fetch(
            `https://app-api.pixverse.ai/openapi/v2/video/result/${videoId}`,
            {
                method: 'GET',
                headers: {
                    'API-KEY': PIXVERSE_API_KEY,
                    'Ai-trace-id': traceId
                }
            }
        );

        const data = await response.json();
        console.log("📊 Status response:", data);

        if (data.ErrCode !== 0) {
            return res.status(400).json({
                error: data.ErrMsg || 'Status check failed',
                raw: data
            });
        }

        res.json(data);

    } catch (error) {
        console.error('❌ Status check error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ---------------------------------------------------------------------------
// 🚀 START SERVER
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Pixverse Proxy running on port ${PORT}`);
    console.log(`🔑 API Key Loaded: ${PIXVERSE_API_KEY ? 'YES' : 'NO'}`);
});
