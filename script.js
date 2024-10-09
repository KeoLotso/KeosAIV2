let promptCounter = 0;

document.getElementById('generateBtn').addEventListener('click', async () => {
    const basePrompt = document.getElementById('prompt').value;
    let width = parseInt(document.getElementById('width').value);
    let height = parseInt(document.getElementById('height').value);
    const style = document.getElementById('style').value;

    width = Math.floor(width / 8) * 8;
    height = Math.floor(height / 8) * 8;

    let finalPrompt = basePrompt;
    if (style === 'pixelArt') {
        finalPrompt = `Create a pixel art scene with a grid-based style, using distinct, blocky pixels and a limited color palette for a retro, 8-bit aesthetic. Ensure clear outlines and solid colors to emphasize simplicity and charm. Capture the essence of the scene while maintaining a playful feel. ${basePrompt}`;
    } else if (style === 'texture') {
        finalPrompt = `Create a seamless looping pixel art texture with a grid-based style, featuring distinct, blocky pixels and a limited color palette for a retro, 8-bit aesthetic. Ensure that the edges align perfectly for seamless repetition, with clear outlines and solid colors to maintain simplicity. The texture should evoke a sense of depth and interest while remaining visually cohesive. ${basePrompt}`;
    } else if (style === `oiltpainting`){
        finalPrompt = `Create a beautiful oil painting that showcases rich textures and vibrant colors, emphasizing brushstroke techniques typical of traditional oil art. The composition should convey depth and emotion, capturing light and shadow in a harmonious way. Focus on blending and layering to achieve a realistic or impressionistic effect, while maintaining the distinctive qualities of oil painting. ${basePrompt}`;
    } else if (style === `illustration`){
        finalPrompt = `Generate a detailed illustration that combines imaginative elements with clarity and creativity. The style should be vibrant and engaging, suitable for storytelling or character design. Focus on dynamic composition, expressive line work, and a cohesive color palette to bring the illustration to life. Ensure that the final artwork communicates its theme effectively while appealing to the viewer's imagination. ${basePrompt}`;
    }

    const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
    const API_KEY = "Bearer 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";

    const newRow = document.createElement('div');
    newRow.className = 'library-row';
    document.getElementById('library').insertBefore(newRow, document.getElementById('library').firstChild);

    const loadingMessage = document.getElementById('loading');
    loadingMessage.classList.remove('hidden');
    loadingMessage.innerHTML = 'Generating images...';

    for (let i = 0; i < 4; i++) {
        const promptWithNumber = finalPrompt + (promptCounter + i + 1);
        const placeholder = document.createElement('div');
        placeholder.className = 'library-image';
        placeholder.innerHTML = 'Loading...';
        newRow.appendChild(placeholder);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: promptWithNumber,
                    parameters: {
                        width: width,
                        height: height
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status code ${response.status}: ${await response.text()}`);
            }

            const reader = response.body.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            const blob = new Blob(chunks);
            const imageUrl = URL.createObjectURL(blob);

            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = "Library Image";
            imgElement.className = 'library-image';
            placeholder.innerHTML = ''; 
            placeholder.appendChild(imgElement);
        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    }

    promptCounter += 4;
    loadingMessage.classList.add('hidden');
});
