// BUG FIX: Now uses VOICE_TUTOR_URL from config.js instead of hardcoded localhost:5001
window.generateVoiceTutor = async function () {
  const prompt = document.getElementById("voiceTutorInput").value;

  if (!prompt) {
    alert("Enter a question first");
    return;
  }

  const status  = document.getElementById("voiceStatus");
  const errorEl = document.getElementById("voiceError");
  const answerEl = document.getElementById("voiceAnswer");
  const player  = document.getElementById("voicePlayer");

  status.innerText  = "Thinking... 🤔";
  errorEl.innerText = "";
  answerEl.innerText = "";

  try {
    const response = await fetch(`${VOICE_TUTOR_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    // BUG FIX: Check HTTP status before parsing JSON
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    answerEl.innerText = data.text;
    player.src = `${VOICE_TUTOR_URL}${data.audio}`;
    player.play();
    status.innerText = "Done ✅";

  } catch (error) {
    console.error(error);
    status.innerText = "";
    errorEl.innerText = "Voice tutor failed: " + error.message +
      ". Make sure the voice-tutor server is running on port 5001.";
  }
};
