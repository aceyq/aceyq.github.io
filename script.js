/* =============================================
   ACELYNN QIAO · script.js
============================================= */

// ---- ROTATING TEXT ----
const phrases = [
  "data science student",
  "business analytics nerd",
  "health data enthusiast",
  "huge dog lover",
  "KOTX dance coordinator",
  "metrics obsessive",
  "rover dog walker",
  "puzzle enthusiast",
];

const el = document.getElementById("rotator");
if (el) {
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
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


// ---- BACKGROUND: FIREFLIES + BLOSSOM TREES ----
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
      y: Math.random() * H * 0.85,
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random(),
      dalpha: (Math.random() * 0.007 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    };
  }

  function initFlies() {
    flies = Array.from({ length: 60 }, makeFly);
  }

  // Draw a single blossom petal cluster
  function drawBlossomCluster(x, y, radius, alpha) {
    const petalColors = [
      `rgba(210,160,180,${alpha})`,
      `rgba(230,180,200,${alpha * 0.8})`,
      `rgba(200,140,165,${alpha * 0.9})`,
    ];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const px = x + Math.cos(angle) * radius * 0.55;
      const py = y + Math.sin(angle) * radius * 0.55;
      ctx.beginPath();
      ctx.ellipse(px, py, radius * 0.55, radius * 0.35, angle, 0, Math.PI * 2);
      ctx.fillStyle = petalColors[i % petalColors.length];
      ctx.fill();
    }
    // Center
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,220,180,${alpha})`;
    ctx.fill();
  }

  // Draw a blossom tree rooted at (rx, ry)
  function drawTree(rx, ry, scale, flip) {
    const dir = flip ? -1 : 1;
    ctx.save();
    ctx.translate(rx, ry);

    // Trunk
    ctx.strokeStyle = "rgba(80,50,30,0.55)";
    ctx.lineWidth = 3 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dir * 10 * scale, -60 * scale);
    ctx.stroke();

    // Main branches
    const branches = [
      { x: dir * 10 * scale, y: -60 * scale, dx: dir * 30 * scale, dy: -40 * scale },
      { x: dir * 10 * scale, y: -60 * scale, dx: dir * -5 * scale, dy: -50 * scale },
      { x: dir * 10 * scale, y: -60 * scale, dx: dir * 20 * scale, dy: -80 * scale },
      { x: dir * 10 * scale, y: -60 * scale, dx: dir * -15 * scale, dy: -35 * scale },
    ];

    ctx.lineWidth = 1.5 * scale;
    for (const b of branches) {
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x + b.dx, b.y + b.dy);
      ctx.stroke();
    }

    // Blossom clusters at branch tips
    const clusters = [
      { x: dir * 40 * scale,  y: -100 * scale, r: 14 * scale, a: 0.55 },
      { x: dir * 5 * scale,   y: -110 * scale, r: 16 * scale, a: 0.5  },
      { x: dir * 30 * scale,  y: -140 * scale, r: 12 * scale, a: 0.45 },
      { x: dir * -5 * scale,  y: -95 * scale,  r: 13 * scale, a: 0.5  },
      { x: dir * 20 * scale,  y: -125 * scale, r: 10 * scale, a: 0.4  },
      { x: dir * -10 * scale, y: -80 * scale,  r: 11 * scale, a: 0.45 },
      { x: dir * 50 * scale,  y: -115 * scale, r: 9  * scale, a: 0.38 },
    ];

    for (const c of clusters) {
      drawBlossomCluster(c.x, c.y, c.r, c.a);
    }

    ctx.restore();
  }

  // Falling petals
  const petals = Array.from({ length: 18 }, () => ({
    x: Math.random() * (typeof W !== 'undefined' ? W : 800),
    y: Math.random() * (typeof H !== 'undefined' ? H : 600),
    r: Math.random() * 3 + 1.5,
    vx: (Math.random() - 0.3) * 0.5,
    vy: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.5 + 0.15,
    rot: Math.random() * Math.PI * 2,
    drot: (Math.random() - 0.5) * 0.02,
  }));

  function drawFlies() {
    ctx.clearRect(0, 0, W, H);

    // Draw trees — left and right corners
    drawTree(W * 0.04, H * 0.92, 1.15, false);
    drawTree(W * 0.96, H * 0.92, 1.0, true);
    // Smaller background trees
    drawTree(W * 0.12, H * 0.95, 0.7, false);
    drawTree(W * 0.88, H * 0.95, 0.65, true);

    // Falling petals
    for (const p of petals) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.drot;
      if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 1.4, p.r * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,170,190,${p.alpha})`;
      ctx.fill();
      ctx.restore();
    }

    // Fireflies
    for (const f of flies) {
      f.x += f.vx; f.y += f.vy;
      f.alpha += f.dalpha;
      if (f.alpha > 1 || f.alpha < 0) f.dalpha *= -1;
      if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
      if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,201,122,${Math.max(0, Math.min(1, f.alpha))})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(232,201,122,0.7)";
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


// ---- PIXEL DOG (proper side-view, 20×12 grid) ----
const C = {
  _: null,
  B: "#c8965a",  // tan body
  D: "#5c3310",  // dark outline
  N: "#0d0400",  // eye/nose
  E: "#e8a090",  // ear pink
  W: "#f5efe0",  // white belly/paws
  G: "#e8c97a",  // gold collar
  T: "#a06830",  // medium shadow tone
};

// 20 wide × 12 tall — proper side-view dog with tail up
const F1 = [
  "_","_","_","_","_","D","D","D","_","_","_","_","_","_","_","D","D","_","_","_",
  "_","_","_","_","D","B","B","B","D","_","_","_","_","_","D","B","B","D","_","_",
  "_","_","_","D","B","B","E","B","B","D","_","_","_","D","B","B","B","B","D","_",
  "_","_","D","B","B","B","B","N","B","B","D","D","D","B","B","G","G","B","B","D",
  "_","_","D","W","B","B","B","B","B","B","B","B","B","B","B","B","B","B","T","D",
  "_","_","_","D","W","W","B","B","B","B","B","B","B","B","B","B","B","D","_","_",
  "_","_","_","_","D","D","B","B","T","B","B","B","T","B","B","D","D","_","_","_",
  "_","_","_","_","_","D","W","D","_","D","W","D","_","D","W","D","_","_","_","_",
  "_","_","_","_","_","D","W","D","_","D","W","D","_","_","D","_","_","_","_","_",
  "_","_","_","_","_","D","_","_","_","D","_","_","_","_","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
];

// Walk frame 2 — front legs shift
const F2 = [
  "_","_","_","_","_","D","D","D","_","_","_","_","_","_","_","D","D","_","_","_",
  "_","_","_","_","D","B","B","B","D","_","_","_","_","_","D","B","B","D","_","_",
  "_","_","_","D","B","B","E","B","B","D","_","_","_","D","B","B","B","B","D","_",
  "_","_","D","B","B","B","B","N","B","B","D","D","D","B","B","G","G","B","B","D",
  "_","_","D","W","B","B","B","B","B","B","B","B","B","B","B","B","B","B","T","D",
  "_","_","_","D","W","W","B","B","B","B","B","B","B","B","B","B","B","D","_","_",
  "_","_","_","_","D","D","B","B","T","B","B","B","T","B","B","D","D","_","_","_",
  "_","_","_","_","D","W","D","_","_","D","W","_","D","W","D","_","_","_","_","_",
  "_","_","_","_","_","D","_","_","_","_","D","_","D","_","D","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
];

// Walk frame 3 — back legs shift
const F3 = [
  "_","_","_","_","_","D","D","D","_","_","_","_","_","_","_","D","D","_","_","_",
  "_","_","_","_","D","B","B","B","D","_","_","_","_","_","D","B","B","D","_","_",
  "_","_","_","D","B","B","E","B","B","D","_","_","_","D","B","B","B","B","D","_",
  "_","_","D","B","B","B","B","N","B","B","D","D","D","B","B","G","G","B","B","D",
  "_","_","D","W","B","B","B","B","B","B","B","B","B","B","B","B","B","B","T","D",
  "_","_","_","D","W","W","B","B","B","B","B","B","B","B","B","B","B","D","_","_",
  "_","_","_","_","D","D","B","B","T","B","B","B","T","B","B","D","D","_","_","_",
  "_","_","_","D","W","D","_","_","D","W","D","_","_","D","W","D","_","_","_","_",
  "_","_","_","D","_","_","_","_","_","D","_","_","_","D","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
  "_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_","_",
];

const FRAMES = [F1, F2, F1, F3];
const GRID_W = 20, GRID_H = 12, PIXEL = 5;

const dogWrap   = document.getElementById("dogWrap");
const dogCanvas = document.getElementById("dogCanvas");

if (dogWrap && dogCanvas) {
  const dctx = dogCanvas.getContext("2d");
  dogCanvas.width  = GRID_W * PIXEL;
  dogCanvas.height = GRID_H * PIXEL;

  let frameIdx = 0, frameTick = 0;
  const FRAME_SPEED = 9;
  let dogX = -120;
  const dogSpeed = 1.4;

  function drawDog(frame) {
    dctx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
    for (let row = 0; row < GRID_H; row++) {
      for (let col = 0; col < GRID_W; col++) {
        const color = C[frame[row * GRID_W + col]];
        if (!color) continue;
        dctx.fillStyle = color;
        dctx.fillRect(col * PIXEL, row * PIXEL, PIXEL, PIXEL);
      }
    }
  }

  function animateDog() {
    frameTick++;
    if (frameTick >= FRAME_SPEED) { frameTick = 0; frameIdx = (frameIdx + 1) % FRAMES.length; }
    dogX += dogSpeed;
    if (dogX > window.innerWidth + 120) dogX = -120;
    dogWrap.style.transform = `translateX(${dogX}px)`;
    drawDog(FRAMES[frameIdx]);
    requestAnimationFrame(animateDog);
  }
  animateDog();
}
