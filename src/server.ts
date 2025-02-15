import express from "express";
import { createClient } from "@deepgram/sdk";
import http from "http";
import WebSocket from "ws";
import cors from "cors";
import fs from "fs";
import path from "path";
const terser = import("terser");

const app = express();
const PORT = 3003;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "../public")));

let fullTranscript = ""; // ✅ Stores full transcript

// Enable CORS to allow requests from ChatGPT.com
app.use(cors());

// Initialize Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
let deepgramSocket = null;

// Serve transcripts
app.get("/transcript", (req, res) => {
  res.json({ transcript: fullTranscript });
});

// Updated /bookmarklet-code endpoint:
app.get("/bookmarklet-code", async (req, res) => {
  try {
    const jsPath = path.join(__dirname, "bookmarklet.js");
    const htmlTemplatePath = path.join(__dirname, "../public/bookmarklet-template.html");

    const jsData = await fs.promises.readFile(jsPath, "utf8");
    const htmlData = await fs.promises.readFile(htmlTemplatePath, "utf8");

    const { code } = await (await terser).minify(jsData, { format: { comments: false } });
    const inlineJs = code || "";

    const combinedHtml = htmlData.replace("BOOKMARKLET_JS_PLACEHOLDER", inlineJs);

    const bookmarklet = `javascript:(function(){
      var w = window.open("","","width=370,height=250");
      w.document.write(${JSON.stringify(combinedHtml)});
      w.document.close();
    })();`;

    res.json({ bookmarklet });
  } catch (error) {
    console.error("Error building bookmarklet:", error);
    res.status(500).json({ error: "Build failed" });
  }
});

// WebSocket server to accept audio from the browser
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", async (ws) => {
  console.log("Client connected for audio streaming.");

  deepgramSocket = deepgram.listen.live({ model: "nova-3", language: "en-US", smart_format: true });

  deepgramSocket.on("Results", (data) => {
    const result = data.channel.alternatives[0]?.transcript;
    if (result && data.is_final) {
      fullTranscript += result + " ";
    }
  });

  deepgramSocket.on("error", console.error);
  deepgramSocket.on("close", () => console.log("Deepgram socket closed"));

  ws.on("message", (audioData) => {
    if (deepgramSocket) deepgramSocket.send(audioData);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (deepgramSocket) {
      deepgramSocket.finish();
      deepgramSocket = null;
    }

    // Reset the transcript when the client disconnects
    fullTranscript = "";
  });
});

server.listen(PORT, () => {
  console.log(`
Server running on http://localhost:${PORT}

To create your bookmarklet:
Go to http://localhost:${PORT}/get-bookmarklet.html

Development:
http://localhost:${PORT}/bookmarklet-template.html
`);
});
