import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Plus, Menu, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userContent = input.trim();
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // AI Backend integration
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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 z-50"
          data-testid="button-open-chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-background z-50 flex h-[100dvh] w-screen overflow-hidden animate-in fade-in duration-300">
          
          {/* Sidebar (Desktop & Mobile Drawer) */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="flex-1 justify-start gap-2 text-primary font-medium hover:text-primary hover:bg-primary/10"
                onClick={() => setMessages([{ id: Date.now().toString(), role: "assistant", content: "Hello! I'm your DevMatch AI strategist. How can I help you today?" }])}
              >
                <Plus className="w-5 h-5" />
                New Chat
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Recent Chats</div>
              {["React vs Vue Job Market", "Backend roles in SF", "Review my resume", "OpenAI latest updates"].map((item, i) => (
                <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-secondary hover:text-foreground truncate transition-colors flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  {item}
                </button>
              ))}
            </div>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsOpen(false)}>
                <ChevronLeft className="w-4 h-4" />
                Back to DevMatch
              </Button>
            </div>
          </div>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col h-full relative bg-background overflow-hidden">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-10 shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    DevMatch Strategist
                  </h2>
                  <span className="hidden sm:flex px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3 text-primary" /> Gemini 2.0 Flash
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
                <X className="w-5 h-5" />
              </Button>
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
            <div className="p-4 bg-gradient-to-t from-background via-background to-transparent shrink-0">
              <div className="max-w-3xl mx-auto relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="relative flex items-end bg-secondary/30 border border-border rounded-2xl shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden"
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
        </div>
      )}
    </>
  );
}