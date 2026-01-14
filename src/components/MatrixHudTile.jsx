import { useEffect, useMemo, useRef, useState } from "react";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

const CHARS =
  "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function MatrixHudTile({ density = 0.75 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  const glyphs = useMemo(() => CHARS.split(""), []);

  useEffect(() => {
    const mm =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mm) return;
    const onChange = () => setReduced(!!mm.matches);
    onChange();
    mm.addEventListener?.("change", onChange);
    return () => mm.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops = [];

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontSize = clamp(Math.floor(Math.min(w, h) / 10), 10, 14);
      cols = Math.max(6, Math.floor(w / fontSize));
      drops = Array.from({ length: cols }, () => ({
        y: Math.random() * h,
        speed: (0.8 + Math.random() * 1.2) * density,
        len: 6 + ((Math.random() * 10) | 0),
        fade: 0.08 + Math.random() * 0.1,
        size: fontSize,
      }));

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "top";
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last = 0;
    let scan = 0;

    const drawHUD = () => {
      // corner brackets
      const pad = 10;
      const L = 18;
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;

      const corners = [
        [pad, pad, 1, 1],
        [w - pad, pad, -1, 1],
        [pad, h - pad, 1, -1],
        [w - pad, h - pad, -1, -1],
      ];

      for (const [x, y, sx, sy] of corners) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + sx * L, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + sy * L);
        ctx.stroke();
      }

      // tiny “ticks” line
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.moveTo(pad + 26, pad);
      ctx.lineTo(w - pad - 26, pad);
      ctx.stroke();

      ctx.restore();
    };

    const loop = (t) => {
      rafRef.current = requestAnimationFrame(loop);
      if (reduced) return;

      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;

      // fade the frame (trails)
      ctx.fillStyle = "rgba(0,0,0,0.19)";
      ctx.fillRect(0, 0, w, h);

      // subtle scanline
      scan += dt * 38;
      const y = scan % h | 0;
      ctx.fillStyle = "rgba(120,255,180,0.045)";

      ctx.fillRect(0, y, w, 1);

      // matrix rain (very subtle, not neon green)
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const x = i * d.size;

        for (let k = 0; k < d.len; k++) {
          const yy = d.y - k * d.size;
          if (yy < -d.size || yy > h + d.size) continue;

          const a = 1 - k / d.len;
          ctx.fillStyle = `rgba(80, 255, 160, ${(0.18 + a * 0.25) * density})`;
          const ch = glyphs[(Math.random() * glyphs.length) | 0];
          ctx.fillText(ch, x, yy);
        }

        d.y += d.speed * 60 * dt;

        if (d.y - d.len * d.size > h + 20) {
          d.y = -Math.random() * 120;
          d.speed = (0.8 + Math.random() * 1.2) * density;
          d.len = 6 + ((Math.random() * 10) | 0);
        }
      }

      // HUD overlay
      drawHUD();

      // faint glow vignette
      const g = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.min(w, h) * 0.7
      );
      g.addColorStop(0, "rgba(255,255,255,0.03)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [glyphs, density, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden="true"
    />
  );
}
