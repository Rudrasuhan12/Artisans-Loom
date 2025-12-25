"use client";

import { useLanguageStore, Language } from "@/store/useLanguageStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', label: 'اردو (Urdu)' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 px-4 rounded-full border-[#D4AF37]/30 text-[#4A3526] hover:bg-white bg-white/40 backdrop-blur-sm text-sm gap-2 min-w-30 justify-between">
          <div className="flex items-center gap-2">
             <Globe className="w-4 h-4" /> 
             <span className="truncate max-w-20">
               {languages.find(l => l.code === language)?.label.split(' ')[0]}
             </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#FFFBF5] border-[#D4AF37]/30 max-h-75 overflow-y-auto z-50">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)} 
            className="font-serif text-[#4A3526] focus:bg-[#D4AF37]/10 cursor-pointer flex justify-between items-center gap-4"
          >
            <span>{lang.label}</span>
            {language === lang.code && <Check className="w-3 h-3 text-[#D4AF37]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}