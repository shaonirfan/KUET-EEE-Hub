
// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In a real setup, you would get this from an environment variable
const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || 'YOUR_N8N_WEBHOOK_URL_HERE'; // Replace with your actual n8n webhook URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    // Simulate calling n8n webhook if N8N_WEBHOOK_URL is the placeholder
    // In a real application, you would ALWAYS call your n8n webhook.
    if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE') {
      // console.log("Simulating n8n call as N8N_WEBHOOK_URL is not set.");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      let botReply = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        botReply = "Hello! I'm the KUET EEE Hub assistant. How can I help you find resources today?";
      } else if (lowerMessage.includes('vlsi')) {
        // Simulate finding a resource and providing links
        const resourceName = "VLSI Design Comprehensive Notes (4th Year)";
        const viewUrl = "https://docs.google.com/document/d/exampleview/view?usp=sharing"; // Placeholder
        const downloadUrl = "https://drive.google.com/uc?export=download&id=exampledownload"; // Placeholder
        botReply = `I found a resource that might be helpful: \n'${resourceName}'.\nYou can [View it here](${viewUrl}) or [Download it directly](${downloadUrl}).\nLet me know if you need anything else!`;
      } else if (lowerMessage.includes('notes') || lowerMessage.includes('slides')) {
        botReply = "For notes or slides, please specify the course name or year. For example, '4th year VLSI notes' or 'slides for EEE 2101'.";
      } else if (lowerMessage.includes('job prep')) {
        const resourceName = "Common Interview Questions - EEE.pdf";
        const viewUrl = "https://docs.google.com/document/d/examplejobprep/view?usp=sharing";
        const downloadUrl = "https://drive.google.com/uc?export=download&id=examplejobprep";
        botReply = `For job preparation, you might find '${resourceName}' useful. \n[View Document](${viewUrl}) | [Download Document](${downloadUrl}).\nCheck the 'Resources' section for more under the 'Job Preparation' category.`;
      } else if (lowerMessage.includes('book')) {
        botReply = "Looking for books? You can browse the 'Books' category or search by specific course names in the Resources section. For example, I found 'Fundamentals of Electric Circuits by Alexander & Sadiku'. I can provide a link if you specify you'd like one for this book.";
      } else if (lowerMessage.includes('thank')) {
        botReply = "You're welcome! Let me know if there's anything else.";
      }
      else {
        botReply = `I've received your message: "${userMessage}". I'll try my best to find relevant materials. You can always browse all resources in the 'Resources' section. If you're looking for something specific, try asking like "4th year VLSI notes".`;
      }
      return NextResponse.json({ reply: botReply });

    } else {
      // Actual call to n8n webhook
      // console.log(`Forwarding message to n8n: ${userMessage}`);
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Adjust the body structure based on what your n8n webhook expects
        body: JSON.stringify({ message: userMessage, /* any other context you want to send */ }),
      });

      if (!n8nResponse.ok) {
        const errorBody = await n8nResponse.text();
        console.error('n8n webhook error:', n8nResponse.status, errorBody);
        throw new Error(`n8n webhook failed with status ${n8nResponse.status}`);
      }

      const n8nData = await n8nResponse.json();
      // Assuming n8n responds with a JSON like { "reply": "..." }
      // The reply should contain Markdown links if you've configured Gemini to produce them.
      const botReply = n8nData.reply || "I received a response, but it was not in the expected format."; 
      return NextResponse.json({ reply: botReply });
    }

  } catch (error) {
    console.error('Error in /api/chat:', error);
    let message = 'An unknown error occurred while processing your chat message.';
    if (error instanceof Error) {
      message = error.message;
    }
    // Return a user-friendly error message
    return NextResponse.json({ 
      reply: `Sorry, I encountered an issue trying to process your request. Please try again later or check the console for details. (Details: ${message})` 
    }, { status: 200 }); // Send 200 so frontend can display it as a bot message
  }
}
