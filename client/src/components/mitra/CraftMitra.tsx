"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, X, Sparkles, Globe, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function CraftMitra() {
  const { user } = useUser();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [language, setLanguage] = useState("auto");

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef(""); 
  const audioRef = useRef<HTMLAudioElement | null>(null); 

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
      setIsSpeaking(false);
    }

    if (!isOpen) {
      setIsOpen(true);
      const name = user?.firstName || "Traveler";
      const greeting = `Namaste ${name}, I am Craft Mitra. How can I help?`;
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
      try { recognitionRef.current.start(); setIsListening(true); } catch(e) {}
    }
  };

  // --- 3. SEND TO GEMINI API ---
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
      
      // Speak the response using SERVER TTS
      await speak(data.text);

      if (data.action === "NAVIGATE" && data.url) {
        setTimeout(() => { setIsOpen(false); router.push(data.url); }, 4000);
      }
    } catch (error) {
      const err = "I am unable to connect to the loom.";
      setReply(err);
      speak(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 4. SERVER-SIDE TTS (THE FIX) ---
  const speak = async (text: string) => {
    try {
      // 1. Determine Language Code
      let targetLang = language === 'auto' ? 'en' : language.split('-')[0];
      
      // Auto-detect based on script if 'auto'
      if (language === 'auto') {
        if (/[\u0900-\u097F]/.test(text)) targetLang = 'hi'; // Hindi
        else if (/[\u0980-\u09FF]/.test(text)) targetLang = 'bn'; // Bengali
        else if (/[\u0B00-\u0B7F]/.test(text)) targetLang = 'or'; // Odia (Google code 'or')
        else if (/[\u0B80-\u0BFF]/.test(text)) targetLang = 'ta'; // Tamil
        else if (/[\u0C00-\u0C7F]/.test(text)) targetLang = 'te'; // Telugu
      }

      // 2. Fetch Audio URL from our new API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: targetLang }),
      });

      const { url } = await response.json();

      // 3. Play Audio
      if (url) {
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      {!isOpen && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-8 right-8 z-[100] cursor-pointer group"
          onClick={toggleListening}
        >
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#2F334F] to-[#1A1D2E] border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[#D4AF37]/20 animate-pulse rounded-full"></div>
             <Mic className="w-8 h-8 text-[#D4AF37] z-10 group-hover:scale-110 transition-transform" />
          </div>
        </motion.div>
      )}

      {/* FULL SCREEN INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <button 
              onClick={() => { 
                setIsOpen(false); 
                if(audioRef.current) audioRef.current.pause(); 
                setIsSpeaking(false);
              }}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
            >
              <X className="w-10 h-10" />
            </button>

            {/* --- VISUAL ORB --- */}
            <div className="relative mb-8 mt-4 shrink-0">
               <motion.div 
                 animate={{ 
                   scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
                   boxShadow: isSpeaking 
                     ? "0 0 60px 20px rgba(212, 175, 55, 0.6)" 
                     : "0 0 20px 5px rgba(212, 175, 55, 0.2)"
                 }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] flex items-center justify-center relative z-10 border-4 border-white/20"
               >
                 {isListening ? (
                    <Mic className="w-12 h-12 text-[#2F334F]" />
                 ) : isProcessing ? (
                    <Loader2 className="w-12 h-12 text-[#2F334F] animate-spin" />
                 ) : (
                    <Sparkles className="w-12 h-12 text-[#2F334F]" />
                 )}
               </motion.div>

               {/* Wave Animation */}
               {(isListening || isSpeaking) && (
                 <>
                   <motion.div animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full border border-[#D4AF37]/50" />
                   <motion.div animate={{ scale: [1, 3], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute inset-0 rounded-full border border-[#D4AF37]/30" />
                 </>
               )}
            </div>

            {/* --- TEXT AREA (Scrollable) --- */}
            <div className="w-full max-w-3xl flex flex-col items-center space-y-6 flex-1 min-h-0">
               
               {/* User Speech */}
               <div className="h-16 flex items-end">
                 <p className="text-xl md:text-2xl text-[#D4AF37] font-medium text-center">
                   {transcript ? `"${transcript}"` : ""}
                 </p>
               </div>

               {/* AI Response */}
               <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 overflow-y-auto custom-scrollbar max-h-[40vh]">
                 {isProcessing ? (
                   <div className="flex items-center justify-center gap-2 text-white/50">
                      <Loader2 className="w-4 h-4 animate-spin" /> Retrieving ancient wisdom...
                   </div>
                 ) : (
                   <motion.p 
                     initial={{ opacity: 0, y: 10 }} 
                     animate={{ opacity: 1, y: 0 }}
                     className="text-lg md:text-xl text-[#E5DCCA] italic leading-relaxed text-center font-serif"
                   >
                     {reply}
                   </motion.p>
                 )}
               </div>
            </div>

            {/* --- CONTROLS --- */}
            <div className="mt-8 mb-4 flex items-center gap-4 relative z-[200]">
               <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-12 w-[160px] rounded-full bg-[#1A1D2E] border border-[#D4AF37]/50 text-[#D4AF37] text-base font-medium shadow-lg hover:border-[#D4AF37] transition-colors focus:ring-0 focus:ring-offset-0">
                     <Globe className="w-4 h-4 mr-2" />
                     <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  
                  <SelectContent className="bg-[#2F334F] border-[#D4AF37] text-white z-[200]">
                     <SelectItem value="auto">Auto Detect</SelectItem>
                     <SelectItem value="hi-IN">Hindi (हिंदी)</SelectItem>
                     <SelectItem value="bn-IN">Bengali (বাংলা)</SelectItem>
                     <SelectItem value="ta-IN">Tamil (தமிழ்)</SelectItem>
                     <SelectItem value="te-IN">Telugu (తెలుగు)</SelectItem>
                     <SelectItem value="or-IN">Odia (ଓଡ଼ିଆ)</SelectItem>
                     <SelectItem value="en-IN">English</SelectItem>
                  </SelectContent>
               </Select>

               <Button 
                 onClick={toggleListening}
                 className={`h-16 w-16 rounded-full shadow-2xl transition-all border-4 ${
                   isListening 
                     ? 'bg-red-500 hover:bg-red-600 border-red-300 scale-110' 
                     : 'bg-[#D4AF37] hover:bg-[#B8860B] border-[#F3E5AB]'
                 }`}
               >
                 {isListening ? (
                    <div className="w-6 h-6 bg-white rounded-md animate-pulse" />
                 ) : (
                    <Mic className="w-10 h-10 text-[#2F334F]" />
                 )}
               </Button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}