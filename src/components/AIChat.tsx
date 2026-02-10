import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          'I understand your request. This is a demo response. In production, this would connect to your AI backend via Supabase Edge Functions.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className='bg-gradient-card flex h-[600px] flex-col rounded-xl border border-border shadow-card backdrop-blur-sm'>
      {/* Header */}
      <div className='flex items-center gap-3 border-b border-border p-4'>
        <div className='bg-gradient-primary shadow-glow rounded-lg p-2'>
          <Bot className='h-5 w-5 text-primary-foreground' />
        </div>
        <div>
          <h3 className='font-semibold'>AI Assistant</h3>
          <p className='text-xs text-muted-foreground'>Always here to help</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className='flex-1 p-4'>
        <div className='space-y-4'>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`rounded-lg p-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className='h-5 w-5' />
                ) : (
                  <Bot className='h-5 w-5' />
                )}
              </div>
              <div
                className={`flex max-w-[80%] flex-col ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p className='text-sm'>{message.content}</p>
                </div>
                <span className='mt-1 text-xs text-muted-foreground'>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex gap-3'>
              <div className='rounded-lg bg-secondary p-2'>
                <Bot className='h-5 w-5' />
              </div>
              <div className='flex items-center gap-2 rounded-lg bg-secondary p-3'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span className='text-sm text-muted-foreground'>
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className='border-t border-border p-4'>
        <div className='flex gap-2'>
          <Input
            className='flex-1 bg-secondary/50'
            disabled={isLoading}
            placeholder='Type your message...'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button
            className='bg-gradient-primary shadow-glow'
            disabled={isLoading || !input.trim()}
            onClick={handleSend}
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};
