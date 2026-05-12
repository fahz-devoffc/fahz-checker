import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Globe, AlertTriangle, CheckCircle, Save, Loader2, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { analyzeUrl } from "@/src/services/aiService";
import { ScanResult } from "@/src/types";

export default function WebScanner() {
  const [url, setUrl] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string; isLoading?: boolean }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem("brc7_web_history");
    if (history) {
      setMessages(JSON.parse(history));
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("brc7_web_history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    const currentUrl = url;
    setUrl("");

    // Add user message
    const newMessages = [...messages, { role: "user" as const, content: currentUrl }];
    setMessages(newMessages);

    // Add AI thinking message
    setMessages((prev) => [...prev, { role: "ai" as const, content: "AI is Thinking...", isLoading: true }]);

    try {
      // Fetch source code via our proxy server
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentUrl }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.isLoading),
          { role: "ai", content: `❌ Error: ${data.error}` },
        ]);
        return;
      }

      // Analyze with AI
      const aiResponse = await analyzeUrl(data.sourceCode);

      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        { role: "ai", content: aiResponse },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        { role: "ai", content: `❌ Network Error: ${err.message}` },
      ]);
    }
  };

  const clearHistory = () => {
    if (confirm("Clear all scan history?")) {
      setMessages([]);
      localStorage.removeItem("brc7_web_history");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between py-4 border-bottom border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="font-bold text-lg">Web Vulnerability Scanner</h2>
        </div>
        <button 
          onClick={clearHistory}
          className="text-xs text-zinc-500 hover:text-red-500 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 py-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
              <Search className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Scan Your First URL</h3>
            <p className="text-zinc-500 max-w-xs">Enter a website URL below to start a comprehensive security analysis.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-red-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
              msg.role === "user" 
                ? "bg-zinc-900 text-white rounded-tr-none" 
                : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm rounded-tl-none prose dark:prose-invert prose-sm"
            }`}>
              {msg.isLoading ? (
                <div className="flex items-center gap-3 py-1">
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                  <span className="font-medium animate-pulse">{msg.content}</span>
                </div>
              ) : (
                <div className="markdown-body">
                   <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="py-6 pt-2">
        <form 
          onSubmit={handleScan}
          className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-red-500/20 transition-all overflow-hidden"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g. google.com)"
            className="w-full px-6 py-4 bg-transparent outline-none text-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="mt-3 text-[10px] text-center text-zinc-400 uppercase tracking-widest font-bold">
          AI Analysis generates results based on public source code
        </p>
      </div>
    </div>
  );
}

// Add CSS to hide scrollbar but allow scrolling
import { Search } from "lucide-react";
