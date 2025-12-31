"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

const translationCache: Record<string, string> = {};

export default function AutoTranslate({ text, className }: { text: string, className?: string }) {
  const { language } = useLanguageStore();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!text || language.startsWith('en')) {
      setDisplay(text);
      return;
    }

    const cacheKey = `${language}:${text}`;

    if (translationCache[cacheKey]) {
      setDisplay(translationCache[cacheKey]);
      return;
    }

    const fetchTranslation = async () => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text, 
            targetLanguage: getLanguageName(language)
          })
        });

        const data = await res.json();
        
        if (data.translatedText) {
          translationCache[cacheKey] = data.translatedText;
          setDisplay(data.translatedText);
        }
      } catch (err) {
        setDisplay(text);
      }
    };

    fetchTranslation();
  }, [text, language]);

  return <span className={className}>{display}</span>;
}

function getLanguageName(code: string) {
  const map: Record<string, string> = {
    hi: "Hindi", bn: "Bengali", te: "Telugu", mr: "Marathi",
    ta: "Tamil", gu: "Gujarati", kn: "Kannada", ml: "Malayalam",
    or: "Odia", pa: "Punjabi", ur: "Urdu"
  };
  return map[code.split('-')[0]] || "English";
}