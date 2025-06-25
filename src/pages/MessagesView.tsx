
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Clock, Copy, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

interface Message {
  id: string;
  content: string;
  timestamp: string;
}

const MessagesView = () => {
  const { linkId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [linkInfo, setLinkInfo] = useState<any>(null);

  useEffect(() => {
    if (linkId) {
      loadMessages();
      loadLinkInfo();
      
      // Set up real-time updates every 3 seconds
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [linkId]);

  const loadMessages = () => {
    if (linkId) {
      const savedMessages = JSON.parse(
        localStorage.getItem(`messages-${linkId}`) || "[]"
      );
      setMessages(savedMessages.sort((a: Message, b: Message) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  };

  const loadLinkInfo = () => {
    if (linkId) {
      const generatedLinks = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
      const link = generatedLinks.find((l: any) => l.id === linkId);
      setLinkInfo(link);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const copyLinkToClipboard = () => {
    if (linkInfo) {
      const url = `${window.location.origin}/message/${linkInfo.subdomain}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Copied! ✨",
        description: "Magic link copied to clipboard",
      });
    }
  };

  if (!linkInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md w-full shadow-xl animate-slide-up">
            <CardContent className="text-center pt-8 pb-8">
              <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-bounce-gentle" />
              <h2 className="text-2xl font-cursive font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Magic Link Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The magical link you're looking for could not be found.
              </p>
              <Link to="/">
                <Button className="gradient-primary text-white border-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Magic Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 animate-fade-in">
          <Link to="/">
            <Button variant="outline" className="mb-6 hover:scale-105 transition-all duration-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Magic Dashboard
            </Button>
          </Link>
          
          <Card className="gradient-primary text-white border-0 shadow-2xl hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-cursive">
                <MessageSquare className="h-6 w-6 animate-pulse" />
                Your Magic Messages ✨
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/20 rounded-lg p-4">
                  <p className="font-mono text-sm bg-white/30 px-3 py-2 rounded-full">
                    {window.location.origin}/message/{linkInfo.subdomain}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLinkToClipboard}
                    className="border-white text-white hover:bg-white/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span>Created: {new Date(linkInfo.createdAt).toLocaleDateString()}</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full font-semibold">
                    {messages.length} magical message{messages.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {messages.length === 0 ? (
            <Card className="animate-slide-up shadow-xl">
              <CardContent className="text-center py-16">
                <div className="w-24 h-24 gradient-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <MessageSquare className="h-12 w-12 text-purple-800 animate-bounce-gentle" />
                </div>
                <h3 className="text-2xl font-cursive font-bold text-muted-foreground mb-4">
                  No magical messages yet ✨
                </h3>
                <p className="text-muted-foreground text-lg">
                  Share your magic link to start receiving anonymous messages from the universe!
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message, index) => (
              <Card 
                key={message.id} 
                className="shadow-xl hover:scale-102 transition-all duration-300 animate-fade-in border-l-4 border-l-purple-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                      <p className="text-lg leading-relaxed font-medium">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Received magically on {formatDate(message.timestamp)}</span>
                      <Sparkles className="h-4 w-4 ml-2 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {messages.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ✨ Messages update automatically every few seconds ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
