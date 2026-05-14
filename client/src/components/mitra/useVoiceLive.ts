'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * useVoiceLive — React hook for Gemini Live bidirectional voice streaming.
 *
 * Captures mic audio as PCM16 @ 16kHz via Web Audio API, sends to server
 * WebSocket, receives audio chunks back, and plays them instantly via AudioContext.
 *
 * Same architecture as the WombTo18 Maternal Module voice frontend.
 */

// ── Helpers ───────────────────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface VoiceLiveAction {
  action: string;
  data?: any;
  url?: string;
}

export interface UseVoiceLiveOptions {
  serverUrl?: string;
  onTranscript?: (side: 'user' | 'assistant', text: string, isFinal: boolean) => void;
  onAction?: (action: VoiceLiveAction) => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
  onReady?: () => void;
  onEnded?: (reason: string) => void;
  onError?: (message: string) => void;
}

export interface UseVoiceLiveReturn {
  connect: (role?: string, name?: string) => Promise<void>;
  disconnect: () => void;
  sendText: (text: string) => void;
  sendIdentify: (data: { email?: string; name?: string }) => void;
  isConnected: boolean;
  isReady: boolean;
  isSpeaking: boolean;
  userTranscript: string;
  assistantTranscript: string;
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useVoiceLive(options: UseVoiceLiveOptions): UseVoiceLiveReturn {
  const {
    serverUrl = `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3001/voice`,
    onTranscript,
    onAction,
    onSpeakingChange,
    onReady,
    onEnded,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [assistantTranscript, setAssistantTranscript] = useState('');
  const lastSideRef = useRef<'user' | 'assistant' | null>(null);
  
  // Track continuous strings synchronously for callbacks
  const userFullTranscriptRef = useRef('');
  const assistantFullTranscriptRef = useRef('');

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Playback
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const playingCountRef = useRef(0);
  const onSpeakingChangeRef = useRef(onSpeakingChange);

  // Keep the ref synced with the latest callback
  useEffect(() => { onSpeakingChangeRef.current = onSpeakingChange; }, [onSpeakingChange]);

  // ── Audio playback — queue PCM chunks and play sequentially ──────────

  const playAudioChunk = useCallback((base64Data: string) => {
    if (!playbackCtxRef.current) {
      playbackCtxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = playbackCtxRef.current;

    const raw = base64ToArrayBuffer(base64Data);
    const pcm16 = new Int16Array(raw);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startTime = Math.max(now, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;

    playingCountRef.current++;
    if (playingCountRef.current === 1) {
      // First chunk — speaking just started. Fire callback SYNCHRONOUSLY
      // so the echo guard ref updates before next browser STT result.
      setIsSpeaking(true);
      onSpeakingChangeRef.current?.(true);
    }

    source.onended = () => {
      playingCountRef.current--;
      if (playingCountRef.current <= 0) {
        playingCountRef.current = 0;
        setIsSpeaking(false);
        onSpeakingChangeRef.current?.(false);
      }
    };
  }, []);

  // ── Mic capture — PCM16 @ 16kHz ─────────────────────────────────────

  const startMicCapture = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    mediaStreamRef.current = stream;

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    sourceRef.current = source;

    // ScriptProcessorNode — sends audio chunks every ~128ms (2048 samples @ 16kHz)
    // Smaller buffer = Gemini detects end-of-speech faster = lower response latency
    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const float32 = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        pcm16[i] = Math.max(-32768, Math.min(32767, Math.round(float32[i] * 32767)));
      }

      const base64 = arrayBufferToBase64(pcm16.buffer);
      wsRef.current.send(JSON.stringify({ type: 'audio', data: base64 }));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
  }, []);

  const stopMicCapture = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close().catch(() => {});
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
    mediaStreamRef.current = null;
  }, []);

  // ── Connect to voice server ─────────────────────────────────────────

  const connect = useCallback(async (role?: string, name?: string) => {
    if (wsRef.current) return;

    // Start mic capture IN PARALLEL with the WS connection to save 1-2 seconds
    const micPromise = startMicCapture().catch((err: any) => {
      console.error('[VoiceLive] Mic access denied:', err);
      onError?.('Microphone access denied. Please allow mic access.');
      return false;
    });

    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (name) query.append('name', name);
    
    const ws = new WebSocket(`${serverUrl}?${query.toString()}`);
    wsRef.current = ws;

    ws.onopen = async () => {
      console.log('[VoiceLive] Connected to server');
      setIsConnected(true);
      const micGranted = await micPromise;
      if (micGranted === false) {
        ws.close();
      }
    };

    ws.onmessage = (event) => {
      let msg: any;
      try { msg = JSON.parse(event.data); } catch { return; }

      switch (msg.type) {
        case 'ready':
          console.log('[VoiceLive] Gemini Live session ready');
          setIsReady(true);
          onReady?.();
          break;

        case 'transcript':
          if (msg.side === 'user') {
            if (lastSideRef.current !== 'user') {
              userFullTranscriptRef.current = msg.text || '';
              setUserTranscript(userFullTranscriptRef.current);
              lastSideRef.current = 'user';
            } else {
              userFullTranscriptRef.current += (msg.text || '');
              setUserTranscript(userFullTranscriptRef.current);
            }
            onTranscript?.('user', userFullTranscriptRef.current, msg.isFinal);
          } else {
            if (lastSideRef.current !== 'assistant') {
              assistantFullTranscriptRef.current = msg.text || '';
              setAssistantTranscript(assistantFullTranscriptRef.current);
              lastSideRef.current = 'assistant';
            } else {
              assistantFullTranscriptRef.current += (msg.text || '');
              setAssistantTranscript(assistantFullTranscriptRef.current);
            }
            onTranscript?.('assistant', assistantFullTranscriptRef.current, msg.isFinal);
          }
          break;

        case 'audio':
          // Play audio chunk IMMEDIATELY — this is what makes it sub-1s
          playAudioChunk(msg.data);
          break;

        case 'action':
          // Shopping action from Gemini's function call (product cards, cart, etc.)
          onAction?.({ action: msg.action, data: msg.data, url: msg.url });
          break;

        case 'turnComplete':
          // Do not clear the transcript here so the user can finish reading it.
          // It will be replaced when the next turn starts.
          break;

        case 'ended':
          console.log('[VoiceLive] Session ended:', msg.reason);
          onEnded?.(msg.reason);
          break;

        case 'error':
          console.error('[VoiceLive] Server error:', msg.message);
          onError?.(msg.message);
          break;
      }
    };

    ws.onclose = () => {
      console.log('[VoiceLive] Disconnected');
      setIsConnected(false);
      setIsReady(false);
      setIsSpeaking(false);
      stopMicCapture();
      wsRef.current = null;
    };

    ws.onerror = (err) => {
      console.error('[VoiceLive] WebSocket error:', err);
      onError?.('Voice connection failed. Is the server running on port 3001?');
    };
  }, [serverUrl, startMicCapture, stopMicCapture, playAudioChunk, onTranscript, onAction, onReady, onEnded, onError]);

  const sendText = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', text }));
    }
  }, []);

  const sendIdentify = useCallback((data: { email?: string; name?: string }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'identify', ...data }));
    }
  }, []);

  // ── Disconnect ──────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop' }));
      wsRef.current.close();
    }
    stopMicCapture();
    // Reset playback
    nextPlayTimeRef.current = 0;
    playingCountRef.current = 0;
    playbackCtxRef.current?.close().catch(() => {});
    playbackCtxRef.current = null;
    setIsConnected(false);
    setIsReady(false);
    setIsSpeaking(false);
    userFullTranscriptRef.current = '';
    assistantFullTranscriptRef.current = '';
    setUserTranscript('');
    setAssistantTranscript('');
    lastSideRef.current = null;
    wsRef.current = null;
  }, [stopMicCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendText,
    sendIdentify,
    isConnected,
    isReady,
    isSpeaking,
    userTranscript,
    assistantTranscript,
  };
}
