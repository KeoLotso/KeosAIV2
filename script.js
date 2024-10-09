let promptCounter = 0;

document.getElementById('generateBtn').addEventListener('click', async () => {
    const basePrompt = document.getElementById('prompt').value;
    let width = parseInt(document.getElementById('width').value);
    let height = parseInt(document.getElementById('height').value);

    width = Math.floor(width / 8) * 8;
    height = Math.floor(height / 8) * 8;

    const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
    const API_KEY = "Bearer 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";

    const newRow = document.createElement('div');
    newRow.className = 'library-row';
    document.getElementById('library').insertBefore(newRow, document.getElementById('library').firstChild);

    const loadingMessage = document.getElementById('loading');
    loadingMessage.classList.remove('hidden');
    loadingMessage.innerHTML = 'Generating images...';

    for (let i = 0; i < 4; i++) {
        const promptWithNumber = basePrompt + (promptCounter + i + 1); // Increment prompt with numbers
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

    promptCounter += 4; // Increment promptCounter for the next set of images
    loadingMessage.classList.add('hidden');
});
