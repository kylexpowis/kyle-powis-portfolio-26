import { useEffect, useMemo, useRef, useState } from "react";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// Evenly distributed points on sphere (Fibonacci sphere)
function makeSpherePoints(N = 560) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2; // 1..-1
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    pts.push({ x, y, z });
  }
  return pts;
}

export default function GlobeReachTile({
  intensity = 1,
  intervalArcs = 0.028, // chance per frame-ish (scaled by intensity)
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [reduced, setReduced] = useState(false);

  const points = useMemo(() => makeSpherePoints(560), []);

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

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // arc beams
    const arcs = [];
    const makeArc = () => {
      const a = points[(Math.random() * points.length) | 0];
      const b = points[(Math.random() * points.length) | 0];
      arcs.push({
        a,
        b,
        t: 0,
        speed: 0.01 + Math.random() * 0.012,
        life: 0.9 + Math.random() * 0.9,
      });
    };

    let last = 0;
    let rot = 0;

    const draw = (t) => {
      rafRef.current = requestAnimationFrame(draw);
      if (reduced) return;

      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;

      rot += dt * 0.55 * intensity;

      // spawn arcs occasionally
      if (Math.random() < intervalArcs * intensity && arcs.length < 8)
        makeArc();

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.35;
      const persp = 2.2;
      const tilt = 0.38;

      const project = (p) => {
        // rotate around Y
        const cosY = Math.cos(rot);
        const sinY = Math.sin(rot);
        let x = p.x * cosY + p.z * sinY;
        let z = -p.x * sinY + p.z * cosY;
        let y = p.y;

        // tilt around X
        const cosX = Math.cos(tilt);
        const sinX = Math.sin(tilt);
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y2;
        z = z2;

        const s = persp / (persp + z + 1.2);
        return { x: cx + x * R * s, y: cy + y * R * s, z, s };
      };

      // background glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
      g.addColorStop(0, "rgba(120,255,180,0.06)");
      g.addColorStop(0.55, "rgba(255,255,255,0.022)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // subtle lat/long grid
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1;

      // longitudes
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        ctx.beginPath();
        for (let j = -44; j <= 44; j++) {
          const v = (j / 44) * (Math.PI / 2);
          const p = {
            x: Math.cos(a) * Math.cos(v),
            y: Math.sin(v),
            z: Math.sin(a) * Math.cos(v),
          };
          const pr = project(p);
          if (j === -44) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.stroke();
      }

      // latitudes
      for (let i = -4; i <= 4; i++) {
        const v = (i / 4) * (Math.PI / 2);
        ctx.beginPath();
        for (let j = 0; j <= 90; j++) {
          const a = (j / 90) * Math.PI * 2;
          const p = {
            x: Math.cos(a) * Math.cos(v),
            y: Math.sin(v),
            z: Math.sin(a) * Math.cos(v),
          };
          const pr = project(p);
          if (j === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.stroke();
      }
      ctx.restore();

      // dotted sphere points (sorted by depth)
      const projected = points.map((p) => ({ pr: project(p) }));
      projected.sort((a, b) => a.pr.z - b.pr.z);

      for (const { pr } of projected) {
        const front = pr.z > -0.15;
        const alpha = front ? 0.55 : 0.16;
        const r = 1 + pr.s * 1.35;

        ctx.beginPath();
        ctx.arc(pr.x, pr.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      // arcs (global reach beams)
      ctx.save();
      ctx.lineWidth = 1.2;

      for (let k = arcs.length - 1; k >= 0; k--) {
        const arc = arcs[k];
        arc.t += arc.speed * (dt * 60);

        if (arc.t > arc.life) {
          arcs.splice(k, 1);
          continue;
        }

        const lerpNormLift = (u) => {
          const x = arc.a.x * (1 - u) + arc.b.x * u;
          const y = arc.a.y * (1 - u) + arc.b.y * u;
          const z = arc.a.z * (1 - u) + arc.b.z * u;
          const m = Math.sqrt(x * x + y * y + z * z) || 1;

          // lift off sphere for beam arc
          const lift = 1 + Math.sin(u * Math.PI) * 0.18;
          return { x: (x / m) * lift, y: (y / m) * lift, z: (z / m) * lift };
        };

        const head = clamp(arc.t / arc.life, 0, 1);
        const tail = clamp(head - 0.28, 0, 1);

        ctx.beginPath();
        const steps = 34;
        for (let i = 0; i <= steps; i++) {
          const u = tail + (i / steps) * (head - tail);
          const pr = project(lerpNormLift(u));
          if (i === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        }

        // outer glow
        ctx.strokeStyle = "rgba(120,255,180,0.18)";
        ctx.stroke();

        // core beam
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = "rgba(120,255,180,0.45)";
        ctx.stroke();
        ctx.lineWidth = 1.2;
      }

      ctx.restore();

      // outer ring hint
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [points, intensity, intervalArcs, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden="true"
    />
  );
}
