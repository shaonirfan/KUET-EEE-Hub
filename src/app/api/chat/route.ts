
// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    // Simulate a delay and bot processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    let botReply = '';

    // Simple keyword-based responses (Placeholder logic)
    // In a real application, this is where you would:
    // 1. Forward the `userMessage` to your n8n webhook.
    // 2. n8n workflow processes it (calls Gemini, queries `/api/resources`, etc.).
    // 3. n8n sends back the actual AI-generated response.
    // 4. This Next.js route then returns that n8n response.

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      botReply = "Hello there! How can I assist you with KUET EEE resources today?";
    } else if (lowerMessage.includes('vlsi')) {
      botReply = "Looking for VLSI resources? You can filter by '4th Year' and 'VLSI Design' in the resources section. I can also try to search if you provide more details.";
    } else if (lowerMessage.includes('notes') || lowerMessage.includes('slides')) {
      botReply = "For notes or slides, please specify the course name, year, or teacher if possible. You can also browse the 'Lecture Notes' category.";
    } else if (lowerMessage.includes('job prep')) {
      botReply = "We have a dedicated 'Job Preparation' category in the resources section. Check it out!";
    } else if (lowerMessage.includes('book')) {
      botReply = "Searching for books? Try the 'Books' category or search by course name.";
    } else {
      botReply = `I received your message: "${userMessage}". I'm still learning, but you can browse all materials in the Resources section!`;
    }
    
    // For now, this route will just echo or give a canned response.
    // Replace with your actual n8n call logic.
    // const n8nWebhookUrl = 'YOUR_N8N_WEBHOOK_URL';
    // const n8nResponse = await fetch(n8nWebhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query: userMessage, /* any other context */ }),
    // });
    // if (!n8nResponse.ok) throw new Error('n8n webhook error');
    // const n8nData = await n8nResponse.json();
    // botReply = n8nData.reply;


    return NextResponse.json({ reply: botReply });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: 'Failed to process chat message', details: message }, { status: 500 });
  }
}
