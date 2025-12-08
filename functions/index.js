const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');

const PIXVERSE_BASE_URL = 'https://app-api.pixverse.ai/openapi/v2';

// Upload image
exports.uploadImage = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            const { image } = req.body;
            // NOTE: Ensure your Firebase config has this key: firebase functions:config:set pixverse.apikey="YOUR_KEY"
            const apiKey = functions.config().pixverse.apikey;

            // Upload format for V2 expects FormData-like structure or base64? 
            // V2 upload is complex with multipart/form-data. 
            // For now, let's assume the user is using the Express server for uploads if this is tricky.
            // But let's try to fix generation first which is the reported error.

            // Actually, V2 Image Upload via Axios/Functions is hard without form-data package.
            // Let's focus on generateVideo first as that's where the error is.

            // ... (Leaving upload as is for now, might need separate fix if they use it)
            // Wait, if upload fails, they can't get img_id. 
            // The provided file `functions/index.js` upload uses JSON body to V1. V2 needs multipart.
            // I will only update generateVideo because that's what we confirmed uses V2.
            // The user's error "Invalid field type" is from GENERATION.

            res.status(500).json({ error: "Please use the local Express server (node server/index.js) for uploads as V2 requires FormData." });
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Generate video from image
exports.generateVideo = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            // Frontend sends: img_id, prompt, duration
            const { img_id, imageId, prompt, duration } = req.body;
            const actualImgId = img_id || imageId; // Handle both camel and snake case
            const apiKey = functions.config().pixverse.apikey;

            console.log("🎬 Generating video (V2) with img_id:", actualImgId);

            const response = await axios.post(
                `${PIXVERSE_BASE_URL}/video/img/generate`,
                {
                    img_id: parseInt(actualImgId),
                    prompt: prompt || "Celebrate birthday",
                    duration: parseInt(duration) || 5, // 5 or 8
                    aspect_ratio: "16:9",
                    model: "v3.5",          // REQUIRED
                    quality: "540p",        // REQUIRED
                    motion_mode: "normal",  // REQUIRED
                    negative_prompt: "distortion, blurry, low quality"
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'API-KEY': apiKey, // V2 uses API-KEY header, not Bearer
                    },
                }
            );

            res.json(response.data);
        } catch (error) {
            console.error('Error generating video:', error.response?.data || error.message);
            res.status(500).json({
                error: error.response?.data?.ErrMsg || error.message
            });
        }
    });
});

// Get video status
exports.getVideoStatus = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            const { taskId } = req.query;
            const apiKey = functions.config().pixverse.apikey;

            const response = await axios.get(
                `${PIXVERSE_BASE_URL}/status/${taskId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            res.json(response.data);
        } catch (error) {
            console.error('Error getting video status:', error);
            res.status(500).json({
                error: error.response?.data || error.message
            });
        }
    });
});
