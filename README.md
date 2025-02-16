# 🎤 Dictate Bookmarklet

This project allows you to **dictate speech-to-text** in real-time on any website. It uses Deepgram's API for transcription and a local Express server with WebSocket support.

## 🚀 How It Works

1. **Install & Configure**  
   - The Express server proxies microphone audio for transcription.
   - The bookmarklet injects a floating panel UI into any webpage.

2. **Bookmarklet Installation**  
   - Open the page at: [http://localhost:3003/get-bookmarklet.html](http://localhost:3003/get-bookmarklet.html)  
     This page displays the bookmarklet code for adding it to your browser. You can also click the link to test it.

3. **UI Development**  
   - Edit the UI for the bookmarklet in `public/bookmarklet-template.html`.  
     This template holds HTML/CSS used when building the bookmarklet.

4. **Build Process**  
   - Use the script `build-bookmarklet.ts` (located in the `scripts` folder) to inject your JS code into the template and produce the final bookmarklet code.
  
## 📥 Installation

### 1. Clone the Repository and Install Dependencies

```sh
git clone https://github.com/Christopher-Hayes/dictate-bookmarklet.git
cd dictate-bookmarklet
npm install
```

### 2. Set up your API key

Create a `.env` file:

```sh
echo "DEEPGRAM_API_KEY=your-deepgram-api-key-here" > .env
```

### 3. Start the server

```sh
npm run start
```

✅ **The server runs at:** `http://localhost:3003`

## 🛠 Usage Guide

1. **Open any website.**
2. **Click the bookmarklet.**  
   - A floating panel appears in the **top-left corner**.
3. **Click "Start Dictation."**  
   - Your voice is transcribed in real-time.
4. **Drag or copy the transcript** into any input field.
5. **Click "Stop Dictation"** to end recording.
6. **Click "Hide"** to close the panel.

## 🏗 Project Structure

```bash
📁 deepgram-bookmarklet
├── 📄 .env # Stores Deepgram API Key
├── 📁 src
│   ├── 📄 server.ts # Express server
│   ├── 📄 bookmarklet.js # Non-UI bookmarklet code
├── 📁 public
│   ├── 📄 local-dictate.html # Floating panel for speech-to-text
│   ├── 📄 bookmarklet-template.html # Template for bookmarklet UI
│   ├── 📄 get-bookmarklet.html # Displays the bookmarklet code
├── 📁 scripts
│   ├── 📄 build-bookmarklet.ts # Script to build the bookmarklet
└── 📄 README.md
```

## ❓ Troubleshooting

### "Microphone access denied"

- **Solution:** Allow mic permissions in browser settings.

### "Server not found"

- **Solution:** Ensure the Express server is running (`npm run start`).

### "Transcript not updating"

- **Solution:** Check if Deepgram API Key is correct in `.env`.
