import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ArrowUpRight,
  Menu,
  X,
  ExternalLink,
  Mail,
  ChevronDown,
} from "lucide-react";
import portraitImg from "../imports/IMAGE_2.jpg";
import orderPulseImg from "../imports/ChatGPT_Image_Sep_22__2026__11_20_30_AM.png";
import certImg from "../imports/Screenshot_2026-09-22_144625.png";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DISPLAY = "'Bricolage Grotesque', sans-serif";
const MONO = "'Geist Mono', 'Courier New', monospace";

// ─── Utility: FadeUp reveal wrapper ───────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
  y = 36,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label chip ────────────────────────────────────────────────────────
function Chip({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center text-xs tracking-widest text-violet-400 border border-violet-400/25 px-3 py-1 rounded-full"
      style={{ fontFamily: MONO, background: "rgba(124,92,252,0.07)" }}
    >
      {text}
    </span>
  );
}

// ─── Animated canvas network background ───────────────────────────────────────
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type N = { x: number; y: number; vx: number; vy: number; r: number; ph: number };
    const nodes: N[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.6,
      ph: Math.random() * Math.PI * 2,
    }));

    const tick = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 170) {
            ctx.strokeStyle = `rgba(124,92,252,${0.16 * (1 - d / 170)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        n.ph += 0.018;
        const glow = 0.55 + Math.sin(n.ph) * 0.35;
        ctx.fillStyle = `rgba(167,139,250,${glow * 0.85})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.45 }}
    />
  );
}

// ─── Preloader ─────────────────────────────────────────────────────────────────
function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6"
      style={{ background: "#050714" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl md:text-7xl font-black tracking-tighter text-white"
        style={{ fontFamily: DISPLAY }}
      >
        KOWSHIK<span style={{ color: "#7c5cfc" }}>.</span>
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 1.3, ease: "easeInOut" }}
        style={{
          width: 200,
          height: 1,
          background: "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, transparent)",
          transformOrigin: "left",
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs tracking-widest text-violet-400/60"
        style={{ fontFamily: MONO }}
      >
        AI PRODUCT BUILDER
      </motion.p>
    </motion.div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const links = [
    { label: "ABOUT", id: "about" },
    { label: "WORK", id: "work" },
    { label: "TOOLKIT", id: "toolkit" },
    { label: "EXPERIENCE", id: "experience" },
    { label: "CERTIFICATES", id: "certificates" },
    { label: "CONTACT", id: "contact" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          padding: scrolled ? "12px 0" : "20px 0",
          background: scrolled ? "rgba(5,7,20,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(124,92,252,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-black tracking-widest text-white hover:text-violet-400 transition-colors duration-300"
            style={{ fontFamily: DISPLAY }}
          >
            KOWSHIK
          </button>

          <div className="hidden md:flex items-center gap-7">
            {links.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className="text-xs tracking-widest text-white/40 hover:text-white transition-colors duration-300"
                style={{ fontFamily: MONO }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-1"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-9"
            style={{ background: "rgba(5,7,20,0.97)", backdropFilter: "blur(24px)" }}
          >
            {links.map(({ label, id }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => go(id)}
                className="text-2xl tracking-widest text-white/60 hover:text-white transition-colors"
                style={{ fontFamily: MONO }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <NetworkCanvas />

      {/* radial glows */}
      <div
        className="absolute top-20 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-20 left-10 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        }}
      />
      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #050714)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px #34d399" }} />
              <span
                className="text-xs tracking-widest text-emerald-400"
                style={{ fontFamily: MONO }}
              >
                OPEN TO ENTRY-LEVEL PRODUCT ROLES
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-black leading-none tracking-tighter text-white"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: "clamp(3.4rem, 9.5vw, 7.8rem)",
                }}
              >
                KOW
                <span style={{ color: "#7c5cfc" }}>SHIK</span>
                <br />
                <span
                  style={{
                    WebkitTextStroke: "1.5px rgba(167,139,250,0.45)",
                    color: "transparent",
                  }}
                >
                  BORA
                </span>
                <span style={{ color: "#a78bfa" }}>PURE</span>
                <span
                  style={{
                    WebkitTextStroke: "1.5px rgba(167,139,250,0.45)",
                    color: "transparent",
                  }}
                >
                  DDY
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="text-sm md:text-base tracking-wider text-white/55 uppercase leading-relaxed"
              style={{ fontFamily: MONO }}
            >
              AI Product Management<br />
              Through Product Thinking,<br />
              Technology &amp; AI.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.15 }}
              className="text-white/35 text-sm max-w-sm leading-relaxed"
            >
              I turn real user problems into practical product ideas, experiences, and AI-powered solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.35 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <button
                onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wider font-semibold text-white transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                  boxShadow: "0 0 0 0 rgba(124,92,252,0)",
                  fontFamily: MONO,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,92,252,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(124,92,252,0)")}
              >
                VIEW MY WORK
                <ArrowUpRight
                  size={15}
                  className="group-hover:rotate-45 transition-transform duration-300"
                />
              </button>
              <a
                href="https://www.linkedin.com/in/kowshik-borapureddy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wider text-white/70 hover:text-white transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: MONO,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(124,92,252,0.45)";
                  e.currentTarget.style.background = "rgba(124,92,252,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                LET'S CONNECT
              </a>
            </motion.div>
          </div>

          {/* RIGHT: Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative" style={{ width: 320, height: 320 }}>
              {/* outer conic ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 180deg, #7c5cfc, #a78bfa, #6366f1, #7c5cfc)",
                  padding: 2,
                }}
              >
                <div className="w-full h-full rounded-full" style={{ background: "#050714" }} />
              </div>
              {/* portrait */}
              <div className="absolute inset-[10px] rounded-full overflow-hidden">
                <img
                  src={portraitImg}
                  alt="Kowshik Borapureddy — professional portrait"
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: "50% 15%" }}
                />
              </div>
              {/* ambient glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: "-30%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(124,92,252,0.22) 0%, transparent 65%)",
                  zIndex: -1,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25"
        >
          <span className="text-[10px] tracking-widest" style={{ fontFamily: MONO }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  const interests = [
    "Understanding user problems",
    "Breaking down product problems",
    "Defining MVPs",
    "Designing product flows",
    "Creating PRDs",
    "Building wireframes",
    "Exploring AI applications",
    "Measuring product outcomes",
  ];

  return (
    <section id="about" className="py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <Chip text="01 — About" />
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-8">
            <FadeUp delay={0.1}>
              <h2
                className="font-black text-white leading-tight"
                style={{ fontFamily: DISPLAY, fontSize: "clamp(1.9rem,4.5vw,3.6rem)" }}
              >
                I'm a Computer Science graduate building my career toward AI Product Management.
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-white/45 leading-relaxed">
                My background combines software development, project coordination, product thinking, and hands-on experimentation with AI-powered products. I'm drawn to the intersection of user needs, technology systems, and product strategy — where the right product decision can create meaningfully better experiences.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="space-y-4">
                <p className="text-xs tracking-widest text-violet-400/70" style={{ fontFamily: MONO }}>
                  WHAT I ENJOY
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                      className="text-xs px-3 py-1.5 rounded-full text-white/60 cursor-default transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.09)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Info card */}
          <FadeUp delay={0.25} className="space-y-0">
            <div
              className="rounded-2xl border divide-y"
              style={{
                background: "rgba(12,17,40,0.85)",
                borderColor: "rgba(124,92,252,0.12)",
                divideColor: "rgba(124,92,252,0.08)",
              }}
            >
              {[
                { label: "Location", value: "Visakhapatnam, Andhra Pradesh, India" },
                { label: "Focus", value: "AI Product Management · Product Strategy" },
                { label: "Education", value: "B.Tech CSE · Malla Reddy College, Hyderabad" },
                { label: "CGPA", value: "7.86 / 10 · 2022 – 2026" },
                { label: "Email", value: "kowshikborapureddy@gmail.com" },
                { label: "Status", value: "Open to Entry-Level Product Roles" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="px-6 py-4 flex flex-col gap-0.5"
                  style={{ borderColor: "rgba(124,92,252,0.08)" }}
                >
                  <span
                    className="text-[10px] tracking-widest text-violet-400/60"
                    style={{ fontFamily: MONO }}
                  >
                    {label.toUpperCase()}
                  </span>
                  <span className="text-sm text-white/75">{value}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Product Thinking ──────────────────────────────────────────────────────────
function ProductThinkingSection() {
  const steps = [
    {
      num: "01",
      title: "UNDERSTAND",
      desc: "Understand the user and the problem. Listen, observe, and empathize before proposing anything.",
    },
    {
      num: "02",
      title: "DEFINE",
      desc: "Turn the problem into a focused product opportunity. Set a clear scope and measurable success criteria.",
    },
    {
      num: "03",
      title: "BUILD",
      desc: "Design the MVP, flows, requirements, and experience. Ship something real to test assumptions early.",
    },
    {
      num: "04",
      title: "LEARN",
      desc: "Measure outcomes, identify trade-offs, and iterate. Let evidence drive the next product decision.",
    },
  ];

  return (
    <section
      className="py-36 px-6"
      style={{ background: "linear-gradient(180deg, #050714 0%, #070a1e 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <Chip text="02 — Product Thinking" />
        </FadeUp>
        <FadeUp delay={0.1} className="mt-5">
          <h2
            className="font-black text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem,4vw,3.4rem)" }}
          >
            HOW I THINK ABOUT PRODUCTS
          </h2>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.09}>
              <div
                className="relative p-7 rounded-2xl group cursor-default transition-all duration-500"
                style={{
                  background: "rgba(12,17,40,0.85)",
                  border: "1px solid rgba(124,92,252,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.35)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(20,25,55,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.1)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(12,17,40,0.85)";
                }}
              >
                <div
                  className="absolute -top-3 left-5 text-[10px] tracking-widest px-2.5 py-0.5 rounded-full border text-violet-400"
                  style={{
                    fontFamily: MONO,
                    background: "#050714",
                    borderColor: "rgba(124,92,252,0.3)",
                  }}
                >
                  {step.num}
                </div>
                <div className="pt-3 space-y-3">
                  <h3
                    className="text-base font-black text-white tracking-wide"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
                {/* bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px rounded-b-full transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(90deg, transparent, #7c5cfc, transparent)" }}
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── OrderPulse detail modal ───────────────────────────────────────────────────
function OrderPulseModal({ onClose }: { onClose: () => void }) {
  const artifacts = [
    { label: "FIGMA", href: "https://www.figma.com/community/file/1684126733595502890/orderpulse-proactive-recovery-for-late-night-food-delivery" },
    { label: "GITHUB", href: "https://github.com/kowshikborapureddy/OrderPulse-Proactive-Recovery" },
    { label: "MEDIUM", href: "https://medium.com/@kowshikborapureedy/orderpulse-proactive-recovery-for-late-night-food-delivery-4954bb6d41be" },
  ];
  const mvp = [
    "Delivery-risk monitoring",
    "Early warning notification",
    "Risk explanation to customer",
    "Recovery options surface",
    "Recovery recommendation",
    "Customer confirmation flow",
    "Outcome tracking",
    "Product metrics dashboard",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{ background: "rgba(5,7,20,0.97)", backdropFilter: "blur(24px)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="text-xs tracking-widest text-violet-400/60" style={{ fontFamily: MONO }}>
              PROJECT DETAIL — 01
            </span>
            <h2
              className="text-4xl md:text-6xl font-black text-white mt-2"
              style={{ fontFamily: DISPLAY }}
            >
              OrderPulse
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-violet-400/40 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <img
          src={orderPulseImg}
          alt="OrderPulse case study visual"
          className="w-full rounded-2xl mb-14"
          style={{ border: "1px solid rgba(124,92,252,0.15)" }}
        />

        <div className="space-y-10">
          {[
            {
              num: "01",
              heading: "THE PROBLEM",
              body: "Customers may discover a delivery problem too late to recover the meal. By the time they're notified of a failure, the recovery window has often already closed.",
            },
            {
              num: "02",
              heading: "THE OPPORTUNITY",
              body: 'How might we help customers recognize delivery problems early enough to do something meaningful about them? The HMW: detect risk proactively, communicate honestly, and offer recovery — not just a refund.',
            },
            {
              num: "03",
              heading: "THE SOLUTION",
              body: "Monitor → Detect Risk → Warn → Explain → Offer Options → Customer Choice → Recover",
              mono: true,
            },
            {
              num: "04",
              heading: "PRODUCT PRINCIPLE",
              body: "AI recommends. Policy controls. Customer decides.",
              mono: true,
            },
          ].map(({ num, heading, body, mono }) => (
            <div
              key={num}
              className="p-8 rounded-2xl border"
              style={{ background: "rgba(12,17,40,0.8)", borderColor: "rgba(124,92,252,0.12)" }}
            >
              <div className="flex items-start gap-5">
                <span className="text-4xl font-black text-white/8 flex-shrink-0" style={{ fontFamily: MONO }}>
                  {num}
                </span>
                <div className="space-y-3">
                  <h3
                    className="text-lg font-black text-white"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {heading}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${mono ? "text-violet-300" : "text-white/55"}`}
                    style={mono ? { fontFamily: MONO } : undefined}
                  >
                    {body}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* MVP features */}
          <div
            className="p-8 rounded-2xl border"
            style={{ background: "rgba(12,17,40,0.8)", borderColor: "rgba(124,92,252,0.12)" }}
          >
            <h3 className="text-lg font-black text-white mb-5" style={{ fontFamily: DISPLAY }}>
              05 — MVP FEATURES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mvp.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/55">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Product artifacts */}
          <div className="flex flex-wrap gap-3">
            {artifacts.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs tracking-wider font-medium text-white transition-all duration-300"
                style={{
                  fontFamily: MONO,
                  background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                }}
              >
                {label} <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Selected Work ─────────────────────────────────────────────────────────────
function SelectedWorkSection() {
  const [showOrderPulse, setShowOrderPulse] = useState(false);
  const tags1 = ["Product Management", "AI Product", "Product Strategy", "UX", "PRD"];
  const tags2 = ["Product Design", "Healthcare", "Matching Logic", "UX", "Web"];

  return (
    <section id="work" className="py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <Chip text="03 — Selected Work" />
        </FadeUp>
        <FadeUp delay={0.1} className="mt-5 flex justify-between items-end flex-wrap gap-4">
          <h2
            className="font-black text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem,4vw,3.4rem)" }}
          >
            SELECTED WORK
          </h2>
          <span className="text-xs text-white/25" style={{ fontFamily: MONO }}>
            2 PROJECTS · 1 CONCEPT
          </span>
        </FadeUp>

        <div className="mt-16 space-y-6">
          {/* ── Project 01: OrderPulse ── */}
          <FadeUp>
            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-700"
              style={{
                background: "rgba(12,17,40,0.92)",
                border: "1px solid rgba(124,92,252,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,92,252,0.1)")
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* image */}
                <div className="lg:col-span-3 relative overflow-hidden" style={{ minHeight: 300 }}>
                  <img
                    src={orderPulseImg}
                    alt="OrderPulse — proactive delivery recovery product case study"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: 300 }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, transparent 55%, rgba(12,17,40,0.85))",
                    }}
                  />
                  <div
                    className="absolute inset-0 lg:hidden"
                    style={{ background: "linear-gradient(to top, rgba(12,17,40,0.95) 0%, transparent 60%)" }}
                  />
                </div>

                {/* content */}
                <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-between gap-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-wider text-violet-400/65" style={{ fontFamily: MONO }}>
                        PROJECT 01
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(124,92,252,0.12)",
                          color: "#a78bfa",
                          border: "1px solid rgba(124,92,252,0.22)",
                          fontFamily: MONO,
                        }}
                      >
                        CONCEPT
                      </span>
                    </div>

                    <div>
                      <h3
                        className="text-4xl font-black text-white"
                        style={{ fontFamily: DISPLAY }}
                      >
                        OrderPulse
                      </h3>
                      <p className="text-white/45 text-sm mt-1">
                        Proactive recovery for late-night food delivery.
                      </p>
                    </div>

                    <p
                      className="text-sm text-violet-300/80 italic leading-relaxed border-l-2 pl-4"
                      style={{ borderColor: "rgba(124,92,252,0.4)" }}
                    >
                      "When delivery fails, recover the meal — not just the money."
                    </p>

                    <p className="text-sm text-white/40 leading-relaxed">
                      A product concept exploring how food-delivery platforms can detect meaningful delivery risk earlier, explain what is happening, and give customers realistic recovery choices before a failed delivery becomes unavoidable.
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {tags1.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-full text-white/35"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowOrderPulse(true)}
                      className="flex items-center gap-1.5 text-xs tracking-wider font-semibold px-4 py-2.5 rounded-full text-white transition-opacity duration-300 hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                        fontFamily: MONO,
                      }}
                    >
                      VIEW CASE STUDY
                    </button>
                    <a
                      href="https://www.figma.com/community/file/1684126733595502890/orderpulse-proactive-recovery-for-late-night-food-delivery"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs tracking-wider px-4 py-2.5 rounded-full text-white/55 hover:text-white transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      FIGMA <ExternalLink size={11} />
                    </a>
                    <a
                      href="https://github.com/kowshikborapureddy/OrderPulse-Proactive-Recovery"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs tracking-wider px-4 py-2.5 rounded-full text-white/55 hover:text-white transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      GITHUB <ExternalLink size={11} />
                    </a>
                    <a
                      href="https://medium.com/@kowshikborapureedy/orderpulse-proactive-recovery-for-late-night-food-delivery-4954bb6d41be"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs tracking-wider px-4 py-2.5 rounded-full text-white/55 hover:text-white transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      MEDIUM <ExternalLink size={11} />
                    </a>
                    <a
                      href="https://medium.com/@kowshikborapureedy/orderpulse-proactive-recovery-for-late-night-food-delivery-4954bb6d41be"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs tracking-wider px-4 py-2.5 rounded-full text-white/55 hover:text-white transition-all duration-300"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      MEDIUM <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ── Project 02: BloodConnect 3D ── */}
          <FadeUp delay={0.08}>
            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-700"
              style={{
                background: "rgba(12,17,40,0.92)",
                border: "1px solid rgba(124,92,252,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,92,252,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,92,252,0.1)")
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* visual */}
                <div
                  className="lg:col-span-2 relative flex items-center justify-center"
                  style={{
                    minHeight: 240,
                    background: "linear-gradient(135deg, #09102a, #110e36)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,rgba(124,92,252,0.2) 0,rgba(124,92,252,0.2) 1px,transparent 1px,transparent 44px),repeating-linear-gradient(90deg,rgba(124,92,252,0.2) 0,rgba(124,92,252,0.2) 1px,transparent 1px,transparent 44px)",
                      backgroundSize: "44px 44px",
                    }}
                  />
                  <div className="relative z-10 text-center p-8">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                      }}
                    >
                      <span className="text-2xl">🩸</span>
                    </div>
                    <p
                      className="text-xs tracking-widest text-red-400/60"
                      style={{ fontFamily: MONO }}
                    >
                      BLOOD · CONNECT · 3D
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 hidden lg:block"
                    style={{ background: "linear-gradient(to right, transparent, rgba(12,17,40,0.6))" }}
                  />
                  <div
                    className="absolute inset-0 lg:hidden"
                    style={{ background: "linear-gradient(to top, rgba(12,17,40,0.95) 0%, transparent 60%)" }}
                  />
                </div>

                {/* content */}
                <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-between gap-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-wider text-violet-400/65" style={{ fontFamily: MONO }}>
                        PROJECT 02
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "#f87171",
                          border: "1px solid rgba(239,68,68,0.22)",
                          fontFamily: MONO,
                        }}
                      >
                        BUILT
                      </span>
                    </div>

                    <div>
                      <h3 className="text-4xl font-black text-white" style={{ fontFamily: DISPLAY }}>
                        BloodConnect 3D
                      </h3>
                      <p className="text-white/45 text-sm mt-1">
                        Emergency blood matching through proximity, compatibility and product design.
                      </p>
                    </div>

                    <p className="text-sm text-white/45 leading-relaxed">
                      BloodConnect 3D explores how hospital emergency blood requests can be connected with nearby compatible donors through structured matching, emergency workflows, and an interactive web experience.
                    </p>

                    <p
                      className="text-xs text-violet-300/60 italic"
                      style={{ fontFamily: MONO }}
                    >
                      Explored an AI Match Assistant as a future product layer while keeping eligibility decisions rule-based.
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {tags2.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-full text-white/35"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ── Coming Next ── */}
          <FadeUp delay={0.14}>
            <div
              className="rounded-3xl p-14 text-center space-y-4"
              style={{
                background: "rgba(12,17,40,0.45)",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-xs tracking-widest text-white/25" style={{ fontFamily: MONO }}>
                COMING NEXT
              </p>
              <h3
                className="text-2xl font-black text-white/40"
                style={{ fontFamily: DISPLAY }}
              >
                MORE PRODUCTS IN PROGRESS
              </h3>
              <p className="text-sm text-white/25 max-w-sm mx-auto leading-relaxed">
                Building and documenting more product experiments around AI, automation, and user-centered systems.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>

      <AnimatePresence>
        {showOrderPulse && (
          <OrderPulseModal onClose={() => setShowOrderPulse(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Product Toolkit ───────────────────────────────────────────────────────────
function ToolkitSection() {
  const categories = [
    {
      title: "PRODUCT",
      color: "#7c5cfc",
      skills: ["Product Discovery", "User Research", "Product Strategy", "MVP Definition", "PRDs", "User Stories", "Product Roadmapping", "Product Metrics"],
    },
    {
      title: "AI",
      color: "#a78bfa",
      skills: ["Generative AI", "Prompt Engineering", "LLM Applications"],
    },
    {
      title: "DESIGN",
      color: "#818cf8",
      skills: ["Figma", "Wireframing"],
    },
    {
      title: "COLLABORATION",
      color: "#6366f1",
      skills: ["Jira", "Git", "GitHub"],
    },
    {
      title: "TECHNICAL",
      color: "#38bdf8",
      skills: ["Python", "Java", "SQL", "React.js", "REST APIs"],
    },
    {
      title: "AI TOOLS",
      color: "#34d399",
      skills: ["Google AI Studio", "Cloudflare"],
    },
  ];

  return (
    <section
      id="toolkit"
      className="py-36 px-6"
      style={{ background: "linear-gradient(180deg, #050714 0%, #070a1e 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <Chip text="04 — Product Toolkit" />
        </FadeUp>
        <FadeUp delay={0.1} className="mt-5">
          <h2
            className="font-black text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem,4vw,3.4rem)" }}
          >
            PRODUCT TOOLKIT
          </h2>
        </FadeUp>
        <FadeUp delay={0.15} className="mt-3">
          <p className="text-sm text-white/35 max-w-lg">
            Tools, methods, and areas I work with — no skill bars, no percentages. Just honest labels.
          </p>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, ci) => (
            <FadeUp key={cat.title} delay={ci * 0.07}>
              <div
                className="p-6 rounded-2xl space-y-4 transition-all duration-500"
                style={{
                  background: "rgba(12,17,40,0.85)",
                  border: "1px solid rgba(124,92,252,0.1)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.22)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.1)")
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}80` }}
                  />
                  <span
                    className="text-xs tracking-widest"
                    style={{ color: cat.color, fontFamily: MONO }}
                  >
                    {cat.title}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.82 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: ci * 0.06 + si * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ scale: 1.06 }}
                      className="text-xs px-3 py-1.5 rounded-full text-white/65 cursor-default"
                      style={{
                        background: `${cat.color}13`,
                        border: `1px solid ${cat.color}28`,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Certifications ────────────────────────────────────────────────────────────
function CertificationsSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const certs = [
    {
      org: "Great Learning",
      course: "Product Management",
      date: "September 02, 2026",
      image: certImg,
    },
    {
      org: "Google Cloud",
      course: "Gen AI Academy APAC 2026 — Cohort 2",
      date: "2026",
      image: null,
    },
    {
      org: "ExcelR",
      course: "Full Stack Java Development Certification",
      date: "2025",
      image: null,
    },
    {
      org: "OpenAI Academy × NxtWave",
      course: "Generative AI Mastery Workshop",
      date: "2025",
      image: null,
    },
  ];

  return (
    <section id="certificates" className="py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <Chip text="05 — Certifications" />
        </FadeUp>
        <FadeUp delay={0.1} className="mt-5">
          <h2
            className="font-black text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem,4vw,3.4rem)" }}
          >
            CERTIFICATIONS
          </h2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {certs.map((cert, i) => (
            <FadeUp key={cert.course} delay={i * 0.08}>
              <div
                className={`group overflow-hidden rounded-2xl transition-all duration-500 ${cert.image ? "cursor-pointer" : ""}`}
                style={{
                  background: "rgba(12,17,40,0.85)",
                  border: "1px solid rgba(124,92,252,0.1)",
                }}
                onClick={() => cert.image && setLightbox(cert.image)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.32)";
                  if (cert.image) (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {cert.image && (
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={cert.image}
                      alt={cert.course}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(12,17,40,1))" }}
                    />
                    <div
                      className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(52,211,153,0.15)",
                        color: "#34d399",
                        border: "1px solid rgba(52,211,153,0.3)",
                        fontFamily: MONO,
                      }}
                    >
                      VERIFIED
                    </div>
                  </div>
                )}
                <div className={`p-5 space-y-2 ${!cert.image ? "py-6" : ""}`}>
                  {!cert.image && (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: "rgba(124,92,252,0.08)",
                        border: "1px solid rgba(124,92,252,0.2)",
                      }}
                    >
                      <span className="text-base">📜</span>
                    </div>
                  )}
                  <p
                    className="text-[10px] tracking-widest text-violet-400/60"
                    style={{ fontFamily: MONO }}
                  >
                    {cert.org.toUpperCase()}
                  </p>
                  <p className="text-sm font-semibold text-white/85 leading-snug">
                    {cert.course}
                  </p>
                  <p className="text-xs text-white/25" style={{ fontFamily: MONO }}>
                    {cert.date}
                  </p>
                  {cert.image && (
                    <p className="text-xs text-violet-400/45 pt-1" style={{ fontFamily: MONO }}>
                      CLICK TO VIEW →
                    </p>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            style={{ background: "rgba(5,7,20,0.96)", backdropFilter: "blur(20px)" }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white/45 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <img
                src={lightbox}
                alt="Certificate"
                className="w-full rounded-2xl shadow-2xl"
                style={{ border: "1px solid rgba(124,92,252,0.2)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Experience + Education + Achievements ────────────────────────────────────
function ExperienceSection() {
  const roles = [
    {
      num: "01",
      org: "Yar Tech Services",
      title: "Web Development Intern",
      period: "Dec 2024 – Feb 2025",
      type: "Internship",
    },
    {
      num: "02",
      org: "Excelerate",
      title: "Project Management Associate",
      period: "Apr 2026 – Jul 2026",
      type: "Remote",
    },
  ];

  const achievements = [
    "Winner — Hack-O-Heist 36-Hour National Hackathon",
    "Google Developer Program — Premium Tier Member",
    "Code Marathon — 10-Hour Technical Hackathon · Leadership & Event Coordination",
  ];

  return (
    <section
      id="experience"
      className="py-36 px-6"
      style={{ background: "linear-gradient(180deg, #050714 0%, #070a1e 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <Chip text="06 — Experience" />
        </FadeUp>
        <FadeUp delay={0.1} className="mt-5">
          <h2
            className="font-black text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem,4vw,3.4rem)" }}
          >
            EXPERIENCE
          </h2>
        </FadeUp>

        <div className="mt-14 space-y-4">
          {roles.map((role, i) => (
            <FadeUp key={role.num} delay={i * 0.1}>
              <div
                className="flex flex-col sm:flex-row gap-5 sm:items-center p-6 md:p-8 rounded-2xl transition-all duration-500"
                style={{
                  background: "rgba(12,17,40,0.85)",
                  border: "1px solid rgba(124,92,252,0.1)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.25)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor = "rgba(124,92,252,0.1)")
                }
              >
                <span
                  className="text-5xl font-black flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.04)", fontFamily: MONO }}
                >
                  {role.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] tracking-widest text-violet-400/60 mb-1"
                    style={{ fontFamily: MONO }}
                  >
                    {role.org.toUpperCase()}
                  </p>
                  <h3 className="text-lg font-bold text-white">{role.title}</h3>
                </div>
                <div className="sm:text-right space-y-1 flex-shrink-0">
                  <p className="text-sm text-white/45" style={{ fontFamily: MONO }}>
                    {role.period}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white/30"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      fontFamily: MONO,
                    }}
                  >
                    {role.type}
                  </span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Education */}
        <FadeUp delay={0.3} className="mt-14">
          <Chip text="Education" />
          <div
            className="mt-6 p-8 rounded-2xl"
            style={{
              background: "rgba(12,17,40,0.85)",
              border: "1px solid rgba(124,92,252,0.1)",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
              <div>
                <p
                  className="text-[10px] tracking-widest text-violet-400/60 mb-2"
                  style={{ fontFamily: MONO }}
                >
                  B.TECH · COMPUTER SCIENCE & ENGINEERING
                </p>
                <h3
                  className="text-xl font-black text-white"
                  style={{ fontFamily: DISPLAY }}
                >
                  Malla Reddy College of Engineering
                </h3>
                <p className="text-sm text-white/40 mt-1">Hyderabad, India</p>
              </div>
              <div className="sm:text-right space-y-1">
                <p className="text-lg font-black" style={{ color: "#7c5cfc" }}>7.86 / 10</p>
                <p className="text-xs text-white/30" style={{ fontFamily: MONO }}>2022 – 2026</p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Achievements */}
        <FadeUp delay={0.4} className="mt-8">
          <div
            className="p-8 rounded-2xl space-y-5"
            style={{
              background: "rgba(12,17,40,0.85)",
              border: "1px solid rgba(124,92,252,0.1)",
            }}
          >
            <p
              className="text-[10px] tracking-widest text-violet-400/60"
              style={{ fontFamily: MONO }}
            >
              ACHIEVEMENTS
            </p>
            {achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ background: "#7c5cfc", boxShadow: "0 0 6px #7c5cfc80" }}
                />
                <p className="text-sm text-white/55 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Currently Building ────────────────────────────────────────────────────────
function CurrentlyBuildingSection() {
  const tags = [
    "AI Products",
    "Product Discovery",
    "UX",
    "Experimentation",
    "Product Strategy",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div
            className="p-10 md:p-16 rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,92,252,0.07), rgba(167,139,250,0.03))",
              border: "1px solid rgba(124,92,252,0.2)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(124,92,252,0.15), transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />
            <p
              className="text-[10px] tracking-widest text-violet-400 mb-5"
              style={{ fontFamily: MONO }}
            >
              CURRENTLY BUILDING
            </p>
            <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed max-w-2xl mb-8">
              Learning by building AI-powered products, documenting product decisions, and developing stronger product thinking through real projects.
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="text-sm px-4 py-2 rounded-full font-medium"
                  style={{
                    color: "#c4b5fd",
                    background: "rgba(124,92,252,0.14)",
                    border: "1px solid rgba(124,92,252,0.28)",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section
      id="contact"
      className="py-44 px-6 text-center relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050714 0%, #07091e 100%)" }}
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(124,92,252,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #050714 100%)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        <FadeUp>
          <Chip text="07 — Contact" />
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2
            className="font-black leading-none tracking-tighter text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(3.2rem,11vw,8.5rem)" }}
          >
            LET'S BUILD
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px rgba(167,139,250,0.38)",
                color: "transparent",
              }}
            >
              SOMETHING
            </span>
            <br />
            <span style={{ color: "#7c5cfc" }}>USEFUL.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-white/35 text-sm max-w-md mx-auto leading-relaxed">
            Open to entry-level opportunities in AI Product Management, Product Management, APM, and AI product roles.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/kowshik-borapureddy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider text-sm text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                fontFamily: MONO,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,92,252,0.45)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              LINKEDIN
              <ArrowUpRight
                size={15}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
            </a>
            <a
              href="mailto:kowshikborapureddy@gmail.com"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider text-sm text-white/70 hover:text-white transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: MONO,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,92,252,0.45)";
                e.currentTarget.style.background = "rgba(124,92,252,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Mail size={15} /> EMAIL
            </a>
            <a
              href="https://github.com/kowshikborapureddy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider text-sm text-white/70 hover:text-white transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: MONO,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,92,252,0.45)";
                e.currentTarget.style.background = "rgba(124,92,252,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              GITHUB <ExternalLink size={15} />
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function FooterSection() {
  return (
    <footer
      className="py-12 px-6"
      style={{ borderTop: "1px solid rgba(124,92,252,0.1)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div>
          <p
            className="font-black tracking-widest text-sm text-white"
            style={{ fontFamily: DISPLAY }}
          >
            KOWSHIK BORAPUREDDY
          </p>
          <p
            className="text-[10px] tracking-widest text-white/25 mt-1"
            style={{ fontFamily: MONO }}
          >
            AI PRODUCT MANAGEMENT · PRODUCT STRATEGY
          </p>
          <p className="text-xs text-white/18 mt-0.5" style={{ fontFamily: MONO }}>
            Visakhapatnam, India
          </p>
        </div>
        <p className="text-xs text-white/20" style={{ fontFamily: MONO }}>
          © 2026 KOWSHIK BORAPUREDDY
        </p>
      </div>
    </footer>
  );
}

// ─── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "#050714", color: "#e8e8f4", minHeight: "100vh" }}>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          <Navbar />
          <HeroSection />
          <AboutSection />
          <ProductThinkingSection />
          <SelectedWorkSection />
          <ToolkitSection />
          <CertificationsSection />
          <ExperienceSection />
          <CurrentlyBuildingSection />
          <ContactSection />
          <FooterSection />
        </motion.div>
      )}
    </div>
  );
}
