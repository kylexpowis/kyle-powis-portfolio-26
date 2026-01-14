import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:.-_/ ";

export default function AnimatedLockText({
  text,
  className = "",
  charset = DEFAULT_CHARSET,
  letterDelay = 22, // ms per letter start offset
  settleSpeed = 34, // ms per frame step
  maxSteps = 7, // how many random cycles before locking each char
}) {
  const [out, setOut] = useState(text);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const target = useMemo(() => String(text), [text]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    const chars = charset;
    const len = target.length;

    // Precompute per-letter lock time (staggered)
    const lockAt = Array.from({ length: len }, (_, i) => {
      const base = i * letterDelay;
      const jitter = (i % 3) * 7; // subtle deterministic jitter
      return base + maxSteps * settleSpeed + jitter;
    });

    const tick = (t) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;

      let done = true;
      let next = "";

      for (let i = 0; i < len; i++) {
        const lockTime = lockAt[i];
        if (elapsed >= lockTime) {
          next += target[i];
        } else {
          done = false;

          // “fly-through” feel: progress bias toward target by increasing chance over time
          const progress = Math.max(0, Math.min(1, elapsed / lockTime));
          const roll = Math.random();

          if (roll < progress * 0.35) next += target[i];
          else next += chars[(Math.random() * chars.length) | 0];
        }
      }

      setOut(next);

      if (!done) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, charset, letterDelay, settleSpeed, maxSteps]);

  return <span className={className}>{out}</span>;
}
