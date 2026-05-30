


import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate, motion, useMotionValue, useScroll,
  useSpring, useTransform,
} from "framer-motion";
import {
  ArrowRight, Bus, ClipboardList, GraduationCap,
  Play, Settings, Users,
} from "lucide-react";
import heroBg from "./assets/hero-school.png";

/* ══════════════════════════════════════════════════════════
   ARC GEOMETRY  (unchanged — preserved exactly)
══════════════════════════════════════════════════════════ */
const CX    = 68;
const CY    = 55;
const RX    = 25;
const RY    = 35;
const A0    = 163;
const A1    = 377;
const ASPAN = A1 - A0;
const FADE  = 0.10;
const toR   = d => (d * Math.PI) / 180;
const norm  = a => ((a % 360) + 360) % 360;

const FEATURES = [
  { label: "Teachers",   sub: "Empower Educators",      Icon: GraduationCap, pulse: 4.5, delay: 0.98 },
  { label: "Attendance", sub: "Track & Manage",         Icon: ClipboardList, pulse: 4.8, delay: 0.50 },
  { label: "Parents",    sub: "Stay Connected",         Icon: Users,         pulse: 5.0, delay: 1.14 },
  { label: "Transport",  sub: "Safe & Smart",           Icon: Bus,           pulse: 4.6, delay: 0.82 },
  { label: "Operations", sub: "Efficient & Integrated", Icon: Settings,      pulse: 4.3, delay: 0.66 },
];
const BASE_FRACS = [0.12, 0.31, 0.50, 0.69, 0.88];

/* ══════════════════════════════════════════════════════════
   GUIDE ARC  — upgraded with animated draw-in + extra glow
══════════════════════════════════════════════════════════ */
function GuideArc() {
  const a0r = toR(A0);
  const a1r = toR(norm(A1));

  const buildPath = (rx, ry) => {
    const sx = (CX + rx * Math.cos(a0r)).toFixed(3);
    const sy = (CY + ry * Math.sin(a0r)).toFixed(3);
    const ex = (CX + rx * Math.cos(a1r)).toFixed(3);
    const ey = (CY + ry * Math.sin(a1r)).toFixed(3);
    return `M ${sx} ${sy} A ${rx} ${ry} 0 0 0 ${ex} ${ey}`;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        zIndex: 3, pointerEvents: "none", overflow: "visible",
      }}
    >
      <defs>
        <filter id="arcGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.55" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="arcGlowOuter" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outermost atmospheric halo */}
      <path
        d={buildPath(RX + 8.5, RY + 6.5)}
        stroke="rgba(96,165,250,0.04)" strokeWidth="0.55" fill="none"
        filter="url(#arcGlowOuter)"
      />
      {/* Outer echo */}
      <path
        d={buildPath(RX + 4.5, RY + 3.5)}
        stroke="rgba(147,197,253,0.09)" strokeWidth="0.24" fill="none"
        strokeDasharray="1.2 6.5"
      />
      {/* Main ribbon — animated draw-in */}
      <motion.path
        d={buildPath(RX, RY)}
        stroke="rgba(147,197,253,0.26)" strokeWidth="0.32" fill="none"
        strokeDasharray="2.5 5.5"
        filter="url(#arcGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Inner whisper */}
      <path
        d={buildPath(RX - 3, RY - 2.5)}
        stroke="rgba(147,197,253,0.11)" strokeWidth="0.17" fill="none"
        strokeDasharray="1.8 4.5"
      />

      {/* Focal glow at school-building crown (upper arc midpoint) */}
      <motion.circle
        cx={CX + 0.5} cy={CY - RY - 1.5} r="2.5"
        fill="none" stroke="rgba(147,197,253,0.10)" strokeWidth="0.5"
        filter="url(#arcGlowOuter)"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0.5] }}
        transition={{ duration: 2.2, delay: 1.8, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURE NODE  — enhanced icon, rings, connector
══════════════════════════════════════════════════════════ */
function FeatureNode({ feature, baseFrac, beltOffset, show }) {
  const { label, sub, Icon, pulse, delay } = feature;
  const ent = useMotionValue(0);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(
      () => animate(ent, 1, { duration: 1.6, ease: [0.16, 1, 0.3, 1] }),
      delay * 1000,
    );
    return () => clearTimeout(t);
  }, [show]); // eslint-disable-line

  const left = useTransform(beltOffset, o => {
    const f = ((baseFrac + o) % 1 + 1) % 1;
    return `${CX + RX * Math.cos(toR(norm(A0 + f * ASPAN)))}%`;
  });
  const top = useTransform(beltOffset, o => {
    const f = ((baseFrac + o) % 1 + 1) % 1;
    return `${CY + RY * Math.sin(toR(norm(A0 + f * ASPAN)))}%`;
  });
  const opacity = useTransform([ent, beltOffset], ([e, o]) => {
    const f   = ((baseFrac + o) % 1 + 1) % 1;
    const vis = f < FADE ? f / FADE : f > 1 - FADE ? (1 - f) / FADE : 1;
    return e * vis * 0.92;
  });
  const scale = useTransform(beltOffset, o => {
    const f = ((baseFrac + o) % 1 + 1) % 1;
    return 0.88 + (1 - Math.abs(f - 0.5) * 2) * 0.12;
  });
  const filterStr = useTransform(beltOffset, o => {
    const f    = ((baseFrac + o) % 1 + 1) % 1;
    const edge = 1 - (f < FADE ? f / FADE : f > 1 - FADE ? (1 - f) / FADE : 1);
    return `blur(${Math.min(edge * 2.5, 2.5).toFixed(2)}px)`;
  });

  return (
    <motion.div
      style={{
        position: "absolute", left, top,
        translateX: "-50%", translateY: "-50%",
        opacity, scale, filter: filterStr,
        zIndex: 4, pointerEvents: "none", willChange: "transform, filter",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{ position: "relative" }}>
          {/* Expanding pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.7, 1], opacity: [0, 0.18, 0] }}
            transition={{ duration: pulse, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: -9, borderRadius: "50%",
              border: "1px solid rgba(147,197,253,0.32)",
            }}
          />
          {/* Breath ring */}
          <motion.div
            animate={{ scale: [1, 1.022, 1], opacity: [0.10, 0.22, 0.10] }}
            transition={{ duration: pulse * 0.68, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              border: "0.5px solid rgba(255,255,255,0.20)",
            }}
          />
          {/* Icon disc */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(59,130,246,0.09) 100%)",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow:
              "0 4px 22px rgba(0,0,0,0.28)," +
              "inset 0 1px 0 rgba(255,255,255,0.16)," +
              "0 0 16px rgba(147,197,253,0.14)",
          }}>
            <Icon size={13} color="rgba(255,255,255,0.87)" strokeWidth={1.5} />
          </div>
          {/* Connector thread + dot */}
          <div style={{
            position: "absolute", bottom: -11, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{
              width: 1, height: 8,
              background: "linear-gradient(180deg, rgba(147,197,253,0.45), transparent)",
            }} />
            <div style={{
              width: 3, height: 3, borderRadius: "50%",
              background: "rgba(147,197,253,0.58)",
              boxShadow: "0 0 6px rgba(147,197,253,0.42)",
            }} />
          </div>
        </div>
        {/* Label */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 1, marginTop: 9,
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: "0.54rem", letterSpacing: "0.10em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap",
            textShadow: "0 1px 8px rgba(0,0,0,0.65)",
          }}>{label}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: "0.44rem", letterSpacing: "0.05em",
            color: "rgba(147,197,253,0.62)", whiteSpace: "nowrap",
          }}>{sub}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   LIVE ACTIVITY CARD  — glassmorphic floating panel
══════════════════════════════════════════════════════════ */
function LiveActivityCard({ show }) {
  const [active, setActive] = useState(247);

  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => {
      setActive(v => Math.max(241, Math.min(259, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 3800);
    return () => clearInterval(id);
  }, [show]);

  const rows = [
    [String(active), "Schools Online"],
    ["1,847", "Students Active"],
    ["99.8%", "Platform Uptime"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 1.55, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        bottom: "clamp(72px,10vh,104px)",
        right: "clamp(20px,4vw,72px)",
        zIndex: 11, pointerEvents: "none",
        background:
          "linear-gradient(148deg," +
          "rgba(255,255,255,0.068) 0%," +
          "rgba(255,255,255,0.020) 100%)",
        border: "1px solid rgba(255,255,255,0.11)",
        borderRadius: 20,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding: "16px 20px 18px",
        boxShadow:
          "0 16px 56px rgba(0,0,0,0.32)," +
          "inset 0 1px 0 rgba(255,255,255,0.10)," +
          "inset 0 -1px 0 rgba(0,0,0,0.08)",
        minWidth: 202,
      }}
    >
      {/* Top highlight edge */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)",
        borderRadius: "0 0 99px 99px",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 15 }}>
        <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 8, height: 8 }}>
          <motion.span
            animate={{ scale: [1, 2.2, 1], opacity: [0.65, 0, 0.65] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(52,211,153,0.44)",
            }}
          />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "block" }} />
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: "0.51rem", letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.36)",
        }}>Live Activity</span>
      </div>

      {/* Rows */}
      {rows.map(([val, lbl], i) => (
        <div
          key={lbl}
          style={{
            display: "flex", alignItems: "baseline",
            justifyContent: "space-between", gap: 20,
            paddingBottom: i < rows.length - 1 ? 11 : 0,
            marginBottom: i < rows.length - 1 ? 11 : 0,
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.065)" : "none",
          }}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
            fontSize: "1.08rem", letterSpacing: "-0.022em",
            color: "rgba(255,255,255,0.90)",
          }}>{val}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "0.47rem", letterSpacing: "0.10em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
            whiteSpace: "nowrap",
          }}>{lbl}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTON  — cursor-tracking elastic feel
══════════════════════════════════════════════════════════ */
function MagneticBtn({ primary, children }) {
  const ref = useRef(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy  = useSpring(my, { stiffness: 200, damping: 20 });

  const move = useCallback(e => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left - r.width  * 0.5) * 0.30);
    my.set((e.clientY - r.top  - r.height * 0.5) * 0.30);
  }, [mx, my]);

  const leave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  if (primary) {
    return (
      <motion.button
        ref={ref}
        onMouseMove={move}
        onMouseLeave={leave}
        whileHover={{
          scale: 1.028,
          boxShadow: "0 0 44px rgba(37,99,235,0.52), 0 0 14px rgba(37,99,235,0.26)",
        }}
        whileTap={{ scale: 0.972 }}
        style={{
          x: sx, y: sy,
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 24px", borderRadius: 99, cursor: "pointer",
          background: "linear-gradient(148deg, #1e3a8a 0%, #2563eb 58%, #3b82f6 100%)",
          border: "1px solid rgba(96,165,250,0.24)",
          boxShadow: "0 0 26px rgba(37,99,235,0.32), inset 0 1px 0 rgba(255,255,255,0.13)",
          color: "#fff", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, fontSize: "0.80rem", letterSpacing: "0.02em",
          whiteSpace: "nowrap", outline: "none",
        }}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      whileHover={{ scale: 1.028, backgroundColor: "rgba(255,255,255,0.055)" }}
      whileTap={{ scale: 0.972 }}
      style={{
        x: sx, y: sy,
        display: "flex", alignItems: "center", gap: 9,
        padding: "12px 20px", borderRadius: 99, cursor: "pointer",
        background: "rgba(255,255,255,0.028)",
        border: "1px solid rgba(255,255,255,0.13)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        color: "rgba(255,255,255,0.56)", fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400, fontSize: "0.80rem", letterSpacing: "0.02em",
        whiteSpace: "nowrap", outline: "none",
      }}
    >
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════
   ANIMATION HELPER
══════════════════════════════════════════════════════════ */
const rise = delay => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { delay, duration: 1.05, ease: [0.16, 1, 0.3, 1] },
});

/* ══════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════ */
export default function Hero() {
  const [show, setShow]   = useState(false);
  const heroRef           = useRef(null);
  const beltOffset        = useMotionValue(0);

  /* ── Mouse parallax ── */
  const rawMX = useMotionValue(0);
  const rawMY = useMotionValue(0);
  const sMX   = useSpring(rawMX, { stiffness: 55, damping: 30 });
  const sMY   = useSpring(rawMY, { stiffness: 55, damping: 30 });
  const bgX   = useTransform(sMX, [-1, 1], ["-2.2%", "2.2%"]);
  const bgY   = useTransform(sMY, [-1, 1], ["-1.4%", "1.4%"]);
  /* Floating card shifts more slowly (parallax depth) */
  const cardX = useTransform(sMX, [-1, 1], ["6px", "-6px"]);
  const cardY = useTransform(sMY, [-1, 1], ["4px", "-4px"]);

  /* ── Scroll parallax ── */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgScale    = useTransform(scrollYProgress, [0, 1], [1.04, 1.15]);
  const imgYScroll  = useTransform(scrollYProgress, [0, 1], ["0%",   "12%"]);
  const copyY       = useTransform(scrollYProgress, [0, 1], [0,      -52]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.52], [1,    0]);

  /* ── Init ── */
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 280);
    return () => clearTimeout(t);
  }, []);

  /* ── Belt animation (orbit) ── */
  useEffect(() => {
    if (!show) return;
    let raf;
    let last = performance.now();
    const SPEED = 0.00003;
    const tick  = now => {
      beltOffset.set((beltOffset.get() + SPEED * (now - last)) % 1);
      last = now;
      raf  = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, beltOffset]);

  /* ── Mouse handler ── */
  const handleMouseMove = useCallback(e => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawMX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    rawMY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2);
  }, [rawMX, rawMY]);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative", width: "100%",
        height: "100vh", minHeight: 580, overflow: "hidden",
        background: "#020b1e",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 0 — School image (parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          x: bgX, y: bgY,
          scale: imgScale,
          translateY: imgYScroll,
          willChange: "transform",
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 1 — Atmospheric grading stack
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Bottom vignette — deep */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background:
          "linear-gradient(180deg," +
          "rgba(2,11,30,0.52) 0%," +
          "rgba(2,11,30,0.22) 34%," +
          "rgba(2,11,30,0.14) 55%," +
          "rgba(2,11,30,0.78) 87%," +
          "rgba(2,11,30,0.97) 100%)",
      }} />
      {/* Left text panel shadow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background:
          "linear-gradient(103deg," +
          "rgba(2,11,30,0.78) 0%," +
          "rgba(2,11,30,0.44) 32%," +
          "transparent 58%)",
      }} />
      {/* Royal blue atmospheric top-right */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "68%",
        zIndex: 1, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 75% 52% at 73% -10%," +
          "rgba(29,78,216,0.22) 0%, transparent 65%)",
      }} />
      {/* Deep navy top-left anchor */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, width: "55%", height: "48%",
        zIndex: 1, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 65% 65% at 12% 0%," +
          "rgba(10,20,62,0.58) 0%, transparent 72%)",
      }} />
      {/* Cinematic light leak — upper right corner */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-8%", right: "-4%",
        width: "42%", height: "52%",
        zIndex: 1, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 82% 72% at 88% 8%," +
          "rgba(56,100,220,0.13) 0%, transparent 68%)",
      }} />
      {/* Horizon luminance band at building base */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "52%", left: "28%", right: 0,
        height: 1, zIndex: 2, pointerEvents: "none",
        background:
          "linear-gradient(90deg," +
          "transparent 0%," +
          "rgba(96,165,250,0.10) 25%," +
          "rgba(147,197,253,0.16) 52%," +
          "rgba(96,165,250,0.10) 78%," +
          "transparent 100%)",
      }} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 2 — Film grain (cinematic texture)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          /* SVG fractal noise rendered inline — zero network request */
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.76' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.027,
          mixBlendMode: "overlay",
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 3 — Arc orbit system
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <GuideArc />
      <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
        {FEATURES.map((f, i) => (
          <FeatureNode
            key={f.label}
            feature={f}
            baseFrac={BASE_FRACS[i]}
            beltOffset={beltOffset}
            show={show}
          />
        ))}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 10 — Hero copy (scroll-parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", justifyContent: "flex-start",
          paddingTop: "clamp(96px,17vh,156px)",
          paddingLeft: "clamp(24px,6vw,100px)",
          paddingRight: "2rem",
          maxWidth: "clamp(300px,44vw,580px)",
          y: copyY, opacity: copyOpacity,
          willChange: "transform, opacity",
          pointerEvents: "none",
        }}
      >
        {/* Eyebrow pill */}
        <motion.div
          {...rise(0.12)}
          style={{ display: "flex", alignItems: "center", marginBottom: 30 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background:
              "linear-gradient(138deg," +
              "rgba(37,99,235,0.15) 0%," +
              "rgba(147,197,253,0.07) 100%)",
            border: "1px solid rgba(147,197,253,0.18)",
            borderRadius: 99, padding: "5px 14px 5px 8px",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
          }}>
            {/* Pulsing dot */}
            <span style={{
              position: "relative", display: "flex", alignItems: "center",
              justifyContent: "center", width: 8, height: 8,
            }}>
              <motion.span
                animate={{ scale: [1, 2.4, 1], opacity: [0.60, 0, 0.60] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "rgba(147,197,253,0.40)",
                }}
              />
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "rgba(147,197,253,0.88)", display: "block",
              }} />
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: "0.57rem", letterSpacing: "0.24em",
              color: "rgba(147,197,253,0.75)", textTransform: "uppercase",
            }}>
              School Operating System
            </span>
          </div>
        </motion.div>

        {/* Headline — three-line editorial composition */}
        <div style={{ marginBottom: 26 }}>
          <motion.p
            {...rise(0.28)}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300, fontStyle: "italic",
              fontSize: "clamp(1.6rem,2.6vw,3.0rem)",
              lineHeight: 1.10, letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.42)",
              margin: 0, marginBottom: "0.10em",
            }}
          >
            One Platform.
          </motion.p>

          <motion.p
            {...rise(0.40)}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(2.8rem,5.0vw,6.2rem)",
              lineHeight: 0.96, letterSpacing: "-0.038em",
              background: "linear-gradient(118deg, #ffffff 12%, #bfdbfe 55%, #93c5fd 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0, marginBottom: "0.12em",
            }}
          >
            One Flow.
          </motion.p>

          <motion.p
            {...rise(0.52)}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              fontSize: "clamp(1.6rem,2.6vw,3.0rem)",
              lineHeight: 1.12, letterSpacing: "-0.014em",
              color: "rgba(255,255,255,0.87)",
              margin: 0,
            }}
          >
            One School<br />Ecosystem.
          </motion.p>
        </div>

        {/* Sub copy */}
        <motion.p
          {...rise(0.64)}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: "clamp(0.78rem,0.92vw,0.90rem)", lineHeight: 1.86,
            color: "rgba(255,255,255,0.38)", maxWidth: "27ch",
            letterSpacing: "0.01em", margin: 0, marginBottom: 40,
          }}
        >
          An intelligent operating system that connects every part of your school — seamlessly.
        </motion.p>

        {/* CTAs (pointer-events re-enabled inside) */}
        <motion.div
          {...rise(0.76)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 48, flexWrap: "wrap",
            pointerEvents: "auto",
          }}
        >
          <MagneticBtn primary>
            Get Started <ArrowRight size={12} strokeWidth={2.2} />
          </MagneticBtn>
          <MagneticBtn>
            <span style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 19, height: 19, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.05)", flexShrink: 0,
            }}>
              <Play size={6} fill="rgba(255,255,255,0.65)" strokeWidth={0} style={{ marginLeft: 1 }} />
            </span>
            Watch Film
          </MagneticBtn>
        </motion.div>

        {/* Metrics row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 1.2 }}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          {[["500+", "Schools"], ["98%", "Retention"], ["25L+", "Users"]].map(([val, lbl], i) => (
            <div key={lbl} style={{ display: "flex", alignItems: "stretch" }}>
              {i > 0 && (
                <div style={{
                  width: 1, alignSelf: "stretch", margin: "0 20px",
                  background: "rgba(255,255,255,0.08)",
                }} />
              )}
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
                  fontSize: "clamp(1.0rem,1.65vw,1.36rem)", letterSpacing: "-0.025em",
                  color: "rgba(255,255,255,0.90)", lineHeight: 1.05,
                }}>{val}</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: "0.50rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.27)",
                  marginTop: 5,
                }}>{lbl}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 11 — Live Activity Card (depth parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div style={{ x: cardX, y: cardY }}>
        <LiveActivityCard show={show} />
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 12 — Scroll indicator
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        style={{
          position: "absolute", bottom: 22, left: 0, right: 0, zIndex: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(24px,6vw,100px)", pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <div style={{
            position: "relative", width: 1, height: 28,
            background: "rgba(255,255,255,0.08)", overflow: "hidden",
          }}>
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.75, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "38%",
                background: "rgba(147,197,253,0.44)",
              }}
            />
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "0.46rem", letterSpacing: "0.24em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.18)",
          }}>Scroll</span>
        </div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: "0.46rem", letterSpacing: "0.22em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.15)",
        }}>
          Intelligent · Connected · Future Ready
        </span>
      </motion.div>
    </section>
  );
}