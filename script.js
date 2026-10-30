// ================= MUSIC PLAYER =================
const playBtn  = document.getElementById('playBtn');
const mySong   = document.getElementById('mySong');
const playIcon = playBtn.querySelector('.play-icon');

playBtn.addEventListener('click', () => {
  if (mySong.paused) {
    mySong.play().catch(err => {
      console.warn('သီချင်းဖွင့်လို့မရပါ — src ကိုစစ်ပါ:', err);
    });
    playBtn.classList.add('playing');
    playIcon.textContent = '❚❚';
  } else {
    mySong.pause();
    playBtn.classList.remove('playing');
    playIcon.textContent = '▶';
  }
});

mySong.addEventListener('ended', () => {
  playBtn.classList.remove('playing');
  playIcon.textContent = '▶';
});

// ================= LIGHTBOX (PHOTO VIEWER) =================
const lightbox   = document.getElementById('lightbox');
const largePhoto = document.getElementById('largePhoto');
const closeBtn   = document.getElementById('closeLightbox');

document.querySelectorAll('.photo').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.dataset.photo;
    largePhoto.src = src;
    lightbox.classList.add('open');
  });
});

closeBtn.addEventListener('click', () => lightbox.classList.remove('open'));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('open');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// ============================================
// SCROLL REVEAL — တဖြည်းဖြည်း ပေါ်လာခြင်း
// ============================================

const revealTargets = document.querySelectorAll(
  '.photo, .text-box, .letter-card, .section-heading, .hero-poem, .music-row, .footer'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal');

  // ပုံတွေ — ဘယ်/ညာ တလှည့်စီ
  if (el.classList.contains('photo')) {
    const dir = el.dataset.dir || (i % 2 === 0 ? 'left' : 'right');
    el.classList.add(dir === 'left' ? 'from-left' : 'from-right');
  }
  // စာသား box တွေ — အောက်ကနေ တက်
  else if (el.classList.contains('text-box')) {
    el.classList.add('from-bottom');
  }
  // ကျန်တာ (letter, heading, hero poem) — အောက်ကနေ
  else {
    el.classList.add('from-bottom');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealTargets.forEach(el => revealObserver.observe(el));
