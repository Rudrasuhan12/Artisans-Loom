"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, X, Sparkles, Globe, Loader2, ShoppingCart, Package, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export default function CraftMitra() {
  const { user } = useUser();
  const router = useRouter();
  const addToCartStore = useCartStore((state) => state.addToCart);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [language, setLanguage] = useState("auto");
  
  const [visualData, setVisualData] = useState<any>(null); 
  const [visualType, setVisualType] = useState<"PRODUCT" | "ORDER" | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef(""); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        transcriptRef.current = currentTranscript;
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcriptRef.current.trim().length > 1) {
          handleSend(transcriptRef.current);
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioQueueRef.current = [];
      setIsSpeaking(false);
    }

    if (!isOpen) {
      setIsOpen(true);
      const name = user?.firstName || "Traveler";
      const greeting = `Namaste ${name}, I am Craft Mitra. How may I serve you?`;
      setReply(greeting);
      speak(greeting);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      transcriptRef.current = "";
      recognitionRef.current.lang = language === 'auto' ? 'en-IN' : language; 
      try { recognitionRef.current.start(); setIsListening(true); } catch(e) { console.error(e); }
    }
  };

  const handleSend = async (text: string) => {
    setIsProcessing(true);   
    try {
      const response = await fetch('/api/mitra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: [] }) 
      });

      const data = await response.json();
      setReply(data.text);

      await speak(data.text);

      if (data.action === "SHOW_PRODUCTS" || data.action === "SHOW_ORDER") {
        setVisualType(data.action === "SHOW_PRODUCTS" ? "PRODUCT" : "ORDER");
        setVisualData(data.data);
      } else {
        setVisualData(null);
        setVisualType(null);
      }

      if (data.action === "NAVIGATE" && data.url) {
        setTimeout(() => { setIsOpen(false); router.push(data.url); }, 3000);
      }

    } catch (error) {
      setReply("I lost connection. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = async (text: string) => {
    if (audioRef.current) audioRef.current.pause();
    setIsSpeaking(true);

    let targetLang = language === 'auto' ? 'en' : language.split('-')[0];
    if (language === 'auto') {
      if (/[\u0900-\u097F]/.test(text)) targetLang = 'hi'; 
      else if (/[\u0980-\u09FF]/.test(text)) targetLang = 'bn'; 
      else if (/[\u0B00-\u0B7F]/.test(text)) targetLang = 'or'; 
      else if (/[\u0B80-\u0BFF]/.test(text)) targetLang = 'ta'; 
      else if (/[\u0C00-\u0C7F]/.test(text)) targetLang = 'te'; 
    }
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    
    audioQueueRef.current = sentences;
    playQueue(targetLang);
  };

  const playQueue = async (lang: string) => {
    if (audioQueueRef.current.length === 0) {
      setIsSpeaking(false);
      return;
    }

    const nextSentence = audioQueueRef.current.shift();
    if (!nextSentence) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nextSentence, lang }),
      });

      const { url } = await response.json();

      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => {
          playQueue(lang);
        };
        
        audio.play();
      } else {
        playQueue(lang);
      }
    } catch (e) {
      console.error(e);
      playQueue(lang);
    }
  };


  const handleAddToCart = (product: any) => {
    addToCartStore({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || "/p1.png",
      quantity: 1
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <>
      {!isOpen && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-8 right-8 z-100 cursor-pointer group"
          onClick={toggleListening}
        >
          <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-[#2F334F] to-[#1A1D2E] border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[#D4AF37]/20 animate-pulse rounded-full"></div>
             <Mic className="w-8 h-8 text-[#D4AF37] z-10 group-hover:scale-110 transition-transform" />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex flex-col items-center p-4 overflow-hidden"
          >
            <button 
              onClick={() => { 
                setIsOpen(false); 
                if(audioRef.current) audioRef.current.pause(); 
                setIsSpeaking(false); 
              }}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 z-50"
            >
              <X className="w-10 h-10" />
            </button>

            <div className={`w-full max-w-5xl flex-1 flex flex-col items-center transition-all duration-500 ${visualData ? 'justify-start pt-10' : 'justify-center'}`}>

              <AnimatePresence>
                {visualData && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="w-full flex justify-center mb-8 shrink-0"
                  >
                    {visualType === "PRODUCT" && (
                      <div className="flex gap-6 overflow-x-auto p-4 custom-scrollbar items-center w-full justify-center max-w-full">
                        {visualData.map((prod: any) => (
                          <div key={prod.id} className="min-w-55 w-55 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37] shrink-0">
                            <div className="relative h-32 w-full">
                              <Image src={prod.images[0] || "/p1.png"} alt={prod.title} fill className="object-cover" />
                            </div>
                            <div className="p-4">
                              <h4 className="text-sm font-bold text-[#4A3526] line-clamp-1">{prod.title}</h4>
                              <p className="text-xs text-[#D97742] font-bold mt-1">₹{prod.price}</p>
                              <Button onClick={() => handleAddToCart(prod)} className="w-full h-9 mt-3 text-xs bg-[#2F334F] text-[#D4AF37] hover:bg-[#1E2135]">
                                <ShoppingCart className="w-3 h-3 mr-1" /> Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout className="relative mb-8 shrink-0">
                 <motion.div 
                   animate={{ 
                     scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
                     boxShadow: isSpeaking 
                       ? "0 0 60px 20px rgba(212, 175, 55, 0.6)" 
                       : "0 0 20px 5px rgba(212, 175, 55, 0.2)"
                   }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className={`${visualData ? 'w-24 h-24 md:w-32 md:h-32' : 'w-40 h-40 md:w-56 md:h-56'} rounded-full bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] flex items-center justify-center relative z-10 border-4 border-white/20 transition-all duration-500`}
                 >
                   {isListening ? <Mic className={`${visualData ? 'w-10 h-10' : 'w-20 h-20'} text-[#2F334F]`} /> : isProcessing ? <Loader2 className={`${visualData ? 'w-10 h-10' : 'w-20 h-20'} text-[#2F334F] animate-spin`} /> : <Sparkles className={`${visualData ? 'w-10 h-10' : 'w-20 h-20'} text-[#2F334F]`} />}
                 </motion.div>
              </motion.div>

              <div className="w-full max-w-3xl flex flex-col items-center space-y-4 px-4 text-center">
                 
                 <div className="min-h-10">
                   <p className="text-2xl text-[#D4AF37] font-medium leading-tight">
                     {transcript ? `"${transcript}"` : ""}
                   </p>
                 </div>

                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                   {isProcessing ? (
                     <p className="text-lg text-white/50 animate-pulse">Consulting the loom...</p>
                   ) : (
                     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-h-60 overflow-y-auto custom-scrollbar shadow-inner text-left mx-auto max-w-2xl">
                       <p className="text-lg text-[#E5DCCA] italic leading-relaxed font-serif whitespace-pre-line">
                         {reply}
                       </p>
                     </div>
                   )}
                 </motion.div>
              </div>

            </div>

            <div className="pb-12 pt-4 flex items-center gap-6 relative z-200">
               <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-14 w-45 rounded-full bg-[#1A1D2E] border border-[#D4AF37]/50 text-[#D4AF37] text-lg font-medium shadow-lg hover:border-[#D4AF37] transition-colors focus:ring-0 focus:ring-offset-0">
                     <Globe className="w-5 h-5 mr-2" />
                     <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2F334F] border-[#D4AF37] text-white z-200">
                     <SelectItem value="auto">Auto Detect</SelectItem>
                     <SelectItem value="hi-IN">Hindi (हिंदी)</SelectItem>
                     <SelectItem value="bn-IN">Bengali (বাংলা)</SelectItem>
                     <SelectItem value="ta-IN">Tamil (தமிழ்)</SelectItem>
                     <SelectItem value="te-IN">Telugu (తెలుగు)</SelectItem>
                     <SelectItem value="or-IN">Odia (ଓଡ଼ିଆ)</SelectItem>
                     <SelectItem value="en-IN">English</SelectItem>
                  </SelectContent>
               </Select>

               <Button onClick={toggleListening} className={`h-20 w-20 rounded-full shadow-2xl transition-all border-4 ${isListening ? 'bg-red-500 hover:bg-red-600 border-red-300 scale-110' : 'bg-[#D4AF37] hover:bg-[#B8860B] border-[#F3E5AB]'}`}>
                 {isListening ? <div className="w-8 h-8 bg-white rounded-md animate-pulse" /> : <Mic className="w-10 h-10 text-[#2F334F]" />}
               </Button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}