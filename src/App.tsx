import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChatSidebar } from './components/ChatSidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ScrollArea } from './components/ui/scroll-area';
import { sendMessageToOpenAI, formatMessagesForAPI } from './utils/openai';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

function ChatApp() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-teal-50/50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Loading ARIA...</p>
        </div>
      </div>
    );
  }

  // Show auth wrapper if user is not logged in
  if (!user) {
    return <AuthWrapper />;
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Format messages for API
      const apiMessages = formatMessagesForAPI([...messages, userMessage].map(m => ({
        sender: m.sender,
        content: m.content
      })));

      // Get AI response
      const aiResponse = await sendMessageToOpenAI(apiMessages);

      // Add AI response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get response from AI. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please make sure your OpenAI API key is configured correctly and try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
    toast.success('New chat started');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-teal-50/50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader onToggleSidebar={toggleSidebar} />

        {/* Messages Area */}
        <div className="flex-1 relative">
          {messages.length === 0 ? (
            <WelcomeScreen onStartChat={handleSendMessage} />
          ) : (
            <ScrollArea ref={scrollAreaRef} className="h-full">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="p-4 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-teal-500/5">
                  <div className="flex gap-4 max-w-4xl mx-auto">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">ARIA</span>
                        <span className="text-xs text-muted-foreground">thinking...</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        {/* Input Area */}
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChatApp />
    </AuthProvider>
  );
}