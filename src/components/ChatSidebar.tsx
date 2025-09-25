import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Plus, MessageSquare, Settings, HelpCircle, X } from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

export function ChatSidebar({ isOpen, onClose, onNewChat }: ChatSidebarProps) {
  const [chatHistory] = useState<ChatHistoryItem[]>([
    { id: '1', title: 'What is artificial intelligence?', timestamp: new Date() },
    { id: '2', title: 'Help with React components', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'JavaScript best practices', timestamp: new Date(Date.now() - 172800000) },
    { id: '4', title: 'CSS Grid vs Flexbox', timestamp: new Date(Date.now() - 259200000) },
    { id: '5', title: 'API integration tips', timestamp: new Date(Date.now() - 345600000) },
  ]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-muted/50 to-background/95 backdrop-blur-sm border-r border-border/50 z-50 lg:relative lg:translate-x-0 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h2 className="font-semibold">Chat History</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-muted/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {chat.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & FAQ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}