import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, User, Paperclip, Copy, Check, Terminal, ExternalLink } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
  files?: File[];
}

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-border/40 bg-zinc-950 dark:bg-zinc-900 shadow-md max-w-full">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 dark:bg-zinc-800/80 text-zinc-400 text-xs font-mono border-b border-border/20 select-none">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="capitalize">{language || "code"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors py-1 px-2 rounded hover:bg-zinc-800 dark:hover:bg-zinc-700/50"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-sm text-zinc-100 bg-zinc-950 dark:bg-zinc-900/30">
        <pre className="m-0 leading-relaxed font-mono whitespace-pre">{code.trim()}</pre>
      </div>
    </div>
  );
};

const parseMessageContent = (text: string) => {
  if (!text) return null;
  // Split the text by code blocks: ```[lang]\n[code]\n```
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      // Extract language and code content
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3).trim();
      
      return (
        <CodeBlock key={index} code={code} language={language} />
      );
    }
    return (
      <span key={index} className="whitespace-pre-wrap break-words leading-relaxed">
        {part}
      </span>
    );
  });
};

export const ChatMessage = ({ role, content, image, files }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-out py-1",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md select-none">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        role="article"
        tabIndex={0}
        aria-label={isUser ? `You: ${content.slice(0, 100)}` : `Assistant: ${content.slice(0, 100)}`}
        aria-live={isUser ? undefined : "polite"}
        className={cn(
          "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
          isUser
            ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-md"
            : "bg-card text-foreground border border-border/80 hover:shadow-md dark:bg-card/90"
        )}
      >
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-border/30">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 text-secondary-foreground dark:bg-zinc-800/80 rounded-lg text-xs"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span className="max-w-[120px] truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {image && (
          <div className="relative group rounded-xl overflow-hidden mb-3 border border-border/50 max-w-sm sm:max-w-md shadow-md bg-black/5 dark:bg-white/5">
            <img 
              src={image} 
              alt="Generated content" 
              className="max-w-full h-auto transition-all duration-300 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <a
                href={image}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-white text-zinc-950 rounded-lg hover:scale-105 transition-transform shadow-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Fullscreen
              </a>
            </div>
          </div>
        )}
        
        <div className="text-[15px] leading-relaxed">
          {parseMessageContent(content)}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary border border-border/50 flex items-center justify-center flex-shrink-0 shadow-sm select-none">
          <User className="w-4 h-4 text-foreground/80" />
        </div>
      )}
    </div>
  );
};

