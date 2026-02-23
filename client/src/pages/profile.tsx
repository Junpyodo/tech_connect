import { useState } from "react";
import { currentUser } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, X, Plus } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(currentUser);
  const [newTech, setNewTech] = useState("");

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to DB
  };

  const removeTech = (techToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== techToRemove)
    }));
  };

  const addTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    
    if (newTech.trim() && !profile.techStack.includes(newTech.trim())) {
      setProfile(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech("");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your public presence and tech stack.</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto font-medium shadow-sm">
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none bg-primary text-primary-foreground">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border bg-card/40 backdrop-blur-sm overflow-hidden text-center">
            <div className="h-24 bg-gradient-to-r from-primary/40 to-secondary/40"></div>
            <CardContent className="pt-0 relative px-6 pb-6">
              <div className="relative inline-block -mt-12 mb-4">
                <Avatar className="w-24 h-24 border-4 border-card bg-card shadow-lg">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs text-muted-foreground uppercase tracking-wider">Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Role</Label>
                    <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md text-sm">
                      <Badge variant="outline" className="bg-background">{profile.role}</Badge>
                      <span className="text-xs text-muted-foreground">(Role changes disabled in mockup)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <Badge variant="secondary" className="mt-2 capitalize bg-primary/10 text-primary border-primary/20">{profile.role}</Badge>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-border bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-muted-foreground">#</span>
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a technology..." 
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={addTech}
                      className="bg-secondary/50 font-mono text-sm"
                    />
                    <Button variant="secondary" onClick={addTech} type="button">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.techStack.map(tech => (
                      <Badge key={tech} variant="secondary" className="pr-1.5 py-1 text-sm bg-secondary hover:bg-secondary/80 font-mono">
                        {tech}
                        <button 
                          onClick={() => removeTech(tech)}
                          className="ml-2 bg-background/50 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.techStack.map(tech => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm font-mono bg-secondary/50 border border-border">
                      {tech}
                    </Badge>
                  ))}
                  {profile.techStack.length === 0 && <span className="text-sm text-muted-foreground">No tech stack added yet.</span>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Bio</Label>
                {isEditing ? (
                  <Textarea 
                    value={profile.bio} 
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="min-h-[100px] bg-secondary/50"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{profile.bio || "No bio provided."}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Experience</Label>
                {isEditing ? (
                  <Textarea 
                    value={profile.experience} 
                    onChange={(e) => setProfile({...profile, experience: e.target.value})}
                    className="min-h-[100px] bg-secondary/50"
                  />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{profile.experience || "No experience provided."}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}