
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Clock, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
      // Load messages
      const savedMessages = JSON.parse(
        localStorage.getItem(`messages-${linkId}`) || "[]"
      );
      setMessages(savedMessages.sort((a: Message, b: Message) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));

      // Load link info
      const generatedLinks = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
      const link = generatedLinks.find((l: any) => l.id === linkId);
      setLinkInfo(link);
    }
  }, [linkId]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const copyLinkToClipboard = () => {
    if (linkInfo) {
      const url = `${window.location.origin}/message/${linkInfo.subdomain}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    }
  };

  if (!linkInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center pt-6">
            <h2 className="text-xl font-semibold mb-2">Link Not Found</h2>
            <p className="text-gray-600 mb-4">
              The requested link could not be found.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages for your link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {window.location.origin}/message/{linkInfo.subdomain}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLinkToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Created: {new Date(linkInfo.createdAt).toLocaleDateString()} • 
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-400">
                  Share your link to start receiving anonymous messages
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-gray-800 leading-relaxed">
                      {message.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
