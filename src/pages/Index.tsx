
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Copy, MessageSquare, User, Link as LinkIcon, LogIn, UserPlus, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface GeneratedLink {
  id: string;
  subdomain: string;
  createdAt: string;
  messageCount: number;
  userEmail?: string;
}

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is signed in
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setIsSignedIn(true);
      setEmail(userEmail);
    }

    // Load generated links
    loadGeneratedLinks();
    
    // Set up auto-refresh for message counts
    const interval = setInterval(loadGeneratedLinks, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadGeneratedLinks = () => {
    const links = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
    setGeneratedLinks(links);
  };

  const handleAuth = () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp) {
      // Simple signup simulation
      localStorage.setItem("userEmail", email);
      setIsSignedIn(true);
      toast({
        title: "Account Created!",
        description: "Welcome! You can now generate personalized links",
      });
    } else {
      // Simple login simulation
      localStorage.setItem("userEmail", email);
      setIsSignedIn(true);
      toast({
        title: "Signed In",
        description: "Welcome back! You can now manage your links",
      });
    }
    setPassword("");
  };

  const signOut = () => {
    localStorage.removeItem("userEmail");
    setIsSignedIn(false);
    setEmail("");
    setPassword("");
    toast({
      title: "Signed Out",
      description: "You've been signed out",
    });
  };

  const generateSubdomain = () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const subdomain = `msg-${randomId}`;
    
    const newLink: GeneratedLink = {
      id: randomId,
      subdomain,
      createdAt: new Date().toISOString(),
      messageCount: 0,
      userEmail: isSignedIn ? email : undefined,
    };

    const existingLinks = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
    const updatedLinks = [...existingLinks, newLink];
    
    localStorage.setItem("generatedLinks", JSON.stringify(updatedLinks));
    setGeneratedLinks(updatedLinks);

    // Initialize empty messages for this subdomain
    localStorage.setItem(`messages-${randomId}`, JSON.stringify([]));

    toast({
      title: "Link Generated! ✨",
      description: "Your magical messaging link has been created",
    });
  };

  const copyToClipboard = (subdomain: string) => {
    const url = `${window.location.origin}/message/${subdomain}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied! 📋",
      description: "Link copied to clipboard",
    });
  };

  const viewMessages = (linkId: string) => {
    navigate(`/messages/${linkId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      <Header />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-cursive font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-bounce-gentle">
            Create Magic Links ✨
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Generate enchanted links to receive anonymous messages from anyone, anywhere
          </p>
        </div>

        {/* Generate Link Section - Top Priority */}
        <Card className="mb-8 gradient-primary text-white border-0 shadow-2xl animate-slide-up hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-cursive">
              <Sparkles className="h-6 w-6 animate-pulse" />
              Generate Your Magic Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Button 
                onClick={generateSubdomain} 
                size="lg" 
                className="mb-4 bg-white text-purple-600 hover:bg-gray-100 text-xl px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="h-6 w-6 mr-2" />
                Create Magic Link
              </Button>
              <p className="text-lg opacity-90">
                ✨ Anyone with your link can send you anonymous messages ✨
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Authentication Section */}
          {!isSignedIn ? (
            <Card className="gradient-secondary border-0 shadow-xl animate-slide-up hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl font-cursive">
                  <User className="h-5 w-5" />
                  Join the Magic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-white/90 text-sm">
                    Sign up to keep track of your magical links across all devices ✨
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        onKeyPress={(e) => e.key === "Enter" && handleAuth()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        onKeyPress={(e) => e.key === "Enter" && handleAuth()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => { setIsSignUp(false); handleAuth(); }}
                        className="flex-1 bg-white text-pink-600 hover:bg-gray-100"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => { setIsSignUp(true); handleAuth(); }}
                        variant="outline" 
                        className="flex-1 border-white text-white hover:bg-white/20"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="gradient-success border-0 shadow-xl animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl font-cursive">
                  <User className="h-5 w-5" />
                  Welcome Back! ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-lg">Signed in as:</p>
                    <p className="text-white/90 font-cursive text-xl">{email}</p>
                    <p className="text-sm text-white/80">
                      Your magical links are saved and synced ✨
                    </p>
                  </div>
                  <Button variant="outline" onClick={signOut} className="border-white text-white hover:bg-white/20">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="gradient-purple border-0 shadow-xl animate-slide-up hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 text-xl font-cursive">
                <LinkIcon className="h-5 w-5" />
                Your Magic Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-purple-800 font-cursive">{generatedLinks.length}</p>
                  <p className="text-sm text-purple-600">Magic Links</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-800 font-cursive">
                    {generatedLinks.reduce((sum, link) => sum + link.messageCount, 0)}
                  </p>
                  <p className="text-sm text-purple-600">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Links */}
        {generatedLinks.length > 0 && (
          <Card className="animate-slide-up shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-cursive bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                <MessageSquare className="h-6 w-6" />
                Your Magic Links ✨
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg hover:scale-102 transition-all duration-300 animate-fade-in border border-purple-200/50 dark:border-purple-700/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-full inline-block shadow-sm">
                        {window.location.origin}/message/{link.subdomain}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                        {link.userEmail && <span>• {link.userEmail}</span>}
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                          {link.messageCount} messages
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.subdomain)}
                        className="hover:scale-105 transition-all duration-200"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => viewMessages(link.id)}
                        className="gradient-primary text-white border-0 hover:scale-105 transition-all duration-200"
                      >
                        View Messages
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
