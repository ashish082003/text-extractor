document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const formData = new FormData(this);  

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image and extract text');
        }

        const result = await response.json();
        
        document.getElementById('extractedText').textContent = result.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('extractedText').textContent = 'Error extracting text. Please try again.';
    }
});
