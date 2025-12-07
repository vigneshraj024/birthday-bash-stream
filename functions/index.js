const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');

const PIXVERSE_BASE_URL = 'https://api.pixverse.ai/v1';

// Upload image
exports.uploadImage = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            const { image } = req.body;
            const apiKey = functions.config().pixverse.apikey;

            const response = await axios.post(
                `${PIXVERSE_BASE_URL}/upload-image`,
                { image },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            res.json(response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({
                error: error.response?.data || error.message
            });
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
            const { imageId, prompt } = req.body;
            const apiKey = functions.config().pixverse.apikey;

            const response = await axios.post(
                `${PIXVERSE_BASE_URL}/generate-video`,
                {
                    image_id: imageId,
                    prompt,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );

            res.json(response.data);
        } catch (error) {
            console.error('Error generating video:', error);
            res.status(500).json({
                error: error.response?.data || error.message
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
