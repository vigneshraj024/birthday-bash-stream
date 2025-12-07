// Direct test of Pixverse API key
const API_KEY = 'sk-8755922f136b65fcdb09d6f2eaee0572';

async function testPixverseKey() {
    console.log('Testing Pixverse API key:', API_KEY);
    console.log('Endpoint: https://app-api.pixverse.ai/openapi/v2/img/upload');

    try {
        // Simple test image (1x1 pixel PNG in base64)
        const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        const response = await fetch('https://app-api.pixverse.ai/openapi/v2/img/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-KEY': API_KEY,
            },
            body: JSON.stringify({ image: testImage }),
        });

        console.log('\n=== RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));

        const text = await response.text();
        console.log('\n=== RESPONSE BODY ===');
        console.log(text);

        // Try to parse as JSON
        try {
            const json = JSON.parse(text);
            console.log('\n=== PARSED JSON ===');
            console.log(JSON.stringify(json, null, 2));

            if (json.ErrCode === 0) {
                console.log('\n✅ SUCCESS! API key is valid!');
            } else {
                console.log('\n❌ API returned error:', json.ErrMsg);
            }
        } catch (e) {
            console.log('\n❌ Response is NOT JSON. This means:');
            console.log('1. API key is invalid');
            console.log('2. API endpoint is wrong');
            console.log('3. Account needs verification');
        }

    } catch (error) {
        console.error('\n❌ Network error:', error.message);
    }
}

testPixverseKey();
