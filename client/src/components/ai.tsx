import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your DevMatch AI strategist. I analyze the latest market trends and job postings to help you navigate your tech career. What would you like to know?",
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="flex-1 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] bg-card/30 border border-border rounded-xl overflow-hidden relative">
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-border/50 bg-background/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">DevMatch Strategist</h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground items-center gap-1 font-mono flex">
            <Sparkles className="w-3 h-3 text-primary" /> Grok Powered
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-8 space-y-8 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className={`w-8 h-8 shrink-0 border mt-1 ${msg.role === "user" ? "border-primary/20" : "border-border"}`}>
                {msg.role === "assistant" ? (
                  <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-secondary"><User className="w-4 h-4" /></AvatarFallback>
                )}
              </Avatar>
              <div className={`flex-1 space-y-2 ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
                <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  {msg.role === "user" ? "You" : "DevMatch AI"}
                </div>
                <div className={`text-base leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user" 
                    ? "bg-secondary px-5 py-3 rounded-2xl rounded-tr-sm inline-block max-w-[85%]" 
                    : "text-foreground font-sans prose prose-invert prose-p:leading-relaxed max-w-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-background/50 to-transparent shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-end bg-background border border-border rounded-2xl shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about tech trends, required stacks, or matching roles..."
              className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent p-4 pr-14 focus-visible:ring-0 text-base"
              rows={1}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim()} 
              className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-3 text-xs text-muted-foreground font-mono">
            DevMatch AI searches across verified tech & job platforms. Responses may vary.
          </div>
        </div>
      </div>
    </div>
  );
}