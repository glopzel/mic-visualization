const container = document.getElementById('container');
const canvas = document.getElementById('canvas1'); 
let sound = document.getElementById('sound');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

let soundAllowed = function(stream) {
    let audioCtx = new AudioContext();
    let audioSource = audioCtx.createMediaStreamSource( stream ); 
    let analyser = audioCtx.createAnalyser();
    let fftSize = 1024;

    analyser.fftSize = fftSize;
    audioSource.connect(analyser);

    let bufferLength = analyser.frequencyBinCount; 
    let dataArray = new Uint8Array(bufferLength); 

    const barWidth = 15; //width of a single bar in the visualizer
    let barHeight;
    let x; 

    function animate() {
        x = 0;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate()
}

// container.addEventListener('keydown', soundAllowed);

navigator.mediaDevices.getUserMedia({ audio: true, video: false}).then(soundAllowed).catch(err => console.log(err)); 

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5; // louder sounds produce longer bars
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(i * Math.PI * 100 / bufferLength);
        const hue = i * 5; 
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}