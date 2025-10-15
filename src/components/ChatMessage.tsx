import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
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
