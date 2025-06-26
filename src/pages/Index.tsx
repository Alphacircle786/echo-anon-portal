import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Copy, MessageSquare, User, Link as LinkIcon, LogIn, UserPlus, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header"; // Assuming Header is already mobile-compatible

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
    // Using navigator.clipboard.writeText is generally preferred for modern browsers
    // and secure contexts. Fallback with document.execCommand if issues arise.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Copied! 📋",
          description: "Link copied to clipboard",
        });
      }).catch(err => {
        console.error('Failed to copy text using Clipboard API: ', err);
        // Fallback for older browsers or insecure contexts
        const tempInput = document.createElement('textarea');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          toast({
            title: "Copied! 📋",
            description: "Link copied to clipboard (fallback)",
          });
        } catch (err2) {
          toast({
            title: "Error Copying",
            description: "Could not copy link to clipboard. Please copy manually.",
            variant: "destructive",
          });
          console.error('Failed to copy text using execCommand: ', err2);
        } finally {
          document.body.removeChild(tempInput);
        }
      });
    } else {
      // Fallback for browsers without Clipboard API support
      const tempInput = document.createElement('textarea');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied! 📋",
          description: "Link copied to clipboard (fallback)",
        });
      } catch (err) {
        toast({
          title: "Error Copying",
          description: "Could not copy link to clipboard. Please copy manually.",
          variant: "destructive",
        });
        console.error('Failed to copy text: ', err);
      } finally {
        document.body.removeChild(tempInput);
      }
    }
  };

  const viewMessages = (linkId: string) => {
    navigate(`/messages/${linkId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      <Header />
      
      {/* Main content container: Adjusted padding for mobile */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"> 
        {/* Main Heading Section: Adjusted text size and margin for mobile */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cursive font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-bounce-gentle">
            Create Magic Links ✨
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            Generate enchanted links to receive anonymous messages from anyone, anywhere
          </p>
        </div>

        {/* Generate Link Section - Top Priority */}
        <Card className="mb-8 gradient-primary text-white border-0 shadow-2xl animate-slide-up hover:scale-105 transition-all duration-300">
          <CardHeader>
            {/* Card title: Stack on mobile, row on larger screens */}
            <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xl sm:text-2xl font-cursive">
              <Sparkles className="h-6 w-6 animate-pulse" />
              Generate Your Magic Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Button 
                onClick={generateSubdomain} 
                size="lg" 
                className="mb-4 bg-white text-purple-600 hover:bg-gray-100 text-base sm:text-xl px-6 py-4 sm:px-8 sm:py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto" // Full width on mobile, auto on larger
              >
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2" /> {/* Adjust icon size for mobile */}
                Create Magic Link
              </Button>
              <p className="text-sm sm:text-lg opacity-90">
                ✨ Anyone with your link can send you anonymous messages ✨
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Authentication & Stats Section: Stack on mobile, side-by-side on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Changed to grid-cols-1 for mobile, md:grid-cols-2 for medium screens */}
          {/* Authentication Section */}
          {!isSignedIn ? (
            <Card className="gradient-secondary border-0 shadow-xl animate-slide-up hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-cursive">
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
                    {/* Auth buttons: Stack on mobile, side-by-side on larger screens */}
                    <div className="flex flex-col sm:flex-row gap-2"> 
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
                {/* Signed-in info & sign out button: Stack on mobile, side-by-side on larger screens */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> 
                  <div className="text-center sm:text-left">
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
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-cursive bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                <MessageSquare className="h-6 w-6" />
                Your Magic Links ✨
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg hover:scale-102 transition-all duration-300 animate-fade-in border border-purple-200/50 dark:border-purple-700/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Link details: occupy full width, then flex */}
                    <div className="flex-1 mb-3 sm:mb-0 min-w-0"> {/* Added min-w-0 to prevent overflow of long URLs */}
                      <p className="font-mono text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-full inline-block shadow-sm break-all"> {/* break-all for long URLs */}
                        {window.location.origin}/message/{link.subdomain}
                      </p>
                      {/* Meta info: allow wrapping on small screens */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground"> 
                        <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                        {link.userEmail && <span>• {link.userEmail}</span>}
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                          {link.messageCount} messages
                        </span>
                      </div>
                    </div>
                    {/* Action buttons: Stack on mobile, row on larger screens */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0"> {/* Added mt-4 for spacing on mobile */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.subdomain)}
                        className="hover:scale-105 transition-all duration-200 w-full sm:w-auto" // Full width on mobile, auto on larger
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => viewMessages(link.id)}
                        className="gradient-primary text-white border-0 hover:scale-105 transition-all duration-200 w-full sm:w-auto" // Full width on mobile, auto on larger
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