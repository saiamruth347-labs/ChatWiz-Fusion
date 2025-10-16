import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  onGenerateImage: (prompt: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, onGenerateImage, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input, attachedFiles);
      setInput("");
      setAttachedFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = attachedFiles.length + files.length;
    
    if (totalFiles > 10) {
      toast({
        variant: "destructive",
        title: "Too many files",
        description: "You can attach a maximum of 10 files at once.",
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 20MB limit.`,
        });
        return false;
      }
      return true;
    });

    setAttachedFiles([...attachedFiles, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleImageGeneration = () => {
    if (input.trim() && !disabled) {
      onGenerateImage(input);
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
    <div className="space-y-2">
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-secondary/50 rounded-lg">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-card border border-border rounded-full text-sm"
            >
              <Paperclip className="w-3 h-3" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[120px] resize-none bg-background border-border focus:border-primary transition-colors"
            disabled={disabled}
          />
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="gap-2"
            >
              <Paperclip className="w-4 h-4" />
              Attach Files
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImageGeneration}
              disabled={disabled || !input.trim()}
              className="gap-2"
            >
              <Image className="w-4 h-4" />
              Generate Image
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !input.trim()}
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 hover:shadow-glow transition-all duration-300 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};
