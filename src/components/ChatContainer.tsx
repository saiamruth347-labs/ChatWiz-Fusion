import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { useToast } from "@/hooks/use-toast";
import { Menu, Sparkles, Sliders, Database, Info, HelpCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  files?: File[];
}

interface ChatContainerProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const ChatContainer = ({ sidebarOpen, setSidebarOpen, setMobileSidebarOpen }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("fusion-3.5");
  const [ollamaModel, setOllamaModel] = useState("llama3");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: string, files?: File[]) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage, files }];
    setMessages(newMessages);
    setIsLoading(true);

    const isOllama = activeModel === "ollama";
    const url = isOllama ? "http://localhost:11434/v1/chat/completions" : CHAT_URL;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (!isOllama) {
      headers["Authorization"] = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: isOllama 
          ? JSON.stringify({
              model: ollamaModel,
              messages: newMessages.map(m => ({ role: m.role, content: m.content })),
              stream: true
            })
          : JSON.stringify({ 
              messages: newMessages,
              model: activeModel 
            }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    const newMessages = [...messages, { role: "user" as const, content: `🎨 Generate: ${prompt}` }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: newMessages,
          generateImage: true 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: data.text || "Here's your generated image!",
          image: data.image
        }
      ]);
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: { prompt: string; type: "chat" | "image" }) => {
    if (suggestion.type === "image") {
      generateImage(suggestion.prompt);
    } else {
      streamChat(suggestion.prompt);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates (Max 8 degrees rotation)
    const rotateX = -(y / (rect.height / 2)) * 8; 
    const rotateY = (x / (rect.width / 2)) * 8;
    
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
    card.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 15px rgba(99, 102, 241, 0.15)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    card.style.boxShadow = "none";
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Top Application Bar */}
      <header className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Desktop Sidebar Toggle when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden md:flex p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 md:hidden">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-base bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Fusion
            </span>
          </div>

          {/* Model Switcher Dropdown */}
          <div className="hidden sm:flex items-center gap-2 bg-secondary/50 rounded-xl px-2.5 py-1 border border-border/40 hover:border-border transition-colors">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground/80 focus:outline-none cursor-pointer pr-1"
            >
              <option value="fusion-3.5" className="dark:bg-zinc-900">⚡ Fusion-X 3.5 (Recommended)</option>
              <option value="fusion-vision" className="dark:bg-zinc-900">👁️ Vision-Multimodal</option>
              <option value="creative-art" className="dark:bg-zinc-900">🎨 Creative-Art-v2</option>
              <option value="ollama" className="dark:bg-zinc-900">🦙 Ollama (Local CLI LLM)</option>
            </select>
          </div>

          {/* Ollama Model Input Field */}
          {activeModel === "ollama" && (
            <div className="flex items-center gap-1.5 bg-secondary/40 border border-border/55 rounded-xl px-2 py-0.5 animate-in fade-in slide-in-from-left-2 duration-200">
              <span className="text-[10px] font-bold text-muted-foreground uppercase pl-1 font-mono">Model:</span>
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="e.g. llama3.2"
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none w-20 sm:w-24 placeholder:text-muted-foreground/50 border-0 p-0"
              />
            </div>
          )}
        </div>

        {/* Right Action Icons & Glowing Supabase Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <Database className="w-3 h-3" />
              SUPABASE ONLINE
            </span>
          </div>
          
          <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors hidden sm:block">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Messaging Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin relative">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 max-w-3xl mx-auto px-4 relative overflow-hidden">
            {/* 3D Cyber grid floor in background */}
            <div className="absolute inset-0 cyber-grid-floor opacity-45 dark:opacity-25 pointer-events-none select-none"></div>

            {/* 3D Floating Rings Hologram */}
            <div className="relative w-28 h-28 flex items-center justify-center animate-float-3d perspective-1000 preserve-3d z-10">
              {/* Glowing aura */}
              <div className="absolute inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-xl opacity-30"></div>
              {/* Outer Ring */}
              <div className="absolute w-28 h-28 rounded-full border border-primary/30 border-dashed animate-rotate-y preserve-3d"></div>
              {/* Middle Ring */}
              <div className="absolute w-22 h-22 rounded-full border-2 border-purple-500/20 border-double animate-rotate-x preserve-3d"></div>
              {/* Center core */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border border-white/10 shadow-lg select-none transform translate-z-[20px] shadow-glow">
                <Sparkles className="text-white w-7 h-7" />
              </div>
            </div>
            
            <div className="space-y-2.5 z-10">
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent sm:text-4xl">
                ChatWiz Fusion
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Unlock the power of unified AI workflows. Generate artwork, debug production code, or consult our specialized customer agent.
              </p>
            </div>

            {/* Suggestions Cards with 3D Tilt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-4 z-10 perspective-1000 preserve-3d">
              {[
                { icon: "💬", text: "Customer Support Info", prompt: "What features do you support and how can you help me?", type: "chat" as const },
                { icon: "🎨", text: "Creative Art Studio", prompt: "Generate an image of a cybernetic wizard using magic fusion in a retro-futuristic city.", type: "image" as const },
                { icon: "💻", text: "Code Assistant", prompt: "Write a React hook to fetch and cache data using local storage.", type: "chat" as const },
                { icon: "🚀", text: "Deep Discussion", prompt: "What are the key technical concepts behind Large Language Models and edge functions?", type: "chat" as const },
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="flex items-start gap-4.5 p-4.5 bg-card border border-border/80 rounded-2xl text-left group transition-all duration-200 ease-out shadow-sm preserve-3d cursor-pointer active:scale-95"
                >
                  <span className="text-2xl p-2 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors select-none transform translate-z-[20px]">
                    {suggestion.icon}
                  </span>
                  <div className="space-y-1 transform translate-z-[15px]">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {suggestion.text}
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {suggestion.prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                role={message.role} 
                content={message.content}
                image={message.image}
                files={message.files}
              />
            ))}
          </div>
        )}
        
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="max-w-4xl mx-auto">
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel with glassmorphism */}
      <div className="border-t border-border/50 bg-card/60 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSend={streamChat} 
            onGenerateImage={generateImage}
            disabled={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};
