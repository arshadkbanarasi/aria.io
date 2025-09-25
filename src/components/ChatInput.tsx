import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border/50 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-teal-500/5 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ARIA anything..."
              className="min-h-[60px] max-h-[200px] resize-none border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/70 transition-colors"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div>Press Enter to send, Shift+Enter for new line</div>
          <div className="text-right">
            ARIA can make mistakes. Consider checking important information.
          </div>
        </div>
      </form>
    </div>
  );
}