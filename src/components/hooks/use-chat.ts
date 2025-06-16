import { useState } from 'react';
import { Recording } from '@/components/sections/OnlineClassRecordingsSection';
import { Resource } from '@/components/sections/ResourcesSection';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  type: string;
  data?: any;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (input: string) => Promise<void>;
}

function getOrCreateChatId() {
  let chatId = document.cookie
    .split('; ')
    .find(row => row.startsWith('chat_id='))
    ?.split('=')[1];
  if (!chatId) {
    chatId = crypto.randomUUID();
    document.cookie = `chat_id=${chatId}; path=/; max-age=31536000`;
  }
  return chatId;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (input: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      content: input,
      sender: 'user',
      type: 'text',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const chatId = getOrCreateChatId();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, chat_id: chatId }),
      });
      const data = await res.text(); // Expect plain text or HTML
      if (data) {
        const aiMessage: Message = {
          id: `${Date.now()}-ai`,
          content: data,
          sender: 'ai',
          type: 'text',
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          type: 'text',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
} 