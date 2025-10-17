import { ChatContainer } from "@/components/ChatContainer";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            ChatWiz Fusion
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-900" />
            )}
          </Button>
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
