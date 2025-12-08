
import fetch from 'node-fetch';
import FormData from 'form-data';

const API_KEY = 'sk-8755922f136b65fcdb09d6f2eaee0572';

async function runDebug() {
    console.log('🚀 Starting Final Debug Script (Testing Models)...');

    // 1. Upload
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(testImageBase64, 'base64');
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

    const uploadRes = await fetch('https://app-api.pixverse.ai/openapi/v2/image/upload', {
        method: 'POST',
        headers: { 'API-KEY': API_KEY, ...formData.getHeaders() },
        body: formData
    });

    const uploadData = await uploadRes.json();
    if (uploadData.ErrCode !== 0) { console.error('Upload Failed', uploadData); return; }
    const imgId = uploadData.Resp.img_id;
    console.log(`✅ Uploaded img_id: ${imgId}`);

    // Test Models
    const models = ['v3.5', 'v4.0', 'v4.5', 'v5.0', '1.0', '2.0'];

    for (const model of models) {
        console.log(`\n🧪 Testing Model: "${model}"`);
        try {
            const body = {
                img_id: parseInt(imgId),
                prompt: 'A simple celebration',
                duration: 5,
                aspect_ratio: '16:9',
                model: model
            };
            const res = await fetch('https://app-api.pixverse.ai/openapi/v2/video/img/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'API-KEY': API_KEY },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            console.log(`Scanning result for ${model}:`, JSON.stringify(data));

            if (data.ErrCode === 0) {
                console.log(`🎉 SUCCESS! Model "${model}" works!`);
                return; // Stop on first success
            }
        } catch (e) {
            console.error(`Error testing ${model}:`, e.message);
        }
    }

    // Test without model (implicit default?)
    console.log(`\n🧪 Testing NO Model parameter`);
    try {
        const body = {
            img_id: parseInt(imgId),
            prompt: 'A simple celebration',
            duration: 5,
            aspect_ratio: '16:9'
        };
        const res = await fetch('https://app-api.pixverse.ai/openapi/v2/video/img/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'API-KEY': API_KEY },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log(`Scanning result for NO MODEL:`, JSON.stringify(data));
    } catch (e) {
        console.error(`Error testing NO MODEL:`, e.message);
    }
}

runDebug();
