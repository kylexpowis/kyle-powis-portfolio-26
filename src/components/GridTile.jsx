import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedLockText from "./AnimatedLockText";
import TechLogoCycler from "./TechLogoCycler";
import ProjectLogoCycler from "./ProjectLogoCycler";
import GlobeReachTile from "./GlobeReachTile";
import MatrixHudTile from "./MatrixHudTile";

export default function GridTile({ tile, activeId, setActiveId }) {
  const [pulseKey, setPulseKey] = useState(0);
  const isSomeoneActive = !!activeId;

  const clickable =
    tile.type !== "blank" &&
    tile.type !== "role" &&
    tile.type !== "name" &&
    tile.type !== "githubLink" && // github is link-only
    tile.type !== "link";

  const onHover = () => setPulseKey((k) => k + 1);

  const onClick = () => {
    if (tile.type === "githubLink" || tile.type === "link") {
      window.open(tile.href, "_blank", "noreferrer");
      return;
    }

    if (!clickable) return;
    setActiveId(tile.id);
  };

  // (files in /public/tech/)
  const techLogos = [
    "/tech/react.svg",
    "/tech/javascript.svg",
    "/tech/supabase.svg",
    "/tech/wireguard.svg",
    "/tech/kalilinux.svg",
    "/tech/sql.svg",
    "/tech/nodejs.svg",
    "/tech/swift.svg",
    "/tech/git.svg",
    "/tech/github.svg",
    "/tech/tailwindcss.svg",
    "/tech/python.svg",
    "/tech/linux.svg",
    "/tech/xcode.svg",
  ];

  // (files in /public/projects/)
  const projectLogos = ["/projects/panther.png"];

  // blank tiles
  if (tile.type === "blank") {
    const isGlobe = tile.id === "blank";
    const isMatrixHud = tile.id === "blank2";

    return (
      <div
        className={[
          "rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden",
          "shadow-[0_0_80px_rgba(255,255,255,0.04)]",
          tile.span || "",
        ].join(" ")}
      >
        {isGlobe && <GlobeReachTile intensity={1} />}
        {isMatrixHud && <MatrixHudTile density={0.75} />}
      </div>
    );
  }

  return (
    <motion.button
      layout
      layoutId={`tile-${tile.id}`}
      className={[
        "relative w-full h-full rounded-3xl border border-white/10 bg-white/[0.03]",
        "overflow-hidden text-left p-4 sm:p-5",
        "transition will-change-transform",
        "focus:outline-none",
        clickable || tile.type === "githubLink"
          ? "cursor-pointer"
          : "cursor-default",
        tile.span || "",
      ].join(" ")}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      whileHover={!isSomeoneActive ? { scale: 1.01 } : {}}
    >
      {/* glow */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition pointer-events-none">
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),transparent_60%)]" />
        <div className="absolute inset-0 shadow-glow" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* items-center keeps logo aligned on mobile */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 max-w-[82%]">
            <AnimatedLockText
              key={`${tile.id}-${pulseKey}`}
              text={tile.label}
              className={getTextClass(tile.type)}
            />

            {tile.type === "projects" && (
              <div className="mt-2 text-sm text-white/65">
                Just a few of 'em
              </div>
            )}

            {tile.type === "tech" && (
              <div className="mt-2 text-sm text-white/65">Core Tech Stack</div>
            )}
            {tile.type === "githubLink" && <div className="mt-2 h-[1.25rem]" />}
          </div>

          {/* Right-side icon/logo area pinned nicely */}
          <div className="shrink-0 self-start sm:self-auto">
            {/* Projects: normal */}
            {tile.type === "projects" && (
              <ProjectLogoCycler logos={projectLogos} />
            )}

            {/* inverted inside TechLogoCycler */}
            {tile.type === "tech" && <TechLogoCycler logos={techLogos} />}

            {tile.type === "githubLink" && <GitHubMark />}
            {tile.type === "link" && tile.label === "LinkedIn" && (
              <LinkedInLogo />
            )}
          </div>
        </div>

        {clickable && (
          <div className="text-xs tracking-widest uppercase text-white/45">
            Click to expand
          </div>
        )}

        {(tile.type === "githubLink" || tile.type === "link") && (
          <div className="text-xs tracking-widest uppercase text-white/45">
            Opens link
          </div>
        )}
      </div>
    </motion.button>
  );
}

function getTextClass(type) {
  if (type === "name") {
    return [
      "font-apple",
      "text-4xl sm:text-6xl",
      "font-semibold",
      "tracking-tight",
      "bg-silver-gradient bg-clip-text text-transparent",
      "truncate",
    ].join(" ");
  }

  if (type === "role") {
    return [
      "font-apple",
      "text-lg sm:text-2xl",
      "font-medium",
      "tracking-tight",
      "bg-silver-gradient bg-clip-text text-transparent",
      "leading-snug",
    ].join(" ");
  }

  return [
    "font-apple",
    "text-lg sm:text-xl",
    "font-semibold",
    "tracking-tight",
    "bg-silver-gradient bg-clip-text text-transparent",
    "truncate",
  ].join(" ");
}

function GitHubMark() {
  return (
    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-7 h-7 opacity-90 fill-white">
        <path d="M12 .5C5.73.5.75 5.6.75 12c0 5.12 3.16 9.45 7.55 10.98.55.1.75-.25.75-.56v-2.04c-3.07.69-3.72-1.52-3.72-1.52-.5-1.32-1.22-1.67-1.22-1.67-1-.71.08-.7.08-.7 1.1.08 1.68 1.15 1.68 1.15.98 1.72 2.58 1.22 3.21.93.1-.73.38-1.22.69-1.5-2.45-.29-5.02-1.26-5.02-5.6 0-1.24.43-2.25 1.14-3.05-.12-.29-.5-1.46.11-3.04 0 0 .93-.3 3.05 1.16.88-.25 1.83-.38 2.77-.38.94 0 1.89.13 2.77.38 2.12-1.46 3.05-1.16 3.05-1.16.61 1.58.23 2.75.11 3.04.71.8 1.14 1.81 1.14 3.05 0 4.35-2.58 5.31-5.04 5.59.39.35.74 1.05.74 2.12v3.14c0 .31.2.66.76.55 4.38-1.53 7.54-5.86 7.54-10.98C23.25 5.6 18.27.5 12 .5z" />
      </svg>
    </div>
  );
}

function LinkedInLogo() {
  return (
    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-7 h-7 opacity-90 fill-white">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8h4.56v16H.22V8zM8.58 8h4.38v2.18h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-7.74c0-1.84-.03-4.21-2.56-4.21-2.56 0-2.95 2-2.95 4.08V24H8.58V8z" />
      </svg>
    </div>
  );
}
