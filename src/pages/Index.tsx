import { ChatContainer } from "@/components/ChatContainer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            AI Chatbot
          </h1>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="h-[calc(100vh-73px)]">
          <ChatContainer />
        </div>
      </main>
    </div>
  );
};

export default Index;
