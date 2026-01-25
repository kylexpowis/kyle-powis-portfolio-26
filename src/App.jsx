import PortfolioGrid from "./components/PortfolioGrid";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050607] text-white overflow-hidden">
      <BackgroundFX />
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <PortfolioGrid />
      </main>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_55%)]" />
      {/* subtle grid glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:42px_42px]" />
      {/* noise */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.55%22/%3E%3C/svg%3E')]" />
    </>
  );
}
