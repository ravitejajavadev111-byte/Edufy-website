// App.jsx
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "@phosphor-icons/react";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(500, 33);

// ─── Data Token Configuration Modules ─────────────────────────────────────────

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

const HERO_ORBIT_MODULES = [
  { id: 'analytics',     name: 'Analytics',     icon: 'ChartBar',      baseAngle: -Math.PI / 2 },
  { id: 'transport',     name: 'Transport',     icon: 'Bus',           baseAngle: -Math.PI / 6 },
  { id: 'communication', name: 'Communication', icon: 'ChatCircle',    baseAngle: Math.PI / 6 },
  { id: 'parents',       name: 'Parents',       icon: 'Users',         baseAngle: Math.PI / 2 },
  { id: 'exams',         name: 'Exams',         icon: 'FileText',      baseAngle: (5 * Math.PI) / 6 },
  { id: 'fees',          name: 'Fees',          icon: 'CurrencyInr',   baseAngle: (7 * Math.PI) / 6 },
  { id: 'attendance',    name: 'Attendance',    icon: 'UsersThree',    baseAngle: -Math.PI / 1.2 }
];

const RADIUS = 300;
const EXPO   = [0.16, 1, 0.3, 1];
const EASE_IN = [0.4, 0, 1, 1];

const FAQS = [
  { q: "How long does setup actually take?", a: "Most schools are fully live within 48 hours of signing up. Our onboarding team handles the data import, and we run a free training session for your staff." },
  { q: "Is our data secure? Where is it stored?", a: "All data is stored on ISO 27001-certified servers located in India. We are PDPB compliant and SOC 2 Type II certified. Your student data never leaves Indian soil." },
  { q: "What happens when the free trial ends?", a: "We'll reach out before your trial ends. Plans start at ₹4,999/month per school — no per-student fees, no hidden costs. If Edufy isn't the right fit, we export your data cleanly." },
  { q: "Do you support state board formats for report cards?", a: "Yes. Edufy supports CBSE, ICSE, and all major state board formats. We configure these for you during onboarding." },
  { q: "Can we use Edufy offline?", a: "Yes. Attendance marking and a read-only view of critical data works offline. Data syncs automatically when connectivity is restored — built for Indian infrastructure realities." },
];

const DEPLOYMENT_STEPS = [
  { step: "01", title: "Setup your school", time: "2 hours", desc: "A dedicated coordinator guides you through data import, staff training, and configuration — remotely with zero disruption." },
  { step: "02", title: "Train your staff", time: "1 session", desc: "One free live training session for teachers and admin. If your staff can use WhatsApp, they can run Edufy." },
  { step: "03", title: "Go live, Day 1", time: "Day 1", desc: "Enable parent notifications, mark attendance, and collect fees online. Most schools see time savings from day one." },
];

const PARTNERSHIP_TIERS = [
  { name: "Self Managed", description: "Your team runs Edufy independently with full platform access.", cta: "Get Started", featured: false },
  { name: "Managed Operations", description: "Edufy's ops team handles daily management and parent communication.", cta: "Book a Demo", featured: true, featuredLabel: "Most popular" },
  { name: "Enterprise", description: "Dedicated success manager, custom workflows, and multi‑campus governance.", cta: "Contact Sales", featured: false },
];

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
  sans:      "'DM Sans', sans-serif",
  syne:      "'Syne', sans-serif",
  sh:        "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
  shMd:      "0 2px 8px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)",
  shBl:      "0 4px 24px rgba(37,99,235,0.12)",
  shFeat:    "0 0 0 1.5px #dbeafe, 0 8px 48px rgba(37,99,235,0.10)",
};

// ─── Core Utility Hooks ───────────────────────────────────────────────────────

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

// ─── Magnetic Action Components ─────────────────────────────────────────────

const MagneticButton = ({ children, className, variant = 'primary', onHoverChange }) => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.6 });

  const intensity = variant === 'primary' ? 0.35 : 0.25;

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distance = Math.hypot(clientX - centerX, clientY - centerY);

    if (distance < 140) {
      x.set((clientX - centerX) * intensity);
      y.set((clientY - centerY) * intensity);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (onHoverChange) onHoverChange(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${className} btn-${variant}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => onHoverChange && onHoverChange(true, 'default')}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// ─── Hero Section Integration Component (PREVIOUS PINNED VERSION RESTORED) ───

function Hero() {
  const heroWrapperRef = useRef(null);
  const heroInnerRef = useRef(null);
  const headlineRef = useRef(null);
  const nodeRefs = useRef({});
  const innerBadgeRefs = useRef({});
  const activeModuleRef = useRef(HERO_ORBIT_MODULES[0].id);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorOuterX = useSpring(cursorX, { stiffness: 500, damping: 32, mass: 0.5 });
  const cursorOuterY = useSpring(cursorY, { stiffness: 500, damping: 32, mass: 0.5 });

  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const pSmoothX = useSpring(parallaxX, { stiffness: 90, damping: 22 });
  const pSmoothY = useSpring(parallaxY, { stiffness: 90, damping: 22 });

  const theaterTransformX = useTransform(pSmoothX, (v) => v * 0.12);
  const theaterTransformY = useTransform(pSmoothY, (v) => v * 0.12);

  const handleInteractiveHover = (isHovered, targetType = 'default') => {
    if (isHovered) {
      if (targetType === 'badge') {
        gsap.to("#cr", { width: 80, height: 80, borderColor: "rgba(10, 88, 238, 0.6)", backgroundColor: "rgba(10, 88, 238, 0)", duration: 0.4, ease: "power3.out" });
        gsap.to("#cd", { scale: 0, opacity: 0, duration: 0.2 });
      } else {
        gsap.to("#cr", { width: 54, height: 54, backgroundColor: "rgba(10, 88, 238, 0.08)", borderColor: "rgba(10, 88, 238, 0.4)", duration: 0.3, ease: "power2.out" });
        gsap.to("#cd", { scale: 1.5, backgroundColor: "#0849C7", duration: 0.3 });
      }
    } else {
      gsap.to("#cr", { width: 36, height: 36, backgroundColor: "rgba(10, 88, 238, 0)", borderColor: "rgba(10, 88, 238, 0.25)", duration: 0.4, ease: "power3.out" });
      gsap.to("#cd", { scale: 1, backgroundColor: "var(--color-brand)", opacity: 1, duration: 0.3 });
    }
  };

  const splitTextIntoSpans = (textString) => {
    return textString.split("").map((char, index) => (
      <span key={index} className="char-mask-wrapper" style={{ display: 'inline-block', overflow: 'hidden' }}>
        <span className="char-item" style={{ display: 'inline-block', willChange: 'transform' }}>
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  useLayoutEffect(() => {
    if (nodeRefs.current[HERO_ORBIT_MODULES[0].id]) {
      nodeRefs.current[HERO_ORBIT_MODULES[0].id].classList.add('orbit-node--active');
    }

    const updateCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      parallaxX.set(((e.clientX - winW / 2) / (winW / 2)) * 20);
      parallaxY.set(((e.clientY - winH / 2) / (winH / 2)) * 20);
    };

    window.addEventListener('mousemove', updateCursor);
    ScrollTrigger.normalizeScroll(true);

    const wrapper = heroWrapperRef.current;
    const inner = heroInnerRef.current;
    const CURRENT_ORBIT_RADIUS = window.innerWidth < 768 ? 160 : 215;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.illustration-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.6, delay: 0.2 })
        .fromTo('.illustration-frame', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5 }, '-=1.1')
        .fromTo('.eyebrow-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' }, '-=1.2')
        .fromTo('.hero-headline .char-item', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.015 }, "-=1.3")
        .fromTo('.subhead-block', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.8')
        .fromTo('.metric-container-box', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.7')
        .fromTo('.cta-group-wrapper', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');

      document.querySelectorAll('.metric-num').forEach(el => {
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: 1.8,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
          onUpdate: () => { el.innerText = Math.floor(obj.val).toLocaleString('en-IN') + suffix; }
        });
      });

   gsap.timeline({
     scrollTrigger: {
       trigger: wrapper,
       start: "top top",
       // Reduce the duration from 5.0 to a tight, dramatic 2.5 for snappier engagement
       end: () => `+=${window.innerHeight * 1.5}`,
       pin: inner,
       pinSpacing: true,
       scrub: 1.5, // Increase scrub interpolation slightly for a high-inertia glide feel
       anticipatePin: 1,
       invalidateOnRefresh: true,
       onUpdate: (self) => {
         // Apply an entry power curve to the rotation so it ramps up elegantly
         const fluidProgress = Math.pow(self.progress, 1.2);
         const globalRotationOffset = fluidProgress * Math.PI * 2;

         const CURRENT_ORBIT_RADIUS = window.innerWidth < 768 ? 160 : 215;
         const stageScroll = 1.0 / HERO_ORBIT_MODULES.length;
         const activeIndex = Math.min(Math.floor(self.progress / stageScroll), HERO_ORBIT_MODULES.length - 1);

         HERO_ORBIT_MODULES.forEach((mod) => {
           const nodeEl = nodeRefs.current[mod.id];
           const internalBadge = innerBadgeRefs.current[mod.id];
           if (!nodeEl) return;

           const currentAngle = mod.baseAngle + globalRotationOffset;
           const posX = Math.cos(currentAngle) * CURRENT_ORBIT_RADIUS;
           const posY = Math.sin(currentAngle) * CURRENT_ORBIT_RADIUS;

           gsap.set(nodeEl, { x: posX, y: posY, z: 0.01, rotation: 0, force3D: true });

           if (internalBadge) {
             gsap.set(internalBadge, { rotation: -globalRotationOffset * (180 / Math.PI), force3D: true });
           }
         });

         const currentActiveId = HERO_ORBIT_MODULES[activeIndex].id;
         const prevActiveId = activeModuleRef.current;
         if (currentActiveId !== prevActiveId) {
           if (nodeRefs.current[prevActiveId]) nodeRefs.current[prevActiveId].classList.remove('orbit-node--active');
           if (nodeRefs.current[currentActiveId]) nodeRefs.current[currentActiveId].classList.add('orbit-node--active');
           activeModuleRef.current = currentActiveId;
         }
       }
     }
   });
    }, heroWrapperRef);

    const ro = new ResizeObserver(() => { requestAnimationFrame(() => ScrollTrigger.refresh()); });
    ro.observe(wrapper);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      ScrollTrigger.normalizeScroll(false);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <div className="noise-grain-overlay" />
      <motion.div id="cd" style={{ x: cursorX, y: cursorY }} />
      <motion.div id="cr" style={{ x: cursorOuterX, y: cursorOuterY }} />

      <div ref={heroWrapperRef} className="hero-wrapper">
        <div ref={heroInnerRef} className="hero-inner">
          <div className="bg-blobs-layer">
            <div className="mesh-blob blob-tl" />
            <div className="mesh-blob blob-br" />
          </div>

          <div className="hero-grid">
            <div className="hero-left">
              <div className="eyebrow-badge">
                <span>The Complete School Ecosystem</span>
              </div>
              <h1 ref={headlineRef} className="hero-headline">
                <div className="word-wrapper">{splitTextIntoSpans("One Platform.")}</div>
                <div className="word-wrapper headline-line--brand">{splitTextIntoSpans("Every Advantage.")}</div>
              </h1>
              <p className="subhead-block">
                Edufy simplifies school operations and enhances collaboration between teachers, students and parents.
              </p>

              <div className="cta-group-wrapper">
                <div className="cta-actions">
                  <MagneticButton variant="primary" onHoverChange={handleInteractiveHover}>
                    <span>Book a Demo</span>
                    <Icons.ArrowRight size={18} weight="bold" />
                  </MagneticButton>
                  <MagneticButton variant="secondary" onHoverChange={handleInteractiveHover}>
                    <Icons.PlayCircle size={22} weight="fill" className="play-icon-brand" />
                    <span>Watch Video</span>
                  </MagneticButton>
                </div>
              </div>

              {/* Trust pills preserved from light version */}
              <div className="hero-trust-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                {['500+ schools', 'ISO 27001', '48h setup'].map((item) => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.05)',
                    fontSize: '0.72rem', fontWeight: 500, color: T.mid,
                    fontFamily: T.syne,
                  }}>
                    <Icons.CheckCircle size={14} weight="fill" color={T.blue} />
                    {item}
                  </div>
                ))}
              </div>

              <div className="metric-container-box">
                <div className="metric-header-text">Real Results. Real Impact.</div>
                <div className="metric-strip">
                  <div className="metric-card">
                    <div className="metric-num" data-target="80" data-suffix="%">0%</div>
                    <div className="metric-label">Time Saved</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-num" data-target="70" data-suffix="%">0%</div>
                    <div className="metric-label">Paperwork Reduced</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-num" data-target="100" data-suffix="%">0%</div>
                    <div className="metric-label">Transparency</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <motion.div style={{ x: theaterTransformX, y: theaterTransformY }} className="theater-scene-container">
                <div className="illustration-halo" />
                <div className="orbit-shared-sandbox-container">
                  <svg className="orbit-ring-svg" viewBox="0 0 500 500">
                    <circle cx="250" cy="250" r="215" />
                  </svg>
                  <div className="illustration-frame">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQMAAABDsxwWAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACJJREFUaN7twTEBAAAAwiD7p7bGDmAAAAAAAAAAAAAAAAAAYNMC9gAB9S086QAAAABJRU5ErkJggg=="
                      alt="Edufy School Centerpiece Building"
                      className="transparent-png-overridden"
                      style={{ backgroundImage: 'url("/assets/hero-base.png")', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                    />
                  </div>
                  <div className="orbit-workspace">
                    <div className="orbit-nodes-absolute-pivot">
                      {HERO_ORBIT_MODULES.map((mod) => {
                        const IconComponent = Icons[mod.icon] || Icons.Circle;
                        return (
                          <div key={mod.id} ref={(el) => { if (el) nodeRefs.current[mod.id] = el; }} className="orbit-node-absolute-item">
                            <div className="orbit-node-container-link" onMouseEnter={() => handleInteractiveHover(true, 'badge')} onMouseLeave={() => handleInteractiveHover(false)}>
                              <div ref={(el) => { if (el) innerBadgeRefs.current[mod.id] = el; }} className="orbit-icon-badge">
                                <IconComponent size={22} weight="regular" />
                              </div>
                              <span className="orbit-node-label">{mod.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sticky Framework Notification Bar ────────────────────────────────────────

function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className={`sticky-bar ${show ? "show" : ""}`}>
      <div className="sticky-bar-text">
        <div className="sticky-bar-title">Join 500+ schools</div>
        <div className="sticky-bar-sub">Start your free trial · No credit card</div>
      </div>
      <a href="#cta" className="sticky-bar-cta">Book free demo →</a>
    </div>
  );
}

// ─── Global Navigation Bar ───────────────────────────────────────────────────

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
              <polygon points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2" stroke={T.blue} strokeWidth="0.9" fill="none" />
              <circle cx="6.5" cy="6.5" r="1.5" fill={T.blue} />
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

// ─── Trust Bar Module ──────────────────────────────────────────

function TrustBar() {
  return (
    <section className="trust-bar" style={{ background: '#f0f4ff', padding: '36px var(--gutter)', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 32 }}>
        <span style={{ fontFamily: T.syne, fontWeight: 700, fontSize: '0.85rem', color: T.mid, letterSpacing: '0.05em' }}>Trusted by 500+ schools across India</span>
        {['CBSE', 'ICSE', 'State Boards'].map((board) => (
          <div key={board} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.sans, fontSize: '0.8rem', fontWeight: 600, color: T.slate }}>
            <Icons.CheckCircle size={14} weight="fill" color={T.blue} />
            {board}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 3D Synchronized Modular Carousel (PREVIOUS VERSION RESTORED) ───────────

function ModulesCinematic() {
  const sectionRef = useRef(null);
  const rotatorRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dir] = useState(1);
  const mod = MODULES[activeIdx];

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
      <section ref={sectionRef} className="pms-sec pms-desktop" id="platform-modules">
        {/* Inject high-end ambient environment depth meshes */}
        <div className="pms-environmental-glow">
          <div className="pms-glow-orb pms-glow-left" />
          <div className="pms-glow-orb pms-glow-right" />
        </div> <div className="pms-layout">
          <div className="pms-left">
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
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ background: mod.accent, color: T.white, padding: '2px 10px', borderRadius: 99, fontFamily: T.syne, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {mod.badge}
                  </span>
                  <span style={{ fontFamily: T.syne, fontSize: '0.7rem', fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {mod.eyebrow}
                  </span>
                </div>
                <h3 className="pms-module-title" style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)", letterSpacing: "-0.02em", color: T.ink, margin: "0 0 12px" }}>
                  {mod.title}
                </h3>
                <h4 style={{ fontFamily: T.sans, fontSize: "1.1rem", fontWeight: 600, color: T.slate, marginBottom: 12, lineHeight: 1.4 }}>{mod.headline}</h4>
                <motion.p
                  className="pms-desc"
                  style={{ color: T.muted, marginBottom: 20, fontSize: "0.85rem", lineHeight: 1.6 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.20, duration: 0.52 }}
                >
                  {mod.desc}
                </motion.p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {mod.features.map((f) => (
                    <span key={f} style={{ padding: '3px 10px', borderRadius: 99, background: T.sky, border: `1px solid ${T.skyDeep}`, fontFamily: T.syne, fontSize: '0.65rem', fontWeight: 700, color: T.blue, textTransform: 'uppercase' }}>
                      {f}
                    </span>
                  ))}
                </div>

                <motion.div
                  className="pms-stat-block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.44, ease: EXPO }}
                >
                  <span className="pms-stat-num" style={{ color: mod.accent }}>{mod.stat}</span>
                  <span className="pms-stat-lbl" style={{ color: T.mid }}>{mod.statLabel}</span>
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
              <span className="pms-nav-hint" style={{ color: T.dim }}>Scroll to explore</span>
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
                        style={{ transform: `rotateY(${angleDeg}deg) translateZ(${RADIUS}px)` }}
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
    <section className="pms-sec pms-mobile" id="platform-modules-mob">
      <div className="pms-mobile-inner">
        <div className="pms-section-label" style={{ justifyContent: "center" }}>
          <span className="pms-section-dot" style={{ background: T.blue }} />
          <span style={{ fontFamily: T.syne, fontSize: "0.575rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: T.mid }}>Platform Modules</span>
        </div>
        <h2 className="pms-mobile-title" style={{ fontFamily: T.syne, color: T.ink }}>
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

// ─── Mid-Page CTA Module ────────────────────────────────────────────

function MidPageCTA() {
  return (
    <section className="mid-cta" style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.blueDark})`, color: T.white, padding: '48px var(--gutter)', textAlign: 'center' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          Ready to transform your school?
        </h2>
        <p style={{ fontFamily: T.sans, fontSize: '1rem', opacity: 0.9, marginBottom: 28 }}>
          Join 500+ schools who have simplified their operations. Start your free trial with zero commitment.
        </p>
        <a href="#cta" style={{
          display: 'inline-block', padding: '14px 32px', borderRadius: 10,
          background: T.white, color: T.blue, fontWeight: 600, fontFamily: T.sans,
          fontSize: '0.95rem', textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'transform 0.15s',
        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = ''}>
          Book a free demo →
        </a>
      </div>
    </section>
  );
}

// ─── Testimonials Module ─────────────────────────────────────────────

function Testimonials() {
  const metrics = [
    { icon: 'Clock', value: '80%', label: 'Time Saved' },
    { icon: 'FileText', value: '70%', label: 'Paperwork Reduced' },
    { icon: 'Users', value: '100%', label: 'Transparency' },
    { icon: 'TrendUp', value: '₹2.1L', label: 'Recovered in month one' },
  ];
  return (
    <section className="testimonials" style={{ background: T.snow, padding: "clamp(48px, 6vw, 64px) var(--gutter)", textAlign: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", color: T.ink, margin: "0 0 40px" }}>
            Measurable impact, <em>real results.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
            {metrics.map((item) => {
              const IconComp = Icons[item.icon] || Icons.Star;
              return (
                <div key={item.label} style={{
                  background: T.white, borderRadius: 14, padding: '24px 16px',
                  border: `1px solid ${T.frost}`, boxShadow: T.sh,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                }}>
                  <IconComp size={28} weight="duotone" color={T.blue} />
                  <div style={{ fontFamily: T.syne, fontSize: '2rem', fontWeight: 700, color: T.ink }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: T.sans, fontSize: '0.85rem', color: T.muted }}>
                    {item.label}
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

// ─── Deployment Models Pipeline ─────────────────────────────────────────────

function DeploymentModelsSection() {
  return (
    <section id="deployment" style={{ background: T.snow, padding: "clamp(48px, 6vw, 64px) clamp(24px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Reveal><Eyebrow>How Edufy works with your school</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h2 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.08, color: T.ink, margin: "0 0 14px" }}>
              From zero to operational in 48 hours.
            </h2>
            <p style={{ fontFamily: T.sans, fontSize: "0.9rem", color: T.muted, lineHeight: 1.65, maxWidth: "50ch", margin: "0 auto 48px" }}>
              A proven process designed to get your school up and running with zero disruption.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(20px, 3vw, 40px)", marginBottom: 56 }}>
          {DEPLOYMENT_STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 0.12} dir="s">
              <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div className="cj-step-num-circle" style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(145deg,#1D4ED8 0%,#2563EB 60%,#3B82F6 100%)",
                  boxShadow: "0 0 0 3px rgba(37,99,235,0.08), 0 2px 8px rgba(37,99,235,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <span style={{ fontFamily: T.syne, fontSize: 10, fontWeight: 700, color: T.white }}>{step.step}</span>
                </div>
                <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.16em", textTransform: "uppercase", color: T.blue, marginBottom: 6 }}>
                  {step.time}
                </div>
                <h3 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "1.1rem", color: T.ink, margin: "0 0 8px" }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.muted, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <h3 style={{ textAlign: "center", fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: T.ink, marginBottom: 32 }}>
            Choose your level of partnership
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 960, margin: "0 auto" }}>
            {PARTNERSHIP_TIERS.map((tier, i) => (
              <div key={i} style={{
                background: tier.featured ? T.white : "transparent",
                borderRadius: 14, padding: "24px 20px",
                border: tier.featured ? `1px solid ${T.skyDeep}` : "1px solid transparent",
                boxShadow: tier.featured ? "0 4px 16px rgba(37,99,235,0.08)" : "none",
                textAlign: "center", position: "relative",
              }}>
                {tier.featuredLabel && (
                  <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: T.blue, color: T.white, fontFamily: T.syne, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 99, whiteSpace: "nowrap" }}>
                    {tier.featuredLabel}
                  </div>
                )}
                <h4 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "1.25rem", color: T.ink, marginBottom: 8 }}>{tier.name}</h4>
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
              { icon: Icons.RocketLaunch, title: "Go Live in 48 Hours", sub: "Guaranteed" },
              { icon: Icons.GraduationCap, title: "Free Staff Training", sub: "Included with every plan" },
              { icon: Icons.ShieldCheck, title: "ISO 27001 Certified", sub: "Data stored in India" },
              { icon: Icons.ChatCircle, title: "6AM–10PM Support", sub: "WhatsApp & email" },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <item.icon size={20} weight="duotone" color={T.blue} />
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

// ... Rest of your structural utility components (FAQ, Eyebrow, CTA, Footer, MobileWhatsAppFloat, and main App assembly code block) remain exactly intact as in your light version.
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="af-sec" id="faq" aria-label="Frequently Asked Questions" style={{ background: T.white, position: "relative", overflow: "hidden" }}>
      <div className="af-inner" style={{ position: "relative", zIndex: 1 }}>
        <div className="af-header">
          <div className="af-header-left">
            <Reveal><Eyebrow>FAQ</Eyebrow></Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(2.2rem,4vw,3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: T.ink, margin: 0 }}>
                Questions<br /><em>answered.</em>
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
            <div style={{ marginTop: 12 }}>
              <a href="#pricing" style={{ fontFamily: T.sans, fontSize: "0.82rem", fontWeight: 600, color: T.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icons.Info size={14} />
                View pricing details
              </a>
            </div>
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
                    aria-expanded={isActive}
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
      </div>
    </section>
  );
}

function Eyebrow({ children, light = false, ruleWidth = 22 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: T.syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: light ? "rgba(147,197,253,0.72)" : T.blue, marginBottom: 20 }}>
      <span style={{ display: "block", width: ruleWidth, height: 1, background: "currentColor", opacity: 0.7, borderRadius: 1 }} />
      {children}
      <span style={{ display: "block", width: ruleWidth, height: 1, background: "currentColor", opacity: 0.7, borderRadius: 1 }} />
    </div>
  );
}

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
          <h2 style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "clamp(2.4rem,5vw,4rem)", letterSpacing: "-0.04em", lineHeight: 1.02, color: T.ink, margin: "0 0 12px" }}>
            Your school deserves<br /><em>better software.</em>
          </h2>
          <p style={{ fontFamily: T.sans, fontSize: "0.92rem", color: T.muted, lineHeight: 1.7, margin: "0 0 28px" }}>
            Join 500+ schools · Go live in 48 hours · No credit card required
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { icon: Icons.Buildings, text: "500+ schools already live" },
              { icon: Icons.Lightning, text: "48-hour go-live guarantee" },
              { icon: Icons.ShieldCheck, text: "ISO 27001 · Data in India" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: T.white, border: `1px solid ${T.frost}`, boxShadow: T.sh, fontFamily: T.sans, fontSize: "0.72rem", fontWeight: 500, color: T.mid }}>
                <item.icon size={14} weight="duotone" color={T.blue} />
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
                <Icons.ChatCircle size={16} weight="duotone" color={T.green} /> Or chat directly on WhatsApp
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
    <footer style={{ background: "#f8fafc", color: T.mid, borderTop: `1px solid ${T.frost}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div className="nav-mark" style={{ width: 28, height: 28, borderRadius: 7 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <polygon points="6.5,0.8 12.2,4.2 12.2,9.0 6.5,12.2 0.8,9.0 0.8,4.2" stroke={T.blue} strokeWidth="0.9" fill="none" />
                  <circle cx="6.5" cy="6.5" r="1.5" fill={T.blue} />
                </svg>
              </div>
              <span style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "12px", letterSpacing: "0.17em", color: T.slate }}>EDUFY</span>
            </div>
            <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: T.dim, lineHeight: 1.5, marginBottom: 10 }}>SCHOOL MANAGEMENT · BUILT FOR INDIA</div>
            <p style={{ fontFamily: T.sans, fontSize: "12.5px", color: T.muted, lineHeight: 1.78, maxWidth: "270px", fontWeight: 400, marginBottom: 16, letterSpacing: "-0.008em" }}>
              Simplifying operations so educators can focus on what they came here to do — teaching.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 11px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 6, background: "rgba(0,0,0,0.02)", marginBottom: 16, fontFamily: T.syne, fontWeight: 700, fontSize: "8.5px", letterSpacing: "0.05em", textTransform: "uppercase", color: T.muted }}>
              🔒  ISO 27001 · PDPB Compliant · Data in India
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["𝕏", "in", "▶", "💬"].map((icon, i) => (
                <button key={i} style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.03)", color: T.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontFamily: T.sans, fontWeight: 600, cursor: "pointer", transition: "background 0.15s ease,border-color 0.15s ease,color 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = T.slate; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.color = T.muted; }}
                >{icon}</button>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: T.syne, fontWeight: 700, fontSize: "8px", letterSpacing: "0.20em", textTransform: "uppercase", color: T.dim, marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontFamily: T.sans, fontSize: "12.5px", color: T.muted, textDecoration: "none", transition: "color 0.15s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = T.slate}
                    onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                  >{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: T.frost, margin: "0 0 24px" }} />
        <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between", flexWrap: "wrap", gap: 8, paddingTop: 14 }}>
          <span style={{ fontFamily: T.sans, fontSize: "11px", color: T.dim, letterSpacing: "-0.005em" }}>© 2026 Edufy Technologies Pvt. Ltd.</span>
          <div style={{ display: "flex", gap: "clamp(10px,1.8vw,20px)", flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Security", "Cookies"].map((l) => (
              <a key={l} href="#" style={{ fontFamily: T.sans, fontSize: "11px", color: T.dim, textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.color = T.muted}
                onMouseLeave={(e) => e.currentTarget.style.color = T.dim}
              >{l}</a>
            ))}
          </div>
          <div style={{ fontFamily: T.syne, fontSize: "9px", fontWeight: 700, color: T.dim, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Made with <span style={{ color: "#f87171" }}>♥</span> in Hyderabad, India
          </div>
        </div>
      </div>
    </footer>
  );
}

function MobileWhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919999999999?text=Hi%2C+I+want+to+know+more+about+Edufy"
      target="_blank"
      rel="noopener"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.524 5.848L0 24l6.336-1.502A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.359-.213-3.722.882.924-3.62-.234-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
      </svg>
    </a>
  );
}

export default function App() {
  return (
    <>
      <div id="noise" aria-hidden="true" />
      <Cursor />
      <Nav />
      <Hero />
      <TrustBar />
      <Divider />
      <ModulesCinematic />
      <Divider />
      <MidPageCTA />
      <Divider />
      <Testimonials />
      <Divider />
      <DeploymentModelsSection />
      <Divider />
      <FAQ />
      <Divider />
      <CTA />
      <Footer />
      <MobileWhatsAppFloat />
      <StickyBar />
    </>
  );
}