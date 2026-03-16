import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome, Operative! I'm your AI Career Mentor. Ask me about career decisions, skills to learn, industry demand, salary expectations, or anything about your career progression. How can I help you level up?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-mentor", {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) },
      });

      if (error) throw error;

      const assistantContent = data?.content || data?.choices?.[0]?.message?.content || "I'm having trouble responding right now. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (e: any) {
      const errorMsg = e?.message?.includes("429") ? "Rate limited. Please wait a moment and try again." :
                       e?.message?.includes("402") ? "AI credits depleted. Please add credits to continue." :
                       "Something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Career Mentor</h1>
        <p className="text-sm text-muted-foreground">Your personal AI guide for career decisions and growth.</p>
      </motion.div>

      <div className="surface-card-inset flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-foreground" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-foreground" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-foreground" />
              </div>
              <div className="bg-secondary rounded-xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border/50 p-4">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about careers, skills, salary..." className="bg-secondary border-border" disabled={loading} />
            <Button type="submit" disabled={loading || !input.trim()} className="gradient-primary text-foreground border-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
