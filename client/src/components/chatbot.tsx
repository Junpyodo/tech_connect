import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your DevMatch AI assistant. Ask me about job matches for your tech stack or the latest tech news!",
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userContent = input.trim();
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userContent }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.text || "Sorry, I couldn't process that." }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Error connecting to the AI strategist. Make sure the backend is running." }
      ]);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 z-50"
          data-testid="button-open-chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-card border border-border shadow-2xl shadow-black/50 rounded-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">DevMatch AI</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Grok Powered
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-secondary">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 min-h-[300px]" ref={scrollRef}>
            <div className="space-y-4 pb-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="w-8 h-8 border border-border mt-1 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none max-w-[85%]"
                        : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50 max-w-[90%]"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="w-8 h-8 border border-border mt-1 shrink-0">
                      <AvatarFallback className="bg-secondary"><User className="w-4 h-4"/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about jobs or tech..."
                className="flex-1 bg-secondary/50 border-border focus-visible:ring-primary text-base"
                data-testid="input-chat"
              />
              <Button type="submit" size="icon" disabled={!input.trim()} className="bg-primary hover:bg-primary/90 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}