import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const PIXVERSE_API_KEY = process.env.PIXVERSE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Pixverse proxy server is running' });
});

// Upload image to Pixverse using FormData
app.post('/api/pixverse/upload-image', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        console.log('📤 Uploading image to Pixverse...');

        // Convert base64 to buffer
        const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Create FormData
        const formData = new FormData();
        formData.append('image', imageBuffer, {
            filename: 'birthday.jpg',
            contentType: 'image/jpeg',
        });

        // Generate unique Ai-trace-id (REQUIRED!)
        const traceId = `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Upload using multipart/form-data
        const response = await fetch('https://app-api.pixverse.ai/openapi/v2/image/upload', {
            method: 'POST',
            headers: {
                'API-KEY': PIXVERSE_API_KEY,
                'Ai-trace-id': traceId,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        const responseText = await response.text();
        console.log('📄 Upload response status:', response.status);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ Failed to parse response');
            return res.status(500).json({
                error: 'Pixverse API returned invalid response',
                statusCode: response.status
            });
        }

        console.log('✅ Image uploaded:', data);

        if (data.ErrCode !== 0) {
            return res.status(400).json({ error: data.ErrMsg || 'Upload failed' });
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate video from image
app.post('/api/pixverse/generate-video', async (req, res) => {
    try {
        const { img_id, prompt } = req.body;

        if (!img_id) {
            return res.status(400).json({ error: 'img_id is required' });
        }

        console.log('🎬 Generating video with img_id:', img_id);

        // Generate unique Ai-trace-id (REQUIRED!)
        const traceId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Simplified request with only required parameters
        const requestBody = {
            img_id: parseInt(img_id),
            prompt: prompt || 'Create a joyful birthday celebration video',
            duration: 6,
            quality: '540p',
            model: 'v4.5',
            aspect_ratio: '16:9',  // Ensure 16:9 widescreen format
        };

        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch('https://app-api.pixverse.ai/openapi/v2/video/img/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-KEY': PIXVERSE_API_KEY,
                'Ai-trace-id': traceId,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('✅ Video generation response:', data);

        if (data.ErrCode !== 0) {
            return res.status(400).json({ error: data.ErrMsg || 'Generation failed', details: data });
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Check video status
app.get('/api/pixverse/status/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        console.log('🔍 Checking status for video:', videoId);

        // Generate unique Ai-trace-id
        const traceId = `status-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const response = await fetch(`https://app-api.pixverse.ai/openapi/v2/video/result/${videoId}`, {
            method: 'GET',
            headers: {
                'API-KEY': PIXVERSE_API_KEY,
                'Ai-trace-id': traceId,
            },
        });

        const data = await response.json();
        console.log('✅ Status response:', data);

        if (data.ErrCode !== 0) {
            return res.status(400).json({ error: data.ErrMsg || 'Status check failed' });
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Status check error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Pixverse proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Ready to proxy requests to Pixverse API`);
    console.log(`🔑 API Key: ${PIXVERSE_API_KEY ? 'YES' : 'NO'}`);
});
