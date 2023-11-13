// script.js
const modelHubURL = 'https://huggingface.co/';

/**
 * Initiates the training process by making a request to the backend.
 */
function startTraining() {
    document.getElementById('output').innerText = 'Training started...';

    axios.post('/start-training')
    .then(response => {
        document.getElementById('output').innerText = response.data.message;
    })
    .catch(error => {
        console.error('Error starting training:', error);
        document.getElementById('output').innerText = 'Error starting training.';
    });
}

/**
 * Stops the training process by making a request to the backend.
 */
function stopTraining() {
    document.getElementById('output').innerText = 'Stopping training...';

    axios.post('/stop-training')
    .then(response => {
        document.getElementById('output').innerText = response.data.message;
    })
    .catch(error => {
        console.error('Error stopping training:', error);
        document.getElementById('output').innerText = 'Error stopping training.';
    });
}

/**
 * Retrieves the number of human casualties and displays recommendations for improvement.
 */
function getCasualties() {
    document.getElementById('output').innerText = 'Fetching casualties...';

    axios.get('/get-casualties')
    .then(response => {
        const casualties = response.data.casualties;
        const recommendations = response.data.recommendations;

        const outputMessage = `Human casualties: ${casualties}\nRecommendations: ${recommendations}`;
        document.getElementById('output').innerText = outputMessage;
    })
    .catch(error => {
        console.error('Error getting casualties:', error);
        document.getElementById('output').innerText = 'Error getting casualties.';
    });
}

/**
 * Tests an AI model with user-input parameters.
 */
function testAIModel() {
    const modelName = document.getElementById('modelName').value;
    const parameter1 = document.getElementById('parameter1').value;
    const parameter2 = document.getElementById('parameter2').value;

    // Construct the URL for the Hugging Face Model Hub
    const modelURL = `${modelHubURL}${modelName}`;

    // Fetch the pre-trained model from the Hugging Face Model Hub
    axios.get(modelURL)
    .then(response => {
        const model = response.data;

        // Use the model for inference with the user-input parameters
        const inferenceResult = performInference(model, parameter1, parameter2);

        // Display the result
        const outputMessage = `Model: ${modelName}\nInference Result: ${inferenceResult}`;
        document.getElementById('output').innerText = outputMessage;
    })
    .catch(error => {
        console.error('Error fetching model from Hugging Face:', error);
        document.getElementById('output').innerText = 'Error fetching model from Hugging Face.';
    });
}

/**
 * Performs text generation using the GPT-2 model and user-input parameters.
 * This is just an example; you need to adapt it based on the specific task of the model.
 * Install 'transformers' and 'torch' libraries: npm install transformers torch
 */
async function performInference(model, parameter1, parameter2) {
    try {
        const transformers = require('transformers');
        const torch = require('torch');

        const tokenizer = new transformers.GPT2Tokenizer.fromPretrained(model);
        const modelInstance = new transformers.GPT2LMHeadModel.fromPretrained(model);

        // Encode the input text
        const input = `${parameter1} ${parameter2}`;
        const inputIds = tokenizer.encode(input, { return_tensors: 'pt' });

        // Generate text based on the input
        const output = await modelInstance.generate(inputIds);
        const decodedOutput = tokenizer.decode(output[0], { skipSpecialTokens: true });

        return decodedOutput;
    } catch (error) {
        console.error('Error performing inference:', error);
        return 'Error performing inference.';
    }
}
