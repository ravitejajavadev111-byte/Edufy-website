import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

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

const RADIUS = 360;
const EXPO = [0.16, 1, 0.3, 1];
const EASE_IN = [0.4, 0, 1, 1];

const PLANS = [
  {
    id: "self-managed",
    name: "Self-Managed",
    price: "₹100",
    unit: "/ student / month",
    description: "Best for schools with existing admin staff.",
    features: [
      "Admin dashboard",
      "Parent mobile app",
      "Attendance & Reports",
      "Fee management",
      "Communication tools",
      "Basic support",
    ],
    cta: "Get started",
    variant: "outline",
  },
  {
    id: "managed-operations",
    name: "Managed Operations",
    price: "₹200",
    unit: "/ student / month",
    description: "Best for schools wanting stress-free operations.",
    featured: true,
    featuredLabel: "Most schools choose this",
    features: [
      "Everything in Self-Managed",
      "Dedicated coordinator",
      "Daily operations support",
      "Parent communication assistance",
      "WhatsApp & email support",
      "Priority support",
      "Operational guidance",
      "Hassle-free administration",
    ],
    cta: "Explore plan",
    variant: "primary",
  },
  {
    id: "institution-infrastructure",
    name: "Institution Infrastructure",
    price: "Custom",
    unit: "pricing",
    description: "Best for school chains and large institutions.",
    features: [
      "Finance management",
      "Own mobile app (customised)",
      "Multi-branch management",
      "Advanced analytics",
      "Custom workflows",
      "Dedicated account manager",
      "Integrations & API access",
      "Training & onboarding",
      "Premium support",
    ],
    cta: "Contact us",
    variant: "ghost",
  },
];

const CMP_ROWS = [
  { label: "Attendance marking time", old: "45+ min/day", edufy: "Under 4 min/day" },
  { label: "Fee reconciliation", old: "5–7 days/month", edufy: "Automated, <10 min" },
  { label: "Parent communication", old: "WhatsApp groups", edufy: "In-app with read receipts" },
  { label: "Report card generation", old: "2 weeks per term", edufy: "4 min for 1,200 cards" },
  { label: "Transport tracking", old: "None (phone calls)", edufy: "Live GPS + auto alerts" },
  { label: "Setup time", old: "3–6 months", edufy: "48 hours" },
  { label: "Multi-campus support", old: "Separate logins", edufy: "One dashboard" },
];

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

function useCount(end, ms = 2000, dec = 0) {
  const [n, setN] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !go) {
          setGo(true);
          obs.disconnect();
        }
      },
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
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on];
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

function Chip({ children, dark = false }) {
  return (
    <div className={`chip ${dark ? "chip-dark" : ""}`}>
      <span className="chip-dot" />
      {children}
    </div>
  );
}

function CheckIcon({ color = "currentColor", size = 9 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path
        d="M1.5 4.5L3.5 6.5L7.5 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'Syne', sans-serif",
        fontSize: "0.575rem",
        fontWeight: 700,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: light ? "rgba(147,197,253,0.68)" : "rgba(37,99,235,0.78)",
        marginBottom: 20,
      }}
    >
      <span
        style={{
          display: "block",
          width: 22,
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
          width: 22,
          height: 1,
          background: "currentColor",
          opacity: 0.7,
          borderRadius: 1,
        }}
      />
    </div>
  );
}

function Orb({ x, y, size = 480, color = "rgba(37,99,235,0.12)", blur = 160 }) {
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
        transform: "translate(-50%, -50%)",
        zIndex: 0,
      }}
    />
  );
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const rp = useRef({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
      const t = e.target;
      setHov(
        !!(t?.closest("button") || t?.closest("a") || t?.closest("[data-cursor]"))
      );
    };
    let raf;
    const anim = () => {
      rp.current.x += (pos.current.x - rp.current.x) * 0.09;
      rp.current.y += (pos.current.y - rp.current.y) * 0.09;
      if (ring.current) {
        ring.current.style.left = rp.current.x + "px";
        ring.current.style.top = rp.current.y + "px";
      }
      raf = requestAnimationFrame(anim);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(anim);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cd" ref={dot} className={hov ? "hov" : ""} />
      <div id="cr" ref={ring} className={hov ? "hov" : ""} />
    </>
  );
}

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
      <a href="#cta" className="sticky-bar-cta">
        Book free demo →
      </a>
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
    { label: "Platform", href: "#platform-modules" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
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
                stroke="rgba(255,255,255,0.88)"
                strokeWidth="0.9"
                fill="none"
              />
              <circle cx="6.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
          <span className="nav-name">EDUFY</span>
        </a>

        <nav className="nav-links" style={{ display: "flex" }}>
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
            rel="noopener"
            className="nav-wa"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.524 5.848L0 24l6.336-1.502A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.359-.213-3.722.882.924-3.62-.234-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
            </svg>
            WhatsApp
          </a>
          <a href="#cta" className="nav-cta">
            Book a demo →
          </a>
          <button
            className={`nav-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
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
            className="mobile-nav open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                rel="noopener"
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

function CinematicRibbon() {
  const schools = [
    "DPS Hyderabad",
    "Narayana Group",
    "Orchids International",
    "Sri Chaitanya",
    "Delhi Public School",
    "Vidyashilp Academy",
    "DAV Public Schools",
    "Kendriya Vidyalaya",
  ];
  const doubled = [...schools, ...schools];

  return (
    <section
      className="cr-sec"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(37,99,235,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(24px,5vw,80px)",
          position: "relative",
          zIndex: 1,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.575rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(37,99,235,0.65)",
            }}
          >
            Trusted by India's leading institutions
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              { n: "500+", l: "Schools" },
              { n: "98%", l: "Retention" },
              { n: "4.9★", l: "App rating" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 12px",
                  borderRadius: 99,
                  background: "rgba(37,99,235,0.05)",
                  border: "1px solid rgba(37,99,235,0.10)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "-0.02em",
                    color: "#2563EB",
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.65rem",
                    color: "rgba(15,23,42,0.45)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cr-rule cr-rule-top" />
      <div className="cr-marquee-outer">
        <div className="cr-track">
          {doubled.map((s, i) => (
            <span
              key={i}
              className={`cr-school ${i % 3 === 1 ? "cr-school-lit" : ""}`}
            >
              {s}
              <span className="cr-sep" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="cr-rule cr-rule-bot" />
    </section>
  );
}

function EditorialMetrics() {
  const [r1, n1] = useCount(500, 2600, 0);
  const [r2, n2] = useCount(98, 2400, 0);
  const [r3, n3] = useCount(2, 2400, 0);
  const [r4, n4] = useCount(4.9, 2400, 1);

  const secondary = [
    { ref: r2, val: n2, suffix: "%", label: "Customer retention", delta: "Industry best" },
    { ref: r3, val: n3, suffix: "M+", label: "Student records managed", delta: "↑ 1.2M this year" },
    { ref: r4, val: n4, suffix: "★", label: "App Store rating", delta: "4,800+ verified reviews" },
  ];

  return (
    <section
      style={{
        position: "relative",
        background: "linear-gradient(170deg, #07122A 0%, #091829 55%, #060E1F 100%)",
        padding: "clamp(72px,10vw,120px) clamp(24px,5vw,80px)",
        overflow: "hidden",
      }}
    >
      <Orb x="15%" y="30%" size={600} color="rgba(37,99,235,0.09)" blur={180} />
      <Orb x="80%" y="70%" size={400} color="rgba(96,165,250,0.07)" blur={140} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Reveal>
          <Eyebrow light>By the numbers</Eyebrow>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 0,
            alignItems: "center",
          }}
        >
          <Reveal dir="l">
            <div
              ref={r1}
              style={{
                paddingRight: "clamp(40px,6vw,88px)",
                position: "relative",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-0.15em",
                  left: "-0.08em",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(120px,20vw,260px)",
                  lineHeight: 0.85,
                  color: "rgba(255,255,255,0.025)",
                  pointerEvents: "none",
                  userSelect: "none",
                  letterSpacing: "-0.05em",
                }}
              >
                500
              </div>
              <div
                style={{
                  fontSize: "clamp(72px,13vw,156px)",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.86,
                  color: "rgba(240,248,255,0.97)",
                  position: "relative",
                }}
              >
                {n1}+
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(0.85rem,1.1vw,1rem)",
                  fontWeight: 400,
                  color: "rgba(240,248,255,0.46)",
                  marginTop: 20,
                  letterSpacing: "0.01em",
                  lineHeight: 1.5,
                  maxWidth: "28ch",
                }}
              >
                Schools onboarded across India
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(96,165,250,0.62)",
                }}
              >
                ↑ 42% year over year
              </div>
            </div>
          </Reveal>

          <div
            style={{
              width: 1,
              alignSelf: "stretch",
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)",
              flexShrink: 0,
            }}
          />

          <Reveal delay={0.1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(28px,4vw,44px)",
                paddingLeft: "clamp(40px,6vw,88px)",
              }}
            >
              {secondary.map((s, i) => (
                <Reveal key={i} delay={0.16 + i * 0.09} dir="r">
                  <div
                    ref={s.ref}
                    style={{
                      display: "flex",
                      gap: 22,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(34px,5.5vw,58px)",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 700,
                        letterSpacing: "-0.035em",
                        lineHeight: 1,
                        color: "rgba(240,248,255,0.95)",
                        minWidth: "3ch",
                        flexShrink: 0,
                      }}
                    >
                      {s.val}{s.suffix}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: "rgba(240,248,255,0.58)",
                          marginBottom: 5,
                          lineHeight: 1.4,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: "0.60rem",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "rgba(96,165,250,0.56)",
                        }}
                      >
                        {s.delta}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="em-strip" style={{ marginTop: "clamp(56px,8vw,88px)" }}>
        <div className="em-strip-inner">
          {[...Array(2)]
            .flatMap(() => [
              "Smart Attendance",
              "Fee Collection",
              "Exams & Results",
              "Live Transport",
              "Parent Notices",
              "Two-way Messaging",
              "Mobile App",
              "Role-based Access",
              "Report Cards",
              "Timetables",
              "Multi-campus",
              "Offline Mode",
            ])
            .map((label, i) => (
              <div key={i} className="em-strip-item">
                <span className="em-strip-dot" />
                {label}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function CinematicJourney() {
  const steps = [
    {
      num: "01",
      title: "Setup your school",
      time: "2 hours",
      desc: "A dedicated coordinator guides you through data import, staff training, and configuration — remotely with zero disruption.",
      detail: ["Remote setup", "Dedicated coordinator", "Zero disruption"],
    },
    {
      num: "02",
      title: "Train your staff",
      time: "1 session",
      desc: "One free live training session for teachers and admin. If your staff can use WhatsApp, they can run Edufy.",
      detail: ["Live session", "Hindi support", "WhatsApp-level ease"],
    },
    {
      num: "03",
      title: "Go live, Day 1",
      time: "Day 1",
      desc: "Enable parent notifications, mark attendance, and collect fees online. Most schools see time savings from day one.",
      detail: ["Instant savings", "Full onboarding", "24/7 support"],
    },
  ];

  return (
    <section className="cj-sec" id="how-it-works" style={{ position: "relative", overflow: "hidden" }}>
      <div className="cj-bg-pattern" />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "70%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(37,99,235,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="cj-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="cj-header">
          <Reveal className="cj-header-left">
            <div className="cj-eyebrow">How it works</div>
            <h2 className="cj-h2">
              From <em>zero</em>
              <br />
              to operational
              <br />
              in 48 hours.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="cj-header-right">
            <p className="cj-sub">
              No IT department. No months of implementation. No chaos. Just a
              dedicated coordinator, one training session, and you're live.
            </p>
            <div className="cj-guarantee">
              <div className="cj-guarantee-dot" />
              <span>48-hour go-live guarantee — or we extend your trial free</span>
            </div>
          </Reveal>
        </div>

        <div className="cj-steps" style={{ position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "2.2rem",
              left: "calc(16.66% + 2rem)",
              right: "calc(16.66% + 2rem)",
              height: 1,
              background: "linear-gradient(90deg, rgba(37,99,235,0.18), rgba(37,99,235,0.30) 50%, rgba(37,99,235,0.18))",
              zIndex: 0,
            }}
          />
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.12} dir="s">
              <div className="cj-step" style={{ position: "relative", zIndex: 1 }}>
                <div className="cj-step-num-wrap">
                  <div
                    className="cj-step-num-circle"
                    style={{
                      background: "linear-gradient(145deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)",
                      boxShadow: "0 0 0 4px rgba(37,99,235,0.10), 0 4px 20px rgba(37,99,235,0.30)",
                    }}
                  >
                    <span>{step.num}</span>
                  </div>
                </div>
                <div
                  className="cj-step-time"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(37,99,235,0.72)",
                  }}
                >
                  {step.time}
                </div>
                <h3
                  className="cj-step-title"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.4rem,2.2vw,1.85rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>
                <p className="cj-step-desc">{step.desc}</p>
                <div className="cj-step-pills">
                  {step.detail.map((d) => (
                    <span key={d} className="cj-pill">
                      {d}
                    </span>
                  ))}
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

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const section = sectionRef.current;
    const rotator = rotatorRef.current;
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
        snap: {
          snapTo: [0, 0.2, 0.4, 0.6, 0.8, 1],
          duration: 0.35,
          ease: "power2.out",
        },
        onUpdate(self) {
          const totalRotation = self.progress * 120;
          let bestIdx = 0, bestDiff = 999;
          for (let i = 0; i < numCards; i++) {
            let cardAngle = ((i * angleStep - (totalRotation % 360) + 360) % 360);
            if (cardAngle > 180) cardAngle = 360 - cardAngle;
            if (cardAngle < bestDiff) {
              bestDiff = cardAngle;
              bestIdx = i;
            }
          }
          setActiveIdx(bestIdx);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const contentV = {
    enter: (d) => ({ opacity: 0, y: d > 0 ? 22 : -22, filter: "blur(6px)" }),
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.52, ease: EXPO },
    },
    exit: (d) => ({
      opacity: 0,
      y: d > 0 ? -14 : 14,
      filter: "blur(3px)",
      transition: { duration: 0.28, ease: EASE_IN },
    }),
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="pms-sec pms-desktop"
        id="platform-modules"
      >
        <div className="pms-layout">
          <div className="pms-left">
            <div className="pms-section-label">
              <span className="pms-section-dot" />
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.575rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Platform Modules
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
              >
                <div className="pms-badge-row">
                  <span
                    className="pms-badge"
                    style={{
                      "--acc": mod.accent,
                      "--acc-rgb": mod.accentRgb,
                    }}
                  >
                    {mod.badge}
                  </span>
                  <span
                    className="pms-eyebrow"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "0.575rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: `rgba(${mod.accentRgb},0.75)`,
                    }}
                  >
                    {mod.eyebrow}
                  </span>
                </div>

                <h3 className="pms-headline">
                  {mod.headline.split("\n").map((line, li) => (
                    <motion.span
                      key={li}
                      className="pms-headline-line"
                      initial={{ opacity: 0, x: -10, clipPath: "inset(0 100% 0 0)" }}
                      animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
                      transition={{ delay: li * 0.09 + 0.05, duration: 0.54, ease: EXPO }}
                    >
                      {line}
                    </motion.span>
                  ))}
                </h3>

                <motion.p
                  className="pms-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.20, duration: 0.52 }}
                >
                  {mod.desc}
                </motion.p>

                <div className="pms-features">
                  {mod.features.map((feat, fi) => (
                    <motion.span
                      key={feat}
                      className="pms-feature-pill"
                      style={{ "--acc": mod.accent, "--acc-rgb": mod.accentRgb }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.24 + fi * 0.05, duration: 0.38, ease: EXPO }}
                    >
                      <CheckIcon color={mod.accent} /> {feat}
                    </motion.span>
                  ))}
                </div>

                <motion.div
                  className="pms-stat-block"
                  style={{ "--acc-rgb": mod.accentRgb }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.44, ease: EXPO }}
                >
                  <span className="pms-stat-num" style={{ color: mod.accent }}>
                    {mod.stat}
                  </span>
                  <span className="pms-stat-lbl">{mod.statLabel}</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <nav className="pms-nav-dots" aria-label="Module navigation">
              {MODULES.map((m, i) => (
                <button
                  key={i}
                  className={`pms-nav-dot${i === activeIdx ? " active" : ""}`}
                  style={i === activeIdx ? { "--acc": m.accent } : {}}
                  aria-label={`Module ${i + 1}: ${m.title}`}
                />
              ))}
              <span className="pms-nav-hint">Scroll to explore</span>
            </nav>
          </div>

          <div className="pms-right">
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
                          "--card-acc": modItem.accent,
                          "--card-acc-rgb": modItem.accentRgb,
                        }}
                      >
                        <div className="carousel-card-inner">
                          <img src={modItem.image} alt={modItem.title} loading="lazy" />
                        </div>
                        <div className="carousel-card-overlay">
                          <div
                            className="carousel-card-badge"
                            style={{ backgroundColor: `${modItem.accent}CC` }}
                          >
                            {modItem.badge}
                          </div>
                          <div className="carousel-card-title">{modItem.title}</div>
                        </div>
                        {isFront && (
                          <div
                            className="carousel-card-glow-edge"
                            style={{
                              background: `linear-gradient(90deg, transparent 0%, ${modItem.accent}44 50%, transparent 100%)`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="carousel-mask-l" />
                <div className="carousel-mask-r" />
              </div>
            </div>
            <div
              className="carousel-floor"
              style={{ "--acc-rgb": mod.accentRgb }}
            />
          </div>
        </div>
      </section>

      <MobileModulesSwiper />
    </>
  );
}

function MobileModulesSwiper() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cardWidth = track.firstElementChild
        ? track.firstElementChild.offsetWidth + 12
        : 1;
      setActiveIdx(
        Math.min(Math.max(Math.round(track.scrollLeft / cardWidth), 0), MODULES.length - 1)
      );
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild
      ? track.firstElementChild.offsetWidth + 12
      : 0;
    track.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="pms-sec pms-mobile" id="platform-modules-mob">
      <div className="pms-mobile-inner">
        <div className="pms-section-label" style={{ justifyContent: "center" }}>
          <span className="pms-section-dot" />
          <span>Platform Modules</span>
        </div>
        <h2 className="pms-mobile-title">
          Every tool your school <em>actually needs.</em>
        </h2>
        <div className="mobile-modules-swiper">
          <div className="mobile-modules-track" ref={trackRef}>
            {MODULES.map((mod, i) => (
              <div key={i} className="mobile-module-card">
                <div className="mobile-module-card-img">
                  <img src={mod.image} alt={mod.title} loading="lazy" />
                  <div className="mobile-module-card-overlay">
                    <div
                      className="mobile-module-badge"
                      style={{ backgroundColor: `${mod.accent}CC` }}
                    >
                      {mod.badge}
                    </div>
                    <div className="mobile-module-title">{mod.title}</div>
                    <div className="mobile-module-sub">
                      {mod.stat} — {mod.statLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mobile-modules-dots">
            {MODULES.map((_, i) => (
              <button
                key={i}
                className={`mobile-modules-dot${i === activeIdx ? " active" : ""}`}
                onClick={() => scrollTo(i)}
                aria-label={`Module ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitWorld() {
  return (
    <section
      className="sw-sec"
      id="comparison"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: "50%",
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(248,113,113,0.018) 0%, rgba(248,113,113,0.025) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(37,99,235,0.022) 0%, rgba(37,99,235,0.030) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="sw-inner" style={{ position: "relative", zIndex: 1 }}>
        <Reveal className="sw-header">
          <div className="sw-eyebrow">The transformation</div>
          <h2 className="sw-h2">
            The old way
            <br />
            <em>versus</em>
            <br />
            the Edufy way.
          </h2>
        </Reveal>

        <Reveal delay={0.1} dir="s">
          <div className="sw-arena">
            <div className="sw-arena-header">
              <div className="sw-header-spacer" />
              <div className="sw-col-head sw-col-head-old">
                <span className="sw-col-badge sw-badge-old">Before</span>
                <div
                  className="sw-col-label"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    opacity: 0.6,
                  }}
                >
                  Legacy / Manual
                </div>
              </div>
              <div className="sw-col-head sw-col-head-new">
                <span className="sw-col-badge sw-badge-new">After Edufy</span>
                <div
                  className="sw-col-label"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    color: "rgba(37,99,235,0.80)",
                  }}
                >
                  With Edufy
                </div>
              </div>
            </div>
            {CMP_ROWS.map((r, i) => (
              <div key={i} className="sw-row">
                <div
                  className="sw-row-label"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(0.75rem,1vw,0.875rem)",
                  }}
                >
                  {r.label}
                </div>
                <div
                  className="sw-row-old"
                  style={{
                    background: "rgba(248,113,113,0.04)",
                    borderLeft: "1px solid rgba(248,113,113,0.12)",
                  }}
                >
                  <div
                    className="sw-icon-bad"
                    style={{
                      color: "rgba(248,113,113,0.80)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    ✕
                  </div>
                  {r.old}
                </div>
                <div
                  className="sw-row-new"
                  style={{
                    background: "rgba(37,99,235,0.04)",
                    borderLeft: "1px solid rgba(37,99,235,0.12)",
                  }}
                >
                  <div
                    className="sw-icon-good"
                    style={{
                      color: "rgba(16,185,129,0.90)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    ✓
                  </div>
                  {r.edufy}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            style={{
              marginTop: "clamp(32px,4vw,48px)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a
              href="#cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 99,
                background: "linear-gradient(148deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "-0.01em",
                boxShadow: "0 8px 28px rgba(37,99,235,0.32), inset 0 1px 0 rgba(255,255,255,0.10)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 36px rgba(37,99,235,0.42), inset 0 1px 0 rgba(255,255,255,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.32), inset 0 1px 0 rgba(255,255,255,0.10)";
              }}
            >
              See what Edufy can do for your school →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section
      className="ms-sec"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-5%",
          right: "-2%",
          width: "40%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(37,99,235,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="ms-decor-quote"
        aria-hidden="true"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(6rem,14vw,12rem)",
          fontWeight: 700,
          color: "rgba(37,99,235,0.05)",
          position: "absolute",
          top: "clamp(40px,5vw,80px)",
          left: "clamp(20px,4vw,60px)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        "
      </div>
      <div className="ms-inner" style={{ position: "relative", zIndex: 1 }}>
        <Reveal dir="l" className="ms-left">
          <div className="ms-img-frame">
            <img src="/assets/founder.png" alt="Ravi Teja Maddoju, Founder & CEO" />
            <div className="ms-img-overlay" />
          </div>
          <div className="ms-credential">
            <div
              className="ms-credential-icon"
              style={{ fontSize: "1rem" }}
            >
              🏆
            </div>
            <div>
              <div className="ms-credential-title">10+ years in EdTech</div>
              <div className="ms-credential-sub">Ex-NIIT · Ex-Byju's</div>
            </div>
          </div>
        </Reveal>
        <div className="ms-right">
          <Reveal>
            <div className="ms-eyebrow">Our story</div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              className="ms-h2"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Built by educators,
              <br />
              <em>for educators.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <blockquote
              className="ms-pull-quote"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1rem,1.6vw,1.25rem)",
                lineHeight: 1.75,
                letterSpacing: "-0.015em",
              }}
            >
              We spent 6 months inside schools before writing a single line of
              code — watching teachers triple-enter attendance, principals
              apologise about buses on WhatsApp, and finance teams reconcile
              spreadsheets at midnight.
            </blockquote>
          </Reveal>
          <Reveal delay={0.20}>
            <p className="ms-body">
              Every Edufy feature comes from those real conversations. India has{" "}
              <strong>1.5 million schools</strong>. Fewer than{" "}
              <strong>3%</strong> use modern management software. We are
              building the infrastructure for the rest.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="ms-stats-row">
              {[
                { n: "500+", l: "Schools" },
                { n: "98%", l: "Retention" },
                { n: "12", l: "States" },
              ].map((s, i) => (
                <div key={i} className="ms-stat">
                  <div className="ms-stat-n">{s.n}</div>
                  <div className="ms-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.30}>
            <div className="ms-sig">
              <div className="ms-sig-rule" />
              <div>
                <div
                  className="ms-sig-name"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Ravi Teja Maddoju
                </div>
                <div className="ms-sig-title">Founder & CEO, Edufy</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ArchitecturalFAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="af-sec" id="faq" style={{ position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: "40%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(37,99,235,0.035) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="af-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="af-header">
          <Reveal className="af-header-left">
            <div className="af-eyebrow">FAQ</div>
            <h2 className="af-h2">
              Questions
              <br />
              <em>answered.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="af-header-right">
            <p className="af-sub">
              Everything principals, finance heads, and IT coordinators ask
              before going live with Edufy.
            </p>
            <a href="#cta" className="af-cta-link">
              Have another question? → Talk to us
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.08} dir="s">
          <div className="af-body">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className={`af-item ${open === i ? "af-open" : ""}`}
              >
                <button
                  className="af-q"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="af-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="af-question">{f.q}</span>
                  <div className="af-toggle">
                    <div className="af-toggle-icon" />
                  </div>
                </button>
                <div className="af-answer">
                  <div className="af-answer-inner">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PricingSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (<section className="pricing-premium">
            <div className="pricing-container">

              <div className="pricing-header">
                <span className="pricing-eyebrow">
                  Flexible Partnership Models
                </span>

                <h2>
                  Choose how involved you want Edufy to be.
                </h2>

                <p>
                  From software-only to fully managed operations,
                  pick the level of support your school needs today.
                </p>
              </div>

              <div className="decision-switch">
                <button>We already have an admin team</button>
                <button className="active">We need operational help</button>
                <button>We want a strategic partner</button>
              </div>

              <div className="pricing-grid">

                <article className="plan-card self">
                  <div className="plan-tag">
                    Operate Yourself
                  </div>

                  <h3>Self Managed</h3>

                  <div className="price">
                    ₹100
                    <span>/student/month</span>
                  </div>

                  <p className="outcome">
                    Perfect for schools with existing administrative staff.
                  </p>

                  <ul>
                    <li>Complete school management platform</li>
                    <li>Attendance and fee tracking</li>
                    <li>Parent mobile application</li>
                    <li>Reports and analytics</li>
                    <li>Communication tools</li>
                  </ul>

                  <button>
                    Book Demo
                  </button>
                </article>

                <article className="plan-card managed featured">

                  <div className="featured-badge">
                    Recommended for Most Schools
                  </div>

                  <div className="plan-tag">
                    Operate With Edufy
                  </div>

                  <h3>Managed Operations</h3>

                  <div className="price">
                    ₹200
                    <span>/student/month</span>
                  </div>

                  <p className="outcome">
                    Focus on education while Edufy handles daily operations.
                  </p>

                  <div className="comparison-box">
                    <div>
                      <strong>Hiring Admin Staff</strong>
                      <span>₹35k–₹50k/month</span>
                    </div>

                    <div>
                      <strong>Edufy Operations Team</strong>
                      <span>Included</span>
                    </div>
                  </div>

                  <ul>
                    <li>Everything in Self Managed</li>
                    <li>Attendance monitoring</li>
                    <li>Fee follow-up support</li>
                    <li>Parent communication assistance</li>
                    <li>Dedicated operations team</li>
                    <li>Priority support</li>
                  </ul>

                  <button>
                    Schedule Consultation
                  </button>

                </article>

                <article className="plan-card enterprise">

                  <div className="plan-tag">
                    Scale With Edufy
                  </div>

                  <h3>Enterprise Partnership</h3>

                  <div className="price">
                    Custom
                  </div>

                  <p className="outcome">
                    Strategic partnership for large schools and school groups.
                  </p>

                  <ul>
                    <li>Dedicated success manager</li>
                    <li>Process optimization</li>
                    <li>Custom workflows</li>
                    <li>Staff training programs</li>
                    <li>Advanced reporting</li>
                    <li>Strategic consulting</li>
                  </ul>

                  <button>
                    Talk To Enterprise Team
                  </button>

                </article>

              </div>

              <div className="trust-strip">

                <div>
                  <strong>Migration Included</strong>
                  <span>No setup headaches</span>
                </div>

                <div>
                  <strong>Training Included</strong>
                  <span>Staff onboarding support</span>
                </div>

                <div>
                  <strong>Dedicated Support</strong>
                  <span>Quick response times</span>
                </div>

                <div>
                  <strong>Implementation Assistance</strong>
                  <span>Launch with confidence</span>
                </div>

              </div>

            </div>
          </section>
  );
}

function CTA() {
  const [form, setForm] = useState({ name: "", school: "", city: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <section className="cta-sec" id="cta">
      <div className="cta-bg-deep" />
      <div className="cta-bg-glow" />
      <div className="cta-grid-lines" />
      <div className="cta-horizon-line" />
      <div className="cta-ring cta-ring-1" />

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 clamp(24px,5vw,48px)",
        }}
      >
        <Reveal>
          <div className="cta-eyebrow">
            <div className="cta-eyebrow-line" />
            <span>Start your free trial</span>
            <div className="cta-eyebrow-line" />
          </div>

          <h2
            className="cta-h2"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              marginBottom: 16,
            }}
          >
            Your school deserves
            <br />
            <em>better software.</em>
          </h2>

          <p className="cta-sub">
            Join 500+ schools · Go live in 48 hours · Plans from{" "}
            <strong>₹4,999/mo</strong>
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {[
              { icon: "🏫", text: "500+ schools already live" },
              { icon: "⚡", text: "48-hour go-live guarantee" },
              { icon: "🔒", text: "ISO 27001 · Data in India" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 14px",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: "rgba(240,248,255,0.62)",
                  letterSpacing: "0.01em",
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {!sent ? (
            <>
              <div className="cta-form">
                <div className="cta-form-row">
                  <div className="cta-field">
                    <label className="cta-label">Your name</label>
                    <input
                      className="cta-input"
                      placeholder="Ravi Teja"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="cta-field">
                    <label className="cta-label">School name</label>
                    <input
                      className="cta-input"
                      placeholder="DPS Hyderabad"
                      value={form.school}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, school: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="cta-form-row">
                  <div className="cta-field">
                    <label className="cta-label">City</label>
                    <input
                      className="cta-input"
                      placeholder="Hyderabad"
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                    />
                  </div>
                  <div className="cta-field">
                    <label className="cta-label">WhatsApp number</label>
                    <input
                      className="cta-input"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      inputMode="tel"
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <button
                  className="cta-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="cta-loading">
                      <span className="cta-loading-dot" />
                      <span className="cta-loading-dot" />
                      <span className="cta-loading-dot" />
                    </span>
                  ) : (
                    "Book my free demo →"
                  )}
                </button>
              </div>
              <a
                href="https://wa.me/919999999999?text=Hi%2C+I+want+to+book+a+demo+for+Edufy"
                target="_blank"
                rel="noopener"
                className="cta-wa"
              >
                <span className="cta-wa-icon">💬</span> Or chat directly on
                WhatsApp
              </a>
            </>
          ) : (
            <div className="cta-success">
              <div className="cta-success-box">
                <div className="cta-success-icon">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M1.5 5.5L4.5 8.5L9.5 2"
                      stroke="#34D399"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="cta-success-text">
                  We'll WhatsApp you within 2 hours.
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(248,250,255,0.52)",
                  fontWeight: 400,
                  marginTop: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Can't wait?{" "}
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener"
                  style={{
                    color: "rgba(147,197,253,0.80)",
                    borderBottom: "1px solid rgba(147,197,253,0.20)",
                  }}
                >
                  Message us on WhatsApp →
                </a>
              </p>
            </div>
          )}

          <div className="cta-trust">
            {["No contract lock-in", "Free onboarding", "Cancel anytime"].map((t) => (
              <div key={t} className="cta-trust-item">
                <div className="cta-trust-check">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1 4L3 6L7 1.5"
                      stroke="#34D399"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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

function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Attendance", href: "#platform-modules" },
        { label: "Fee Management", href: "#platform-modules" },
        { label: "Transport", href: "#platform-modules" },
        { label: "Communication", href: "#platform-modules" },
        { label: "Reports", href: "#platform-modules" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press Kit", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "System Status", href: "#" },
        { label: "WhatsApp Support", href: "https://wa.me/919999999999" },
      ],
    },
  ];

  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <div
              className="nav-mark"
              style={{ width: 30, height: 30, borderRadius: 8 }}
            >
              <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                <polygon
                  points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2"
                  stroke="rgba(255,255,255,0.88)"
                  strokeWidth="0.9"
                  fill="none"
                />
                <circle cx="6.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.92)" />
              </svg>
            </div>
            <span className="nav-name" style={{ fontSize: "1rem" }}>
              EDUFY
            </span>
          </div>
          <p className="footer-tagline">
            The school operating system
            <br />
            <em>built for India.</em>
          </p>
          <p className="footer-desc">
            Simplifying operations so educators can focus on what they came
            here to do — teaching.
          </p>
          <div className="footer-compliance">
            🔒 ISO 27001 · PDPB Compliant · Data stored in India
          </div>
          <div className="footer-social">
            {["𝕏", "in", "▶", "💬"].map((icon, i) => (
              <button key={i} className="footer-social-btn">
                {icon}
              </button>
            ))}
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title} className="footer-col">
            <div className="footer-col-title">{col.title}</div>
            <div className="footer-links">
              {col.links.map((l) => (
                <a key={l.label} href={l.href} className="footer-link">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-divider" />
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 Edufy Technologies Pvt. Ltd.</span>
        <div className="footer-legal">
          {["Privacy Policy", "Terms of Service", "Security", "Cookies"].map((l) => (
            <a key={l} href="#" className="footer-legal-link">
              {l}
            </a>
          ))}
        </div>
        <div className="footer-made">
          Made with <span className="footer-heart">♥</span> in Hyderabad, India
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <div id="noise" aria-hidden="true" />
      <Cursor />
      <StickyBar />
      <Nav />
      <Hero />
      <CinematicRibbon />
      <EditorialMetrics />
      <CinematicJourney />
      <ModulesCinematic />
      <SplitWorld />
      <ManifestoSection />
      <ArchitecturalFAQ />
      <PricingSection />
      <CTA />
      <Footer />
    </>
  );
}