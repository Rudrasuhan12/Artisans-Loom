import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    const safeText = text.substring(0, 200); 
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(safeText)}&tl=${lang || "en"}&client=tw-ob`;

    const response = await fetch(googleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Google TTS API responded with ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");
    const audioDataUri = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({ url: audioDataUri });

  } catch (error) {
    console.error("TTS Proxy Error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}