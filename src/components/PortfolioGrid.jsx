import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GridTile from "./GridTile";

export default function PortfolioGrid() {
  const [activeId, setActiveId] = useState(null);

  const tiles = useMemo(() => {
    const desktop = [
      // ROW 1
      { id: "blank", type: "blank", label: "", span: "col-span-1 row-span-1" },
      { id: "blank2", type: "blank", label: "", span: "col-span-1 row-span-1" },
      {
        id: "tech",
        type: "tech",
        label: "Technologies",
        span: "col-span-1 row-span-1",
      },

      // ROW 2
      {
        id: "name",
        type: "name",
        label: "Kyle Powis",
        span: "col-span-2 row-span-1",
      },
      {
        id: "projects",
        type: "projects",
        label: "Projects",
        span: "col-span-1 row-span-1",
      },

      // ROW 3
      {
        id: "role",
        type: "role",
        label: "Full Stack Software Developer",
        span: "col-span-2 row-span-1",
      },
      {
        id: "resume",
        type: "panel",
        label: "Full Resume",
        span: "col-span-1 row-span-1",
      },

      // ROW 4
      {
        id: "github",
        type: "githubLink",
        label: "GitHub",
        href: "https://github.com/kylexpowis",
        span: "col-span-1 row-span-1",
      },
      {
        id: "linkedin",
        type: "link",
        label: "LinkedIn",
        href: "https://www.linkedin.com/",
        span: "col-span-1 row-span-1",
      },
      {
        id: "contact",
        type: "panel",
        label: "Contact",
        span: "col-span-1 row-span-1",
      },
    ];

    const mobile = [
      // TOP BLANKS (always first on mobile)
      { id: "blank", type: "blank", label: "", span: "col-span-1 row-span-1" },
      { id: "blank2", type: "blank", label: "", span: "col-span-1 row-span-1" },

      // HERO
      {
        id: "name",
        type: "name",
        label: "Kyle Powis",
        span: "col-span-2 row-span-1",
      },
      {
        id: "role",
        type: "role",
        label: "Full Stack Software Developer",
        span: "col-span-2 row-span-1",
      },

      // UNDER HERO
      {
        id: "tech",
        type: "tech",
        label: "Technologies",
        span: "col-span-1 row-span-1",
      },
      {
        id: "projects",
        type: "projects",
        label: "Projects",
        span: "col-span-1 row-span-1",
      },

      // REST
      {
        id: "resume",
        type: "panel",
        label: "Resume/CV",
        span: "col-span-1 row-span-1",
      },
      {
        id: "github",
        type: "githubLink",
        label: "GitHub",
        href: "https://github.com/kylexpowis",
        span: "col-span-1 row-span-1",
      },
      {
        id: "linkedin",
        type: "link",
        label: "LinkedIn",
        href: "https://www.linkedin.com/",
        span: "col-span-1 row-span-1",
      },
      {
        id: "contact",
        type: "panel",
        label: "Contact",
        span: "col-span-1 row-span-1",
      },
    ];

    return { desktop, mobile };
  }, []);

  // Desktop: true 3x3. Mobile: 2 columns (still keeps the vibe).
  return (
    <div className="w-full max-w-5xl min-h-0 overflow-visible">
      {/* Mobile grid */}
      <motion.div
        layout
        className="
    grid gap-3
    grid-cols-2
    auto-rows-[120px]
    sm:hidden
     overflow-visible
  "
      >
        {tiles.mobile.map((t) => (
          <GridTile
            key={`m-${t.id}`}
            tile={t}
            isActive={activeId === t.id}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </motion.div>

      {/* Desktop grid */}
      <motion.div
        layout
        className="
    hidden sm:grid gap-3
    sm:grid-cols-3
    sm:auto-rows-[140px]
  "
      >
        {tiles.desktop.map((t) => (
          <GridTile
            key={`d-${t.id}`}
            tile={t}
            isActive={activeId === t.id}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </motion.div>

      {/* Fullscreen overlay content for active tile */}
      <AnimatePresence>
        {activeId && (
          <motion.div
            className="fixed inset-0 z-50 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setActiveId(null)}
            />
            <motion.div
              layoutId={`tile-${activeId}`}
              className="relative mx-auto h-full max-w-5xl rounded-3xl border border-white/10 bg-[#07080a]/90 shadow-[0_0_80px_rgba(255,255,255,0.10)] overflow-hidden"
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <ExpandedContent
                id={activeId}
                onClose={() => setActiveId(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandedContent({ id, onClose }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="text-sm tracking-widest text-white/60 uppercase">
          Kyle Powis
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80 hover:text-white hover:border-white/30 transition"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 sm:p-10">
        {id === "projects" && <ProjectsPanel />}
        {id === "github" && (
          <LinkPanel title="GitHub" href="https://github.com/" />
        )}
        {id === "linkedin" && (
          <LinkPanel title="LinkedIn" href="https://www.linkedin.com/" />
        )}
        {id === "tech" && <TechPanel />}
        {id === "resume" && <ResumePanel />}
        {id === "contact" && <ContactPanel />}
        {(id === "introA" || id === "introB") && <IntroPanel />}
      </div>
    </div>
  );
}

function Title({ children }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-silver-gradient bg-clip-text text-transparent">
      {children}
    </h2>
  );
}

function Paragraph({ children }) {
  return <p className="mt-4 text-white/85 leading-relaxed">{children}</p>;
}

function LinkPanel({ title, href }) {
  return (
    <div>
      <Title>{title}</Title>
      <Paragraph>
        This tile can open an external link, or you can render content here.
      </Paragraph>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex mt-6 rounded-full border border-white/15 px-5 py-2 text-white/90 hover:border-white/35 hover:text-white transition"
      >
        Open {title}
      </a>
    </div>
  );
}

function ProjectsPanel() {
  const projects = [
    {
      name: "Panther VPN",
      desc: "Sole developer for my own privacy focused VPN app with WireGuard Encryption, cryptocurrency payment options and multiple servers worldwide.",
      href: "https://panthervpn.app/",
    },
    {
      name: "Puri Lips",
      desc: "Shopify Build for a new Aesthetics product.",
      href: "https://purilips.co.uk/",
    },
    {
      name: "Oakwood Furniture Outlet",
      desc: "Shopify build for online furniture store",
      href: "https://oakwoodfurnitureoutlet.co.uk/",
    },
    {
      name: "Kaizen Development",
      desc: "Client work + bespoke builds across Shopify/WordPress/React.",
      href: "https://kaizendevelopment.uk",
    },
    {
      name: "Pair Sniper Data Analytics",
      desc: "Project Manager and Developer in a team of 3. Cryptocurrency data analytics platform providing insights into trading trends using the coinmarketcap API. (This is a DEMO version. NDA Signed for live version).",
      href: "https://fe-demo-data.vercel.app/",
    },
    {
      name: "Das Bros",
      desc: "Portoflio for Videographers and 3D GFX Artists DasBros.",
      href: "https://dasbros.co.uk/",
    },
    {
      name: "Lordz DJ",
      desc: "Booking and Showreel website for worldwide performing Lordz DJ",
      href: "https://www.lordzdj.com/",
    },
  ];

  return (
    <div>
      <Title>Projects</Title>

      <div className="mt-8 grid gap-4">
        {projects.map((p) => (
          <motion.a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition"
            whileHover={{ y: -2 }}
          >
            <div className="text-lg font-medium bg-silver-gradient bg-clip-text text-transparent">
              {p.name}
            </div>
            <div className="mt-1 text-white/80">{p.desc}</div>
            <div className="mt-3 text-sm text-white/60">View →</div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

function TechPanel() {
  const tech = [
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "SQL",
    "Supabase",
    "TailwindCSS",
    "Swift",
    "AWS",
  ];
  return (
    <div>
      <Title>Technologies</Title>
      <Paragraph>
        You can view my current tech stack below. <br /> However, I am eager to
        learn more, and a fast learner. I
      </Paragraph>
      <div className="mt-6 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-sm text-white/85"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ResumePanel() {
  return (
    <div>
      <Title>Resume/CV</Title>
      <Paragraph>
        Drop a PDF into <span className="text-white">/public</span> and link it
        here, or render a full resume section.
      </Paragraph>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noreferrer"
        className="inline-flex mt-6 rounded-full border border-white/15 px-5 py-2 text-white/90 hover:border-white/35 hover:text-white transition"
      >
        Open Resume PDF
      </a>
    </div>
  );
}

function ContactPanel() {
  return (
    <div>
      <Title>Contact</Title>
      <Paragraph>
        Minimal contact: email + socials. (You can add a form later.)
      </Paragraph>
      <div className="mt-6 space-y-2 text-white/85">
        <div>
          Email: <span className="text-white">kyle@example.com</span>
        </div>
        <div>
          Location: <span className="text-white">Manchester, UK</span>
        </div>
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <div>
      <Title>Kyle Powis</Title>
      <Paragraph>
        Full Stack Software Developer. Minimal, futuristic portfolio in a
        grid-first UX.
      </Paragraph>
    </div>
  );
}
