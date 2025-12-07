import { serve } from 'std/http/server.ts'

const PIXVERSE_API_KEY = Deno.env.get('PIXVERSE_API_KEY')
const PIXVERSE_BASE_URL = 'https://api.pixverse.ai/v1'

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    }

    try {
        const { action, data } = await req.json()

        // Generate video from image
        if (action === 'generate') {
            const response = await fetch(`${PIXVERSE_BASE_URL}/image-to-video`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PIXVERSE_API_KEY}`,
                },
                body: JSON.stringify({
                    image: data.image,
                    prompt: data.prompt,
                    seed: data.seed || -1,
                    aspect_ratio: data.aspect_ratio || '16:9',
                }),
            })

            const result = await response.json()

            return new Response(JSON.stringify(result), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })
        }

        // Poll for video status
        if (action === 'poll') {
            const response = await fetch(`${PIXVERSE_BASE_URL}/videos/${data.videoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${PIXVERSE_API_KEY}`,
                },
            })

            const result = await response.json()

            return new Response(JSON.stringify(result), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    }
})
