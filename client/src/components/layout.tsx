import { Link, useLocation } from "wouter";
import { Briefcase, Newspaper, UserCircle, LogOut, Code2, Menu, X } from "lucide-react";
import NewsWidget from "./news-widget";
import Chatbot from "./chatbot";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Newspaper, label: "Feed", href: "/" },
    { icon: Briefcase, label: "Jobs", href: "/?tab=jobs" },
    { icon: UserCircle, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary font-mono font-bold text-xl tracking-tighter">
          <Code2 className="w-6 h-6" />
          DevMatch
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 lg:w-72
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden md:flex items-center gap-2 p-6 text-primary font-mono font-bold text-2xl tracking-tighter border-b border-border/50">
          <Code2 className="w-8 h-8" />
          DevMatch_
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <Link 
            href="/auth"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative scroll-smooth">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </div>

        {/* Right Sidebar (Tech News) */}
        <aside className="hidden lg:block w-80 xl:w-96 border-l border-border bg-card/30 overflow-y-auto p-6">
          <NewsWidget />
        </aside>
      </main>

      {/* Floating Chatbot */}
      <Chatbot />
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}