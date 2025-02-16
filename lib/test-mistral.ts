import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY || 'your_api_key';
const client = new Mistral({ apiKey: apiKey });

async function testMistral() {
  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: 'What is the best French cheese?' }],
    });
    console.log('Chat:', chatResponse?.choices?.[0]?.message?.content || 'No response');
  } catch (error) {
    console.error('Error testing Mistral:', error);
  }
}

testMistral();
