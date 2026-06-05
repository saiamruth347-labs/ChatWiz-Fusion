import { useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { StitchDashboard } from "@/components/StitchDashboard";
import { StatsDashboard } from "@/components/StatsDashboard";
import { HeroScrollDemo } from "@/components/ui/scroll-demo";
import { Moon, Sun, MessageSquare, Plus, Sparkles, Menu, X, ChevronLeft, Compass, Activity, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "stitch" | "stats" | "scroll">("chat");

  // Mock chat history
  const recentChats = [
    { id: "1", title: "Customer Support Demo", date: "Today" },
    { id: "2", title: "Creative Sunset Art Generator", date: "Today" },
    { id: "3", title: "React TypeScript Boilerplate", date: "Yesterday" },
    { id: "4", title: "Supabase Schema Design", date: "2 days ago" },
  ];

  const handleNewChat = () => {
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border/80 transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0 md:w-64 md:opacity-100" : "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/80 flex justify-between items-center bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ChatWiz Fusion
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full w-8 h-8"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Sidebar Main Content / Scroller */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5 hover:from-primary/10 hover:to-purple-600/10 text-primary transition-all duration-300 font-medium text-sm group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            New Chat
          </button>

          {/* History List */}
          <div className="space-y-1.5">
            <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Recent Conversations
            </div>
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveTab("chat");
                  setMobileSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm hover:bg-secondary/80 transition-all duration-200 group border border-transparent hover:border-border/30",
                  activeTab === "chat" ? "text-foreground" : "text-foreground/80"
                )}
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="truncate flex-1">{chat.title}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border/50 my-2 pt-4 space-y-2">
            <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Dev Suite & Tools
            </div>
            <div className="grid grid-cols-1 gap-1">
              <button 
                onClick={() => {
                  setActiveTab("stitch");
                  setMobileSidebarOpen(false);
                }} 
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left",
                  activeTab === "stitch" 
                    ? "bg-secondary text-primary font-bold border border-border/40" 
                    : "text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <Compass className="w-4 h-4 text-purple-500" />
                <span>Stitch Integration</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("stats");
                  setMobileSidebarOpen(false);
                }} 
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left",
                  activeTab === "stats" 
                    ? "bg-secondary text-primary font-bold border border-border/40" 
                    : "text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Performance Stats</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("scroll");
                  setMobileSidebarOpen(false);
                }} 
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left",
                  activeTab === "scroll" 
                    ? "bg-secondary text-primary font-bold border border-border/40" 
                    : "text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <Scroll className="w-4 h-4 text-amber-500" />
                <span>Scroll Showcase</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer / User Profile Card */}
        <div className="p-3 border-t border-border/80 bg-card/40">
          {/* Progress Bar */}
          <div className="mb-3 px-2 space-y-1">
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
              <span>API Request Limits</span>
              <span>12% used</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse" style={{ width: "12%" }} />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/40 border border-border/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs select-none">
                HI
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground leading-tight">Developer Pro</p>
                <span className="text-[9px] bg-primary/10 text-primary dark:bg-primary/20 px-1.5 py-0.5 rounded font-medium uppercase">
                  Active
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-8 h-8 hover:bg-secondary-foreground/10"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-800" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Chat Panel */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Toggle button when sidebar is collapsed on desktop */}
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="hidden md:flex absolute top-4 left-4 z-20 rounded-full w-9 h-9 shadow-md border-border/80 bg-card hover:bg-secondary"
          >
            <ChevronLeft className="w-4 h-4 rotate-180 text-foreground" />
          </Button>
        )}

        <div className="h-full w-full overflow-hidden">
          {activeTab === "chat" ? (
            <ChatContainer 
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              setMobileSidebarOpen={setMobileSidebarOpen}
            />
          ) : activeTab === "stitch" ? (
            <StitchDashboard />
          ) : activeTab === "stats" ? (
            <StatsDashboard />
          ) : (
            <div className="h-full w-full overflow-y-auto">
              <HeroScrollDemo />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
