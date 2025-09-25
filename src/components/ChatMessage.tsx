import { User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`p-4 ${isUser ? 'bg-muted/30' : 'bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-teal-500/5'}`}>
      <div className={`flex gap-4 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className={isUser ? 'bg-gradient-to-br from-green-400 to-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-600'}>
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className={`flex-1 space-y-2 max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="font-medium">
              {isUser ? 'You' : 'ARIA'}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className={`inline-block p-3 rounded-2xl ${
            isUser 
              ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white ml-auto' 
              : 'bg-white dark:bg-gray-800 border border-border/50'
          }`}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </div>

          {!isUser && (
            <div className="flex items-center gap-1 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}