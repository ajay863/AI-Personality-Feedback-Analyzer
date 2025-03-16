let cameraStream;
let mediaRecorder;
let recordedChunks = [];
let recordingTime = 0;
let timerInterval;

document.getElementById("startCamera").addEventListener("click", startCamera);
document.getElementById("stopCamera").addEventListener("click", stopCamera);
document.getElementById("startRecording").addEventListener("click", startRecording);
document.getElementById("stopRecording").addEventListener("click", stopRecording);
document.getElementById("downloadVideo").addEventListener("click", downloadVideo);

async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById("camera").srcObject = cameraStream;
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

function stopCamera() {
    if (cameraStream) {
        let tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
        document.getElementById("camera").srcObject = null;
    }
}

function startRecording() {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(cameraStream);
    
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        let videoBlob = new Blob(recordedChunks, { type: "video/mp4" });
        let videoURL = URL.createObjectURL(videoBlob);
        document.getElementById("recordedVideo").src = videoURL;
    };

    mediaRecorder.start();
    recordingTime = 0;
    document.getElementById("timer").textContent = "Recording Time: 0s";
    
    timerInterval = setInterval(() => {
        recordingTime++;
        document.getElementById("timer").textContent = `Recording Time: ${recordingTime}s`;
        updateLiveFeedback();
    }, 1000);
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        clearInterval(timerInterval);
        generateFinalScore();
    }
}

function downloadVideo() {
    if (recordedChunks.length > 0) {
        let blob = new Blob(recordedChunks, { type: "video/mp4" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "recorded_video.mp4";
        link.click();
    }
}

function updateLiveFeedback() {
    let eyeContactFeedback = ["Good", "Try to maintain", "Excellent"];
    let confidenceFeedback = ["Improve clarity", "Strong", "Needs more energy"];
    let postureFeedback = ["Sit up straight", "Excellent posture", "Needs improvement"];
    let speechFeedback = ["Clear speech", "Improve pace", "Needs better articulation"];

    document.getElementById("liveFeedback").innerHTML += `<p>Time: ${recordingTime}s - 
        Eye Contact: ${getRandom(eyeContactFeedback)} | 
        Confidence: ${getRandom(confidenceFeedback)} | 
        Posture: ${getRandom(postureFeedback)} | 
        Speech: ${getRandom(speechFeedback)}</p>`;

    document.getElementById("eyeContact").textContent = getRandom(eyeContactFeedback);
    document.getElementById("confidence").textContent = getRandom(confidenceFeedback);
    document.getElementById("posture").textContent = getRandom(postureFeedback);
    document.getElementById("speakingPerformance").textContent = getRandom(speechFeedback);
}

function generateFinalScore() {
    let score = Math.floor(Math.random() * 20) + 80;
    document.getElementById("finalScore").textContent = score;
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
