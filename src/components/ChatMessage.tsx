import { cn } from "@/lib/utils";
import { Bot, User, Paperclip } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
  files?: File[];
}

export const ChatMessage = ({ role, content, image, files }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-subtle",
          isUser
            ? "bg-gradient-to-br from-primary to-purple-600 text-primary-foreground"
            : "bg-card text-card-foreground border border-border"
        )}
      >
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-current/20">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-background/20 rounded-full text-xs"
              >
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[100px] truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {image && (
          <img 
            src={image} 
            alt="Generated content" 
            className="rounded-lg mb-2 max-w-full h-auto"
          />
        )}
        
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-subtle">
          <User className="w-5 h-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};
