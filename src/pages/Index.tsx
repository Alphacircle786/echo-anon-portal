
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Copy, MessageSquare, User, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  }, []);

  const loadGeneratedLinks = () => {
    const links = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
    setGeneratedLinks(links);
  };

  const signIn = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("userEmail", email);
    setIsSignedIn(true);
    toast({
      title: "Signed In",
      description: "You're now signed in and can generate personalized links",
    });
  };

  const signOut = () => {
    localStorage.removeItem("userEmail");
    setIsSignedIn(false);
    setEmail("");
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
      title: "Link Generated!",
      description: "Your anonymous messaging link has been created",
    });
  };

  const copyToClipboard = (subdomain: string) => {
    const url = `${window.location.origin}/message/${subdomain}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const viewMessages = (linkId: string) => {
    navigate(`/messages/${linkId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Anonymous Message Generator
          </h1>
          <p className="text-gray-600">
            Generate a unique link to receive anonymous messages from anyone
          </p>
        </div>

        {/* Authentication Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isSignedIn ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sign in to keep track of your generated links across devices (optional)
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && signIn()}
                    />
                  </div>
                  <Button onClick={signIn} className="mt-6">
                    Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Signed in as: {email}</p>
                  <p className="text-sm text-gray-600">
                    Your links will be saved and synced
                  </p>
                </div>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Link Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Generate Your Anonymous Message Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Button onClick={generateSubdomain} size="lg" className="mb-4">
                Generate New Link
              </Button>
              <p className="text-sm text-gray-600">
                Anyone with your link can send you anonymous messages
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Generated Links */}
        {generatedLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Your Generated Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm">
                        {window.location.origin}/message/{link.subdomain}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(link.createdAt).toLocaleDateString()}
                        {link.userEmail && ` • ${link.userEmail}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.subdomain)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => viewMessages(link.id)}
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
