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
    } else if (style === 'oiltpainting') {
        finalPrompt = `Create a beautiful oil painting that showcases rich textures and vibrant colors, emphasizing brushstroke techniques typical of traditional oil art. The composition should convey depth and emotion, capturing light and shadow in a harmonious way. Focus on blending and layering to achieve a realistic or impressionistic effect, while maintaining the distinctive qualities of oil painting. ${basePrompt}`;
    } else if (style === 'illustration') {
        finalPrompt = `Generate a detailed illustration that combines imaginative elements with clarity and creativity. The style should be vibrant and engaging, suitable for storytelling or character design. Focus on dynamic composition, expressive line work, and a cohesive color palette to bring the illustration to life. Ensure that the final artwork communicates its theme effectively while appealing to the viewer's imagination. ${basePrompt}`;
    } else if (style === 'anime') {
        finalPrompt = `Create an anime-style artwork with a focus on expressive characters and dynamic action. Use bold lines, vibrant colors, and exaggerated emotions to convey a sense of adventure or drama. The background should complement the characters with stylized landscapes or urban settings, adding depth to the scene. ${basePrompt}`;
    } else if (style === 'cyberpunk') {
        finalPrompt = `Generate a futuristic cyberpunk scene featuring neon-lit cityscapes, advanced technology, and a dystopian atmosphere. Incorporate high-tech elements like holograms, flying vehicles, and cybernetic enhancements. The image should feel gritty and chaotic, with a focus on the contrast between humanity and machines. ${basePrompt}`;
    } else if (style === 'fantasy') {
        finalPrompt = `Create a fantasy scene with mythical creatures, magical landscapes, and legendary heroes. Use vivid colors and imaginative designs to evoke a sense of wonder and adventure. The scene should feature elements like castles, enchanted forests, or mystical artifacts, transporting the viewer to a world of magic. ${basePrompt}`;
    } else if (style === 'noir') {
        finalPrompt = `Generate a film noir-style image with a dark, moody atmosphere. Use black and white tones with heavy shadows and sharp contrasts. The scene should evoke mystery, crime, or detective themes, featuring smoky streets, trench coats, and vintage cityscapes. ${basePrompt}`;
    } else if (style === 'surreal') {
        finalPrompt = `Create a surreal artwork that defies logic and embraces dreamlike imagery. Use abstract forms, impossible landscapes, and imaginative distortions of reality. The composition should feel otherworldly, blending fantasy and reality in unexpected ways to challenge the viewer's perception. ${basePrompt}`;
    } else if (style === 'darkfantasy') {
        finalPrompt = `Generate a dark fantasy scene with a haunting atmosphere, drawing inspiration from the eerie, gothic worlds popularized on TikTok. Incorporate supernatural creatures, shadowy landscapes, and a sense of foreboding magic. Use a dark color palette with dramatic lighting, creating a mystical yet ominous ambiance. Let the image evoke a feeling of both awe and dread. ${basePrompt}`;
    } else if (style === 'profile') {
        finalPrompt = `Generate a A minimalistic, vibrant profile picture with soft gradients, simple shapes, and balanced composition. The style should be modern and abstract, emphasizing clean lines and smooth transitions. Incorporate a color palette that enhances contrast without being overwhelming, suitable for a versatile and appealing profile icon.
 ${basePrompt}`;
    }
    

    const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
    const API_KEY = "Bearer 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";
    const loadingMessage = document.getElementById('loading');
    loadingMessage.classList.remove('hidden');
    loadingMessage.innerHTML = 'Generating images...';

    const newRow = document.createElement('div');
    newRow.className = 'library-row';
    document.getElementById('library').insertBefore(newRow, document.getElementById('library').firstChild);

    const promises = [];
    
    for (let i = 0; i < 4; i++) {
        const promptWithNumber = finalPrompt + (promptCounter + i + 1);
        const placeholder = document.createElement('div');
        placeholder.className = 'library-image';
        placeholder.innerHTML = 'Loading...';
        newRow.appendChild(placeholder);

        const fetchPromise = fetch(API_URL, {
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
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status code ${response.status}: ${response.statusText}`);
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = "Library Image";
            imgElement.className = 'library-image';
            placeholder.innerHTML = '';
            placeholder.appendChild(imgElement);
        })
        .catch(error => {
            placeholder.innerHTML = "Error loading image.";
            console.error('Image generation failed:', error);
        });

        promises.push(fetchPromise);
    }

    Promise.all(promises).finally(() => {
        promptCounter += 4;
        loadingMessage.classList.add('hidden');
    });
});
