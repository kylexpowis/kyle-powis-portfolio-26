import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TechLogoCycler({ logos = [], interval = 2800 }) {
  const safeLogos = useMemo(
    () => (Array.isArray(logos) ? logos.filter(Boolean) : []),
    [logos]
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!safeLogos.length) return;

    setIdx((i) => (i >= safeLogos.length ? 0 : i));

    const t = setInterval(() => {
      setIdx((i) => (i + 1) % safeLogos.length);
    }, interval);

    return () => clearInterval(t);
  }, [safeLogos, interval]);

  if (!safeLogos.length) return null;

  const src = safeLogos[idx];

  return (
    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center overflow-hidden">
      {/* subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -inset-6 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 object-contain opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.22)]"
          // this makes tech logos white
          style={{ filter: "brightness(0) saturate(100%) invert(1)" }}
          initial={{ opacity: 0, y: 4, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.985 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}
