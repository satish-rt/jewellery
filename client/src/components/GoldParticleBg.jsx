import React, { useEffect, useRef } from 'react';

/**
 * GoldParticleBg
 * Full-screen canvas animation: floating gold dust, bokeh spheres, light rays.
 * Works entirely in-browser — no external video needed.
 * To use a real video instead, drop hero-video.mp4 into /client/public/ folder.
 */
const GoldParticleBg = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || document.body);

    // ── Palette ──────────────────────────────────────────────
    const gold = [
      [245, 223, 160],
      [212, 175, 122],
      [184, 147,  95],
      [237, 202, 106],
      [139, 107,  61],
    ];
    const rndGold = () => gold[Math.floor(Math.random() * gold.length)];

    // ── Particle (floating dust) ──────────────────────────────
    class Particle {
      constructor(scattered = false) { this.init(scattered); }
      init(scattered = false) {
        [this.r, this.g, this.b] = rndGold();
        this.x = Math.random() * canvas.width;
        this.y = scattered ? Math.random() * canvas.height : canvas.height + Math.random() * 60;
        this.radius = Math.random() * 2.2 + 0.4;
        this.speed  = Math.random() * 0.55 + 0.15;
        this.drift  = (Math.random() - 0.5) * 0.35;
        this.maxOp  = Math.random() * 0.65 + 0.1;
        this.op     = scattered ? Math.random() * this.maxOp : 0;
        this.phase  = Math.random() * Math.PI * 2;
        this.flicker = Math.random() * 0.02 + 0.008;
        this.hasGlow = Math.random() > 0.72;
      }
      tick() {
        this.y     -= this.speed;
        this.x     += this.drift;
        this.phase += this.flicker;
        this.op = Math.min(this.op + 0.004, this.maxOp);
        if (this.y < -10 || this.x < -20 || this.x > canvas.width + 20) this.init();
        const shimmer = 0.75 + 0.25 * Math.sin(this.phase);
        const a = this.op * shimmer;

        if (this.hasGlow) {
          const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
          grd.addColorStop(0, `rgba(${this.r},${this.g},${this.b},${a})`);
          grd.addColorStop(1, `rgba(${this.r},${this.g},${this.b},0)`);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${a})`;
        ctx.fill();
      }
    }

    // ── Bokeh sphere ─────────────────────────────────────────
    class Bokeh {
      constructor() { this.init(); }
      init() {
        [this.r, this.g, this.b] = rndGold();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 55 + 18;
        this.maxOp  = Math.random() * 0.07 + 0.015;
        this.op     = 0;
        this.speed  = (Math.random() - 0.5) * 0.25;
        this.drift  = (Math.random() - 0.5) * 0.18;
        this.phase  = Math.random() * Math.PI * 2;
        this.pSpeed = Math.random() * 0.006 + 0.003;
      }
      tick() {
        this.y     += this.speed;
        this.x     += this.drift;
        this.phase += this.pSpeed;
        const breathing = 0.5 + 0.5 * Math.sin(this.phase);
        this.op = this.maxOp * breathing;
        if (this.y < -this.radius * 2 || this.y > canvas.height + this.radius * 2) this.init();

        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grd.addColorStop(0,   `rgba(${this.r},${this.g},${this.b},${this.op})`);
        grd.addColorStop(0.5, `rgba(${this.r},${this.g},${this.b},${this.op * 0.4})`);
        grd.addColorStop(1,   `rgba(${this.r},${this.g},${this.b},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    // ── Light ray ────────────────────────────────────────────
    class Ray {
      constructor() { this.init(); }
      init() {
        this.x      = Math.random() * canvas.width * 1.2 - canvas.width * 0.1;
        this.width  = Math.random() * 80 + 30;
        this.maxOp  = Math.random() * 0.055 + 0.01;
        this.phase  = Math.random() * Math.PI * 2;
        this.pSpeed = Math.random() * 0.005 + 0.002;
        this.skew   = (Math.random() - 0.5) * 0.3;
      }
      tick() {
        this.phase += this.pSpeed;
        const a = this.maxOp * (0.5 + 0.5 * Math.sin(this.phase));

        ctx.save();
        ctx.globalAlpha = a;
        const grd = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        grd.addColorStop(0,   'rgba(245,223,160,0)');
        grd.addColorStop(0.3, `rgba(245,223,160,${a})`);
        grd.addColorStop(0.7, `rgba(184,147,95,${a * 0.6})`);
        grd.addColorStop(1,   'rgba(184,147,95,0)');

        ctx.beginPath();
        ctx.moveTo(this.x - this.width * 0.2, 0);
        ctx.lineTo(this.x + this.width * 1.2, 0);
        ctx.lineTo(this.x + this.width * 1.2 + canvas.height * this.skew, canvas.height);
        ctx.lineTo(this.x - this.width * 0.2 + canvas.height * this.skew, canvas.height);
        ctx.closePath();
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      }
    }

    // ── Coin / ring ring flash ────────────────────────────────
    class Flash {
      constructor() { this.init(); }
      init() {
        this.x      = Math.random() * canvas.width;
        this.y      = Math.random() * canvas.height;
        this.maxOp  = Math.random() * 0.55 + 0.2;
        this.op     = 0;
        this.growing = true;
        this.size   = Math.random() * 3 + 1.5;
        this.speed  = Math.random() * 0.012 + 0.006;
        this.delay  = Math.random() * 300;
        this.t      = 0;
      }
      tick() {
        this.t++;
        if (this.t < this.delay) return;
        if (this.growing) {
          this.op += this.speed;
          if (this.op >= this.maxOp) this.growing = false;
        } else {
          this.op -= this.speed * 0.6;
          if (this.op <= 0) this.init();
        }
        // 4-point star
        const a = this.op;
        const sz = this.size;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = `rgba(245,223,160,${a})`;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(0, 0, sz, sz * 5, i * Math.PI / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Build scene
    const particles = Array.from({ length: 110 }, (_, i) => new Particle(true));
    const bokeh     = Array.from({ length: 12 }, () => new Bokeh());
    const rays      = Array.from({ length: 6 },  () => new Ray());
    const flashes   = Array.from({ length: 25 }, () => new Flash());

    const draw = () => {
      // Deep dark-gold background
      ctx.fillStyle = '#0C0A05';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient vignette — warm glow in centre
      const vign = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.45, 0,
        canvas.width * 0.5, canvas.height * 0.45, canvas.width * 0.72
      );
      vign.addColorStop(0,   'rgba(60,40,5,0.45)');
      vign.addColorStop(0.5, 'rgba(30,20,2,0.2)');
      vign.addColorStop(1,   'rgba(0,0,0,0.6)');
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rays.forEach(r => r.tick());
      bokeh.forEach(b => b.tick());
      particles.forEach(p => p.tick());
      flashes.forEach(f => f.tick());

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

export default GoldParticleBg;