/* =============================================
   ACELYNN QIAO · script.js
   - Rotating typewriter text
   - Firefly particles
   - Pixel Shiba Inu running across the bottom
============================================= */

// ---- ROTATING TEXT ----
const phrases = [
  "data science student",
  "business analytics nerd",
  "health data enthusiast",
  "backend builder",
  "KOTX dance coordinator",
  "metrics obsessive",
  "studio ghibli fan",
];

const el = document.getElementById("rotator");

if (el) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 1800); // pause before deleting
        return;
      }
      setTimeout(type, 65);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 35);
    }
  }

  setTimeout(type, 800);
}


// ---- FIREFLIES ----
const fc = document.getElementById("fireflies");
if (fc) {
  const ctx = fc.getContext("2d");
  let W, H, flies;

  function resize() {
    W = fc.width = window.innerWidth;
    H = fc.height = window.innerHeight;
  }

  function makeFly() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random(),
      dalpha: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    };
  }

  function initFlies() {
    flies = Array.from({ length: 55 }, makeFly);
  }

  function drawFlies() {
    ctx.clearRect(0, 0, W, H);
    for (const f of flies) {
      f.x += f.vx;
      f.y += f.vy;
      f.alpha += f.dalpha;
      if (f.alpha > 1 || f.alpha < 0) f.dalpha *= -1;
      if (f.x < 0) f.x = W;
      if (f.x > W) f.x = 0;
      if (f.y < 0) f.y = H;
      if (f.y > H) f.y = 0;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,201,122,${Math.max(0, Math.min(1, f.alpha))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(232,201,122,0.6)";
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(drawFlies);
  }

  window.addEventListener("resize", () => { resize(); initFlies(); });
  resize();
  initFlies();
  drawFlies();
}


// ---- PIXEL SHIBA DOG ----
// Each frame is drawn on a 12×8 grid of "pixels"
// Color key: _ = transparent, B = body (warm tan), D = dark (brown),
//            N = nose/eye (dark), E = ear inner (blush), W = white belly, G = gold collar
const C = {
  _: null,
  B: "#c8965a",  // warm tan body
  D: "#7a4e2a",  // dark brown outlines/markings
  N: "#1a0a00",  // eye/nose
  E: "#e8a090",  // ear inner pink
  W: "#f5efe0",  // white chest/paws
  G: "#e8c97a",  // gold collar
};

// 3 walk frames — 12 wide × 8 tall
const FRAMES = [
  // Frame 1: neutral
  [
    "_","_","_","D","D","D","D","_","_","_","_","_",
    "_","_","D","B","B","B","B","D","_","_","_","_",
    "_","D","B","E","B","N","B","B","D","_","_","_",
    "_","D","B","B","B","B","G","B","B","D","_","_",
    "_","_","D","W","B","B","B","B","D","_","_","_",
    "_","_","D","W","D","_","D","B","D","_","_","_",
    "_","_","_","D","_","_","_","D","_","_","_","_",
    "_","_","_","_","_","_","_","_","_","_","_","_",
  ],
  // Frame 2: left leg forward
  [
    "_","_","_","D","D","D","D","_","_","_","_","_",
    "_","_","D","B","B","B","B","D","_","_","_","_",
    "_","D","B","E","B","N","B","B","D","_","_","_",
    "_","D","B","B","B","B","G","B","B","D","_","_",
    "_","_","D","W","B","B","B","B","D","_","_","_",
    "_","_","D","W","D","_","_","D","D","_","_","_",
    "_","_","D","_","_","_","_","D","_","_","_","_",
    "_","_","_","_","_","_","_","_","_","_","_","_",
  ],
  // Frame 3: right leg forward
  [
    "_","_","_","D","D","D","D","_","_","_","_","_",
    "_","_","D","B","B","B","B","D","_","_","_","_",
    "_","D","B","E","B","N","B","B","D","_","_","_",
    "_","D","B","B","B","B","G","B","B","D","_","_",
    "_","_","D","W","B","B","B","B","D","_","_","_",
    "_","_","_","D","D","_","D","W","D","_","_","_",
    "_","_","_","D","_","_","_","D","_","_","_","_",
    "_","_","_","_","_","_","_","_","_","_","_","_",
  ],
];

const GRID_W = 12;
const GRID_H = 8;
const PIXEL  = 4; // size of each "pixel" in real px

const dogWrap   = document.getElementById("dogWrap");
const dogCanvas = document.getElementById("dogCanvas");

if (dogWrap && dogCanvas) {
  const dctx = dogCanvas.getContext("2d");
  dogCanvas.width  = GRID_W * PIXEL;
  dogCanvas.height = GRID_H * PIXEL;

  let frameIdx  = 0;
  let frameTick = 0;
  const FRAME_SPEED = 8; // animation frames between sprite frames

  // Position — starts off-screen left, moves right, wraps
  let dogX = -80;
  const dogSpeed = 1.2;

  function drawDog(frame) {
    dctx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
    for (let row = 0; row < GRID_H; row++) {
      for (let col = 0; col < GRID_W; col++) {
        const key = frame[row * GRID_W + col];
        const color = C[key];
        if (!color) continue;
        dctx.fillStyle = color;
        dctx.fillRect(col * PIXEL, row * PIXEL, PIXEL, PIXEL);
      }
    }
  }

  function animateDog() {
    // Advance sprite frame
    frameTick++;
    if (frameTick >= FRAME_SPEED) {
      frameTick = 0;
      frameIdx = (frameIdx + 1) % FRAMES.length;
    }

    // Move dog
    dogX += dogSpeed;
    const trackW = window.innerWidth;
    if (dogX > trackW + 80) dogX = -80;

    dogWrap.style.transform = `translateX(${dogX}px)`;
    drawDog(FRAMES[frameIdx]);

    requestAnimationFrame(animateDog);
  }

  animateDog();
}
