import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown) onKeyDown(e);
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // Find the form and submit it
        const form = (e.target as HTMLElement).closest("form");
        if (form) {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }
      // Shift+Enter will insert a new line by default
    };
    return (
      <Textarea
        autoComplete="off"
        ref={ref}
        name="message"
        className={cn(
          "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);
ChatInput.displayName = "ChatInput";

export { ChatInput }; 