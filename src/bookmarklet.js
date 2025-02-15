(()=>{
    if (window.deepgramUI) return;
    const panel = document.getElementById("dictate-panel");
    if (!panel) return console.error("UI template is missing.");
    window.deepgramUI = panel;
    
    const startStopBtn = document.getElementById("start-dictate");
    const transcriptDiv = document.getElementById("transcript");
    const hideBtn = document.getElementById("hide-dictate");
    const copyBtn = document.getElementById("copy-transcript");

    let recording = false;
    let ws;

    async function toggleRecording() {
      if (recording) {
        ws.close();
        startStopBtn.textContent = "Start Dictation";
        recording = false;
        return;
      }
      try {
        ws = new WebSocket("ws://localhost:3003");
        ws.onopen = () => console.log("Connected to server");
        ws.onclose = () => console.log("Disconnected from server");

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => ws.send(event.data);
        recorder.start(500);

        startStopBtn.textContent = "Stop Dictation";
        recording = true;
        setInterval(async () => {
          if (!recording) return;
          const res = await fetch("http://localhost:3003/transcript");
          const data = await res.json();
          transcriptDiv.textContent = data.transcript || "No transcript yet...";
        }, 1000);
      } catch (err) {
        alert("Microphone access denied or server not running.");
        console.error(err);
      }
    }
    startStopBtn.onclick = toggleRecording;

    transcriptDiv.onclick = () => {
      const range = document.createRange();
      range.selectNodeContents(transcriptDiv);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };

    hideBtn.onclick = () => {
      panel.remove();
      ws.close();
      window.deepgramUI = undefined;
      window.close();
    };

    copyBtn.onclick = () => {
        // Send transcript to clipboard
        navigator.clipboard.writeText(transcriptDiv.textContent);

        // briefly show "Copied!" message on the button
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy Transcript";
        }, 2000);
    }


    let offsetX, offsetY, isDragging = false;
    panel.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
    };
    document.onmousemove = (e) => {
      if (!isDragging) return;
      panel.style.left = (e.clientX - offsetX) + "px";
      panel.style.top = (e.clientY - offsetY) + "px";
    };
    document.onmouseup = () => isDragging = false;
})();

