// App.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

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
    accentRgb: "245,158,11",
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
    accentRgb: "167,139,250",
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
    accentRgb: "16,185,129",
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
    accentRgb: "248,113,113",
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
    accentRgb: "56,189,248",
  },
];

const RADIUS = 300;
const EXPO   = [0.16, 1, 0.3, 1];
const EASE_IN = [0.4, 0, 1, 1];

const FAQS = [
  {
    q: "How long does setup actually take?",
    a: "Most schools are fully live within 48 hours of signing up. Our onboarding team handles the data import, and we run a free training session for your staff. You don't need an IT department — if you can use a smartphone, you can run Edufy.",
  },
  {
    q: "Is our data secure? Where is it stored?",
    a: "All data is stored on ISO 27001-certified servers located in India. We are PDPB compliant and SOC 2 Type II certified. Your student data never leaves Indian soil, and we offer 256-bit AES encryption at rest and in transit.",
  },
  {
    q: "Do you support state board formats for report cards?",
    a: "Yes. Edufy supports CBSE, ICSE, and all major state board formats including UP Board, Maharashtra SSC, AP/Telangana, Karnataka, Tamil Nadu, and more. We configure these for you during onboarding.",
  },
  {
    q: "What happens when the free trial ends?",
    a: "We'll reach out before your trial ends to discuss next steps. There's no auto-charge. Plans start at ₹4,999/month per school — no per-student fees, no hidden costs. If Edufy isn't the right fit, we export your data cleanly.",
  },
  {
    q: "Can we use Edufy offline?",
    a: "Yes. Attendance marking and a read-only view of critical data works offline. Data syncs automatically when connectivity is restored — built for Indian infrastructure realities.",
  },
  {
    q: "Do you integrate with Tally and existing payment systems?",
    a: "We have a native Tally integration for fee accounting. We also support UPI, HDFC, ICICI, and Razorpay payment gateways. Custom payment API integration is available during onboarding.",
  },
  {
    q: "How does multi-campus management work?",
    a: "One Edufy account can manage unlimited campuses. The group admin sees consolidated reports across all schools, switches between campuses in one click, and sets campus-specific configurations independently.",
  },
  {
    q: "Do you provide training for teachers who aren't tech-savvy?",
    a: "Edufy feels like WhatsApp, not enterprise software. We run live video training, provide Hindi and regional language guides, and our support team is available 6 AM–10 PM IST via WhatsApp.",
  },
];

const TRANSFORMATION_PROOF = [
  { label: "Communication", before: "WhatsApp groups", after: "Unified platform" },
  { label: "Administration", before: "Paper registers", after: "Automated workflows" },
  { label: "Fees", before: "Manual tracking", after: "Online payments & reminders" },
  { label: "Parent Visibility", before: "Constant phone calls", after: "Real‑time GPS & reports" },
];

const DEPLOYMENT_STEPS = [
  { step: "01", title: "Discovery", desc: "We learn about your school's unique needs." },
  { step: "02", title: "Migration", desc: "Your data is imported securely, with zero downtime." },
  { step: "03", title: "Training", desc: "One live session for staff — they'll feel right at home." },
  { step: "04", title: "Go Live", desc: "Day one: attendance, fees, and communication are live." },
  { step: "05", title: "Support", desc: "6AM–10PM WhatsApp support, every day." },
];

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
    description: "Dedicated success manager, custom workflows, and multi‑campus governance.",
    cta: "Contact Sales",
    featured: false,
  },
];

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  white:     "#ffffff",
  snow:      "#f8fafc",
  ice:       "#f1f5f9",
  frost:     "#e2e8f0",
  sky:       "#eff6ff",
  skyDeep:   "#dbeafe",
  blue:      "#2563EB",
  blueDark:  "#1D4ED8",
  blueLight: "#3B82F6",
  ink:       "#0f172a",
  slate:     "#1e293b",
  mid:       "#475569",
  muted:     "#64748b",
  dim:       "#94a3b8",
  serif:     "'Cormorant Garamond', Georgia, serif",
  sans:      "'DM Sans', sans-serif",
  syne:      "'Syne', sans-serif",
  sh:        "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
  shMd:      "0 2px 8px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)",
  shBl:      "0 4px 24px rgba(37,99,235,0.12)",
  shFeat:    "0 0 0 1.5px #dbeafe, 0 8px 48px rgba(37,99,235,0.10)",
};

// ─── Utility Hooks ────────────────────────────────────────────────────────────

function useCount(end, ms = 2000, dec = 0) {
  const [n, setN] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !go) { setGo(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [go]);
  useEffect(() => {
    if (!go) return;
    let t0;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setN(parseFloat((end * e).toFixed(dec)));
      if (p < 1) requestAnimationFrame(tick);
      else setN(end);
    };
    requestAnimationFrame(tick);
  }, [go, end, ms, dec]);
  return [ref, n];
}

function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on];
}

// ─── Utility Components ───────────────────────────────────────────────────────

function Reveal({ children, delay = 0, dir = "up", className = "", style = {} }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const cls = dir === "s" ? "rv-s" : dir === "r" ? "rv-r" : dir === "l" ? "rv-l" : "rv";
  return (
    <div ref={ref} className={`${cls} ${on ? "on" : ""} ${className}`} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function CheckIcon({ color = "currentColor", size = 9 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path d="M1.5 4.5L3.5 6.5L7.5 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Orb({ x, y, size = 480, color = "rgba(37,99,235,0.06)", blur = 110 }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: color, filter: `blur(${blur}px)`,
      pointerEvents: "none", transform: "translate(-50%,-50%)", zIndex: 0,
    }} />
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e2e8f0 20%,#e2e8f0 80%,transparent)" }} />
  );
}

function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const rp   = useRef({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      const t = e.target;
      setHov(!!(t?.closest("button") || t?.closest("a") || t?.closest("[data-cursor]")));
    };
    let raf;
    const anim = () => {
      rp.current.x += (pos.current.x - rp.current.x) * 0.09;
      rp.current.y += (pos.current.y - rp.current.y) * 0.09;
      if (ring.current) { ring.current.style.left = rp.current.x + "px"; ring.current.style.top = rp.current.y + "px"; }
      raf = requestAnimationFrame(anim);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(anim);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div id="cd" ref={dot}  className={hov ? "hov" : ""} />
      <div id="cr" ref={ring} className={hov ? "hov" : ""} />
    </>
  );
}

// ─── Layout Components ────────────────────────────────────────────────────────

function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.35);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className={`sticky-bar ${show ? "show" : ""}`}>
      <div className="sticky-bar-text">
        <div className="sticky-bar-title">500+ schools trust Edufy</div>
        <div className="sticky-bar-sub">Free 30-day trial · No credit card</div>
      </div>
      <a href="#cta" className="sticky-bar-cta">Book free demo →</a>
    </div>
  );
}

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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const links = [
    { label: "Platform",     href: "#platform-modules" },
    { label: "How it works", href: "#how-it-works"      },
    { label: "Deployment",   href: "#deployment"        },
    { label: "FAQ",          href: "#faq"               },
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
              <polygon points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2" stroke="rgba(255,255,255,0.88)" strokeWidth="0.9" fill="none" />
              <circle cx="6.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
          <span className="nav-name">EDUFY</span>
        </a>
        <nav className="nav-links" style={{ display: "flex" }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <a href="https://wa.me/919999999999?text=Hi%2C+I+want+to+learn+more+about+Edufy" target="_blank" rel="noopener" className="nav-wa">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.524 5.848L0 24l6.336-1.502A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.359-.213-3.722.882.924-3.62-.234-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
            </svg>
            WhatsApp
          </a>
          <a href="#cta" className="nav-cta">Book a demo →</a>
          <button className={`nav-toggle ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-nav open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} className="mobile-nav-link" onClick={close}>{l.label}</a>
            ))}
            <div className="mobile-nav-ctas">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener" className="mobile-nav-wa" onClick={close}>💬 Chat on WhatsApp</a>
              <a href="#cta" className="mobile-nav-demo" onClick={close}>Book a free demo →</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CinematicJourney() {
  const steps = [
    {
      num: "01", title: "Setup your school", time: "2 hours",
      desc: "A dedicated coordinator guides you through data import, staff training, and configuration — remotely with zero disruption.",
      detail: ["Remote setup", "Dedicated coordinator", "Zero disruption"],
    },
    {
      num: "02", title: "Train your staff", time: "1 session",
      desc: "One free live training session for teachers and admin. If your staff can use WhatsApp, they can run Edufy.",
      detail: ["Live session", "Hindi support", "WhatsApp-level ease"],
    },
    {
      num: "03", title: "Go live, Day 1", time: "Day 1",
      desc: "Enable parent notifications, mark attendance, and collect fees online. Most schools see time savings from day one.",
      detail: ["Instant savings", "Full onboarding", "24/7 support"],
    },
  ];

  return (
    <section className="cj-sec" id="how-it-works" style={{ background: T.white, position: "relative", overflow: "hidden" }}>
      <div className="cj-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="cj-header">
          <Reveal className="cj-header-left">
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(2.2rem,4vw,3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: T.ink, margin: 0 }}>
              From <em>zero</em>
              <br />to operational
              <br />in 48 hours.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="cj-header-right">
            <p className="cj-sub" style={{ fontFamily: T.sans, color: T.muted, lineHeight: 1.65, fontSize: "0.9rem" }}>
              No IT department. No months of implementation. No chaos. Just a dedicated coordinator, one training session, and you're live.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 99, marginTop: 4,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
              <span style={{ fontFamily: T.sans, fontSize: "0.72rem", fontWeight: 500, color: "#15803d" }}>
                48-hour go-live guarantee — or we extend your trial free
              </span>
            </div>
          </Reveal>
        </div>

        <div className="cj-steps" style={{ position: "relative", marginTop: 8 }}>
          <div aria-hidden="true" style={{
            position: "absolute", top: "1.8rem",
            left: "calc(16.66% + 1.5rem)", right: "calc(16.66% + 1.5rem)",
            height: 1,
            background: "linear-gradient(90deg, rgba(37,99,235,0.08), rgba(37,99,235,0.12) 50%, rgba(37,99,235,0.08))",
            zIndex: 0,
          }} />
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.12} dir="s">
              <div className="cj-step" style={{
                position: "relative", zIndex: 1,
                background: "transparent", borderRadius: 0,
                padding: "0", boxShadow: "none",
                marginTop: i === 0 ? 0 : 0,
              }}>
                <div style={{ padding: "0 0 10px", borderBottom: "1px solid #e2e8f0" }}>
                  <div className="cj-step-num-wrap" style={{ marginBottom: 8 }}>
                    <div className="cj-step-num-circle" style={{
                      background: "linear-gradient(145deg,#1D4ED8 0%,#2563EB 60%,#3B82F6 100%)",
                      boxShadow: "0 0 0 3px rgba(37,99,235,0.08),0 2px 8px rgba(37,99,235,0.18)",
                    }}>
                      <span>{step.num}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.16em", textTransform: "uppercase", color: T.blue, marginTop: 2 }}>
                    {step.time}
                  </div>
                  <h3 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(1.25rem,2vw,1.6rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: T.ink, margin: "6px 0 8px" }}>
                    {step.title}
                  </h3>
                  <p className="cj-step-desc" style={{ fontFamily: T.sans, color: T.muted, lineHeight: 1.6, fontSize: "0.85rem", margin: "0 0 12px" }}>
                    {step.desc}
                  </p>
                  <div className="cj-step-pills">
                    {step.detail.map((d) => (
                      <span key={d} style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 9px", borderRadius: 99,
                        background: T.sky, border: `1px solid ${T.skyDeep}`,
                        fontFamily: T.syne, fontSize: "0.65rem", fontWeight: 700, color: T.blue,
                        textTransform: "uppercase", letterSpacing: "0.1em",
                      }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModulesCinematic() {
  const sectionRef = useRef(null);
  const rotatorRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const mod = MODULES[activeIdx];

  // scroll‑triggered orbit (unchanged)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const section  = sectionRef.current;
    const rotator  = rotatorRef.current;
    if (!section || !rotator) return;
    const numCards = MODULES.length;
    const angleStep = 360 / numCards;

    gsap.set(rotator, { transformStyle: "preserve-3d", rotateY: 0 });

    const tween = gsap.to(rotator, {
      rotateY: -360,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        scrub: 1.2,
        pin: true,
        end: "+=2200",
        pinSpacing: true,
        anticipatePin: 1,
        snap: { snapTo: [0, 0.2, 0.4, 0.6, 0.8, 1], duration: 0.35, ease: "power2.out" },
        onUpdate(self) {
          const totalRotation = self.progress * 120;
          let bestIdx = 0, bestDiff = 999;
          for (let i = 0; i < numCards; i++) {
            let cardAngle = ((i * angleStep - (totalRotation % 360) + 360) % 360);
            if (cardAngle > 180) cardAngle = 360 - cardAngle;
            if (cardAngle < bestDiff) { bestDiff = cardAngle; bestIdx = i; }
          }
          setActiveIdx(bestIdx);
        },
      },
    });

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  const contentV = {
    enter: (d) => ({ opacity: 0, y: d > 0 ? 22 : -22, filter: "blur(6px)" }),
    center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.52, ease: EXPO } },
    exit:   (d) => ({ opacity: 0, y: d > 0 ? -14 : 14, filter: "blur(3px)", transition: { duration: 0.28, ease: EASE_IN } }),
  };

  return (
    <>
      <section ref={sectionRef} className="pms-sec pms-desktop" id="platform-modules" style={{ background: T.white }}>
        <div className="pms-layout">
          <div className="pms-left" style={{ background: T.white }}>
            {/* Section identifier kept, but reduced visual weight */}
            <div className="pms-section-label">
              <span className="pms-section-dot" style={{ background: T.blue }} />
              <span style={{ fontFamily: T.syne, fontSize: "0.575rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: T.mid }}>
                Platform
              </span>
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`c-${activeIdx}`}
                className="pms-content"
                custom={dir}
                variants={contentV}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ background: T.white }}
              >
                {/* Product name as the main heading */}
                <h3 className="pms-module-title" style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)", letterSpacing: "-0.02em", color: T.ink, margin: "0 0 12px" }}>
                  {mod.title}
                </h3>

                {/* Single‑sentence description */}
                <motion.p
                  className="pms-desc"
                  style={{ color: T.muted, marginBottom: 20, fontSize: "0.85rem", lineHeight: 1.6 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.20, duration: 0.52 }}
                >
                  {mod.desc}
                </motion.p>

                {/* Key stat only */}
                <motion.div
                  className="pms-stat-block"
                  style={{ background: "transparent", border: "none", borderRadius: 0, padding: 0 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.44, ease: EXPO }}
                >
                  <span className="pms-stat-num" style={{ color: mod.accent }}>
                    {mod.stat}
                  </span>
                  <span className="pms-stat-lbl" style={{ color: T.mid }}>
                    {mod.statLabel}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <nav className="pms-nav-dots" aria-label="Module navigation">
              {MODULES.map((m, i) => (
                <button
                  key={i}
                  className={`pms-nav-dot${i === activeIdx ? " active" : ""}`}
                  style={i === activeIdx ? { "--acc": m.accent } : {}}
                  aria-label={`Module ${i + 1}: ${m.title}`}
                />
              ))}
              <span className="pms-nav-hint" style={{ color: T.dim }}>Scroll to explore</span>
            </nav>
          </div>

          {/* Right side – clean product photography */}
          <div className="pms-right" style={{ background: T.white }}>
            <div className="carousel-stage-wrap">
              <div className="carousel-stage">
                <div ref={rotatorRef} className="carousel-rotator">
                  {MODULES.map((modItem, i) => {
                    const angleDeg = (360 / MODULES.length) * i;
                    const isFront = i === activeIdx;
                    return (
                      <div
                        key={i}
                        className={`carousel-card${isFront ? " front" : ""}`}
                        style={{
                          transform: `rotateY(${angleDeg}deg) translateZ(${RADIUS}px)`,
                        }}
                      >
                        <div className="carousel-card-inner">
                          <img src={modItem.image} alt={modItem.title} loading="lazy" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="carousel-mask-l" />
                <div className="carousel-mask-r" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MobileModulesSwiper />
    </>
  );
}
function MobileModulesSwiper() {
  // unchanged
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 12 : 1;
      setActiveIdx(Math.min(Math.max(Math.round(track.scrollLeft / cardWidth), 0), MODULES.length - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 12 : 0;
    track.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="pms-sec pms-mobile" id="platform-modules-mob" style={{ background: T.white }}>
      <div className="pms-mobile-inner">
        <div className="pms-section-label" style={{ justifyContent: "center" }}>
          <span className="pms-section-dot" style={{ background: T.blue }} />
          <span style={{ fontFamily: T.syne, fontSize: "0.575rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: T.mid }}>Platform Modules</span>
        </div>
        <h2 className="pms-mobile-title" style={{ fontFamily: T.serif, color: T.ink }}>
          Every tool your school <em>actually needs.</em>
        </h2>
        <div className="mobile-modules-swiper">
          <div className="mobile-modules-track" ref={trackRef}>
            {MODULES.map((mod, i) => (
              <div key={i} className="mobile-module-card">
                <div className="mobile-module-card-img">
                  <img src={mod.image} alt={mod.title} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
          <div className="mobile-modules-dots">
            {MODULES.map((_, i) => (
              <button key={i} className={`mobile-modules-dot${i === activeIdx ? " active" : ""}`} onClick={() => scrollTo(i)} aria-label={`Module ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function TransformationImpact() {
  return (
    <section id="impact" style={{ background: T.snow, padding: "clamp(64px, 8vw, 80px) clamp(24px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 64px)" }}>
            <Eyebrow ruleWidth={28}>The impact is felt in weeks, not months.</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: T.ink, margin: 0 }}>
              From chaos to clarity.
            </h2>
          </div>
        </Reveal>

        {/* Dramatic Before / After Narrative */}
        <Reveal delay={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "clamp(24px, 4vw, 48px)", alignItems: "start", marginTop: "1rem" }}>
            {/* BEFORE */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 24 }}>
                Before Edufy
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "WhatsApp groups scattered across classes",
                  "Paper attendance registers lost every term",
                  "Manual fee tracking in Excel sheets",
                  "Parents calling the office for bus updates",
                  "Disconnected systems that never talk",
                ].map((item) => (
                  <li key={item} style={{ fontFamily: T.serif, fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", color: "#64748b", lineHeight: 1.8, marginBottom: 8, fontStyle: "italic" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* TRANSITION ARROW */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4v24M8 20l8 8 8-8" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* AFTER */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2563EB", marginBottom: 24 }}>
                After Edufy
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "One unified platform for all communication",
                  "Digital attendance with instant parent alerts",
                  "Automated fee collection & reconciliation",
                  "Real‑time GPS tracking for every bus",
                  "Every system speaks to every other — seamlessly",
                ].map((item) => (
                  <li key={item} style={{ fontFamily: T.serif, fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Supporting proof – compact strip */}
        <Reveal delay={0.18}>
          <div style={{ marginTop: "clamp(64px, 8vw, 80px)", display: "flex", justifyContent: "center", gap: "clamp(28px, 4vw, 48px)", flexWrap: "wrap" }}>
            {TRANSFORMATION_PROOF.map((item, i) => (
              <div key={i} style={{ flex: "1 1 180px", maxWidth: 220, borderLeft: "2px solid #e2e8f0", paddingLeft: 16 }}>
                <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: T.blue, marginBottom: 8 }}>
                  {item.label}
                </div>
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.muted, lineHeight: 1.5, margin: 0 }}>
                  <span style={{ textDecoration: "line-through", color: "#94a3b8" }}>{item.before}</span>
                  {" → "}
                  <span style={{ color: T.ink, fontWeight: 500 }}>{item.after}</span>
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.24}>
          <div style={{ textAlign: "center", marginTop: "clamp(48px, 6vw, 64px)" }}>
            <a href="#cta" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 24px", borderRadius: 99,
              background: "linear-gradient(148deg,#1D4ED8 0%,#2563EB 60%,#3B82F6 100%)",
              color: T.white, fontFamily: T.sans, fontWeight: 600, fontSize: "0.85rem",
              letterSpacing: "-0.01em", textDecoration: "none",
              boxShadow: "0 6px 24px rgba(37,99,235,0.30)",
              transition: "transform 0.18s ease,box-shadow 0.18s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,99,235,0.30)"; }}
            >
              See the transformation for your school →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArchitecturalFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="af-sec" id="faq" style={{ background: T.white, position: "relative", overflow: "hidden" }}>
      <div className="af-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="af-header">
          <div className="af-header-left">
            <Reveal>
              <Eyebrow>FAQ</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(2.2rem,4vw,3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: T.ink, margin: 0 }}>
                Questions
                <br />
                <em>answered.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="af-header-right">
            <p style={{ fontFamily: T.sans, fontSize: "0.85rem", color: T.muted, lineHeight: 1.7, marginBottom: 16 }}>
              Everything principals, finance heads, and IT coordinators ask before going live with Edufy.
            </p>
            <a href="#cta" style={{ fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 600, color: T.blue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${T.skyDeep}`, paddingBottom: 2, transition: "gap 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
              onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
            >
              Have a different question? → Talk to us
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.08} dir="s">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((f, i) => {
              const isActive = open === i;
              return (
                <div key={i} style={{ borderBottom: "1px solid #e2e8f0", background: isActive ? "rgba(37,99,235,0.02)" : "transparent", transition: "background 0.2s ease" }}>
                  <button
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    onClick={() => setOpen(isActive ? null : i)}
                  >
                    <span style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.12em", color: isActive ? T.blue : "#cbd5e1", minWidth: 22, flexShrink: 0, transition: "color 0.2s" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: T.sans, fontSize: "0.92rem", fontWeight: 600, color: T.ink, flex: 1, lineHeight: 1.4 }}>
                      {f.q}
                    </span>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: isActive ? "#2563EB" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s,transform 0.2s", transform: isActive ? "rotate(45deg)" : "rotate(0deg)" }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1V9M1 5H9" stroke={isActive ? T.white : "#64748b"} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </button>
                  <div style={{ maxHeight: isActive ? 300 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                    <div style={{ padding: "0 0 22px 52px", fontFamily: T.sans, fontSize: "0.85rem", color: T.mid, lineHeight: 1.75, borderLeft: isActive ? "2px solid #2563EB" : "2px solid transparent", paddingLeft: "calc(52px - 2px)" }}>
                      {f.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* FAQ-to-Deployment Bridge */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ fontFamily: T.sans, fontSize: "0.85rem", color: T.muted, margin: 0 }}>
            Ready to see which deployment model fits your school?
          </p>
          <a href="#deployment" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "10px 24px", borderRadius: 99, background: T.sky, border: `1px solid ${T.skyDeep}`, color: T.blue, fontFamily: T.sans, fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", transition: "background 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.skyDeep)}
            onMouseLeave={(e) => (e.currentTarget.style.background = T.sky)}
          >
            View Deployment Options →
          </a>
        </div>
      </div>
    </section>
  );
}

function DeploymentModelsSection() {
  return (
    <section id="deployment" style={{ background: T.snow, padding: "clamp(48px, 6vw, 64px) clamp(24px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Reveal>
            <Eyebrow>How Edufy works with your school</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.08, color: T.ink, margin: "0 0 14px" }}>
              From discovery to support in five steps.
            </h2>
            <p style={{ fontFamily: T.sans, fontSize: "0.9rem", color: T.muted, lineHeight: 1.65, maxWidth: "50ch", margin: "0 auto 48px" }}>
              A proven process designed to get your school up and running with zero disruption.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} dir="s">
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(20px, 3vw, 40px)", marginBottom: 56 }}>
            {DEPLOYMENT_STEPS.map((step, i) => (
              <div key={i} style={{ flex: "1 1 150px", maxWidth: 180, textAlign: "center" }}>
                <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "2rem", color: T.blue, opacity: 0.25, marginBottom: 8 }}>{step.step}</div>
                <h3 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "1.1rem", color: T.ink, margin: "0 0 6px" }}>{step.title}</h3>
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.muted, lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <h3 style={{ textAlign: "center", fontFamily: T.serif, fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: T.ink, marginBottom: 32 }}>
            Choose your level of partnership
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 960, margin: "0 auto" }}>
            {PARTNERSHIP_TIERS.map((tier, i) => (
              <div key={i} style={{
                background: tier.featured ? T.white : "transparent",
                borderRadius: 14,
                padding: "24px 20px",
                border: tier.featured ? `1px solid ${T.skyDeep}` : "1px solid transparent",
                boxShadow: tier.featured ? "0 4px 16px rgba(37,99,235,0.08)" : "none",
                textAlign: "center",
                position: "relative",
              }}>
                {tier.featuredLabel && (
                  <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: T.blue, color: T.white, fontFamily: T.syne, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 99, whiteSpace: "nowrap" }}>
                    {tier.featuredLabel}
                  </div>
                )}
                <h4 style={{ fontFamily: T.serif, fontWeight: 700, fontSize: "1.25rem", color: T.ink, marginBottom: 8 }}>{tier.name}</h4>
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.muted, lineHeight: 1.6, marginBottom: 20 }}>{tier.description}</p>
                <a href="#cta" style={{ fontFamily: T.sans, fontWeight: 600, fontSize: "0.8rem", color: tier.featured ? T.blue : T.mid, textDecoration: "none", borderBottom: tier.featured ? `1px solid ${T.skyDeep}` : "none", paddingBottom: 2 }}>
                  {tier.cta} →
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 3.5vw, 40px)", flexWrap: "wrap", marginTop: 44 }}>
            {[
              { icon: "🚀", title: "Go Live in 48 Hours", sub: "Guaranteed" },
              { icon: "🎓", title: "Free Staff Training", sub: "Included with every plan" },
              { icon: "🔒", title: "ISO 27001 Certified", sub: "Data stored in India" },
              { icon: "💬", title: "6AM–10PM Support", sub: "WhatsApp & email" },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: "0.82rem", color: T.slate }}>{item.title}</div>
                  <div style={{ fontFamily: T.sans, fontWeight: 400, fontSize: "0.72rem", color: T.muted }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontFamily: T.sans, fontWeight: 400, fontSize: "0.75rem", color: T.dim }}>
            No credit card required · Cancel anytime · Free data export
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children, light = false, ruleWidth = 22 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: T.syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: light ? "rgba(147,197,253,0.72)" : T.blue, marginBottom: 20 }}>
      <span style={{ display: "block", width: ruleWidth, height: 1, background: "currentColor", opacity: 0.7, borderRadius: 1 }} />
      {children}
      <span style={{ display: "block", width: ruleWidth, height: 1, background: "currentColor", opacity: 0.7, borderRadius: 1 }} />
    </div>
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
    setTimeout(() => { setLoading(false); setSent(true); }, 900);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: T.white, border: `1px solid ${T.frost}`,
    borderRadius: 10, color: T.ink,
    fontFamily: T.sans, fontSize: "0.875rem",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s ease,box-shadow 0.15s ease",
  };

  const labelStyle = {
    display: "block", fontFamily: T.syne, fontSize: "0.58rem",
    fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
    color: T.muted, marginBottom: 7,
  };

  return (
    <section id="cta" style={{ background: "linear-gradient(165deg,#f8fafc 0%,#ffffff 100%)", padding: "clamp(56px, 6vw, 64px) clamp(24px,5vw,48px)", position: "relative", overflow: "hidden" }}>
      <Orb x="20%" y="30%" size={500} color="rgba(37,99,235,0.04)" blur={130} />
      <Orb x="80%" y="70%" size={400} color="rgba(99,102,241,0.03)" blur={120} />

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
        <Reveal>
          <Eyebrow ruleWidth={32}>Start Your Free Trial</Eyebrow>
          <h2 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: "clamp(2.4rem,5vw,4rem)", letterSpacing: "-0.04em", lineHeight: 1.02, color: T.ink, margin: "0 0 12px" }}>
            Your school deserves
            <br /><em>better software.</em>
          </h2>
          <p style={{ fontFamily: T.sans, fontSize: "0.92rem", color: T.muted, lineHeight: 1.7, margin: "0 0 28px" }}>
            Join 500+ schools · Go live in 48 hours · No credit card required
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { icon: "🏫", text: "500+ schools already live" },
              { icon: "⚡", text: "48-hour go-live guarantee" },
              { icon: "🔒", text: "ISO 27001 · Data in India" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: T.white, border: `1px solid ${T.frost}`, boxShadow: T.sh, fontFamily: T.sans, fontSize: "0.72rem", fontWeight: 500, color: T.mid }}>
                <span style={{ fontSize: "0.88rem" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {!sent ? (
            <>
              <div style={{ background: T.white, border: `1px solid ${T.frost}`, borderRadius: 16, padding: "28px 26px", boxShadow: T.shMd, textAlign: "left" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>School Name</label>
                    <input style={inputStyle} placeholder="DPS Hyderabad" value={form.school} inputMode="text" onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
                      onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)"; }}
                      onBlur={(e) => { e.target.style.borderColor = T.frost; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>WhatsApp Number</label>
                    <input style={inputStyle} placeholder="+91 98765 43210" value={form.phone} inputMode="tel" onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)"; }}
                      onBlur={(e) => { e.target.style.borderColor = T.frost; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
                <button disabled={loading} onClick={handleSubmit} style={{ width: "100%", padding: "14px", background: loading ? T.skyDeep : `linear-gradient(148deg,${T.blueDark} 0%,${T.blue} 60%,${T.blueLight} 100%)`, color: T.white, border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontFamily: T.sans, fontWeight: 600, fontSize: "0.95rem", letterSpacing: "-0.01em", boxShadow: "0 4px 20px rgba(37,99,235,0.28)", transition: "transform 0.15s ease,box-shadow 0.15s ease", marginTop: 16 }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.38)"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.28)"; } }}
                >
                  {loading ? (
                    <span className="cta-loading"><span className="cta-loading-dot" /><span className="cta-loading-dot" /><span className="cta-loading-dot" /></span>
                  ) : "Book My Free Demo →"}
                </button>
              </div>
              <a href="https://wa.me/919999999999?text=Hi%2C+I+want+to+book+a+demo+for+Edufy" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 500, color: T.muted, textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.color = T.blue}
                onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
              >
                <span>💬</span> Or chat directly on WhatsApp
              </a>
            </>
          ) : (
            <div style={{ padding: "28px 24px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, boxShadow: T.sh }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontFamily: T.sans, fontSize: "0.95rem", fontWeight: 600, color: "#15803d" }}>We'll WhatsApp you within 2 hours.</div>
              <p style={{ fontFamily: T.sans, fontSize: "0.78rem", color: "#22c55e", margin: 0 }}>
                Can't wait? <a href="https://wa.me/919999999999" target="_blank" rel="noopener" style={{ color: "#15803d", fontWeight: 600 }}>Message us directly →</a>
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 24, flexWrap: "wrap" }}>
            {["No contract lock-in", "Free onboarding", "Cancel anytime"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: T.sans, fontSize: "0.75rem", fontWeight: 500, color: T.muted }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 1.5" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Product", links: [
      { label: "Attendance", href: "#platform-modules" },
      { label: "Fee Management", href: "#platform-modules" },
      { label: "Transport", href: "#platform-modules" },
      { label: "Communication", href: "#platform-modules" },
      { label: "Reports", href: "#platform-modules" },
    ]},
    { title: "Company", links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
    ]},
    { title: "Support", links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "System Status", href: "#" },
      { label: "WhatsApp Support", href: "https://wa.me/919999999999" },
    ]},
  ];

  return (
    <footer style={{ background: "#070d18", color: "rgba(240,248,255,0.70)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div className="nav-mark" style={{ width: 28, height: 28, borderRadius: 7 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <polygon points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2" stroke="rgba(255,255,255,0.88)" strokeWidth="0.9" fill="none" />
                  <circle cx="6.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.92)" />
                </svg>
              </div>
              <span style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "12px", letterSpacing: "0.17em", color: "rgba(240,248,255,0.95)" }}>EDUFY</span>
            </div>
            <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,248,255,0.50)", lineHeight: 1.5, marginBottom: 10 }}>SCHOOL MANAGEMENT · BUILT FOR INDIA</div>
            <p style={{ fontFamily: T.sans, fontSize: "12.5px", color: "rgba(210,232,255,0.36)", lineHeight: 1.78, maxWidth: "270px", fontWeight: 400, marginBottom: 16, letterSpacing: "-0.008em" }}>
              Simplifying operations so educators can focus on what they came here to do — teaching.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 11px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6, background: "rgba(255,255,255,0.016)", marginBottom: 16, fontFamily: T.syne, fontWeight: 700, fontSize: "8.5px", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(210,232,255,0.28)" }}>
              🔒  ISO 27001 · PDPB Compliant · Data in India
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["𝕏", "in", "▶", "💬"].map((icon, i) => (
                <button key={i} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)", color: "rgba(210,232,255,0.32)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontFamily: T.sans, fontWeight: 600, cursor: "pointer", transition: "background 0.15s ease,border-color 0.15s ease,color 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(240,248,255,0.80)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(210,232,255,0.32)"; }}
                >{icon}</button>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "8px", letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(210,232,255,0.24)", marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontFamily: T.sans, fontSize: "12.5px", color: "rgba(210,232,255,0.38)", textDecoration: "none", transition: "color 0.15s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "rgba(240,248,255,0.82)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(210,232,255,0.38)"}
                  >{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 0 24px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingTop: 14 }}>
          <span style={{ fontFamily: T.sans, fontSize: "11px", color: "rgba(210,232,255,0.22)", letterSpacing: "-0.005em" }}>© 2026 Edufy Technologies Pvt. Ltd.</span>
          <div style={{ display: "flex", gap: "clamp(10px,1.8vw,20px)", flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Security", "Cookies"].map((l) => (
              <a key={l} href="#" style={{ fontFamily: T.sans, fontSize: "11px", color: "rgba(210,232,255,0.22)", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(210,232,255,0.58)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(210,232,255,0.22)"}
              >{l}</a>
            ))}
          </div>
          <div style={{ fontFamily: T.syne, fontSize: "9px", fontWeight: 700, color: "rgba(210,232,255,0.16)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Made with <span style={{ color: "#f87171" }}>♥</span> in Hyderabad, India
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Final App Assembly ────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <div id="noise" aria-hidden="true" />
      <Cursor />
      <Nav />
      <Hero />
      <Divider />
      <CinematicJourney />
      <Divider />
      <ModulesCinematic />
      <Divider />
      <TransformationImpact />
      <Divider />
      <ArchitecturalFAQ />
      <Divider />
      <DeploymentModelsSection />
      <Divider />
      <CTA />
      <Footer />
    </>
  );
}

