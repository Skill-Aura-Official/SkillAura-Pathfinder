import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Sparkles, Compass, Target, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  { icon: Compass, label: "What's my next quest?", prompt: "Analyze my profile and tell me exactly what my next career quest should be — what to build, learn, or apply for this week." },
  { icon: Target, label: "Skill gap analysis", prompt: "Run a tactical skill-gap analysis between my current skills and my target career. Show me the top 3 gaps to close first." },
  { icon: Sparkles, label: "Roast my resume", prompt: "Be brutally honest about my resume / profile data. Where am I weak? What would a recruiter screen me out for?" },
  { icon: MessagesSquare, label: "Mock interview", prompt: "Run a 3-question mock interview for my target role. Ask one at a time and grade me after I answer." },
];

export default function AIMentor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data?.length) {
          setMessages(data.map(m => ({ role: m.role as "user" | "assistant", content: m.content })));
        }
        setLoadingHistory(false);
      });
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || streaming || !user) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: text });

    // Add empty assistant message that we'll stream into
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              if (delta) {
                full += delta;
                setMessages(prev => {
                  const next = [...prev];
                  next[next.length - 1] = { role: "assistant", content: full };
                  return next;
                });
              }
            } catch { /* ignore partial chunks */ }
          }
        }
      }

      if (full) {
        await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: full });
      }
    } catch (e: any) {
      const msg = e?.message?.includes("429") ? "Rate limited. Wait a moment and retry."
                : e?.message?.includes("402") ? "AI credits depleted. Add funds in Workspace → Usage."
                : e?.message || "System error. Please retry.";
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: `_${msg}_` };
        return next;
      });
      toast.error(msg);
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const showWelcome = messages.length === 0 && !loadingHistory;

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <PageHeader
        eyebrow="System Intelligence"
        icon={<Bot className="h-3.5 w-3.5" />}
        title="AI Career Mentor"
        description="Tactical guidance from a system that knows your level, skills, goals, and history."
      />

      <div className="surface-card-inset flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          {loadingHistory ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4 rounded-2xl" />
              <Skeleton className="h-12 w-1/2 rounded-2xl ml-auto" />
              <Skeleton className="h-20 w-3/4 rounded-2xl" />
            </div>
          ) : showWelcome ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center pt-8 md:pt-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-primary grid place-items-center glow-primary">
                <Bot className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-display text-2xl text-foreground mb-2">Your tactical career system is online</h2>
              <p className="text-sm text-muted-foreground mb-8">
                I have access to your level, skills, goals, and history. Pick a starting move or ask anything.
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5 text-left">
                {SUGGESTED_PROMPTS.map((s, i) => (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => send(s.prompt)}
                    className="surface-interactive p-4 text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">{s.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.prompt}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const isLastAssistant = !isUser && i === messages.length - 1 && streaming;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${isUser ? "justify-end" : ""}`}
                  >
                    {!isUser && (
                      <div className="shrink-0 w-9 h-9 rounded-xl gradient-primary grid place-items-center glow-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                      isUser
                        ? "gradient-primary text-primary-foreground rounded-tr-sm"
                        : "glass border border-border/60 text-foreground rounded-tl-sm"
                    }`}>
                      {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : msg.content ? (
                        <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-headings:text-foreground prose-headings:font-display prose-strong:text-primary prose-code:text-accent prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-ul:my-2 prose-li:my-0.5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          {isLastAssistant && <span className="inline-block w-2 h-4 ml-0.5 bg-primary rounded-sm animate-pulse" />}
                        </div>
                      ) : (
                        <div className="flex gap-1.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "120ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "240ms" }} />
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="shrink-0 w-9 h-9 rounded-xl bg-secondary grid place-items-center">
                        <User className="h-4 w-4 text-foreground" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border/50 p-3 md:p-4 bg-card/40 backdrop-blur-sm">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2 items-end">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask anything — careers, skills, next moves…  (Shift+Enter for newline)"
              rows={1}
              className="bg-secondary/60 border-border/60 resize-none min-h-[44px] max-h-32"
              disabled={streaming}
            />
            <Button
              type="submit"
              disabled={streaming || !input.trim()}
              className="gradient-primary text-primary-foreground border-0 h-11 px-4 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
