"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, X, Sparkles, Globe, Loader2, ShoppingCart, Package, Send, MessageSquare, Volume2, VolumeX, Trash2, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "mitra";
  text: string;
  visualType?: "PRODUCT" | "ORDER" | "CART" | null;
  visualData?: any;
}

const QUICK_COMMANDS = [
  { label: "🛍️ Show trending", cmd: "Show me trending products" },
  { label: "🛒 My cart", cmd: "What's in my cart?" },
  { label: "📦 Track order", cmd: "Where is my order?" },
  { label: "👜 Silk sarees", cmd: "Show me silk sarees" },
  { label: "🎨 Pottery", cmd: "Show me pottery items" },
  { label: "💰 Under ₹2000", cmd: "Show products under 2000 rupees" },
];

const QUICK_COMMANDS_HI = [
  { label: "🛍️ ट्रेंडिंग", cmd: "ट्रेंडिंग प्रोडक्ट्स दिखाओ" },
  { label: "🛒 मेरा कार्ट", cmd: "मेरे कार्ट में क्या है?" },
  { label: "📦 ऑर्डर ट्रैक", cmd: "मेरा ऑर्डर कहाँ है?" },
  { label: "👜 सिल्क साड़ी", cmd: "सिल्क साड़ी दिखाओ" },
  { label: "🎨 मिट्टी के बर्तन", cmd: "मिट्टी के बर्तन दिखाओ" },
  { label: "💰 ₹2000 से कम", cmd: "2000 रुपये से कम के प्रोडक्ट्स दिखाओ" },
];

// Smart voice selection — prioritized human-like voices per language
const VOICE_PREFERENCES: Record<string, string[]> = {
  en: ["Microsoft Heera", "Microsoft Zira", "Google UK English Female", "Samantha", "Google US English", "Karen"],
  hi: ["Microsoft Swara", "Google \u0939\u093f\u0928\u094d\u0926\u0940", "Lekha", "Hindi"],
  bn: ["Google \u09AC\u09BE\u0982\u09B2\u09BE", "Bangla"],
  or: ["Google Odia", "Odia"],
  ta: ["Google \u0BA4\u0BAE\u0BBF\u0BB4\u0BCD", "Tamil"],
  te: ["Google \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", "Telugu"],
};

function getBestVoice(lang: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const prefs = VOICE_PREFERENCES[lang] || VOICE_PREFERENCES.en;
  for (const pref of prefs) {
    const match = voices.find(v => v.name.includes(pref));
    if (match) return match;
  }
  // Fallback: find any voice for the language
  const langVoice = voices.find(v => v.lang.startsWith(lang));
  if (langVoice) return langVoice;
  return null;
}

// Auto-detect language from text using Unicode script ranges + romanized Hindi patterns
function detectLanguageFromText(text: string): string {
  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  const bengali = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const odia = (text.match(/[\u0B00-\u0B7F]/g) || []).length;
  const tamil = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const telugu = (text.match(/[\u0C00-\u0C7F]/g) || []).length;
  const latin = (text.match(/[a-zA-Z]/g) || []).length;

  // Pick whichever script has the most characters
  const scores: [string, number][] = [
    ['hi', devanagari],
    ['bn', bengali],
    ['or', odia],
    ['ta', tamil],
    ['te', telugu],
  ];
  const best = scores.reduce((a, b) => b[1] > a[1] ? b : a);
  if (best[1] > 2) return best[0]; // Non-Latin script detected

  // Check for romanized Hindi/Hinglish patterns
  if (latin > 0) {
    const hindiPatterns = /\b(kya|hai|mujhe|dikhao|chahiye|kaise|kahan|mera|kitna|acha|nahi|haan|ji|bhai|dedo|batao|karo|lao|bhejo|saree|sari|kurta|dupatta|lehenga|dhoti|pagdi|jaipur|varanasi|lucknow|banaras)\b/i;
    if (hindiPatterns.test(text)) return 'hi';
  }

  return 'en';
}

export default function CraftMitra() {
  const { data: session } = useSession();
  const router = useRouter();
  const addToCartStore = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [reply, setReply] = useState("");
  const [language, setLanguage] = useState("auto");
  const [visualData, setVisualData] = useState<any>(null); 
  const [visualType, setVisualType] = useState<"PRODUCT" | "ORDER" | "CART" | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<"voice" | "text">("voice");

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef(""); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceCacheRef = useRef<Record<string, SpeechSynthesisVoice | null>>({});
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasBrowserTTSRef = useRef(false);
  const detectedLangRef = useRef<string>('en');
  const speakCancelledRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = 0; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += t;
          } else {
            interim += t;
          }
        }
        if (final) {
          setTranscript(final);
          transcriptRef.current = final;
          setInterimTranscript("");
          // Auto-detect language from what the user said
          const detected = detectLanguageFromText(final);
          detectedLangRef.current = detected;
        } else {
          setInterimTranscript(interim);
        }
        // Reset silence timer on every speech result
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          // 2s of silence after speech → auto-submit
          if (transcriptRef.current.trim().length > 1) {
            recognition.stop();
          }
        }, 2000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (transcriptRef.current.trim().length > 1) {
          handleSend(transcriptRef.current);
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  // Cache browser voices for human-like TTS
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    hasBrowserTTSRef.current = true;
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return;
      for (const lang of Object.keys(VOICE_PREFERENCES)) {
        voiceCacheRef.current[lang] = getBestVoice(lang, voices);
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, visualData]);

  const toggleListening = () => {
    // Guest gate — require login
    if (!session?.user) {
      setShowLoginPrompt(true);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioQueueRef.current = [];
      setIsSpeaking(false);
    }
    // Also stop browser TTS
    if (hasBrowserTTSRef.current) {
      speakCancelledRef.current = true;
      speechSynthesis.cancel();
    }

    if (!isOpen) {
      setIsOpen(true);
      setMode("voice");
      const name = session?.user?.name?.split(' ')[0] || "Traveler";
      const greeting = `Namaste ${name}, I am Mitra. How may I serve you? You can ask me to find products, add to cart, track orders, or shop by voice in Hindi or English!`;
      setReply(greeting);
      setChatHistory([{ role: "mitra", text: greeting }]);
      if (!isMuted) speak(greeting);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setInterimTranscript("");
      transcriptRef.current = "";
      recognitionRef.current.lang = language === 'auto' ? 'en-IN' : language; 
      try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
    }
  };

  const openTextMode = () => {
    // Guest gate — require login
    if (!session?.user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!isOpen) {
      setIsOpen(true);
      setMode("text");
      const name = session?.user?.name?.split(' ')[0] || "Traveler";
      const greeting = `Namaste ${name}! Type or use the quick commands below to start shopping. I understand Hindi and English!`;
      setReply(greeting);
      setChatHistory([{ role: "mitra", text: greeting }]);
      return;
    }
    setMode("text");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    // Detect language from typed input
    detectedLangRef.current = detectLanguageFromText(textInput.trim());
    handleSend(textInput.trim());
    setTextInput("");
  };

  // Handle local cart commands before hitting the API
  const handleLocalCartCommand = (text: string): boolean => {
    const lower = text.toLowerCase();
    const hindiCart = /कार्ट|cart/i.test(text);

    // "What's in my cart?" / "मेरे कार्ट में क्या है"
    if ((lower.includes("my cart") || lower.includes("in cart") || lower.includes("view cart") || /मेरे कार्ट/.test(text) || /कार्ट दिखाओ/.test(text)) && !lower.includes("add") && !lower.includes("buy")) {
      if (cartItems.length === 0) {
        const msg = language === "hi-IN" ? "आपका कार्ट खाली है। क्या मैं कुछ प्रोडक्ट्स दिखाऊं?" : "Your cart is empty. Shall I show you some trending crafts?";
        setReply(msg);
        setChatHistory(prev => [...prev, { role: "user", text }, { role: "mitra", text: msg }]);
        setVisualData(null);
        setVisualType(null);
        if (!isMuted) speak(msg);
      } else {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const msg = language === "hi-IN" 
          ? `आपके कार्ट में ${cartItems.length} आइटम हैं, कुल ₹${total.toLocaleString()}। चेकआउट करना चाहेंगे?`
          : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart, totalling ₹${total.toLocaleString()}. Would you like to checkout?`;
        setReply(msg);
        setVisualType("CART");
        setVisualData(cartItems);
        setChatHistory(prev => [...prev, { role: "user", text }, { role: "mitra", text: msg, visualType: "CART", visualData: cartItems }]);
        if (!isMuted) speak(msg);
      }
      setIsProcessing(false);
      return true;
    }

    // "Clear cart" / "कार्ट खाली करो"
    if ((lower.includes("clear cart") || lower.includes("empty cart") || /कार्ट खाली/.test(text) || /कार्ट साफ/.test(text))) {
      clearCart();
      const msg = language === "hi-IN" ? "आपका कार्ट खाली कर दिया गया है।" : "Your cart has been cleared.";
      setReply(msg);
      setVisualData(null);
      setVisualType(null);
      setChatHistory(prev => [...prev, { role: "user", text }, { role: "mitra", text: msg }]);
      if (!isMuted) speak(msg);
      toast.success("Cart cleared!");
      setIsProcessing(false);
      return true;
    }

    // "Go to checkout" / "चेकआउट"
    if (lower.includes("checkout") || lower.includes("check out") || /चेकआउट/.test(text) || /चेक आउट/.test(text)) {
      const msg = language === "hi-IN" ? "आपको चेकआउट पर ले जा रहा हूं।" : "Taking you to checkout now.";
      setReply(msg);
      setChatHistory(prev => [...prev, { role: "user", text }, { role: "mitra", text: msg }]);
      if (!isMuted) speak(msg);
      setTimeout(() => { setIsOpen(false); router.push("/checkout"); }, 2000);
      setIsProcessing(false);
      return true;
    }

    return false;
  };

  const handleSend = async (text: string) => {
    setIsProcessing(true);
    setChatHistory(prev => [...prev, { role: "user", text }]);

    // Check local cart commands first
    if (handleLocalCartCommand(text)) return;
    
    try {
      // Build conversation history for context
      const apiHistory = chatHistory.slice(-6).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/mitra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: apiHistory,
          detectedLanguage: detectedLangRef.current,
          cartSummary: cartItems.length > 0 ? `Cart: ${cartItems.length} items, ₹${cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}` : "Cart: empty"
        }) 
      });

      const data = await response.json();
      setReply(data.text);
      if (!isMuted) await speak(data.text);

      if (data.action === "ADD_TO_CART") {
         setVisualType("PRODUCT");
         setVisualData(data.data);
         
         const product = data.data;
         addToCartStore({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "/p1.png",
            quantity: 1
         });
         toast.success("Added to Cart!");
         setChatHistory(prev => [...prev, { role: "mitra", text: data.text, visualType: "PRODUCT", visualData: data.data }]);
         
         setTimeout(() => {
            setIsOpen(false);
            router.push("/checkout");
         }, 4000);
      }

      else if (data.action === "SHOW_PRODUCTS") {
        setVisualType("PRODUCT");
        setVisualData(data.data);
        setChatHistory(prev => [...prev, { role: "mitra", text: data.text, visualType: "PRODUCT", visualData: data.data }]);
      } 

      else if (data.action === "SHOW_ORDER") {
        setVisualType("ORDER");
        setVisualData(data.data);
        setChatHistory(prev => [...prev, { role: "mitra", text: data.text, visualType: "ORDER", visualData: data.data }]);
      } 

      else if (data.action === "NAVIGATE" && data.url) {
        setChatHistory(prev => [...prev, { role: "mitra", text: data.text }]);
        setTimeout(() => { setIsOpen(false); router.push(data.url); }, 3000);
      }
      
      else {
        setVisualData(null);
        setVisualType(null);
        setChatHistory(prev => [...prev, { role: "mitra", text: data.text }]);
      }

    } catch (error) {
      const errMsg = "I lost connection. Please try again.";
      setReply(errMsg);
      setChatHistory(prev => [...prev, { role: "mitra", text: errMsg }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = async (text: string) => {
    if (audioRef.current) audioRef.current.pause();
    if (hasBrowserTTSRef.current) speechSynthesis.cancel();
    speakCancelledRef.current = false;
    setIsSpeaking(true);

    // Use the detected language from user's input as the primary signal
    let targetLang = detectedLangRef.current;
    // If user manually selected a language (not auto), honor that
    if (language !== 'auto') {
      targetLang = language.split('-')[0];
    }

    // Primary: Edge Neural TTS (server) — human-like quality
    // Send full text for natural pacing instead of sentence-by-sentence
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: targetLang }),
      });
      const { url } = await response.json();
      if (url && !speakCancelledRef.current) {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          // Auto-listen after Mitra finishes speaking
          if (mode === "voice" && isOpen && !isMuted && !speakCancelledRef.current) {
            setTimeout(() => {
              setTranscript("");
              setInterimTranscript("");
              transcriptRef.current = "";
              if (recognitionRef.current) {
                recognitionRef.current.lang = language === 'auto' ? 'en-IN' : language;
                try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
              }
            }, 600);
          }
        };
        audio.onerror = () => {
          // If audio playback fails, try browser TTS fallback
          speakBrowserFallback(text, targetLang);
        };
        audio.play().catch(() => speakBrowserFallback(text, targetLang));
        return;
      }
    } catch (e) {
      // Server TTS failed — fall through to browser fallback
    }

    // Fallback: browser-native SpeechSynthesis
    speakBrowserFallback(text, targetLang);
  };

  const speakBrowserFallback = (text: string, targetLang: string) => {
    if (speakCancelledRef.current) {
      setIsSpeaking(false);
      return;
    }
    const cachedVoice = voiceCacheRef.current[targetLang];
    if (hasBrowserTTSRef.current && cachedVoice) {
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
      speakBrowserQueue(sentences, cachedVoice, targetLang);
    } else {
      setIsSpeaking(false);
    }
  };

  const speakBrowserQueue = (sentences: string[], voice: SpeechSynthesisVoice, lang: string) => {
    // Stop if speech was cancelled (close/mute)
    if (speakCancelledRef.current) {
      setIsSpeaking(false);
      return;
    }
    if (sentences.length === 0) {
      setIsSpeaking(false);
      if (mode === "voice" && isOpen && !isMuted) {
        setTimeout(() => {
          setTranscript("");
          setInterimTranscript("");
          transcriptRef.current = "";
          if (recognitionRef.current) {
            recognitionRef.current.lang = language === 'auto' ? 'en-IN' : language;
            try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
          }
        }, 600);
      }
      return;
    }
    const next = sentences.shift()!;
    const utterance = new SpeechSynthesisUtterance(next.trim());
    utterance.voice = voice;
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onend = () => speakBrowserQueue(sentences, voice, lang);
    utterance.onerror = () => {
      if (!speakCancelledRef.current) speakBrowserQueue(sentences, voice, lang);
    };
    speechSynthesis.speak(utterance);
  };


  const handleAddToCart = (product: any) => {
    addToCartStore({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "/p1.png",
      quantity: 1
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    toast.success("Removed from cart");
    const updated = cartItems.filter(i => i.id !== id);
    if (updated.length === 0) {
      setVisualData(null);
      setVisualType(null);
    } else {
      setVisualData(updated);
    }
  };

  const quickCommands = language === "hi-IN" ? QUICK_COMMANDS_HI : QUICK_COMMANDS;

  return (
    <>
      {/* ── FLOATING ACTION BUTTON ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-2">
          {/* Text chat mini button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={openTextMode}
            className="w-11 h-11 rounded-full bg-[#2F334F] border border-[#D4AF37]/50 shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#3a3f5e] transition-colors"
            aria-label="Open text chat"
          >
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          </motion.button>

          {/* Main mic button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className="relative w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#2F334F] to-[#1A1D2E] border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center cursor-pointer"
            aria-label="Open voice assistant"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/20 animate-pulse rounded-full" />
            <Mic className="w-7 h-7 text-[#D4AF37] relative z-10" />
          </motion.button>
        </div>
      )}

      {/* ── FULL-SCREEN OVERLAY ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col"
          >
            {/* ─── TOP BAR ─── */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
              {/* Left: Mode toggle */}
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5">
                <button
                  onClick={() => setMode("voice")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === "voice"
                      ? "bg-[#D4AF37] text-[#1A1D2E]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voice</span>
                </button>
                <button
                  onClick={() => {
                    setMode("text");
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === "text"
                      ? "bg-[#D4AF37] text-[#1A1D2E]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Text</span>
                </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (!isMuted) {
                      if (audioRef.current) audioRef.current.pause();
                      speakCancelledRef.current = true;
                      if (hasBrowserTTSRef.current) speechSynthesis.cancel();
                      audioQueueRef.current = [];
                      setIsSpeaking(false);
                    }
                  }}
                  className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {cartItems.length > 0 && (
                  <button
                    onClick={() => handleSend("What's in my cart?")}
                    className="relative p-2 rounded-full text-[#D4AF37]/70 hover:text-[#D4AF37] hover:bg-white/5 transition-all cursor-pointer"
                    aria-label="View cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {cartItems.length}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    speakCancelledRef.current = true;
                    if (audioRef.current) audioRef.current.pause();
                    if (hasBrowserTTSRef.current) speechSynthesis.cancel();
                    if (recognitionRef.current && isListening) recognitionRef.current.stop();
                    audioQueueRef.current = [];
                    setIsSpeaking(false);
                    setIsListening(false);
                  }}
                  className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer ml-1"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="flex-1 min-h-0 flex flex-col">
              {mode === "text" ? (
                /* ════════ TEXT MODE ════════ */
                <div className="flex-1 min-h-0 flex flex-col max-w-2xl w-full mx-auto">
                  {/* Chat messages - scrollable */}
                  <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                            msg.role === "user"
                              ? "bg-[#D4AF37] text-[#1A1D2E] rounded-br-md"
                              : "bg-white/8 text-[#E5DCCA] border border-white/8 rounded-bl-md"
                          }`}
                        >
                          <p
                            className={`text-sm leading-relaxed ${
                              msg.role === "mitra" ? "italic font-serif" : "font-medium"
                            }`}
                          >
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Inline product cards */}
                    {visualData && visualType === "PRODUCT" && (
                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                        {(Array.isArray(visualData) ? visualData : [visualData]).map(
                          (prod: any) => (
                            <div
                              key={prod.id}
                              className="min-w-[180px] w-[180px] bg-white rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/40 shrink-0"
                            >
                              <div className="relative h-24 w-full">
                                <Image
                                  src={prod.images?.[0] || "/p1.png"}
                                  alt={prod.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-2.5">
                                <h4 className="text-xs font-bold text-[#4A3526] line-clamp-1">
                                  {prod.title}
                                </h4>
                                <p className="text-xs text-[#D97742] font-bold mt-0.5">
                                  ₹{prod.price?.toLocaleString()}
                                </p>
                                <Button
                                  onClick={() => handleAddToCart(prod)}
                                  className="w-full h-7 mt-1.5 text-[10px] bg-[#2F334F] text-[#D4AF37] hover:bg-[#1E2135] cursor-pointer"
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Inline cart view */}
                    {visualData && visualType === "CART" && (
                      <div className="space-y-2">
                        {(Array.isArray(visualData) ? visualData : [visualData]).map(
                          (item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-white/8 rounded-xl px-3 py-2.5 border border-white/8"
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={item.image || "/p1.png"}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#E5DCCA] font-medium truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-[#D4AF37]">
                                  ₹{item.price?.toLocaleString()} × {item.quantity}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-red-400/60 hover:text-red-400 p-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )
                        )}
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/checkout");
                          }}
                          className="w-full mt-1 bg-[#D4AF37] text-[#1A1D2E] hover:bg-[#b8962e] font-bold text-sm cursor-pointer"
                        >
                          Proceed to Checkout →
                        </Button>
                      </div>
                    )}

                    {/* Processing indicator */}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white/8 rounded-2xl px-4 py-2.5 border border-white/8 rounded-bl-md">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                            <p className="text-sm text-white/40">Consulting the loom...</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              ) : (
                /* ════════ VOICE MODE ════════ */
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-y-auto px-4">
                  {/* Visual cards */}
                  <AnimatePresence>
                    {visualData && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full flex justify-center mb-6 shrink-0"
                      >
                        {visualType === "PRODUCT" && (
                          <div className="flex gap-4 overflow-x-auto p-3 items-start w-full justify-center max-w-full">
                            {(Array.isArray(visualData) ? visualData : [visualData]).map(
                              (prod: any) => (
                                <div
                                  key={prod.id}
                                  className="min-w-[200px] w-[200px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37] shrink-0"
                                >
                                  <div className="relative h-28 w-full">
                                    <Image
                                      src={prod.images?.[0] || "/p1.png"}
                                      alt={prod.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="p-3">
                                    <h4 className="text-sm font-bold text-[#4A3526] line-clamp-1">
                                      {prod.title}
                                    </h4>
                                    <p className="text-xs text-[#D97742] font-bold mt-1">
                                      ₹{prod.price?.toLocaleString()}
                                    </p>
                                    <Button
                                      onClick={() => handleAddToCart(prod)}
                                      className="w-full h-8 mt-2 text-xs bg-[#2F334F] text-[#D4AF37] hover:bg-[#1E2135] cursor-pointer"
                                    >
                                      <ShoppingCart className="w-3 h-3 mr-1" /> Add
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {visualType === "CART" && (
                          <div className="w-full max-w-sm space-y-2 p-3">
                            {(Array.isArray(visualData) ? visualData : [visualData]).map(
                              (item: any) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 bg-[#FFFBF5] rounded-xl px-3 py-2.5 border border-[#D4AF37]/30"
                                >
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                      src={item.image || "/p1.png"}
                                      alt={item.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#4A3526] font-medium truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-[#D97742]">
                                      ₹{item.price?.toLocaleString()} × {item.quantity}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="text-red-400/60 hover:text-red-400 p-1 cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )
                            )}
                            <Button
                              onClick={() => {
                                setIsOpen(false);
                                router.push("/checkout");
                              }}
                              className="w-full mt-1 bg-[#D4AF37] text-[#1A1D2E] hover:bg-[#b8962e] font-bold text-sm cursor-pointer"
                            >
                              Proceed to Checkout →
                            </Button>
                          </div>
                        )}

                        {visualType === "ORDER" && (
                          <div className="w-full max-w-sm bg-[#FFFBF5] rounded-2xl p-5 border-2 border-[#D4AF37] shadow-2xl">
                            <div className="flex items-center gap-3 mb-3 border-b border-[#D4AF37]/20 pb-3">
                              <Package className="w-7 h-7 text-[#D97742]" />
                              <div>
                                <h3 className="font-bold text-[#4A3526] text-sm">Order Status</h3>
                                <p className="text-[10px] text-[#8C7B70] font-mono">
                                  #{visualData.id?.slice(-8).toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <p className="text-base font-bold text-[#2F334F]">
                              {visualData.status}
                            </p>
                            <p className="text-sm text-[#8C7B70]">
                              Total: ₹{visualData.total?.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Golden Orb */}
                  <motion.div layout className="relative mb-6 shrink-0">
                    <motion.div
                      animate={{
                        scale: isListening || isSpeaking ? [1, 1.08, 1] : 1,
                        boxShadow: isSpeaking
                          ? "0 0 50px 15px rgba(212, 175, 55, 0.5)"
                          : "0 0 20px 5px rgba(212, 175, 55, 0.15)",
                      }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className={`${
                        visualData ? "w-20 h-20 sm:w-28 sm:h-28" : "w-36 h-36 sm:w-48 sm:h-48"
                      } rounded-full bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] flex items-center justify-center border-4 border-white/20 transition-all duration-500`}
                    >
                      {isListening ? (
                        <Mic className={`${visualData ? "w-8 h-8" : "w-12 h-12"} text-[#2F334F]`} />
                      ) : isProcessing ? (
                        <Loader2 className={`${visualData ? "w-8 h-8" : "w-12 h-12"} text-[#2F334F] animate-spin`} />
                      ) : (
                        <Sparkles className={`${visualData ? "w-8 h-8" : "w-12 h-12"} text-[#2F334F]`} />
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Transcript + Reply */}
                  <div className="w-full max-w-2xl flex flex-col items-center gap-3 px-4 text-center">
                    {(transcript || interimTranscript) && (
                      <p className="text-xl sm:text-2xl font-medium leading-tight">
                        {transcript && <span className="text-[#D4AF37]">{transcript}</span>}
                        {interimTranscript && <span className="text-white/30 italic">{interimTranscript}</span>}
                      </p>
                    )}
                    {isProcessing ? (
                      <p className="text-base text-white/40 animate-pulse">
                        Consulting the loom...
                      </p>
                    ) : (
                      reply && (
                        <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/8 max-h-48 overflow-y-auto w-full shadow-inner text-left">
                          <p className="text-base text-[#E5DCCA] italic leading-relaxed font-serif whitespace-pre-line">
                            {reply}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ─── BOTTOM CONTROLS (pinned) ─── */}
            <div className="shrink-0 border-t border-white/5 px-4 sm:px-6 pt-3 pb-4 sm:pb-5 space-y-2.5">
              {/* Quick command chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 max-w-2xl mx-auto hide-scrollbar">
                {quickCommands.map((qc, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qc.cmd)}
                    disabled={isProcessing}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-white/8 border border-white/8 text-[11px] text-[#E5DCCA]/80 hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/25 hover:text-[#D4AF37] transition-all disabled:opacity-40 whitespace-nowrap cursor-pointer"
                  >
                    {qc.label}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
                {/* Language select */}
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-10 sm:h-11 w-[110px] sm:w-[130px] rounded-full bg-[#1A1D2E] border border-white/10 text-[#D4AF37] text-xs font-medium shrink-0">
                    <Globe className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <SelectValue placeholder="Lang" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2F334F] border-[#D4AF37]/30 text-white z-[200]">
                    <SelectItem value="auto">Auto Detect</SelectItem>
                    <SelectItem value="hi-IN">हिंदी</SelectItem>
                    <SelectItem value="bn-IN">বাংলা</SelectItem>
                    <SelectItem value="en-IN">English</SelectItem>
                  </SelectContent>
                </Select>

                {mode === "text" ? (
                  /* Text input + send + mic */
                  <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-2 min-w-0">
                    <input
                      ref={inputRef}
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={
                        language === "hi-IN" ? "अपना संदेश लिखें..." : "Type a message..."
                      }
                      disabled={isProcessing}
                      className="flex-1 min-w-0 h-10 sm:h-11 px-4 rounded-full bg-[#1A1D2E] border border-white/10 text-[#E5DCCA] placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/60 text-sm disabled:opacity-40 transition-colors"
                    />
                    <Button
                      type="submit"
                      disabled={isProcessing || !textInput.trim()}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#D4AF37] hover:bg-[#b8962e] disabled:opacity-40 shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#1A1D2E]" />
                    </Button>
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full shrink-0 flex items-center justify-center transition-all border cursor-pointer ${
                        isListening
                          ? "bg-red-500 border-red-400 shadow-lg shadow-red-500/30"
                          : "bg-[#1A1D2E] border-white/10 hover:border-[#D4AF37]/40"
                      }`}
                    >
                      <Mic className={`w-4 h-4 ${isListening ? "text-white" : "text-[#D4AF37]"}`} />
                    </button>
                  </form>
                ) : (
                  /* Voice mode: Large mic button */
                  <div className="flex-1 flex justify-center">
                    <Button
                      onClick={toggleListening}
                      className={`h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full shadow-2xl transition-all border-4 cursor-pointer ${
                        isListening
                          ? "bg-red-500 border-red-400 scale-105 shadow-red-500/40"
                          : "bg-[#D4AF37] border-[#D4AF37]/60 hover:border-white/30"
                      }`}
                    >
                      {isListening ? (
                        <div className="w-6 h-6 bg-white rounded-sm animate-pulse" />
                      ) : (
                        <Mic className="w-8 h-8 text-[#2F334F]" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GUEST LOGIN PROMPT ── */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-[#1A1D2E] to-[#2F334F] rounded-3xl p-8 max-w-sm w-full border-2 border-[#D4AF37]/40 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Golden orb icon */}
              <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                <Sparkles className="w-9 h-9 text-[#2F334F]" />
              </div>

              <h3 className="text-xl font-bold text-[#F3E5AB] font-serif mb-2">
                Namaste, Traveler!
              </h3>
              <p className="text-sm text-[#E5DCCA]/70 leading-relaxed mb-6">
                To access <span className="text-[#D4AF37] font-semibold">Craft Mitra</span> — your personal AI shopping concierge — please sign in first.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D4AF37] text-[#1A1D2E] font-bold text-sm hover:bg-[#b8962e] transition-colors shadow-lg"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full py-2.5 rounded-xl text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden scrollbar utility */}
      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
