// ============================
// LOVE CARD - MAIN JAVASCRIPT
// ============================

// 1. PHOTO GALLERY / LIGHTBOX

const cards = document.querySelectorAll(".photo-card");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

let previousFocus = null;

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img");

    if (!img || !img.complete || img.naturalWidth === 0) {
      alert("ဒီပုံကို ဖွင့်မရပါ။ Image file ကို စစ်ဆေးပါ။");
      return;
    }

    previousFocus = card;
    lightboxImage.src = img.src;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    closeLightbox.focus();
  });
});

function hideLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lightboxImage.src = "";

  if (previousFocus) {
    previousFocus.focus();
  }
}

closeLightbox.addEventListener("click", hideLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    hideLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    hideLightbox();
  }
});


// 2. LOCAL MUSIC PLAYER

const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const musicFile = document.getElementById("musicFile");

let selectedMusic = false;
let musicURL = null;

musicButton.addEventListener("click", async () => {
  if (!selectedMusic) {
    musicFile.click();
    return;
  }

  if (music.paused) {
    try {
      await music.play();
    } catch (error) {
      musicLabel.textContent = "TAP TO PLAY";
    }
  } else {
    music.pause();
  }
});

musicFile.addEventListener("change", async () => {
  const file = musicFile.files[0];

  if (!file) return;

  if (!file.type.startsWith("audio/")) {
    alert("Audio file တစ်ခုကို ရွေးပေးပါ။");
    return;
  }

  if (musicURL) {
    URL.revokeObjectURL(musicURL);
  }

  music.pause();

  musicURL = URL.createObjectURL(file);
  music.src = musicURL;
  selectedMusic = true;
  musicLabel.textContent = "PLAY MUSIC";

  try {
    await music.play();
  } catch (error) {
    musicLabel.textContent = "TAP TO PLAY";
  }
});

music.addEventListener("play", () => {
  musicButton.classList.add("playing");
  musicLabel.textContent = "NOW PLAYING";
});

music.addEventListener("pause", () => {
  musicButton.classList.remove("playing");

  if (selectedMusic) {
    musicLabel.textContent = "PLAY MUSIC";
  }
});


// 3. FLOATING HEART PARTICLES

const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = width < 600 ? 16 : 30;

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 5 + Math.random() * 10,
    speed: 0.25 + Math.random() * 0.65,
    drift: (Math.random() - 0.5) * 0.5,
    alpha: 0.12 + Math.random() * 0.35,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawHeart(x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  ctx.moveTo(0, 7);
  ctx.bezierCurveTo(-15, -3, -10, -13, 0, -5);
  ctx.bezierCurveTo(10, -13, 15, -3, 0, 7);

  ctx.fillStyle = "#ff78bd";
  ctx.shadowColor = "#ff3eaa";
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.restore();
}

let animationFrame;
let lastFrame = 0;

function animateHearts(timestamp) {
  // Limit rendering to roughly 30 FPS to save battery.
  if (timestamp - lastFrame < 33) {
    animationFrame = requestAnimationFrame(animateHearts);
    return;
  }

  lastFrame = timestamp;

  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.y -= p.speed;
    p.x += p.drift + Math.sin(timestamp * 0.0007 + p.phase) * 0.25;

    if (p.y < -20) {
      p.y = height + 20;
      p.x = Math.random() * width;
    }

    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;

    drawHeart(p.x, p.y, p.size, p.alpha);
  });

  animationFrame = requestAnimationFrame(animateHearts);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    lastFrame = 0;
    animationFrame = requestAnimationFrame(animateHearts);
  }
});

animationFrame = requestAnimationFrame(animateHearts);
