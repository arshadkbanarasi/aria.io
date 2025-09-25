import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Code, Lightbulb, BookOpen, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: (message: string) => void;
}

export function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const suggestions = [
    {
      icon: Code,
      title: "Code Help",
      description: "Help me debug my JavaScript code",
      prompt: "Can you help me debug a JavaScript function that's not working properly?"
    },
    {
      icon: Lightbulb,
      title: "Creative Ideas",
      description: "Brainstorm ideas for my project",
      prompt: "I need creative ideas for a web development project. Can you help me brainstorm?"
    },
    {
      icon: BookOpen,
      title: "Learning",
      description: "Explain complex concepts simply",
      prompt: "Can you explain how machine learning works in simple terms?"
    },
    {
      icon: Zap,
      title: "Quick Answers",
      description: "Get instant answers to questions",
      prompt: "What are the latest trends in web development for 2024?"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to ARIA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your Adaptive Reasoning & Intelligence Assistant. Ask me anything and I'll help you find the answers you need.
          </p>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm border-border/50"
              onClick={() => onStartChat(suggestion.prompt)}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <suggestion.icon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">What can ARIA do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">💡 Creative Problem Solving</h3>
              <p>Get innovative solutions and fresh perspectives on your challenges</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">🔍 Research & Analysis</h3>
              <p>Analyze data, research topics, and provide detailed explanations</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">⚡ Instant Support</h3>
              <p>Quick answers to technical questions and step-by-step guidance</p>
            </div>
          </div>
        </div>

        {/* API Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 max-w-md mx-auto">
            <strong>Note:</strong> This is a demo interface. To enable full AI functionality, connect your OpenAI API key in the settings.
          </p>
        </div>
      </div>
    </div>
  );
}