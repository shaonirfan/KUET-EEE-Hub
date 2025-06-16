import { NextResponse } from 'next/server';

// n8n webhook URL - replace with your actual n8n webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat';

export async function POST(req: Request) {
  try {
    const { message: userMessage, context, chat_id } = await req.json();

    // Call n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        context,
        chat_id,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process message');
    }

    // Try to parse as JSON, fallback to text
    let data: any;
    let text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    // If n8n returns a JSON object with content/output, extract it
    let reply = '';
    if (data && typeof data === 'object') {
      reply = data.content || data.output || '';
    } else {
      reply = text;
    }

    if (!reply) {
      return new Response('Sorry, I encountered an error. Please try again.', { status: 500 });
    }

    return new Response(reply, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
} 