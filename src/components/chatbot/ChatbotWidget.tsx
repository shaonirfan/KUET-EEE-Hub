
'use client';

import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Add a slight delay to ensure the input is visible before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
       // Add a welcome message from the bot when the chat opens for the first time
      if (messages.length === 0) {
        setMessages([
          { id: Date.now().toString(), text: "Hello! I'm the KUET EEE Hub assistant. How can I help you find resources today?", sender: 'bot' }
        ]);
      }
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real app, you'd replace this with your n8n webhook URL
      // or a Next.js API route that securely calls your n8n webhook.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(), // Ensure unique ID
        text: data.reply || "Sorry, I couldn't understand that.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching bot reply:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Refocus input after bot replies or on error
      setTimeout(() => {
         inputRef.current?.focus();
      }, 100);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        aria-label="Open chat"
      >
        <MessageSquare size={28} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] sm:h-[550px] shadow-xl z-50 flex flex-col bg-card/80 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Bot className="text-primary" />
          <CardTitle className="text-lg">EEE Resouce Bot</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleOpen} aria-label="Close chat">
          <X size={20} />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-max max-w-[85%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
                  msg.sender === 'user'
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 py-2">
                 <Bot size={20} className="text-muted-foreground animate-pulse" />
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Bot is typing...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/40">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask about resources..."
            className="flex-1"
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
