
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
}

const MessageForm = () => {
  const { subdomain } = useParams();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Extract the link ID from subdomain
    const linkId = subdomain?.replace("msg-", "") || "";
    
    // Get existing messages
    const existingMessages = JSON.parse(
      localStorage.getItem(`messages-${linkId}`) || "[]"
    );

    // Add new message
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...existingMessages, newMessage];
    localStorage.setItem(`messages-${linkId}`, JSON.stringify(updatedMessages));

    // Update message count in generated links
    const generatedLinks = JSON.parse(localStorage.getItem("generatedLinks") || "[]");
    const updatedLinks = generatedLinks.map((link: any) => 
      link.id === linkId 
        ? { ...link, messageCount: updatedMessages.length }
        : link
    );
    localStorage.setItem("generatedLinks", JSON.stringify(updatedLinks));

    setIsSubmitting(false);
    setSubmitted(true);
    setMessage("");

    toast({
      title: "Message Sent!",
      description: "Your anonymous message has been delivered",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-4">
              Your anonymous message has been delivered successfully.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Anonymous Message
          </CardTitle>
          <p className="text-sm text-gray-600">
            Your message will be sent anonymously
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                placeholder="Write your anonymous message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              🔒 Your identity will remain completely anonymous. The recipient will only see your message.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageForm;
