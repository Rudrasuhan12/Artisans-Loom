"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useVoiceLive, VoiceLiveAction } from "./useVoiceLive";
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

// Auto-detect language from text using Unicode script ranges + romanized patterns
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

  // Check for romanized patterns
  if (latin > 0) {
    const lower = text.toLowerCase();
    // Odia patterns (check FIRST — Odia words overlap with Hindi)
    const odiaPatterns = /\b(makte|kuwa|kana|kemiti|achchhi|kichhi|boli|sete|ame|tume|achhi|hela|kariba|kiniba|bhala|kete|dama|paisa|mote|tote|emiti|nahi re|haan re|dekha|mu|mora|kaha|kahaku)\b/i;
    if (odiaPatterns.test(lower)) return 'or';

    // Hindi patterns
    const hindiPatterns = /\b(kya|mujhe|chahiye|kaise|kahan|kitna|nahi|haan|bhai|dedo|batao|bhejo|saree|sari|kurta|dupatta|lehenga|dhoti|pagdi|jaipur|varanasi|lucknow|banaras)\b/i;
    if (hindiPatterns.test(lower)) return 'hi';

    // Bengali patterns
    const bengaliPatterns = /\b(amake|kemon|bhalo|ache|chai|dekhao|kori|bolchi|jani)\b/i;
    if (bengaliPatterns.test(lower)) return 'bn';

    // Tamil patterns
    const tamilPatterns = /\b(enna|irukku|kaatu|venum|epdi|nalla|sollu|paru|vaanga)\b/i;
    if (tamilPatterns.test(lower)) return 'ta';

    // Telugu patterns
    const teluguPatterns = /\b(enti|undi|chupinchu|kavali|ela|baaga|cheppandi|randi)\b/i;
    if (teluguPatterns.test(lower)) return 'te';
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [reply, setReply] = useState("");
  const [language, setLanguage] = useState("auto");
  const [visualData, setVisualData] = useState<any>(null); 
  const [visualType, setVisualType] = useState<"PRODUCT" | "ORDER" | "CART" | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [useLiveVoice, setUseLiveVoice] = useState(true); // Gemini Live mode flag

  // ── Gemini Live voice hook (sub-1s real-time) ──────────────────────────
  const handleLiveAction = useCallback((action: VoiceLiveAction) => {
    // Clear previous visual data before showing new results
    setVisualType(null);
    setVisualData(null);

    if (action.action === 'SHOW_PRODUCTS' && action.data?.length > 0) {
      setVisualType('PRODUCT');
      setVisualData(action.data);
      setIsVoiceExpanded(false);
      setChatHistory(prev => [...prev, { role: 'mitra', text: '🎯 Here are some products I found:', visualType: 'PRODUCT', visualData: action.data }]);
    } else if (action.action === 'SHOW_PRODUCTS' && (!action.data || action.data.length === 0)) {
      // No products found — don't show stale cards
      setChatHistory(prev => [...prev, { role: 'mitra', text: 'I couldn\'t find products matching that criteria. Try a different search!' }]);
    } else if (action.action === 'ADD_TO_CART' && action.data) {
      const product = action.data;
      addToCartStore({ id: product.id, title: product.title, price: product.price, image: product.images?.[0] || '/p1.png', quantity: 1 });
      toast.success(`${product.title} added to cart!`);
      setVisualType('PRODUCT');
      setVisualData([product]);
      setChatHistory(prev => [...prev, { role: 'mitra', text: `✅ Added ${product.title} to your cart!`, visualType: 'PRODUCT', visualData: [product] }]);
    } else if (action.action === 'NAVIGATE' && action.url) {
      setChatHistory(prev => [...prev, { role: 'mitra', text: `Taking you to ${action.url}...` }]);
      setTimeout(() => { isOpenRef.current = false; setIsOpen(false); router.push(action.url!); }, 2000);
    }
  }, [addToCartStore, router]);

  const voiceLive = useVoiceLive({
    onTranscript: (side, text, isFinal) => {
      if (side === 'user') {
        // Display user's question using Gemini's inputTranscription
        // Skip when Gemini is speaking — those are echoes of its own voice
        if (text.trim() && !geminiSpeakingRef.current) {
          setTranscript(text);
          transcriptRef.current = text;
        }
      } else {
        setReply(text);
        if (isFinal && text.trim()) {
          setChatHistory(prev => [...prev, { role: 'mitra', text: text.trim() }]);
        }
      }
    },
    onAction: handleLiveAction,
    // Fires SYNCHRONOUSLY when audio playback starts/stops.
    onSpeakingChange: (speaking) => {
      geminiSpeakingRef.current = speaking;
      if (speaking) {
        // Physically STOP browser STT to prevent echo
        try { recognitionRef.current?.stop(); } catch(e) {}
      }
    },
    onReady: () => {
      setIsListening(true);
      const name = session?.user?.name?.split(' ')[0] || 'Traveler';
      setReply(`🎙️ Namaste ${name}! Mitra is listening... speak naturally.`);
    },
    onEnded: (reason) => {
      setIsListening(false);
      setReply('Voice session ended. Tap the mic to start again.');
    },
    onError: (msg) => {
      toast.error(msg);
      setIsListening(false);
    },
  });

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef(""); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const replyContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceCacheRef = useRef<Record<string, SpeechSynthesisVoice | null>>({});
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasBrowserTTSRef = useRef(false);
  const detectedLangRef = useRef<string>('en');
  const speakCancelledRef = useRef(false);
  const recognitionLangRef = useRef<string>('en-IN');
  const langSwitchingRef = useRef(false);
  const modeRef = useRef<"voice" | "text">("voice");
  const isMutedRef = useRef(false);
  const hasGeminiSpokenRef = useRef(false);
  const geminiSpeakingRef = useRef(false);
  const liveConnectedRef = useRef(false);

  // Trigger greeting after connection is fully established
  useEffect(() => {
    if (voiceLive.isReady) {
      const name = session?.user?.name?.split(' ')[0] || 'Traveler';
      voiceLive.sendIdentify({ email: session?.user?.email || '', name: session?.user?.name || '' });
      voiceLive.sendText(`User "${name}" just joined. You are Craft Mitra. Give a warm 1-sentence greeting to ${name}.`);
      
      // Start STT for real-time visual feedback
      if (recognitionRef.current) {
        recognitionRef.current.lang = 'en-IN';
        try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
      }
    }
  }, [voiceLive.isReady]);

  // ── Live mode state sync ──
  useEffect(() => {
    geminiSpeakingRef.current = voiceLive.isSpeaking;
    liveConnectedRef.current = voiceLive.isConnected;
    if (!useLiveVoice || !voiceLive.isConnected) return;
    if (voiceLive.isSpeaking) {
      hasGeminiSpokenRef.current = true;
      // STT stopped synchronously in onSpeakingChange
    } else if (hasGeminiSpokenRef.current && isOpenRef.current) {
      // Gemini finished speaking — clear old user transcript for next turn
      setTranscript("");
      setInterimTranscript("");
      transcriptRef.current = "";
      setIsListening(true);
      // Restart STT
      setTimeout(() => {
        try { recognitionRef.current?.start(); } catch(e) {}
      }, 80);
    }
  }, [voiceLive.isSpeaking, voiceLive.isConnected, useLiveVoice]);
  const isOpenRef = useRef(false);

  // Pagination state for "See More" products
  const [expandedChatMsgs, setExpandedChatMsgs] = useState<Record<number, boolean>>({});
  const [isVoiceExpanded, setIsVoiceExpanded] = useState(false);

  // Map detected language code to SpeechRecognition BCP-47 locale
  const LANG_TO_RECOGNITION: Record<string, string> = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'or': 'or-IN',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'mr': 'mr-IN',
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        // ═══ HOT MIC ECHO GUARD ═══
        // When Gemini is speaking, browser STT picks up her voice as echo.
        // Silently discard those results — the mic stays open for instant resume.
        if (liveConnectedRef.current && geminiSpeakingRef.current) return;

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

        // Language detection & switching — detect user's language and switch STT locale
        // so transcript renders in the correct script (Devanagari, Odia, etc.)
        const textToAnalyze = interim || final;
        if (textToAnalyze && language === 'auto' && !langSwitchingRef.current) {
          const detected = detectLanguageFromText(textToAnalyze);
          const targetRecogLang = LANG_TO_RECOGNITION[detected] || 'en-IN';
          
          if (detected !== 'en' && targetRecogLang !== recognitionLangRef.current) {
            langSwitchingRef.current = true;
            detectedLangRef.current = detected;
            recognitionLangRef.current = targetRecogLang;
            const savedText = transcriptRef.current;
            try {
              recognition.stop();
              setTimeout(() => {
                setTranscript("");
                setInterimTranscript("");
                transcriptRef.current = savedText;
                recognition.lang = targetRecogLang;
                try { 
                  recognition.start(); 
                  setIsListening(true);
                  langSwitchingRef.current = false;
                } catch(e) { langSwitchingRef.current = false; }
              }, 150);
            } catch(e) { langSwitchingRef.current = false; }
            return;
          }
        }

        if (final) {
          setTranscript(final);
          transcriptRef.current = final;
          setInterimTranscript("");
          const detected = detectLanguageFromText(final);
          detectedLangRef.current = detected;
        } else {
          setInterimTranscript(interim);
        }

        // Reset silence timer on every speech result
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        // Skip auto-stop when Gemini Live is connected — Live handles its own VAD
        if (!liveConnectedRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            if (transcriptRef.current.trim().length > 1) {
              recognition.stop();
            }
          }, 1200);
        }
      };

      recognition.onend = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        // Live mode: only restart if Gemini is NOT speaking.
        // When Gemini is speaking, STT was stopped intentionally (echo prevention).
        // The speaking sync useEffect handles restarting after Gemini finishes.
        if (liveConnectedRef.current) {
          if (isOpenRef.current && !geminiSpeakingRef.current) {
            setTimeout(() => {
              try { recognition.start(); } catch(e) {}
            }, 50);
          }
          return;
        }
        setIsListening(false);
        setInterimTranscript("");
        // Don't submit if we're just switching languages
        if (langSwitchingRef.current) return;
        // Don't submit if Gemini is speaking — would be echo of Mitra's own voice
        if (geminiSpeakingRef.current) return;
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

  // Auto-scroll voice mode reply container — progressive, every text chunk
  useEffect(() => {
    if (!replyContainerRef.current) return;
    // Double-RAF: first RAF fires after React commit, second fires after
    // browser has laid out the new text content. This guarantees scrollHeight
    // reflects the latest DOM state for pixel-perfect scroll tracking.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (replyContainerRef.current) {
          replyContainerRef.current.scrollTop = replyContainerRef.current.scrollHeight;
        }
      });
    });
  }, [reply]);

  useEffect(() => {
    modeRef.current = mode;
    isMutedRef.current = isMuted;
    isOpenRef.current = isOpen;
  }, [mode, isMuted, isOpen]);

  const stopSpeech = () => {
    if (audioRef.current) audioRef.current.pause();
    audioQueueRef.current = [];
    speakCancelledRef.current = true;
    setIsSpeaking(false);
    if (hasBrowserTTSRef.current) speechSynthesis.cancel();
  };

  const shouldSpeak = () => modeRef.current === "voice" && !isMutedRef.current;

  const toggleListening = () => {
    // Guest gate — require login
    if (!session?.user) {
      setShowLoginPrompt(true);
      return;
    }

    stopSpeech();

    if (!isOpen) {
      setIsOpen(true);
      isOpenRef.current = true;
      modeRef.current = "voice";
      setMode("voice");

      // ── Gemini Live mode (sub-1s real-time) ──
      if (useLiveVoice) {
        const name = session?.user?.name?.split(' ')[0] || "Traveler";
        setReply(`Connecting Mitra Live... 🎙️`);
        setChatHistory([{ role: "mitra", text: `Namaste ${name}! Connecting real-time voice...` }]);
        voiceLive.connect((session?.user as any)?.role, session?.user?.name || undefined);
        
        // Browser recognition will start AFTER greeting finishes (echo-guard useEffect)
        setTranscript("");
        setInterimTranscript("");
        transcriptRef.current = "";
        hasGeminiSpokenRef.current = false;
        
        return;
      }

      // ── Fallback: legacy browser STT mode ──
      const name = session?.user?.name?.split(' ')[0] || "Traveler";
      const greeting = `Namaste ${name}, I am Mitra. How may I serve you? You can ask me to find products, add to cart, track orders, or shop by voice in Hindi or English!`;
      setReply(greeting);
      setChatHistory([{ role: "mitra", text: greeting }]);
      if (shouldSpeak()) speak(greeting);
      return;
    }

    // Already open — toggle mic
    if (useLiveVoice && voiceLive.isConnected) {
      voiceLive.disconnect();
      try { recognitionRef.current?.stop(); } catch(e) {}
      setIsListening(false);
      hasGeminiSpokenRef.current = false;
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setInterimTranscript("");
      transcriptRef.current = "";
      langSwitchingRef.current = false;
      const recogLang = language === 'auto' 
        ? (LANG_TO_RECOGNITION[detectedLangRef.current] || 'en-IN')
        : language;
      recognitionLangRef.current = recogLang;
      recognitionRef.current.lang = recogLang; 
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
      isOpenRef.current = true;
      modeRef.current = "text";
      setMode("text");
      stopSpeech();
      const name = session?.user?.name?.split(' ')[0] || "Traveler";
      const greeting = `Namaste ${name}! Type or use the quick commands below to start shopping. I understand Hindi and English!`;
      setReply(greeting);
      setChatHistory([{ role: "mitra", text: greeting }]);
      return;
    }
    modeRef.current = "text";
    setMode("text");
    stopSpeech();
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
        if (shouldSpeak()) speak(msg);
      } else {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const msg = language === "hi-IN" 
          ? `आपके कार्ट में ${cartItems.length} आइटम हैं, कुल ₹${total.toLocaleString()}। चेकआउट करना चाहेंगे?`
          : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart, totalling ₹${total.toLocaleString()}. Would you like to checkout?`;
        setReply(msg);
        setVisualType("CART");
        setVisualData(cartItems);
        setChatHistory(prev => [...prev, { role: "user", text }, { role: "mitra", text: msg, visualType: "CART", visualData: cartItems }]);
        if (shouldSpeak()) speak(msg);
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
      if (shouldSpeak()) speak(msg);
      toast.success("Cart cleared!");
      setIsProcessing(false);
      return true;
    }

    // "Go to checkout" / "चेकआउट"
    if (lower.includes("checkout") || lower.includes("check out") || /चेकआउट/.test(text) || /चेक आउट/.test(text)) {
      const msg = language === "hi-IN" ? "आपको चेकआउट पर ले जा रहा हूं।" : "Taking you to checkout now.";
      setReply(msg);
      setChatHistory(prev => [...prev, { role: "user", text }, { role: "mitra", text: msg }]);
      if (shouldSpeak()) speak(msg);
      setTimeout(() => { isOpenRef.current = false; setIsOpen(false); router.push("/checkout"); }, 2000);
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
      // Use Gemini's detected language for TTS (most accurate)
      if (data.responseLanguage) {
        detectedLangRef.current = data.responseLanguage;
      }
      if (shouldSpeak()) speak(data.text); // Fire-and-forget — visual cards render while audio plays

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
            isOpenRef.current = false;
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
        setTimeout(() => { isOpenRef.current = false; setIsOpen(false); router.push(data.url); }, 3000);
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

  // ── Helper: fetch TTS audio URL from server ──
  const fetchTTSAudio = async (text: string, lang: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.url || null;
    } catch {
      return null;
    }
  };

  // ── Helper: auto-listen after Mitra finishes speaking ──
  const autoListenAfterSpeech = () => {
    if (modeRef.current === "voice" && isOpenRef.current && !isMutedRef.current && !speakCancelledRef.current) {
      setTimeout(() => {
        setTranscript("");
        setInterimTranscript("");
        transcriptRef.current = "";
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'auto' ? (LANG_TO_RECOGNITION[detectedLangRef.current] || 'en-IN') : language;
          try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
        }
      }, 600);
    }
  };

  // ── Helper: play a TTS audio URL, with optional auto-listen on end ──
  const playTTSAudio = (url: string, isLast: boolean): Promise<void> => {
    return new Promise((resolve) => {
      if (speakCancelledRef.current) { setIsSpeaking(false); resolve(); return; }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        if (isLast) {
          setIsSpeaking(false);
          autoListenAfterSpeech();
        }
        resolve();
      };
      audio.onerror = () => { setIsSpeaking(false); resolve(); };
      audio.play().catch(() => { setIsSpeaking(false); resolve(); });
    });
  };

  const speak = async (text: string) => {
    if (!shouldSpeak()) {
      stopSpeech();
      return;
    }
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

    console.log(`[Mitra TTS] Speaking: lang=${targetLang}, textLen=${text.length}, first50="${text.substring(0, 50)}"`);

    // Split into sentences for progressive playback
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

    // Short text (≤1 sentence) — single TTS call, no split overhead
    if (sentences.length <= 1) {
      const url = await fetchTTSAudio(text, targetLang);
      if (url && !speakCancelledRef.current) {
        playTTSAudio(url, true);
        return;
      }
      speakBrowserFallback(text, targetLang);
      return;
    }

    // ── Progressive TTS: play first sentence ASAP while rest prefetches ──
    const firstSentence = sentences[0].trim();
    const restText = sentences.slice(1).map(s => s.trim()).filter(Boolean).join(' ');

    // Fire BOTH TTS requests in parallel
    const firstPromise = fetchTTSAudio(firstSentence, targetLang);
    const restPromise = restText ? fetchTTSAudio(restText, targetLang) : Promise.resolve(null);

    try {
      // Wait only for the first sentence — start playing immediately
      const firstUrl = await firstPromise;

      if (firstUrl && !speakCancelledRef.current) {
        const firstAudio = new Audio(firstUrl);
        audioRef.current = firstAudio;

        firstAudio.onended = async () => {
          if (speakCancelledRef.current) { setIsSpeaking(false); return; }
          // Rest was prefetching in parallel — should be ready by now
          try {
            const restUrl = await restPromise;
            if (restUrl && !speakCancelledRef.current) {
              playTTSAudio(restUrl, true);
            } else {
              setIsSpeaking(false);
              autoListenAfterSpeech();
            }
          } catch {
            setIsSpeaking(false);
            autoListenAfterSpeech();
          }
        };
        firstAudio.onerror = () => speakBrowserFallback(text, targetLang);
        firstAudio.play().catch(() => speakBrowserFallback(text, targetLang));
        return;
      }

      // First URL was null — fall through to browser TTS
      speakBrowserFallback(text, targetLang);
    } catch (e) {
      console.error(`[Mitra TTS] Progressive fetch error:`, e);
      speakBrowserFallback(text, targetLang);
    }
  };

  const speakBrowserFallback = (text: string, targetLang: string) => {
    if (speakCancelledRef.current) {
      setIsSpeaking(false);
      return;
    }
    // Try target language, then similar languages, then any available
    const fallbackChain = [targetLang, 'hi', 'en'];
    let voice: SpeechSynthesisVoice | null = null;
    let usedLang = targetLang;
    for (const lang of fallbackChain) {
      voice = voiceCacheRef.current[lang] || null;
      if (voice) { usedLang = lang; break; }
    }
    if (hasBrowserTTSRef.current && voice) {
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
      speakBrowserQueue(sentences, voice, usedLang);
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
      if (modeRef.current === "voice" && isOpenRef.current && !isMutedRef.current) {
        setTimeout(() => {
          setTranscript("");
          setInterimTranscript("");
          transcriptRef.current = "";
          if (recognitionRef.current) {
            recognitionRef.current.lang = language === 'auto' ? (LANG_TO_RECOGNITION[detectedLangRef.current] || 'en-IN') : language;
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
                  onClick={() => {
                    modeRef.current = "voice";
                    setMode("voice");
                  }}
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
                    modeRef.current = "text";
                    setMode("text");
                    stopSpeech();
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
                    const nextMuted = !isMuted;
                    isMutedRef.current = nextMuted;
                    setIsMuted(nextMuted);
                    if (nextMuted) {
                      stopSpeech();
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
                    isOpenRef.current = false;
                    speakCancelledRef.current = true;
                    if (audioRef.current) audioRef.current.pause();
                    if (hasBrowserTTSRef.current) speechSynthesis.cancel();
                    if (recognitionRef.current && isListening) recognitionRef.current.stop();
                    audioQueueRef.current = [];
                    setIsSpeaking(false);
                    setIsListening(false);
                    voiceLive.disconnect(); // Clean up Gemini Live session
                    hasGeminiSpokenRef.current = false;
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
                        
                        {/* Render visual data inline with the message if it exists */}
                        {msg.visualData && msg.visualType === "PRODUCT" && (
                          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 mt-2 w-full max-w-full items-stretch">
                            {(() => {
                              const allProds = Array.isArray(msg.visualData) ? msg.visualData : [msg.visualData];
                              const isExpanded = expandedChatMsgs[i];
                              const visibleProds = isExpanded ? allProds : allProds.slice(0, 3);
                              const hasMore = allProds.length > 3;

                              return (
                                <>
                                  {visibleProds.map((prod: any) => (
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
                                  ))}
                                  {hasMore && !isExpanded && (
                                    <div className="min-w-[120px] w-[120px] shrink-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                         onClick={() => setExpandedChatMsgs(prev => ({ ...prev, [i]: true }))}>
                                      <div className="flex flex-col items-center text-[#D4AF37]">
                                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-2">
                                          <span className="text-lg">+</span>
                                        </div>
                                        <span className="text-xs font-bold">See {allProds.length - 3} More</span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {msg.visualData && msg.visualType === "CART" && (
                          <div className="space-y-2 mt-2 w-full">
                            {(Array.isArray(msg.visualData) ? msg.visualData : [msg.visualData]).map(
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
                                isOpenRef.current = false;
                                setIsOpen(false);
                                router.push("/checkout");
                              }}
                              className="w-full mt-1 bg-[#D4AF37] text-[#1A1D2E] hover:bg-[#b8962e] font-bold text-sm cursor-pointer"
                            >
                              Proceed to Checkout →
                            </Button>
                          </div>
                        )}
                        
                      </div>
                    ))}

                    {/* Visual cards are now rendered inline within the chat messages above */}

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
                <div className="flex-1 min-h-0 flex flex-col items-center justify-between overflow-y-auto overscroll-none px-4 py-2 w-full [&::-webkit-scrollbar]:hidden">
                  
                  {/* Top Area: Visual cards */}
                  <div className="flex-1 min-h-0 w-full flex items-end justify-center pb-4">
                    <AnimatePresence>
                      {visualData && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="w-full flex justify-center shrink-0"
                        >
                          {visualType === "PRODUCT" && (
                            <div className="flex gap-4 overflow-x-auto p-3 items-stretch w-full justify-center max-w-full">
                              {(() => {
                                const allProds = Array.isArray(visualData) ? visualData : [visualData];
                                const visibleProds = isVoiceExpanded ? allProds : allProds.slice(0, 3);
                                const hasMore = allProds.length > 3;

                                return (
                                  <>
                                    {visibleProds.map((prod: any) => (
                                      <div
                                        key={prod.id}
                                        className="min-w-[200px] w-[200px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37] shrink-0"
                                      >
                                        <div className="relative h-36 w-full">
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
                                  ))}
                                  {hasMore && !isVoiceExpanded && (
                                    <div className="min-w-[140px] w-[140px] shrink-0 flex items-center justify-center bg-white/5 border border-[#D4AF37]/50 rounded-2xl cursor-pointer hover:bg-[#D4AF37]/10 transition-colors shadow-2xl"
                                         onClick={() => setIsVoiceExpanded(true)}>
                                      <div className="flex flex-col items-center text-[#D4AF37]">
                                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-2">
                                          <span className="text-2xl">+</span>
                                        </div>
                                        <span className="text-sm font-bold tracking-wide">See {allProds.length - 3} More</span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
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
                                isOpenRef.current = false;
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
                  </div>

                  {/* Middle Area: Golden Orb */}
                  <div className="shrink-0 my-2">
                    <motion.div layout className="relative shrink-0">
                      {/* LIVE badge */}
                      {voiceLive.isConnected && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          LIVE
                        </div>
                      )}
                      <motion.div
                        animate={{
                          scale: (isListening || isSpeaking || voiceLive.isSpeaking) ? [1, 1.08, 1] : 1,
                          boxShadow: (isSpeaking || voiceLive.isSpeaking)
                            ? "0 0 50px 15px rgba(212, 175, 55, 0.5)"
                            : voiceLive.isConnected
                            ? "0 0 30px 10px rgba(16, 185, 129, 0.3)"
                            : "0 0 20px 5px rgba(212, 175, 55, 0.15)",
                        }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className={`${
                          visualData ? "w-20 h-20 sm:w-28 sm:h-28" : "w-36 h-36 sm:w-48 sm:h-48"
                        } rounded-full bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] flex items-center justify-center border-4 border-white/20 transition-all duration-500`}
                      >
                        {(isListening || voiceLive.isConnected) ? (
                          <Mic className={`${visualData ? "w-8 h-8" : "w-12 h-12"} text-[#2F334F]`} />
                        ) : isProcessing ? (
                          <Loader2 className={`${visualData ? "w-8 h-8" : "w-12 h-12"} text-[#2F334F] animate-spin`} />
                        ) : (
                          <Sparkles className={`${visualData ? "w-8 h-8" : "w-12 h-12"} text-[#2F334F]`} />
                        )}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Bottom Area: Transcript + Reply */}
                  <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-start pt-4">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-3 px-4 text-center">
                      {(transcript || interimTranscript) && (
                        <p className="text-xl sm:text-2xl font-medium leading-tight">
                          {transcript && <span className="text-[#D4AF37]">{transcript}</span>}
                          {interimTranscript && <span className="text-[#D4AF37]/70">{interimTranscript}</span>}
                        </p>
                      )}
                      {isProcessing ? (
                        <p className="text-base text-white/40 animate-pulse">
                          Consulting the loom...
                        </p>
                      ) : (
                        reply && (
                          <div ref={replyContainerRef} className="bg-white/8 backdrop-blur-md rounded-2xl p-4 border border-white/8 overflow-y-auto w-full shadow-inner text-left max-h-[140px]">
                            <p className="text-sm text-[#E5DCCA] italic leading-relaxed font-serif whitespace-pre-line">
                              {reply}
                            </p>
                          </div>
                        )
                      )}
                    </div>
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
                    <SelectItem value="or-IN">ଓଡ଼ିଆ</SelectItem>
                    <SelectItem value="bn-IN">বাংলা</SelectItem>
                    <SelectItem value="ta-IN">தமிழ்</SelectItem>
                    <SelectItem value="te-IN">తెలుగు</SelectItem>
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
