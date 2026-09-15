import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Convert 16-bit PCM buffer to standard WAV format
function pcmToWavBuffer(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  numChannels = 1,
  bitDepth = 16
): Buffer {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk size (16 for PCM)
  header.writeUInt16LE(1, 20); // PCM audio format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.1-flash-tts-preview",
  });
});

// Text-to-Speech endpoint using gemini-3.1-flash-tts-preview
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    const ai = getAi();
    const validVoices = ["Kore", "Puck", "Charon", "Fenrir", "Zephyr"];
    const selectedVoice = validVoices.includes(voice) ? voice : "Kore";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    const rawAudioBase64 = part?.inlineData?.data;
    const reportedMime = part?.inlineData?.mimeType || "audio/pcm;rate=24000";

    if (!rawAudioBase64) {
      return res
        .status(500)
        .json({ error: "No audio data returned from Gemini TTS model" });
    }

    // Convert raw PCM to standard WAV for browser compatibility
    const pcmBuf = Buffer.from(rawAudioBase64, "base64");
    const wavBuf = pcmToWavBuffer(pcmBuf, 24000, 1, 16);
    const wavBase64 = wavBuf.toString("base64");

    res.json({
      success: true,
      model: "gemini-3.1-flash-tts-preview",
      voice: selectedVoice,
      mimeType: "audio/wav",
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
      reportedMime,
      durationEstimated: Math.round((pcmBuf.length / (24000 * 2)) * 10) / 10,
    });
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate speech",
      details: error?.status || "TTS_GENERATION_FAILED",
    });
  }
});

// Mock Order submission endpoint
app.post("/api/orders", (req, res) => {
  try {
    const orderData = req.body;
    const orderNumber = `AUER-${Date.now().toString().slice(-6)}`;
    res.json({
      success: true,
      orderNumber,
      orderDate: new Date().toISOString(),
      ...orderData,
      status: "CONFIRMED",
    });
  } catch (err: any) {
    res.status(500).json({ error: "Order submission failed" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
