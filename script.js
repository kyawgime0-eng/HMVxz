const photos = [
  { src: "images/photo1.jpg", caption: "A little memory ♡" },
  { src: "images/photo2.jpg", caption: "Just us ✨" },
  { src: "images/photo3.jpg", caption: "My favorite feeling" },
  { src: "images/photo4.jpg", caption: "A moment to keep ♡" },
  { src: "images/photo5.jpg", caption: "Always a special one" }
];

const modal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const music = document.getElementById("loveMusic");
const musicBtn = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");

let currentPhoto = 0;
let touchStartX = 0;

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  modalImage.src = photos[currentPhoto].src;
  modalCaption.textContent = photos[currentPhoto].caption;
}

function openPhoto(index) {
  showPhoto(index);
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-photo]").forEach((button) => {
  button.addEventListener("click", () => {
    openPhoto(Number(button.dataset.photo));
  });
});

document.getElementById("closeModal").addEventListener("click", closePhoto);

document.getElementById("prevPhoto").addEventListener("click", () => {
  showPhoto(currentPhoto - 1);
});

document.getElementById("nextPhoto").addEventListener("click", () => {
  showPhoto(currentPhoto + 1);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closePhoto();
});

modal.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

modal.addEventListener("touchend", (event) => {
  const difference = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(difference) > 55) {
    showPhoto(currentPhoto + (difference < 0 ? 1 : -1));
  }
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePhoto();
    closeSurprise();
  }

  if (modal.classList.contains("show")) {
    if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
    if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  }
});

// Surprise popup
const surprise = document.getElementById("surprise");

function openSurprise() {
  surprise.classList.add("show");
  surprise.setAttribute("aria-hidden", "false");
}

function closeSurprise() {
  surprise.classList.remove("show");
  surprise.setAttribute("aria-hidden", "true");
}

document.getElementById("openBtn").addEventListener("click", openSurprise);
document.getElementById("closeSurprise").addEventListener("click", closeSurprise);
document.getElementById("surpriseOk").addEventListener("click", closeSurprise);

surprise.addEventListener("click", (event) => {
  if (event.target === surprise) closeSurprise();
});

// Music controls
musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicLabel.textContent = "Pause Music";
    } catch (error) {
      musicLabel.textContent = "Music unavailable";
      alert(
        "Music file မရှိသေးပါ။ music/young-and-beautiful.mp3 ကို ထည့်ပေးပါ။"
      );
    }
  } else {
    music.pause();
    musicLabel.textContent = "Play Music";
  }
});

music.addEventListener("ended", () => {
  musicLabel.textContent = "Play Music";
});

// Floating hearts animation
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles = Array.from({ length: width < 600 ? 14 : 25 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 5 + Math.random() * 9,
    speed: 0.25 + Math.random() * 0.6,
    drift: (Math.random() - 0.5) * 0.4,
    opacity: 0.15 + Math.random() * 0.3
  }));
}

function drawHeart(x, y, size, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "#ff8fb8";
  ctx.beginPath();
  ctx.moveTo(0, 7);
  ctx.bezierCurveTo(-16, -3, -9, -12, 0, -5);
  ctx.bezierCurveTo(9, -12, 16, -3, 0, 7);
  ctx.fill();
  ctx.restore();
}

function animateHearts() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((heart) => {
    drawHeart(heart.x, heart.y, heart.size, heart.opacity);

    heart.y -= heart.speed;
    heart.x += heart.drift;

    if (heart.y < -25) {
      heart.y = height + 25;
      heart.x = Math.random() * width;
    }

    if (heart.x < -25) heart.x = width + 25;
    if (heart.x > width + 25) heart.x = -25;
  });

  requestAnimationFrame(animateHearts);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateHearts();
