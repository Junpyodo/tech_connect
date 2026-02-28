import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
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
      content: "안녕하세요! 실리콘밸리 기술 전략가 DevMatch AI입니다. 궁금하신 기술 트렌드나 채용 정보를 물어보세요.",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // AI 응답 대기 상태
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 자동으로 하단 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // 우리가 만든 Vercel Serverless Function 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error("API 연동 에러");

      const data = await response.json();

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.answer 
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Response Error:", error);
      setMessages((prev) => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: "assistant", 
          content: "죄송합니다. 실시간 데이터를 분석하는 중에 문제가 발생했습니다. Vercel의 환경 변수(API Key) 설정을 확인해주세요." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-card border border-border shadow-2xl shadow-black/50 rounded-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">DevMatch AI</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Live Search RAG
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-secondary">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 h-80 p-4" ref={scrollRef}>
            <div className="space-y-4">
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
                    className={`p-3 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="w-8 h-8 border border-border mt-1 shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground"><User className="w-4 h-4"/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-3">
                  <Avatar className="w-8 h-8 border border-border mt-1 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Loader2 className="w-4 h-4 animate-spin"/>
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary p-3 rounded-2xl rounded-tl-none text-xs text-muted-foreground italic">
                    실시간 데이터를 분석 중입니다...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
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
                placeholder={isLoading ? "AI가 생각 중입니다..." : "Ask about tech jobs..."}
                disabled={isLoading}
                className="flex-1 bg-secondary/50 border-border focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
