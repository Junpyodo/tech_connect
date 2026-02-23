import { useState } from "react";
import { mockPosts, currentUser } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, Briefcase, Code, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPosts = mockPosts.filter((post) => {
    if (activeTab === "all") return true;
    return post.type === activeTab;
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Feed</h1>
        <p className="text-muted-foreground">See the latest job openings and tech news.</p>
      </header>

      {/* Create Post Area */}
      <Card className="border-border bg-card/40 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 border border-border">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea 
                placeholder="Share a tech update or post a job..." 
                className="resize-none border-none bg-secondary/30 focus-visible:ring-1 focus-visible:ring-primary/50 min-h-[80px] text-base"
              />
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">
                    <Code className="w-3 h-3 mr-1" /> Tech
                  </Button>
                  {currentUser.role === "recruiter" && (
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">
                      <Briefcase className="w-3 h-3 mr-1" /> Job
                    </Button>
                  )}
                </div>
                <Button size="sm" className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="w-3 h-3 mr-2" /> Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">All Updates</TabsTrigger>
          <TabsTrigger value="job" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Job Posts</TabsTrigger>
          <TabsTrigger value="news" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Tech News</TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3 flex flex-row items-start gap-4 space-y-0">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">{post.authorId.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm leading-none">
                        {post.authorId === "u1" ? currentUser.name : `User ${post.authorId}`}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{post.createdAt}</p>
                    </div>
                    {post.type === "job" ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase tracking-wider">Job</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-accent text-accent-foreground border-border font-mono text-[10px] uppercase tracking-wider">News</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <h3 className="text-lg font-bold mb-2 text-foreground">{post.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary rounded-md text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-border/50 bg-secondary/10 flex gap-4 sm:gap-6">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary p-0 h-auto gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-0 h-auto gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Comment</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-0 h-auto gap-1.5 ml-auto">
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  );
}