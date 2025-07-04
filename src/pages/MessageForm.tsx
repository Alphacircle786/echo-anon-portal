import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Send, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

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
      title: "Message Sent! ✨",
      description: "Your anonymous message has been delivered magically",
    });
  };

  // --- Submission Success State ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-700 via-blue-700 to-purple-700 dark:from-gray-950 dark:via-green-950 dark:to-blue-950 transition-all duration-500">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] p-4 sm:p-6 lg:p-8"> 
          <Card className="max-w-md w-full gradient-success text-white border-0 shadow-2xl animate-slide-up hover:scale-105 transition-all duration-300">
            <CardContent className="text-center pt-6 pb-6 sm:pt-8 sm:pb-8"> 
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Sparkles className="h-10 w-10 text-white animate-bounce-gentle" />
              </div>
              <h2 className="text-xl sm:text-2xl font-cursive font-bold mb-4">Message Sent! ✨</h2> 
              <p className="text-base sm:text-lg mb-6 opacity-90"> 
                Your magical message has been delivered successfully to its destination!
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setSubmitted(false)} 
                  className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold"
                >
                  Send Another Message
                </Button>
                <Link to="/">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Create Your Own Link
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Message Form State ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-700 to-pink-700 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 transition-all duration-500">
      <Header />
      <div className="flex items-center justify-center min-h-[80vh] p-4 sm:p-6 lg:p-8"> 
        <Card className="max-w-md w-full shadow-2xl animate-slide-up hover:scale-105 transition-all duration-300">
          <CardHeader className="text-center gradient-primary text-white rounded-t-lg p-4 sm:p-6"> 
            <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xl sm:text-2xl font-cursive"> 
              <MessageSquare className="h-6 w-6 animate-pulse" />
              Send Anonymous Message ✨
            </CardTitle>
            <p className="text-base opacity-90"> 
              Your magical message will be sent anonymously
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6"> 
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Textarea
                  placeholder="Write your magical anonymous message here... ✨"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6} 
                  className="resize-none text-base sm:text-lg leading-relaxed border-2 border-purple-200 dark:border-purple-700 focus:border-purple-400 transition-all duration-300"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full gradient-secondary text-white border-0 text-base py-4 sm:text-lg sm:py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Sending Magic...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Magical Message ✨
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 p-3 sm:p-4 gradient-purple rounded-lg"> 
              <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-800 text-center font-medium"> 
                🔒 Your identity will remain completely anonymous. Only your magical message will be delivered! ✨
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link to="/">
                <Button variant="outline" className="hover:scale-105 transition-all duration-200 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"> 
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Create Your Own Magic Link
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageForm;