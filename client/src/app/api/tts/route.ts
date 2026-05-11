import { NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Microsoft Edge Neural Voice mapping — these are genuinely human-like
const VOICE_MAP: Record<string, string> = {
  en: "en-IN-NeerjaNeural",   // Indian English female — warm, natural
  hi: "hi-IN-SwaraNeural",    // Hindi female — excellent quality
  bn: "bn-IN-TanishaaNeural", // Bengali female
  ta: "ta-IN-PallaviNeural",  // Tamil female
  te: "te-IN-ShrutiNeural",   // Telugu female
  or: "or-IN-SubhasiniNeural",// Odia female
  mr: "mr-IN-AarohiNeural",   // Marathi female
};

// Reusable TTS instances per voice (connection pooling)
const ttsCache = new Map<string, MsEdgeTTS>();

async function getTTSInstance(voice: string): Promise<MsEdgeTTS> {
  if (ttsCache.has(voice)) {
    return ttsCache.get(voice)!;
  }
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  ttsCache.set(voice, tts);
  return tts;
}

// Clean text for better TTS reading
function cleanTextForTTS(text: string): string {
  return text
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Convert ₹ to "rupees" for better reading
    .replace(/₹\s*(\d[\d,]*)/g, "$1 rupees")
    // Remove markdown-like symbols
    .replace(/[*_~`#]/g, "")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanedText = cleanTextForTTS(text.substring(0, 500));
    if (!cleanedText) {
      return NextResponse.json({ url: null });
    }

    const voiceName = VOICE_MAP[lang] || VOICE_MAP.en;

    try {
      const tts = await getTTSInstance(voiceName);
      const { audioStream } = tts.toStream(cleanedText);

      // Collect audio chunks into a single buffer
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
        audioStream.on("end", resolve);
        audioStream.on("close", resolve);
        audioStream.on("error", reject);
      });

      const audioBuffer = Buffer.concat(chunks);
      const base64Audio = audioBuffer.toString("base64");
      const audioDataUri = `data:audio/mpeg;base64,${base64Audio}`;

      return NextResponse.json({ url: audioDataUri });
    } catch (ttsError) {
      // If Edge TTS fails, clear cache and retry once with fresh instance
      console.error("Edge TTS Error, retrying:", ttsError);
      ttsCache.delete(voiceName);

      try {
        const tts = await getTTSInstance(voiceName);
        const { audioStream } = tts.toStream(cleanedText);
        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
          audioStream.on("end", resolve);
          audioStream.on("close", resolve);
          audioStream.on("error", reject);
        });
        const audioBuffer = Buffer.concat(chunks);
        const base64Audio = audioBuffer.toString("base64");
        return NextResponse.json({ url: `data:audio/mpeg;base64,${base64Audio}` });
      } catch (retryError) {
        console.error("Edge TTS retry failed:", retryError);
        return NextResponse.json({ url: null });
      }
    }
  } catch (error) {
    console.error("TTS Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}