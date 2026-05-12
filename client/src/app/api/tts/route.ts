import { NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Microsoft Edge Neural Voice mapping
const VOICE_MAP: Record<string, string> = {
  en: "en-IN-NeerjaNeural",
  hi: "hi-IN-SwaraNeural",
  bn: "bn-IN-TanishaaNeural",   // Native Bengali voice works perfectly
  ta: "ta-IN-PallaviNeural",    // Native Tamil voice works perfectly
  te: "te-IN-ShrutiNeural",     // Native Telugu voice works perfectly
  or: "hi-IN-SwaraNeural",      // Odia native voice broken → Hindi voice + Devanagari transliteration
  mr: "mr-IN-AarohiNeural",
};

// Odia-specific characters that DON'T map cleanly with a simple offset
// These need explicit mapping to correct Devanagari equivalents
const ODIA_SPECIAL_MAP: Record<number, number> = {
  0x0B5C: 0x0921,  // ଡ଼ → ड (Da)
  0x0B5D: 0x0922,  // ଢ଼ → ढ (Dha)
  0x0B5F: 0x092F,  // ୟ → य (Ya)
  0x0B70: 0x0950,  // ୰ → ॐ (isshar - rare, map to Om)
  0x0B71: 0x0935,  // ୱ → व (Wa/Va) — CRITICAL FIX: was mapping to ॱ garbage
};

// Transliterate Odia script to Devanagari for TTS
// Edge TTS returns 0 bytes for Odia Unicode, so we convert to Devanagari
// and use the Hindi neural voice which sounds natural for Odia pronunciation
function odiaToDevanagari(text: string): string {
  return text.replace(/[\u0B00-\u0B7F]/g, ch => {
    const code = ch.charCodeAt(0);
    // Check special mapping first
    if (ODIA_SPECIAL_MAP[code] !== undefined) {
      return String.fromCharCode(ODIA_SPECIAL_MAP[code]);
    }
    // Standard offset: Odia (0x0B00) → Devanagari (0x0900)
    const mapped = code - 0x0200;
    // Validate mapped code is in Devanagari range
    if (mapped >= 0x0900 && mapped <= 0x097F) {
      return String.fromCharCode(mapped);
    }
    // If mapping is invalid, return original character
    return ch;
  });
}

// Check if text contains Odia script (the only Indic script that fails in Edge TTS)
function hasOdiaScript(text: string): boolean {
  return /[\u0B00-\u0B7F]/.test(text);
}

// Clean text for better TTS reading
function cleanTextForTTS(text: string, lang: string): string {
  let cleaned = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[*_~`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Language-specific ₹ handling
  if (lang === 'hi' || lang === 'or' || lang === 'mr') {
    cleaned = cleaned.replace(/₹\s*(\d[\d,]*)/g, "$1 रुपये");
  } else if (lang === 'bn') {
    cleaned = cleaned.replace(/₹\s*(\d[\d,]*)/g, "$1 টাকা");
  } else if (lang === 'ta') {
    cleaned = cleaned.replace(/₹\s*(\d[\d,]*)/g, "$1 ரூபாய்");
  } else if (lang === 'te') {
    cleaned = cleaned.replace(/₹\s*(\d[\d,]*)/g, "$1 రూపాయలు");
  } else {
    cleaned = cleaned.replace(/₹\s*(\d[\d,]*)/g, "$1 rupees");
  }

  return cleaned;
}

async function generateSpeech(voiceName: string, text: string): Promise<string | null> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    audioStream.on("end", resolve);
    audioStream.on("close", resolve);
    audioStream.on("error", reject);
  });

  if (chunks.length === 0) return null;
  const audioBuffer = Buffer.concat(chunks);
  if (audioBuffer.length === 0) return null;
  return `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    let cleanedText = cleanTextForTTS(text.substring(0, 500), lang || 'en');
    if (!cleanedText) {
      return NextResponse.json({ url: null });
    }

    const voiceName = VOICE_MAP[lang] || VOICE_MAP.en;

    // Odia is the only language where Edge TTS returns 0 bytes for native script.
    // Bengali, Tamil, Telugu all work with their native voices.
    // For Odia: transliterate to Devanagari → read with Hindi neural voice.
    if (hasOdiaScript(cleanedText)) {
      cleanedText = odiaToDevanagari(cleanedText);
      console.log(`[TTS] Transliterated Odia → Devanagari for Hindi voice`);
    }

    try {
      console.log(`[TTS] Generating: voice=${voiceName}, lang=${lang}, len=${cleanedText.length}`);
      const audioUrl = await generateSpeech(voiceName, cleanedText);
      if (audioUrl) {
        console.log(`[TTS] ✅ Success`);
        return NextResponse.json({ url: audioUrl });
      }

      // If primary voice returned empty, try English as last resort
      console.log(`[TTS] ⚠️ Primary empty, trying English fallback`);
      const fallbackUrl = await generateSpeech(VOICE_MAP.en, cleanedText);
      if (fallbackUrl) return NextResponse.json({ url: fallbackUrl });
    } catch (err) {
      console.error(`[TTS] ❌ Error:`, err);
      try {
        const fallbackUrl = await generateSpeech(VOICE_MAP.en, cleanedText);
        if (fallbackUrl) return NextResponse.json({ url: fallbackUrl });
      } catch (_) {}
    }

    return NextResponse.json({ url: null });
  } catch (error) {
    console.error("[TTS] Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}