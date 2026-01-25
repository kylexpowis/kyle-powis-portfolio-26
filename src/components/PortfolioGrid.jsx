import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GridTile from "./GridTile";

export default function PortfolioGrid() {
  const [activeId, setActiveId] = useState(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 639px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsMobile(mq.matches);

    onChange();

    // Safari compatibility: older iOS uses addListener/removeListener
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  // Close overlay when breakpoint flips (prevents layoutId mismatch)
  useEffect(() => {
    setActiveId(null);
  }, [isMobile]);

  const layoutScope = isMobile ? "m" : "d";

  const tiles = useMemo(() => {
    const desktop = [
      // ROW 1
      { id: "blank", type: "blank", label: "", span: "col-span-1 row-span-1" },
      { id: "blank2", type: "blank", label: "", span: "col-span-1 row-span-1" },
      {
        id: "tech",
        type: "tech",
        label: "TechStack",
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
        label: "CV / Resume",
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
      // TOP BLANKS
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
        label: "TechStack",
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

  // iPhone Safari fix:
  // Disable framer "layout" calculations on mobile grid containers.
  const gridLayout = !isMobile;

  return (
    <div className="w-full max-w-5xl min-h-0 overflow-visible">
      {/* Mobile grid */}
      <motion.div
        layout={gridLayout}
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
            activeId={activeId}
            setActiveId={setActiveId}
            layoutScope="m"
            isMobile={true} // REQUIRED for GridTile to disable layoutId on mobile
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
            activeId={activeId}
            setActiveId={setActiveId}
            layoutScope="d"
            isMobile={false}
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
            style={{
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
            }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setActiveId(null)}
            />

            <motion.div
              layoutId={`tile-${layoutScope}-${activeId}`}
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

/* ---------------- Expanded panels ---------------- */

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
  const techItems = [
    { name: "React", src: "/tech/react.svg" },
    { name: "JavaScript", src: "/tech/javascript.svg" },
    { name: "Supabase", src: "/tech/supabase.svg" },
    { name: "WireGuard", src: "/tech/wireguard.svg" },
    { name: "Kali Linux", src: "/tech/kalilinux.svg" },
    { name: "SQL", src: "/tech/sql.svg" },
    { name: "Node.js", src: "/tech/nodejs.svg" },
    { name: "Swift", src: "/tech/swift.svg" },
    { name: "Git", src: "/tech/git.svg" },
    { name: "GitHub", src: "/tech/github.svg" },
    { name: "Tailwind", src: "/tech/tailwindcss.svg" },
    { name: "Python", src: "/tech/python.svg" },
    { name: "Linux", src: "/tech/linux.svg" },
    { name: "Xcode", src: "/tech/xcode.svg" },
  ];

  return (
    <div>
      <Title>TechStack</Title>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {techItems.map((item) => (
          <div
            key={item.name}
            className="group flex flex-col items-center justify-center"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <img
                src={item.src}
                alt={item.name}
                draggable={false}
                className="
                  w-10 h-10 sm:w-12 sm:h-12
                  object-contain
                  opacity-85
                  transition
                  group-hover:opacity-100
                  group-hover:scale-110
                  drop-shadow-[0_0_18px_rgba(120,255,180,0.12)]
                  group-hover:drop-shadow-[0_0_28px_rgba(120,255,180,0.22)]
                "
                style={{ filter: "brightness(0) saturate(100%) invert(1)" }}
              />
            </div>

            <div className="mt-3 text-sm tracking-wide text-white/75 group-hover:text-white transition">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumePanel() {
  return (
    <div className="max-w-3xl">
      <Title>CV / Resume</Title>
      <Paragraph>
        Full-stack developer with a front end focus. Recently launched a privacy
        focused iOS VPN, delivering secure infrastructure, real time systems,
        and production payment flows. Skilled in modern JavaScript, React,
        SwiftUI, TDD, CI/CD, and agile delivery.
      </Paragraph>

      <SectionDivider />
      <SectionTitle>Experience</SectionTitle>

      <Role
        title="PantherVPN"
        subtitle="Sole Developer"
        meta="August 2025 – Present · Live on the App Store · panthervpn.app"
      >
        Developed and deployed a privacy focused iOS VPN using SwiftUI,
        provisioning Linux based VPS infrastructure across multiple regions and
        implementing WireGuard encrypted tunnels with public key cryptography,
        secure routing, and firewall hardening. Integrated Supabase
        authentication, serverless access control, and secure payment flows via
        StoreKit, Stripe, and BTCPay.
      </Role>

      <Role
        title="Oakwood Furniture Outlet"
        subtitle="Web Developer"
        meta="February 2024 – Present"
      >
        Full Shopify build, SEO, Google Ads, and Facebook Ads.
      </Role>

      <Role
        title="Kaizen Development"
        subtitle="Founder & Developer"
        meta="May 2024 – Present"
      >
        Launched a boutique web agency building responsive landing pages,
        Shopify stores, and managing Google Ads campaigns. Delivered projects
        for small businesses, yielding a 35% average increase in lead
        conversion. Coordinated end to end project lifecycle including
        requirements, UI/UX mockups, front end development, and performance
        optimisation.
      </Role>

      <Role
        title="Pairsniper"
        subtitle="Project Manager & Developer"
        meta="Jan 2024 – April 2024"
      >
        Developed a cryptocurrency trading analytics platform automating data
        aggregation from multiple market exchanges. Designed real time
        dashboards for live market data and architected a scalable backend with
        robust error handling and relational database support.
      </Role>

      <Role
        title="Northcoders Bootcamp"
        subtitle="Full-Stack Developer"
        meta="2023"
      >
        Completed an intensive 12 week bootcamp covering JavaScript, React,
        Node.js, Express, PostgreSQL, and Agile methodologies. Built multiple
        team and solo projects.
      </Role>

      <Role
        title="Freelance Music Production & DJ"
        subtitle="Self Employed"
        meta="2012 – Present"
      >
        Produced music for Artists, TV Shows & Brands, such as; Keeping Up With
        the Kardashians, MTV’s The Real World, New Balance, Footasylum, and
        other major brands.
      </Role>

      <SectionDivider />
      <SectionTitle>Technical Skills</SectionTitle>

      <SkillGroup
        label="Languages & Frameworks"
        text="JavaScript, React, React Native, Swift, Expo, Tailwind CSS, HTML5, CSS3, Node.js, Python, Next.js, Vite"
      />
      <SkillGroup
        label="Security"
        text="WireGuard VPN architecture, encrypted tunnelling, Linux VPS provisioning, network hardening, public-key cryptography, SSH-based access control, Supabase authentication"
      />
      <SkillGroup
        label="Back-End & Databases"
        text="SQL / PostgreSQL, Supabase (Postgres, Auth, Realtime, Edge Functions), Express.js, database seeding and migrations"
      />
      <SkillGroup
        label="Testing & QA"
        text="Jest, Supertest, React Testing Library, TDD workflows"
      />
      <SkillGroup
        label="Hosting & Payments"
        text="GitHub, Netlify, Vercel, Render, App Store Connect, Apple StoreKit (IAP), Stripe, BTCPay"
      />
      <SkillGroup
        label="Tools & Methodologies"
        text="Git, VS Code, Figma, Agile / SCRUM, paired programming, technical communication"
      />
      <SkillGroup
        label="Soft Skills"
        text="Adaptability, accountability, attention to detail, creative problem-solving"
      />

      <SectionDivider />
      <SectionTitle>Education</SectionTitle>

      <Paragraph>
        <strong>HND Media Production</strong> - University of Salford, UK
        <br />
        <strong>BTEC Level 3 National Diploma in Music Technology</strong> -
        Bury College, UK
        <br />
        Nine GCSEs
      </Paragraph>
    </div>
  );
}

function ContactPanel() {
  return (
    <div>
      <Title>Contact</Title>
      <Paragraph>Drop me an email and ill get back to you asap.</Paragraph>
      <div className="mt-6 space-y-2 text-white/85">
        <div>
          Email: <span className="text-white">kyle@kaizendevelopment.uk</span>
        </div>
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <div>
      <Title>Kyle Powis</Title>
      <Paragraph>Full Stack Software Developer</Paragraph>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mt-12 mb-4 text-lg tracking-widest uppercase text-white/70">
      {children}
    </h3>
  );
}

function SectionDivider() {
  return <div className="my-10 h-px bg-white/10" />;
}

function Role({ title, subtitle, meta, children }) {
  return (
    <div className="mb-8">
      <div className="text-white font-medium">
        {title} <span className="text-white/60">| {subtitle}</span>
      </div>
      <div className="mt-1 text-sm text-white/55 italic">{meta}</div>
      <p className="mt-3 text-white/85 leading-relaxed">{children}</p>
    </div>
  );
}

function SkillGroup({ label, text }) {
  return (
    <p className="mt-3 text-white/85 leading-relaxed">
      <span className="text-white/60">{label}:</span> {text}
    </p>
  );
}
