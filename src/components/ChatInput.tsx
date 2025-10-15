import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        className="min-h-[60px] max-h-[120px] resize-none bg-background border-border focus:border-primary transition-colors"
      />
      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        size="icon"
        className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 hover:shadow-glow transition-all duration-300 disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};
