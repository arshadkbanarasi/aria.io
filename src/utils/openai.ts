// OpenAI API Integration
// To use this chatbot with actual AI responses, you need to:
// 1. Sign up for an OpenAI account at https://platform.openai.com/
// 2. Generate an API key from your dashboard
// 3. Replace 'PUT_YOUR_API_KEY_HERE' with your actual API key
// 4. Uncomment the actual API call code below

const OPENAI_API_KEY = 'PUT_YOUR_API_KEY_HERE';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToOpenAI(messages: ChatMessage[]): Promise<string> {
  // This is a mock response for demo purposes
  // Replace with actual OpenAI API call when you have an API key
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponses = [
        "I'm ARIA, your AI assistant! I'm currently running in demo mode. To enable full AI functionality, please add your OpenAI API key to the code.",
        "That's a great question! In demo mode, I can show you how the interface works. For real AI responses, connect your OpenAI API key.",
        "I'd love to help you with that! This is a demonstration of the chat interface. Add your OpenAI API key to unlock full AI capabilities.",
        "Interesting! I'm designed to be helpful, harmless, and honest. Right now I'm showing you the UI - add an API key for real conversations.",
        "I understand what you're asking. This beautiful interface is ready for real AI conversations once you configure your OpenAI API key!"
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      resolve(randomResponse);
    }, 1000 + Math.random() * 2000); // Simulate network delay
  });

  /* 
  // UNCOMMENT THIS CODE WHEN YOU HAVE AN OPENAI API KEY:
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are ARIA (Adaptive Reasoning & Intelligence Assistant), a helpful AI assistant. Be concise, accurate, and friendly in your responses.'
          },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI response. Please check your API key and try again.');
  }
  */
}

// Utility function to format messages for OpenAI API
export function formatMessagesForAPI(messages: { sender: string; content: string }[]): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}