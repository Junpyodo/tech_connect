import { mockNews } from "@/lib/mock-data";
import { ExternalLink, Rss } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export default function NewsWidget() {
  return (
    <div className="space-y-6 sticky top-8">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 font-mono tracking-tight">
          <Rss className="w-5 h-5 text-primary" />
          Tech Radar
        </h2>
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-sm">
          <CardContent className="p-0">
            {mockNews.map((news, index) => (
              <div key={news.id} className="group">
                <a 
                  href="#" 
                  className="block p-4 hover:bg-secondary/50 transition-colors"
                  data-testid={`link-news-${news.id}`}
                >
                  <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{news.source}</span>
                    <span className="flex items-center gap-1">
                      {news.time}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </a>
                {index < mockNews.length - 1 && <Separator className="bg-border/50" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
        <h3 className="font-semibold text-sm text-primary mb-2">Want to integrate a real API?</h3>
        <p className="text-xs text-muted-foreground mb-4">
          This widget currently uses mock data. In a fullstack app, you can connect NewsAPI or an RSS parser here.
        </p>
      </div>
    </div>
  );
}