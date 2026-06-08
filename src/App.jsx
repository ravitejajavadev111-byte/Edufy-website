// App.jsx — Edufy Phase 2 Production Build
// All Phase 1 diagnostic fixes applied.

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin"; // FIX 1.6: added
import * as Icons from "@phosphor-icons/react";
import Hero from "./Hero";
import "./index.css";

// ─── GSAP Bootstrap ─────────────────────────────────────────────────────────
// FIX 4.5: Strict initialization sequence.
//   1. Register both plugins in a single call.
//   2. iOS normalizeScroll BEFORE any ScrollTrigger.create().
//   3. --vh setter + resize handler (ScrollTrigger.refresh) consolidated
//      into one passive listener — no duplicate handlers from components.

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if (typeof window !== "undefined") {
  // FIX 1.4: normalizeScroll prevents iOS rubber-band overscroll
  // from corrupting progress below 0 or above 1.
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isIOS) ScrollTrigger.normalizeScroll(true);

  // FIX 1.2: --vh fallback for browsers without dvh support.
  const setVH = () =>
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  setVH();

  // FIX 1.5: ScrollTrigger.refresh() on resize — one consolidated
  //          passive listener rather than per-component handlers.
  const onResize = () => {
    setVH();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize, { passive: true });
}

// ─── Data — Modules ──────────────────────────────────────────────────────────
const MODULES = [
  {
    title: "Smart Attendance",
    badge: "Core",
    eyebrow: "Daily Operations",
    headline: "Mark attendance in one tap. Know who's absent before class ends.",
    desc: "Automated alerts reach parents the moment a student is marked absent. Teachers reclaim 41 minutes every single day — no spreadsheets, no register.",
    features: ["1-tap per class", "Auto parent alerts", "Offline sync", "Biometric ready"],
    stat: "41 min",
    statLabel: "saved per teacher, per day",
    image: "/assets/parent-attendance.png",
    accent: "#F59E0B",
  },
  {
    title: "Exams & Results",
    badge: "Academic",
    eyebrow: "Academic Intelligence",
    headline: "Report cards for 1,200 students — generated in 4 minutes.",
    desc: "Supports CBSE, ICSE and all major state boards. Build grade structures once. Generate, review, and publish in bulk with one click.",
    features: ["All board formats", "Bulk PDF export", "Remark templates", "Parent delivery"],
    stat: "4 min",
    statLabel: "for 1,200 report cards",
    image: "/assets/parent-reports.png",
    accent: "#A78BFA",
  },
  {
    title: "Fee Management",
    badge: "Finance",
    eyebrow: "Financial Intelligence",
    headline: "Collect fees online, offline, and everywhere in between.",
    desc: "UPI, Razorpay, HDFC, ICICI — all gateways unified. Automated reminders. Native Tally sync. Reconcile in minutes, not days.",
    features: ["All payment modes", "Auto reminders", "Tally sync", "Real-time reports"],
    stat: "₹2.1L",
    statLabel: "recovered in month one",
    image: "/assets/parent-home.png",
    accent: "#10B981",
  },
  {
    title: "Live Transport",
    badge: "Safety",
    eyebrow: "Student Safety",
    headline: "Every parent knows exactly where their child's bus is.",
    desc: "Real-time GPS with geofence alerts. Parents are notified when the bus is 5 minutes away. Zero phone calls to the school office.",
    features: ["Real-time GPS", "Arrival alerts", "Geofence zones", "Driver SOS"],
    stat: "0",
    statLabel: "transport enquiry calls",
    image: "/assets/parent-home.png",
    accent: "#F87171",
  },
  {
    title: "Notice Board",
    badge: "Comms",
    eyebrow: "School Communication",
    headline: "Reach every parent in seconds — with proof they read it.",
    desc: "Targeted broadcasts to specific classes or the whole school. Read receipts. Two-way replies. Professional at scale — no WhatsApp chaos.",
    features: ["Targeted groups", "Read receipts", "Two-way replies", "Scheduled sends"],
    stat: "3×",
    statLabel: "faster than WhatsApp groups",
    image: "/assets/parent-home.png",
    accent: "#38BDF8",
  },
];

// ─── Data — FAQs ─────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How long does setup actually take?",
    a: "Most schools are fully live within 48 hours of signing up. Our onboarding team handles the data import, and we run a free training session for your staff.",
  },
  {
    q: "Is our data secure? Where is it stored?",
    a: "All data is stored on ISO 27001-certified servers located in India. We are PDPB compliant and SOC 2 Type II certified. Your student data never leaves Indian soil.",
  },
  {
    q: "What happens when the free trial ends?",
    a: "We'll reach out before your trial ends. Plans start at ₹4,999/month per school — no per-student fees, no hidden costs. If Edufy isn't the right fit, we export your data cleanly.",
  },
  {
    q: "Do you support state board formats for report cards?",
    a: "Yes. Edufy supports CBSE, ICSE, and all major state board formats. We configure these for you during onboarding.",
  },
  {
    q: "Can we use Edufy offline?",
    a: "Yes. Attendance marking and a read-only view of critical data works offline. Data syncs automatically when connectivity is restored — built for Indian infrastructure realities.",
  },
];

// ─── Data — Deployment steps ─────────────────────────────────────────────────
const DEPLOYMENT_STEPS = [
  {
    step: "01",
    title: "Setup your school",
    time: "2 hours",
    desc: "A dedicated coordinator guides you through data import, staff training, and configuration — remotely with zero disruption.",
  },
  {
    step: "02",
    title: "Train your staff",
    time: "1 session",
    desc: "One free live training session for teachers and admin. If your staff can use WhatsApp, they can run Edufy.",
  },
  {
    step: "03",
    title: "Go live, Day 1",
    time: "Day 1",
    desc: "Enable parent notifications, mark attendance, and collect fees online. Most schools see time savings from day one.",
  },
];

// ─── Data — Partnership tiers ─────────────────────────────────────────────────
const PARTNERSHIP_TIERS = [
  {
    name: "Self Managed",
    description: "Your team runs Edufy independently with full platform access.",
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Managed Operations",
    description: "Edufy's ops team handles daily management and parent communication.",
    cta: "Book a Demo",
    featured: true,
    featuredLabel: "Most popular",
  },
  {
    name: "Enterprise",
    description: "Dedicated success manager, custom workflows, and multi-campus governance.",
    cta: "Contact Sales",
    featured: false,
  },
];

// ─── Design Token Object ──────────────────────────────────────────────────────
// FIX 4.1: T is a direct mirror of :root — no divergence.
//           Single canonical blue (#2563eb). violet added.
//           --font-body / --font-display references purged.
const T = {
  // Surfaces
  white:     "#ffffff",
  snow:      "#f8fafc",
  ice:       "#f1f5f9",
  frost:     "#e2e8f0",
  sky:       "#eff6ff",
  skyDeep:   "#dbeafe",
  // Brand — canonical
  blue:      "#2563eb",
  blueDark:  "#1d4ed8",
  blueLight: "#3b82f6",
  // Text
  ink:       "#0f172a",
  slate:     "#1e293b",
  mid:       "#475569",
  muted:     "#64748b",
  dim:       "#94a3b8",
  // Accents
  green:     "#10b981",
  coral:     "#f87171",
  amber:     "#f59e0b",
  violet:    "#8b5cf6", // FIX 4.1: was missing from T
  // Typography — matches --fb / --fs in CSS
  sans:      "'DM Sans', system-ui, sans-serif",
  syne:      "'Syne', system-ui, sans-serif",
  // Shadows — prefer CSS vars; kept as fallback for inline styles
  sh:   "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
  shMd: "0 2px 8px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)",
};

// ─── Utility Components ───────────────────────────────────────────────────────

function Eyebrow({ children, light = false, ruleWidth = 22 }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: T.syne,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.20em",
        textTransform: "uppercase",
        color: light ? "rgba(147,197,253,0.72)" : T.blue,
        marginBottom: 20,
      }}
    >
      <span
        style={{
          display: "block",
          width: ruleWidth,
          height: 1,
          background: "currentColor",
          opacity: 0.7,
          borderRadius: 1,
        }}
      />
      {children}
      <span
        style={{
          display: "block",
          width: ruleWidth,
          height: 1,
          background: "currentColor",
          opacity: 0.7,
          borderRadius: 1,
        }}
      />
    </div>
  );
}

function Reveal({ children, delay = 0, dir = "up", className = "", style = {} }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cls =
    dir === "s" ? "rv-s" : dir === "r" ? "rv-r" : dir === "l" ? "rv-l" : "rv";

  return (
    <div
      ref={ref}
      className={`${cls} ${on ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

function Orb({ x, y, size = 480, color = "rgba(37,99,235,0.06)", blur = 110 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        transform: "translate(-50%,-50%)",
        zIndex: 0,
      }}
    />
  );
}

// FIX: Divider now uses the .divider CSS class (was inline style only).
function Divider() {
  return <div className="divider" />;
}

// ─── StickyBar ────────────────────────────────────────────────────────────────
// FIX 1.9: StickyBar is now rendered in App() — it was previously fully
//          implemented but never mounted, making it dead code.
function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className={`sticky-bar ${show ? "show" : ""}`} role="banner">
      <div className="sticky-bar-text">
        <div className="sticky-bar-title">Join 500+ schools</div>
        <div className="sticky-bar-sub">Start your free trial · No credit card</div>
      </div>
      <a href="#cta" className="sticky-bar-cta">
        Book free demo →
      </a>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
// FIX 1.10: "#how-it-works" → "#deployment" — no element with id="how-it-works"
//            exists. Changed to point at DeploymentModelsSection id="deployment".
function Nav() {
  const [sc, setSc] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setSc(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // FIX 1.10: #how-it-works → #deployment
  const links = [
    { label: "Platform",    href: "#platform-modules" },
    { label: "How it works", href: "#deployment" }, // FIX: was #how-it-works (broken)
    { label: "Deployment",  href: "#deployment" },
    { label: "FAQ",         href: "#faq" },
  ];

  return (
    <>
      <motion.header
        id="nav"
        className={sc ? "s" : ""}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <a href="#" className="nav-logo" style={{ textDecoration: "none" }}>
          <div className="nav-mark">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <polygon
                points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2"
                stroke={T.blue}
                strokeWidth="0.9"
                fill="none"
              />
              <circle cx="6.5" cy="6.5" r="1.5" fill={T.blue} />
            </svg>
          </div>
          <span className="nav-name">EDUFY</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            href="https://wa.me/919999999999?text=Hi%2C+I+want+to+learn+more+about+Edufy"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-wa"
          >
            <Icons.WhatsappLogo
              size={14}
              weight="fill"
              style={{ marginRight: 4, transform: "translateY(1px)" }}
            />
            WhatsApp
          </a>
          <a href="#cta" className="nav-cta">
            Book a demo →
          </a>
          <button
            className={`nav-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="mobile-nav-link"
                onClick={close}
              >
                {l.label}
              </a>
            ))}
            <div className="mobile-nav-ctas">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-wa"
                onClick={close}
              >
                💬 Chat on WhatsApp
              </a>
              <a href="#cta" className="mobile-nav-demo" onClick={close}>
                Book a free demo →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// ─── ModulesCinematic — Dual-Mode Wrapper ─────────────────────────────────────
// FIX 4.6: Hard conditional split. A matchMedia listener determines mode
//           at mount and on resize. No shared code path between desktop and
//           mobile. Mobile path has zero GSAP dependency.
function ModulesCinematic() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 968 : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 968px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile ? <ModulesMobileCarousel /> : <ModulesDesktopCinematic />;
}

// ─── ModulesMobileCarousel ────────────────────────────────────────────────────
// Zero GSAP. Native scroll-snap. IntersectionObserver drives activeIdx.
// Clean, accessible, zero animation budget consumed.
function ModulesMobileCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = carousel.querySelectorAll(".pms-mobile-card");
    if (!cards.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActiveIdx(Number(e.target.dataset.index));
          }
        });
      },
      { threshold: 0.6, root: carousel }
    );

    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const mod = MODULES[activeIdx];

  const scrollToCard = (i) => {
    const card = carouselRef.current?.querySelector(
      `[data-index="${i}"]`
    );
    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <section
      className="pms-sec"
      id="platform-modules"
      aria-label="Platform modules"
    >
      {/* Environmental atmosphere */}
      <div className="pms-environmental-glow" aria-hidden="true">
        <div className="pms-glow-orb pms-glow-left" />
        <div className="pms-glow-orb pms-glow-right" />
      </div>

      <div style={{ width: "100%", position: "relative", zIndex: 2 }}>
        {/* Active module title overlay */}
        <div className="pms-mobile-title-overlay" aria-live="polite">
          <span
            className="pms-mobile-dot-indicator"
            style={{ background: mod.accent }}
            aria-hidden="true"
          />
          {mod.title}
        </div>

        {/* Native scroll-snap carousel */}
        <div
          ref={carouselRef}
          className="pms-mobile-carousel"
          role="region"
          aria-label="Module cards"
        >
          {MODULES.map((m, i) => (
            <article
              key={i}
              className="pms-mobile-card"
              data-index={i}
              aria-label={m.title}
            >
              {/* Badge row */}
              <div className="pms-mobile-card-badge">
                <span
                  style={{
                    background: m.accent,
                    color: "#ffffff",
                    padding: "3px 12px",
                    borderRadius: "100px",
                    fontFamily: T.syne,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {m.badge}
                </span>
                <span
                  style={{
                    fontFamily: T.syne,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#64748b",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {m.eyebrow}
                </span>
              </div>

              <h2 className="pms-mobile-card-title">{m.title}</h2>
              <p className="pms-mobile-card-headline">{m.headline}</p>
              <p className="pms-mobile-card-desc">{m.desc}</p>

              <div className="pms-mobile-card-features">
                {m.features.map((feat) => (
                  <span
                    key={feat}
                    className="pms-mobile-card-tag"
                    style={{ color: m.accent, borderColor: `${m.accent}33` }}
                  >
                    {feat}
                  </span>
                ))}
              </div>

              <div className="pms-mobile-card-metric">
                <span
                  className="pms-mobile-card-stat"
                  style={{ color: m.accent }}
                >
                  {m.stat}
                </span>
                <span className="pms-mobile-card-stat-label">
                  {m.statLabel}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Dot navigation */}
        <div className="pms-mobile-dots" role="tablist" aria-label="Module navigation">
          {MODULES.map((m, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Go to ${m.title}`}
              className={`pms-dot ${i === activeIdx ? "active" : ""}`}
              style={i === activeIdx ? { background: mod.accent } : {}}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ModulesDesktopCinematic ──────────────────────────────────────────────────
function ModulesDesktopCinematic() {
  const wrapperRef = useRef(null); // Added: A stable parent for React to manage around the GSAP pin
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const rawProgressRef = useRef(0);
  const activIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  const numCards = MODULES.length;
  const mod = MODULES[activeIdx];

  // Detect reduced motion preference once at mount
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Helper: compute and apply 3D transform for a card given float progress
  const applyCardTransforms = useCallback((raw) => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - raw;
      const tx = offset * 280;
      const tz = Math.abs(offset) * -230;
      const rotY = offset * -32;
      const scale = 1 - Math.abs(offset) * 0.06;
      const opacity =
        Math.abs(offset) > 1.6
          ? 0
          : Math.max(1 - Math.abs(offset) * 0.85, 0);
      const blur = Math.min(Math.abs(offset) * 1.5, 4);

      card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = Math.round(10 - Math.abs(offset) * 4);
      card.style.filter = `blur(${blur}px)`;
      card.style.pointerEvents = Math.abs(offset) < 0.4 ? "auto" : "none";
    });
  }, []);

  // Set initial card positions synchronously before first paint
  useLayoutEffect(() => {
    applyCardTransforms(0);
  }, [applyCardTransforms]);

  // GSAP ScrollTrigger setup (skipped if reduced motion)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    // FIX: Wrap inside gsap.context() and scope to the stable wrapperRef
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${numCards * 600}`,
        pin: true,
        scrub: 0.25,
        onUpdate: (self) => {
          const raw = self.progress * (numCards - 1);
          rawProgressRef.current = raw;

          // Direct DOM mutation
          applyCardTransforms(raw);

          // React state update ONLY when the active module changes
          const newIdx = Math.min(
            Math.max(Math.round(raw), 0),
            numCards - 1
          );
          if (newIdx !== activIdxRef.current) {
            activIdxRef.current = newIdx;
            setActiveIdx(newIdx);
          }
        },
      });
    }, wrapperRef);

    // FIX: Revert completely unwraps the GSAP pin-spacer safely
    return () => ctx.revert();
  }, [numCards, prefersReducedMotion, applyCardTransforms]);

  const jumpTo = useCallback(
    (targetIndex) => {
      if (prefersReducedMotion) {
        // Reduced motion: instant state switch, no scroll animation
        const clamped = Math.min(Math.max(targetIndex, 0), numCards - 1);
        activIdxRef.current = clamped;
        setActiveIdx(clamped);
        applyCardTransforms(clamped);
        return;
      }

      const triggerInstance = ScrollTrigger.getAll().find(
        (st) => st.trigger === sectionRef.current
      );
      if (!triggerInstance) return;

      const targetScrollPos =
        triggerInstance.start +
        (targetIndex / (numCards - 1)) *
          (triggerInstance.end - triggerInstance.start);

      gsap.to(window, {
        scrollTo: targetScrollPos,
        duration: 0.6,
        ease: "power2.inOut",
      });
    },
    [numCards, prefersReducedMotion, applyCardTransforms]
  );

  // Touch swipe handlers (desktop fallback for touch-enabled laptops)
  const touchStartRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (touchStartRef.current === null) return;
      const diff = touchStartRef.current - e.touches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) jumpTo(Math.min(activIdxRef.current + 1, numCards - 1));
        else jumpTo(Math.max(activIdxRef.current - 1, 0));
        touchStartRef.current = null;
      }
    },
    [jumpTo, numCards]
  );

  // ── Reduced-motion static tab layout ──────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <section
        ref={sectionRef}
        className="pms-sec"
        id="platform-modules"
        aria-label="Platform modules"
      >
        <div className="pms-environmental-glow" aria-hidden="true">
          <div className="pms-glow-orb pms-glow-left" />
          <div className="pms-glow-orb pms-glow-right" />
        </div>

        <div className="pms-container">
          <div className="pms-left-panel">
            <div className="pms-section-label">
              <span className="pms-section-dot" aria-hidden="true" />
              <span>Platform Modules</span>
            </div>

            {/* Static tab content — no AnimatePresence */}
            <div className="pms-text-viewport-box">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ background: mod.accent, color: "#ffffff", padding: "3px 12px", borderRadius: "100px", fontFamily: T.syne, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
                  {mod.badge}
                </span>
                <span style={{ fontFamily: T.syne, fontSize: "0.7rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {mod.eyebrow}
                </span>
              </div>
              <h2 className="pms-module-title">{mod.title}</h2>
              <h4 className="pms-headline">{mod.headline}</h4>
              <p className="pms-desc">{mod.desc}</p>
              <div className="pms-features-wrapper">
                {mod.features.map((feat) => (
                  <span key={feat} className="pms-feature-tag" style={{ color: mod.accent, borderColor: `${mod.accent}33` }}>
                    {feat}
                  </span>
                ))}
              </div>
              <div className="pms-metric-container">
                <span className="pms-metric-value" style={{ color: mod.accent }}>{mod.stat}</span>
                <span className="pms-metric-label">{mod.statLabel}</span>
              </div>
            </div>

            <div
              className="pms-controls-row"
              style={{ "--module-accent": mod.accent }}
            >
              <div className="pms-arrow-group">
                <button
                  onClick={() => jumpTo(Math.max(activeIdx - 1, 0))}
                  disabled={activeIdx === 0}
                  className="pms-arrow-btn"
                  style={{ opacity: activeIdx === 0 ? 0.3 : 1 }}
                  aria-label="Previous module"
                >
                  <Icons.ArrowLeft size={20} weight="bold" />
                </button>
                <button
                  onClick={() => jumpTo(Math.min(activeIdx + 1, MODULES.length - 1))}
                  disabled={activeIdx === MODULES.length - 1}
                  className="pms-arrow-btn"
                  style={{ opacity: activeIdx === MODULES.length - 1 ? 0.3 : 1 }}
                  aria-label="Next module"
                >
                  <Icons.ArrowRight size={20} weight="bold" />
                </button>
              </div>
              <div className="pms-indicator-dots" role="tablist">
                {MODULES.map((m, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeIdx}
                    onClick={() => jumpTo(i)}
                    className={`pms-dot ${i === activeIdx ? "active" : ""}`}
                    style={i === activeIdx ? { background: mod.accent } : {}}
                    aria-label={`Go to ${m.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pms-right-stage">
            <div className="pms-spatial-canvas">
              <div
                ref={(el) => (cardRefs.current[activeIdx] = el)}
                className="pms-cinematic-card is-active"
                style={{ transform: "none", opacity: 1 }}
              >
                <div className="pms-card-sheen" />
                <img src={mod.image} alt={mod.title} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Full GSAP 3D cinematic layout ─────────────────────────────────────────
  return (
    // FIX: This wrapper div provides a stable parent for React
    <div ref={wrapperRef} style={{ width: "100%", position: "relative" }}>
      <section
        ref={sectionRef}
        className="pms-sec"
        id="platform-modules"
        aria-label="Platform modules"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Environmental atmosphere */}
        <div className="pms-environmental-glow" aria-hidden="true">
          <div className="pms-glow-orb pms-glow-left" />
          <div className="pms-glow-orb pms-glow-right" />
        </div>

        <div className="pms-container">
          {/* Left text panel — desktop only */}
          <div className="pms-left-panel">
            <div className="pms-section-label">
              <span className="pms-section-dot" aria-hidden="true" />
              <span>Platform Modules</span>
            </div>

            <div className="pms-text-viewport-box">
              {/* FIX: Removed mode="wait" to prevent rapid scrubbing crash */}
              <AnimatePresence>
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  // FIX: Added position absolute on exit to prevent layout jumps
                  exit={{ opacity: 0, x: 16, filter: "blur(4px)", position: "absolute" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        background: mod.accent,
                        color: "#ffffff",
                        padding: "3px 12px",
                        borderRadius: "100px",
                        fontFamily: T.syne,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {mod.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: T.syne,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#64748b",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {mod.eyebrow}
                    </span>
                  </div>

                  <h2 className="pms-module-title">{mod.title}</h2>
                  <h4 className="pms-headline">{mod.headline}</h4>
                  <p className="pms-desc">{mod.desc}</p>

                  <div className="pms-features-wrapper">
                    {mod.features.map((feat) => (
                      <span
                        key={feat}
                        className="pms-feature-tag"
                        style={{
                          color: mod.accent,
                          borderColor: `${mod.accent}33`,
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="pms-metric-container">
                    <span
                      className="pms-metric-value"
                      style={{ color: mod.accent }}
                    >
                      {mod.stat}
                    </span>
                    <span className="pms-metric-label">{mod.statLabel}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              className="pms-controls-row"
              style={{ "--module-accent": mod.accent }}
            >
              <div className="pms-arrow-group">
                <button
                  onClick={() => jumpTo(Math.max(activeIdx - 1, 0))}
                  disabled={activeIdx === 0}
                  className="pms-arrow-btn"
                  style={{ opacity: activeIdx === 0 ? 0.3 : 1 }}
                  aria-label="Previous module"
                >
                  <Icons.ArrowLeft size={20} weight="bold" />
                </button>
                <button
                  onClick={() =>
                    jumpTo(Math.min(activeIdx + 1, MODULES.length - 1))
                  }
                  disabled={activeIdx === MODULES.length - 1}
                  className="pms-arrow-btn"
                  style={{
                    opacity: activeIdx === MODULES.length - 1 ? 0.3 : 1,
                  }}
                  aria-label="Next module"
                >
                  <Icons.ArrowRight size={20} weight="bold" />
                </button>
              </div>
              <div className="pms-indicator-dots" role="tablist">
                {MODULES.map((m, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeIdx}
                    onClick={() => jumpTo(i)}
                    className={`pms-dot ${i === activeIdx ? "active" : ""}`}
                    style={i === activeIdx ? { background: mod.accent } : {}}
                    aria-label={`Go to ${m.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right 3D theater stage */}
          <div className="pms-right-stage">
            <div
              className="pms-mobile-title-overlay"
              aria-live="polite"
            >
              <span
                className="pms-mobile-dot-indicator"
                style={{ background: mod.accent }}
                aria-hidden="true"
              />
              {mod.title}
            </div>

            <div className="pms-stage-mask pms-stage-mask-left" aria-hidden="true" />
            <div className="pms-stage-mask pms-stage-mask-right" aria-hidden="true" />

            <div className="pms-spatial-canvas">
              {MODULES.map((m, i) => (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={`pms-cinematic-card ${i === activeIdx ? "is-active" : ""}`}
                  onClick={() => jumpTo(i)}
                  aria-label={`View ${m.title}`}
                  role="button"
                  tabIndex={Math.abs(i - activeIdx) <= 1 ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") jumpTo(i);
                  }}
                >
                  <div className="pms-card-sheen" aria-hidden="true" />
                  <img src={m.image} alt={m.title} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MidPageCTA ───────────────────────────────────────────────────────────────
function MidPageCTA() {
  return (
    <section
      className="mid-cta"
      aria-label="Call to action"
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          {/* FIX 2.6: h2 em is now styled via CSS: italic + white on dark bg */}
          <h2
            style={{
              fontFamily: T.syne,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}
          >
            Ready to transform your school?
          </h2>
          <p
            style={{
              fontFamily: T.sans,
              fontSize: "1rem",
              opacity: 0.9,
              marginBottom: 28,
            }}
          >
            Join 500+ schools who have simplified their operations. Start your
            free trial with zero commitment.
          </p>
          <a
            href="#cta"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 10,
              background: T.white,
              color: T.blue,
              fontWeight: 600,
              fontFamily: T.sans,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            Book a free demo →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── ImpactMetrics ─────────────────────────────────────────────────────────────
// FIX 2.5 + 4.3.5: Renamed from Testimonials — the section contained
//                   metrics, not testimonials.
// FIX 2.7: Icons.TrendUp does not exist in Phosphor. Replaced with explicit
//           component references — no string lookup, no Star fallback.
function ImpactMetrics() {
  const metrics = [
    {
      Icon: Icons.Clock,
      value: "80%",
      label: "Time Saved on Admin",
    },
    {
      Icon: Icons.FileText,
      value: "70%",
      label: "Paperwork Reduced",
    },
    {
      Icon: Icons.Users,
      value: "100%",
      label: "Parent Transparency",
    },
    {
      // FIX 2.7: CurrencyInr is the correct Phosphor icon for a financial metric.
      // Icons.TrendUp does not exist → was silently falling back to Icons.Star.
      Icon: Icons.CurrencyInr,
      value: "₹2.1L",
      label: "Recovered in month one",
    },
  ];

  return (
    <section
      className="impact-metrics"
      aria-label="Impact metrics"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          {/* FIX 2.6: em styled via CSS — italic + var(--blue) */}
          <h2
            style={{
              fontFamily: T.syne,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: T.ink,
              margin: "0 0 40px",
            }}
          >
            Measurable impact, <em>real results.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          {/* FIX 4.3.4: metrics-grid CSS class replaces inline gridTemplateColumns */}
          <div className="metrics-grid">
            {metrics.map(({ Icon, value, label }) => (
              <div
                key={label}
                style={{
                  background: T.white,
                  borderRadius: 14,
                  padding: "24px 16px",
                  border: `1px solid ${T.frost}`,
                  boxShadow: T.sh,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Icon size={28} weight="duotone" color={T.blue} />
                <div
                  style={{
                    fontFamily: T.syne,
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: T.ink,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.85rem",
                    color: T.muted,
                    textAlign: "center",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── DeploymentModelsSection ──────────────────────────────────────────────────
// FIX 4.3.4: Grid layouts extracted to CSS classes:
//   "repeat(3, 1fr)" inline → .deployment-steps-grid
//   "repeat(3, 1fr)" inline → .partnership-tiers-grid
//   Both classes have full 768px / 480px responsive breakpoints in CSS.
function DeploymentModelsSection() {
  return (
    <section
      id="deployment"
      style={{
        background: T.snow,
        padding: "var(--section-pad-y) var(--section-pad-x)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Reveal>
            <Eyebrow>How Edufy works with your school</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              style={{
                fontFamily: T.syne,
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: T.ink,
                margin: "0 0 14px",
              }}
            >
              From zero to operational in 48 hours.
            </h2>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: "0.9rem",
                color: T.muted,
                lineHeight: 1.65,
                maxWidth: "50ch",
                margin: "0 auto 48px",
              }}
            >
              A proven process designed to get your school up and running with
              zero disruption.
            </p>
          </Reveal>
        </div>

        {/* FIX 4.3.4: CSS class replaces inline gridTemplateColumns */}
        <div className="deployment-steps-grid">
          {DEPLOYMENT_STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 0.12} dir="s">
              <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div
                  className="cj-step-num-circle"
                  style={{
                    background:
                      "linear-gradient(145deg,#1D4ED8 0%,#2563EB 60%,#3B82F6 100%)",
                    boxShadow:
                      "0 0 0 3px rgba(37,99,235,0.08), 0 2px 8px rgba(37,99,235,0.18)",
                    margin: "0 auto 12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.syne,
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.white,
                    }}
                  >
                    {step.step}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: T.syne,
                    fontWeight: 700,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: T.blue,
                    marginBottom: 6,
                  }}
                >
                  {step.time}
                </div>
                <h3
                  style={{
                    fontFamily: T.syne,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: T.ink,
                    margin: "0 0 8px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.8rem",
                    color: T.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <h3
            style={{
              textAlign: "center",
              fontFamily: T.syne,
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              color: T.ink,
              marginBottom: 32,
            }}
          >
            Choose your level of partnership
          </h3>

          {/* FIX 4.3.4: CSS class replaces inline gridTemplateColumns */}
          <div className="partnership-tiers-grid">
            {PARTNERSHIP_TIERS.map((tier, i) => (
              <div
                key={i}
                style={{
                  background: tier.featured ? T.white : "transparent",
                  borderRadius: 14,
                  padding: "24px 20px",
                  border: tier.featured
                    ? `1px solid ${T.skyDeep}`
                    : "1px solid transparent",
                  boxShadow: tier.featured
                    ? "0 4px 16px rgba(37,99,235,0.08)"
                    : "none",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {tier.featuredLabel && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: T.blue,
                      color: T.white,
                      fontFamily: T.syne,
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "4px 12px",
                      borderRadius: 99,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tier.featuredLabel}
                  </div>
                )}
                <h4
                  style={{
                    fontFamily: T.syne,
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: T.ink,
                    marginBottom: 8,
                  }}
                >
                  {tier.name}
                </h4>
                <p
                  style={{
                    fontFamily: T.sans,
                    fontSize: "0.8rem",
                    color: T.muted,
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  {tier.description}
                </p>
                <a
                  href="#cta"
                  style={{
                    fontFamily: T.sans,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: tier.featured ? T.blue : T.mid,
                    textDecoration: "none",
                    borderBottom: tier.featured
                      ? `1px solid ${T.skyDeep}`
                      : "none",
                    paddingBottom: 2,
                  }}
                >
                  {tier.cta} →
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(20px, 3.5vw, 40px)",
              flexWrap: "wrap",
              marginTop: 44,
            }}
          >
            {[
              { Icon: Icons.RocketLaunch, title: "Go Live in 48 Hours",  sub: "Guaranteed" },
              { Icon: Icons.GraduationCap, title: "Free Staff Training", sub: "Included with every plan" },
              { Icon: Icons.ShieldCheck, title: "ISO 27001 Certified",   sub: "Data stored in India" },
              { Icon: Icons.ChatCircle, title: "6AM–10PM Support",       sub: "WhatsApp & email" },
            ].map(({ Icon, title, sub }) => (
              <div
                key={title}
                style={{ display: "flex", alignItems: "center", gap: 9 }}
              >
                <Icon size={20} weight="duotone" color={T.blue} />
                <div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: T.slate,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontFamily: T.sans,
                      fontWeight: 400,
                      fontSize: "0.72rem",
                      color: T.muted,
                    }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontFamily: T.sans,
              fontWeight: 400,
              fontSize: "0.75rem",
              color: T.dim,
            }}
          >
            No credit card required · Cancel anytime · Free data export
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section
      className="af-sec"
      id="faq"
      aria-label="Frequently Asked Questions"
      style={{ background: T.white, position: "relative", overflow: "hidden" }}
    >
      <div className="af-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="af-header">
          <div className="af-header-left">
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              {/* FIX 2.6: em styled via CSS — italic + var(--blue) */}
              <h2
                style={{
                  fontFamily: T.syne,
                  fontWeight: 700,
                  fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: T.ink,
                  margin: 0,
                }}
              >
                Questions
                <br />
                <em>answered.</em>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="af-header-right">
            <p
              style={{
                fontFamily: T.sans,
                fontSize: "0.85rem",
                color: T.muted,
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              Everything principals, finance heads, and IT coordinators ask
              before going live with Edufy.
            </p>
            <a
              href="#cta"
              style={{
                fontFamily: T.sans,
                fontSize: "0.82rem",
                fontWeight: 600,
                color: T.blue,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderBottom: `1px solid ${T.skyDeep}`,
                paddingBottom: 2,
              }}
            >
              Have a different question? → Talk to us
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.08} dir="s">
          <div
            style={{ display: "flex", flexDirection: "column", gap: 2 }}
            role="list"
          >
            {FAQS.map((f, i) => {
              const isActive = openIdx === i;
              return (
                <div
                  key={i}
                  role="listitem"
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    background: isActive
                      ? "rgba(37,99,235,0.02)"
                      : "transparent",
                    transition: "background 0.2s ease",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onClick={() => setOpenIdx(isActive ? null : i)}
                    aria-expanded={isActive}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    <span
                      style={{
                        fontFamily: T.syne,
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        color: isActive ? T.blue : "#cbd5e1",
                        minWidth: 22,
                        flexShrink: 0,
                        transition: "color 0.2s",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: T.sans,
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        color: T.ink,
                        flex: 1,
                        lineHeight: 1.4,
                      }}
                    >
                      {f.q}
                    </span>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: isActive ? T.blue : "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s, transform 0.2s",
                        transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M5 1V9M1 5H9"
                          stroke={isActive ? T.white : "#64748b"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    style={{
                      maxHeight: isActive ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 0 22px calc(52px - 2px)",
                        fontFamily: T.sans,
                        fontSize: "0.85rem",
                        color: T.mid,
                        lineHeight: 1.75,
                        borderLeft: isActive
                          ? `2px solid ${T.blue}`
                          : "2px solid transparent",
                      }}
                    >
                      {f.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  const [form, setForm] = useState({ school: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.school || !form.phone || form.phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: T.white,
    border: `1px solid ${T.frost}`,
    borderRadius: 10,
    color: T.ink,
    fontFamily: T.sans,
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontFamily: T.syne,
    fontSize: "0.58rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: T.muted,
    marginBottom: 7,
  };

  return (
    <section
      id="cta"
      style={{
        background: "linear-gradient(165deg,#f8fafc 0%,#ffffff 100%)",
        padding: "var(--section-pad-y) var(--section-pad-x)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Orb x="20%" y="30%" size={500} color="rgba(37,99,235,0.04)" blur={130} />
      <Orb x="80%" y="70%" size={400} color="rgba(99,102,241,0.03)" blur={120} />

      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <Reveal>
          <Eyebrow ruleWidth={32}>Start Your Free Trial</Eyebrow>
          {/* FIX 2.6: em styled via CSS — italic + var(--blue) on light bg */}
          <h2
            style={{
              fontFamily: T.syne,
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: T.ink,
              margin: "0 0 12px",
            }}
          >
            Your school deserves
            <br />
            <em>better software.</em>
          </h2>
          <p
            style={{
              fontFamily: T.sans,
              fontSize: "0.92rem",
              color: T.muted,
              lineHeight: 1.7,
              margin: "0 0 28px",
            }}
          >
            Join 500+ schools · Go live in 48 hours · No credit card required
          </p>

          {!sent ? (
            <div
              style={{
                background: T.white,
                border: `1px solid ${T.frost}`,
                borderRadius: 16,
                padding: "28px 26px",
                boxShadow: T.shMd,
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label htmlFor="cta-school" style={labelStyle}>
                    School Name
                  </label>
                  <input
                    id="cta-school"
                    style={inputStyle}
                    placeholder="DPS Hyderabad"
                    value={form.school}
                    inputMode="text"
                    autoComplete="organization"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, school: e.target.value }))
                    }
                    onFocus={(e) => {
                      e.target.style.borderColor = T.blue;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(37,99,235,0.10)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = T.frost;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="cta-phone" style={labelStyle}>
                    WhatsApp Number
                  </label>
                  <input
                    id="cta-phone"
                    style={inputStyle}
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    inputMode="tel"
                    autoComplete="tel"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    onFocus={(e) => {
                      e.target.style.borderColor = T.blue;
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(37,99,235,0.10)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = T.frost;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
              <button
                disabled={loading}
                onClick={handleSubmit}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading
                    ? T.skyDeep
                    : `linear-gradient(148deg,${T.blueDark} 0%,${T.blue} 60%,${T.blueLight} 100%)`,
                  color: T.white,
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: T.sans,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.28)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  marginTop: 16,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(37,99,235,0.38)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(37,99,235,0.28)";
                  }
                }}
              >
                {loading ? "Sending…" : "Book My Free Demo →"}
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "28px 24px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                boxShadow: T.sh,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6.5 11.5L13 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: T.sans,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#15803d",
                }}
              >
                We'll WhatsApp you within 2 hours.
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
// FIX 3.4 + 4.3.4: footer-grid CSS class replaces inline gridTemplateColumns.
//                   Breakpoints in CSS: 2-col at 768px, 1-col at 480px.
// FIX 2.4:          footer-col-title CSS class enforces 11px min (was 8px).
function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Attendance",    href: "#platform-modules" },
        { label: "Fee Management", href: "#platform-modules" },
        { label: "Transport",     href: "#platform-modules" },
        { label: "Communication", href: "#platform-modules" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About",   href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center",      href: "#" },
        { label: "WhatsApp Support", href: "https://wa.me/919999999999" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "#f8fafc",
        color: T.mid,
        borderTop: `1px solid ${T.frost}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px var(--gutter) 32px",
        }}
      >
        {/* FIX 3.4: .footer-grid class has responsive breakpoints in CSS */}
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div className="nav-mark" style={{ width: 28, height: 28, borderRadius: 7 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <polygon
                    points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2"
                    stroke={T.blue}
                    strokeWidth="0.9"
                    fill="none"
                  />
                  <circle cx="6.5" cy="6.5" r="1.5" fill={T.blue} />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: T.syne,
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.17em",
                  color: T.slate,
                }}
              >
                EDUFY
              </span>
            </div>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: "12.5px",
                color: T.muted,
                lineHeight: 1.78,
                maxWidth: "270px",
              }}
            >
              Simplifying operations so educators can focus on what they came
              here to do — teaching.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              {/* FIX 2.4: .footer-col-title class enforces 11px min (was 8px inline) */}
              <div className="footer-col-title">{col.title}</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    style={{
                      fontFamily: T.sans,
                      fontSize: "12.5px",
                      color: T.muted,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = T.slate)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = T.muted)
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: T.frost,
            margin: "0 0 24px",
          }}
        />
        <span
          style={{
            fontFamily: T.sans,
            fontSize: "11px",
            color: T.dim,
          }}
        >
          © 2026 Edufy Technologies Pvt. Ltd.
        </span>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
// FIX 1.9: <StickyBar /> is now rendered — it was fully implemented but
//           never mounted, making it dead code that never showed on screen.
// FIX 2.5: <Testimonials /> renamed to <ImpactMetrics />.
export default function App() {
  return (
    <>
      <div id="noise" aria-hidden="true" />
      <StickyBar />        {/* FIX 1.9: was missing — now rendered */}
      <Nav />
      <Hero />
      <Divider />
      <ModulesCinematic />
      <Divider />
      <ImpactMetrics />   {/* FIX 4.3.5: renamed from Testimonials */}
      <Divider />
      <DeploymentModelsSection />
      <Divider />
      <FAQ />
      <Divider />
      <CTA />
      <Footer />
    </>
  );
}