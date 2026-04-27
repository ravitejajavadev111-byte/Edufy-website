import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// ============================================================
// IMAGE PATHS
// ============================================================
const IMAGES = {
  hero: "/assets/hero.png",
  adminFees: "/assets/admin-fees.png",
  parentAttendance: "/assets/parent-attendance.png",
  parentComplaints: "/assets/parent-complaints.png",
  parentHome: "/assets/parent-home.png",
  parentReports: "/assets/parent-reports.png",
  founder: "/assets/founder.png",
};

// ============================================================
// REUSABLE IMAGE BLOCK
// ============================================================
const ImageBlock: React.FC<{
  src: string;
  alt: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
}> = ({ src, alt, className = "", containerStyle, imgStyle }) => (
  <div className={`image-block ${className}`} style={containerStyle}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "100%", display: "block", ...imgStyle }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  </div>
);

// ============================================================
// FEATURES
// ============================================================
type Feature = {
  title: string;
  desc: string;
  img: string;
  color: string;
};

const FEATURES: Feature[] = [
  { title: "Smart Attendance", desc: "Mark per section, instant parent notifications.", img: IMAGES.parentAttendance, color: "#34D399" },
  { title: "Exam & Results", desc: "Exam cycles, grades, rank & progress tracking.", img: IMAGES.parentReports, color: "#A78BFA" },
  { title: "Fee Management", desc: "Collections, dues, and payment tracking.", img: IMAGES.adminFees, color: "#FB7185" },
  { title: "Complaints", desc: "Raise concerns, track resolution status.", img: IMAGES.parentComplaints, color: "#22D3EE" },
  { title: "Parent Portal", desc: "Stay connected with your child's progress.", img: IMAGES.parentHome, color: "#F472B6" },
];

const CAROUSEL_FEATURES = FEATURES;

// ============================================================
// UTILITY HOOKS
// ============================================================
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return pos;
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible on mount?
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, visible } = useReveal(0.08);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

function StatCounter({ end, suffix = "+" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const inc = end / steps;
    let cur = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      cur = Math.min(end, Math.round(cur + inc));
      setCount(cur);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ============================================================
// STORY‑DRIVEN 3D MODULES
// ============================================================
const StoryModules: React.FC<{ features: Feature[]; enabled: boolean }> = ({ features, enabled }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centralTextRef = useRef<HTMLDivElement>(null);
  const centralSubRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const mountedRef = useRef(true);
  const lastIndexRef = useRef(-1);
  const prevFeatureRef = useRef<Feature | null>(null);

  const featuresRef = useRef(features);
  const numCardsRef = useRef(features.length);
  const radiusRef = useRef(400);
  featuresRef.current = features;
  numCardsRef.current = features.length;

  const mouse = useMousePosition();

  useEffect(() => {
    const el = perspectiveRef.current;
    if (!el) return;
    const ox = 48 + (mouse.x - 0.5) * 24;
    const oy = 42 + (mouse.y - 0.5) * 18;
    el.style.perspectiveOrigin = `${ox}% ${oy}%`;
  }, [mouse]);

  const animateCenterText = (newFeature: Feature) => {
    if (!centralTextRef.current || !centralSubRef.current) return;
    const prev = prevFeatureRef.current;
    if (prev && prev.title === newFeature.title) return;

    const tl = gsap.timeline();
    tl.to([centralTextRef.current, centralSubRef.current], {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        if (centralTextRef.current) {
          centralTextRef.current.textContent = newFeature.title;
          centralTextRef.current.style.color = newFeature.color;
        }
        if (centralSubRef.current) {
          centralSubRef.current.textContent = newFeature.desc;
        }
      },
    }).to([centralTextRef.current, centralSubRef.current], {
      opacity: 1,
      duration: 0.3,
    });

    prevFeatureRef.current = newFeature;
  };

  useLayoutEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;
    if (!section || !carousel) return;

    mountedRef.current = true;
    lastIndexRef.current = -1;
    prevFeatureRef.current = null;

    const ctx = gsap.context(() => {
      const numCards = numCardsRef.current;
      const radius = radiusRef.current;
      const feat = featuresRef.current;

      // Initial positions
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const baseAngle = (360 / numCards) * i;
        gsap.set(card, {
          rotationY: baseAngle,
          z: radius,
          scale: 0.7,
          opacity: 0.3,
          backfaceVisibility: "hidden",
          transformOrigin: "center center",
        });
      });

      const updateStory = () => {
        if (!mountedRef.current) return;

        const angle = gsap.getProperty(carousel, "rotationY") as number;
        const step = 360 / numCards;
        const rawIndex = Math.round(((angle % 360) + 360) % 360 / step) % numCards;

        if (rawIndex === lastIndexRef.current) return;
        lastIndexRef.current = rawIndex;

        const currentFeature = feat[rawIndex];
        animateCenterText(currentFeature);

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const baseAngle = step * i;
          let diff = ((angle + baseAngle) % 360 + 180) % 360 - 180;
          const frontness = 1 - Math.min(Math.abs(diff) / 90, 1);
          const scale = 0.65 + frontness * 0.35;
          const opacity = 0.15 + frontness * 0.85;

          gsap.set(card, {
            rotationY: baseAngle,
            z: radius - Math.abs(diff) * 2,
            scale,
            opacity,
            backfaceVisibility: "hidden",
          });

          if (i === rawIndex) {
            card.classList.add("is-front");
          } else {
            card.classList.remove("is-front");
          }
        });
      };

      gsap.to(carousel, {
        rotationY: -420,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.5}`,
          pin: true,
          pinSpacing: true,
          pinReparent: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: updateStory,
        },
      });

      updateStory();
    }, section);

    ctxRef.current = ctx;

    return () => {
      mountedRef.current = false;
      ctx.revert();
      ScrollTrigger.getAll().forEach((st: any) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, [enabled]);

  const getInitialTransform = (i: number) =>
    `rotateY(${(360 / features.length) * i}deg) translateZ(${400}px) scale(0.7)`;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        zIndex: 15,
        overflow: "hidden",
        background: "linear-gradient(180deg, #0A0A14 0%, #050510 50%, #020208 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", padding: "60px 2rem 0", position: "relative", zIndex: 16 }}>
        <span style={{
          display: "inline-block", padding: "6px 22px", borderRadius: "100px",
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
          color: "#A5B4FC", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", marginBottom: "20px",
        }}>The Solution</span>
        <h2 style={{
          fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#F1F5F9",
          letterSpacing: "-0.04em", marginBottom: "10px",
        }}>One platform, every module</h2>
        <p style={{ color: "#94A3B8", fontSize: "1rem" }}>Scroll to explore your school’s new command center</p>
      </div>

      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 20, textAlign: "center", pointerEvents: "none",
      }}>
        <div ref={centralTextRef} style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em",
          color: "#F1F5F9", marginBottom: "12px", textShadow: "0 0 40px rgba(0,0,0,0.8)",
        }}>Smart Attendance</div>
        <div ref={centralSubRef} style={{
          fontSize: "1.1rem", color: "#CBD5E1", maxWidth: "400px", margin: "0 auto",
          fontStyle: "italic",
        }}>Mark per section, instant parent notifications.</div>
      </div>

      <div
        ref={perspectiveRef}
        style={{
          perspective: "1400px", perspectiveOrigin: "50% 45%", width: "100%", height: "85vh",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1,
        }}
      >
        <div ref={carouselRef} style={{
          transformStyle: "preserve-3d", position: "relative", width: 0, height: 0, willChange: "transform",
        }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (cardRefs.current[i] = el)}
              className="story-module-card"
              style={{
                position: "absolute", top: "50%", left: "50%", width: "280px",
                marginLeft: "-140px", marginTop: "-190px",
                borderRadius: "28px", overflow: "hidden",
                background: "rgba(18,18,40,0.75)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                willChange: "transform", userSelect: "none",
                transition: "border-color 0.5s ease, box-shadow 0.5s ease",
                transform: getInitialTransform(i),
                opacity: 0.3,
              }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#0A0A1A" }}>
                <img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#0A0A1A",
                    padding: "10px",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div style={{ padding: "16px 18px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#F1F5F9", marginBottom: "4px" }}>{f.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .story-module-card.is-front {
          border-color: rgba(129,140,248,0.9) !important;
          box-shadow: 0 0 100px rgba(99,102,241,0.4), 0 35px 90px rgba(0,0,0,0.8) !important;
        }
      `}</style>
    </section>
  );
};

// ============================================================
// FALLBACK GRID
// ============================================================
function FeatureGridFallback({ enabled }: { enabled: boolean }) {
  return (
    <section style={{ padding: "100px 2rem", background: "#06060E", display: enabled ? "block" : "none" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <span style={{
          display: "inline-block", padding: "6px 20px", borderRadius: "100px",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
          color: "#A5B4FC", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: "16px",
        }}>The Solution</span>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.03em" }}>Every module your school needs</h2>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
        gap: "20px", maxWidth: "1100px", margin: "0 auto",
      }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{
            background: "rgba(255,255,255,0.025)", borderRadius: "20px", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#0A0A1A" }}>
              <img
                src={f.img}
                alt={f.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#0A0A1A",
                  padding: "12px",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#F1F5F9", marginBottom: "4px" }}>{f.title}</h3>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// PROBLEM SECTION
// ============================================================
function ProblemSection() {
  return (
    <section style={{ padding: "100px 2rem", background: "#06060E", textAlign: "center" }}>
      <Reveal>
        <h2 style={{
          fontSize: "clamp(2.2rem, 5vw, 3rem)", fontWeight: 700, color: "#F1F5F9",
          letterSpacing: "-0.04em", maxWidth: "650px", margin: "0 auto 24px",
        }}>Schools still run on spreadsheets, WhatsApp, and guesswork.</h2>
        <p style={{ fontSize: "1.1rem", color: "#94A3B8", maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.6 }}>
          It’s time for a system that connects everyone—teachers, parents, students—into one intelligent, easy‑to‑use platform.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          {["No more lost data", "Instant parent updates", "One login for everything"].map((text, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px", padding: "18px 28px", backdropFilter: "blur(10px)",
              color: "#CBD5E1", fontSize: "0.95rem", fontWeight: 500,
            }}>{text}</div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ============================================================
// TRANSPORT SECTION
// ============================================================
function TransportSection() {
  const [dot, setDot] = useState({ x: 20, y: 60 });
  const [progress, setProgress] = useState(0);
  const path = [
    { x: 20, y: 60 }, { x: 30, y: 48 }, { x: 42, y: 42 },
    { x: 55, y: 38 }, { x: 67, y: 42 }, { x: 75, y: 55 }, { x: 78, y: 65 },
  ];

  useEffect(() => {
    let idx = 0;
    const iv = setInterval(() => {
      idx = (idx + 1) % path.length;
      setDot(path[idx]);
      setProgress(Math.round((idx / (path.length - 1)) * 100));
    }, 900);
    return () => clearInterval(iv);
  }, []);

  return (
    <section style={{ padding: "100px 2rem", background: "#0A0A14" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{
            display: "inline-block", padding: "6px 22px", borderRadius: "100px",
            background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.22)",
            color: "#FACC15", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: "18px",
          }}>● Live Feature</span>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.04em", marginBottom: "12px" }}>
            Real‑time Transport Tracking
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "1rem" }}>Parents see the bus on a live map—no more waiting.</p>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px", maxWidth: "960px", margin: "0 auto", alignItems: "center" }}>
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "28px", padding: "24px", backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
            <span style={{ padding: "4px 12px", borderRadius: "8px", background: "rgba(99,102,241,0.15)", color: "#A5B4FC", fontSize: "0.75rem", fontWeight: 600 }}>LIVE</span>
            <span style={{ padding: "4px 12px", borderRadius: "8px", background: "rgba(52,211,153,0.12)", color: "#34D399", fontSize: "0.75rem", fontWeight: 600 }}>Bus #3 Active</span>
          </div>
          <svg viewBox="0 0 100 80" style={{ width: "100%", borderRadius: "14px" }}>
            <rect width="100" height="80" fill="#0F0F1E" />
            {[15, 30, 45, 60, 75].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="80" stroke="#1E1E3A" strokeWidth="0.5" />)}
            {[15, 30, 45, 60, 75].map(y => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#1E1E3A" strokeWidth="0.5" />)}
            <polyline points={path.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="4,4" opacity="0.7" />
            <circle cx="78" cy="65" r="4.5" fill="#FACC15" opacity="0.2" />
            <circle cx="78" cy="65" r="2.8" fill="#FACC15" />
            <text x="80" y="68" fontSize="4.2" fill="#FACC15" fontWeight="600">School</text>
            <circle cx={dot.x} cy={dot.y} r="5.5" fill="#6366F1" opacity="0.35" style={{ transition: "all 0.8s ease" }} />
            <circle cx={dot.x} cy={dot.y} r="3" fill="#6366F1" style={{ transition: "all 0.8s ease" }} />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "18px", padding: "22px", backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "8px" }}>ETA to School</div>
            <div style={{ fontSize: "2.6rem", fontWeight: 700, color: "#F1F5F9" }}>8 <span style={{ fontSize: "1rem", color: "#64748B" }}>min</span></div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "18px", padding: "22px", backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "10px" }}>Route Progress</div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #6366F1, #22D3EE)", borderRadius: "100px", transition: "width 0.8s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748B", marginTop: "10px" }}>
              <span>Start</span><span>{progress}%</span><span>School</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOUNDER SECTION
// ============================================================
function FounderSection() {
  return (
    <section style={{
      padding: "100px 2rem",
      background: "linear-gradient(180deg, #0A0A14 0%, #06060E 100%)",
      borderTop: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "48px",
        flexWrap: "wrap", maxWidth: "900px", margin: "0 auto",
      }}>
        <div style={{ flex: "1 1 240px", textAlign: "center" }}>
          <div style={{
            width: "280px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}>
            <img
              src={IMAGES.founder}
              alt="Founder"
              loading="lazy"
              decoding="async"
              style={{ width: "100%", display: "block", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>
        <div style={{ flex: "1 1 340px", color: "#F1F5F9" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "16px", letterSpacing: "-0.03em" }}>
            Built by founders who understand schools
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#94A3B8", lineHeight: 1.6 }}>
            Our team has spent decades in education and technology—designing a platform that works the way schools really operate.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA
// ============================================================
function CTASection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section style={{
      padding: "100px 2rem 100px", textAlign: "center",
      background: "radial-gradient(ellipse at 50% 50%, rgba(26,26,58,0.8) 0%, transparent 70%)",
      borderTop: "1px solid rgba(255,255,255,0.04)",
    }}>
      <Reveal>
        <h2 style={{
          fontSize: "clamp(2.4rem, 5vw, 3.2rem)", fontWeight: 800, color: "#F1F5F9",
          letterSpacing: "-0.04em", marginBottom: "16px", lineHeight: 1.3,
        }}>
          Stop running your school on WhatsApp & Excel.
        </h2>
        <p style={{ fontSize: "1.05rem", color: "#94A3B8", marginBottom: "38px" }}>
          Join the schools already using SchoolOS to run their entire operations.
        </p>
        {!sent ? (
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email" placeholder="school@yourdomain.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px", padding: "15px 24px", fontSize: "0.95rem", color: "#F1F5F9",
                outline: "none", width: "280px", backdropFilter: "blur(14px)", transition: "border-color 0.3s",
              }}
            />
            <button
              onClick={() => setSent(true)}
              style={{
                background: "linear-gradient(135deg, #6366F1, #22D3EE)", border: "none", borderRadius: "14px",
                color: "#fff", padding: "15px 32px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 8px 32px rgba(99,102,241,0.45)", transition: "all 0.3s",
              }}
            >Request Early Access</button>
          </div>
        ) : (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 30px",
            background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: "14px", color: "#34D399", fontWeight: 600,
          }}>✓ You're on the list! We'll be in touch.</div>
        )}
      </Reveal>
    </section>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "68px", padding: "0 2.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1000,
      background: scrolled ? "rgba(6,6,14,0.75)" : "transparent",
      backdropFilter: scrolled ? "blur(30px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "all 0.5s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6366F1, #22D3EE)", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }} />
        <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#F1F5F9", letterSpacing: "-0.03em" }}>SchoolOS</span>
      </div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {["Product", "Features", "Security"].map(l => (
          <a key={l} href="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.8rem", fontWeight: 500, transition: "color 0.2s" }}>{l}</a>
        ))}
        <button style={{
          background: "linear-gradient(135deg, #6366F1, #22D3EE)", border: "none", borderRadius: "10px",
          color: "#fff", padding: "9px 22px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 18px rgba(99,102,241,0.4)", transition: "all 0.3s",
        }}>Request Demo</button>
      </div>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-title", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
      gsap.fromTo(".hero-sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
      gsap.fromTo(".hero-btns", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} style={{
      position: "relative", zIndex: 10, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "150px 2rem 4rem",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "65vw", height: "65vw", background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "0%", right: "5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <div className="hero-container" style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "48px", maxWidth: "1200px", width: "100%", flexWrap: "wrap",
      }}>
        {/* Text */}
        <div style={{ flex: "1 1 400px", textAlign: "left" }}>
          <div className="hero-title" style={{ marginBottom: "24px" }}>
            <span style={{
              display: "inline-block", padding: "6px 22px", borderRadius: "100px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              color: "#A5B4FC", fontSize: "0.8rem", fontWeight: 600, marginBottom: "28px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", boxShadow: "0 0 12px #6366F1", display: "inline-block", marginRight: "8px" }} />
              All‑in‑One School ERP
            </span>
            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.08,
              letterSpacing: "-0.04em", color: "#F1F5F9",
            }}>
              <span style={{
                background: "linear-gradient(135deg, #A5B4FC 0%, #22D3EE 60%, #818CF8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>The OS for modern schools</span>
            </h1>
          </div>
          <p className="hero-sub" style={{ fontSize: "1.1rem", color: "#94A3B8", maxWidth: "480px", lineHeight: 1.7, marginBottom: "32px" }}>
            Connect students, parents, teachers, and administrators into one intelligent, beautifully designed system.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button style={{
              background: "linear-gradient(135deg, #6366F1, #22D3EE)", border: "none", borderRadius: "14px",
              color: "#fff", padding: "15px 34px", fontSize: "1rem", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 10px 35px rgba(99,102,241,0.45)", transition: "all 0.3s",
            }}>Get Early Access</button>
            <button style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px", color: "#F1F5F9", padding: "15px 34px", fontSize: "1rem",
              fontWeight: 500, cursor: "pointer", backdropFilter: "blur(14px)", transition: "all 0.3s",
            }}>▶ Watch Overview</button>
          </div>
        </div>

        {/* Hero image */}
        <div style={{ flex: "1 1 500px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)",
              width: "80%", height: "40%", background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent)",
              filter: "blur(60px)", zIndex: -1,
            }} />
            <div
              className="hero-image-wrapper"
              style={{
                maxWidth: "720px",
                transform: "perspective(1200px) rotateY(-8deg)",
                boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <img
                src={IMAGES.hero}
                alt="SchoolOS Dashboard"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", display: "block", borderRadius: "20px" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STATS BAR
// ============================================================
function StatsBar() {
  return (
    <section style={{
      padding: "3.5rem 2rem", background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.01) 50%, transparent 100%)",
      borderTop: "1px solid rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.03)",
      display: "flex", justifyContent: "center", gap: "clamp(2rem, 6vw, 5rem)", flexWrap: "wrap", textAlign: "center",
    }}>
      {[
        { end: 120, label: "Schools onboarded" },
        { end: 8500, label: "Active students" },
        { end: 98, label: "Parent satisfaction", suffix: "%" },
        { end: 14, label: "Countries" },
      ].map(s => (
        <div key={s.label}>
          <div style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800,
            background: "linear-gradient(135deg, #A5B4FC, #22D3EE)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            <StatCounter end={s.end} suffix={s.suffix || "+"} />
          </div>
          <div style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "4px", letterSpacing: "-0.01em" }}>{s.label}</div>
        </div>
      ))}
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.04)", padding: "24px 2.5rem",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: "16px", color: "#64748B", fontSize: "0.8rem", background: "#06060E",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #6366F1, #22D3EE)" }} />
        <span>© 2025 SchoolOS · All rights reserved</span>
      </div>
      <div style={{ display: "flex", gap: "24px" }}>
        {["Privacy", "Terms", "Contact"].map(l => (
          <a key={l} href="#" style={{ color: "#64748B", textDecoration: "none", transition: "color 0.2s" }}>{l}</a>
        ))}
      </div>
    </footer>
  );
}

// ============================================================
// GLOBAL STYLES
// ============================================================
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { } /* removed scroll-behavior */

      body {
        background: #06060E;
        color: #F1F5F9;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body::after {
        content: "";
        position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.02;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      }

      .image-block {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
      }
      .image-block img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .hero-image-wrapper {
        animation: heroFloat 6s ease-in-out infinite;
      }
      @keyframes heroFloat {
        0% { transform: perspective(1200px) rotateY(-8deg) translateY(0px); }
        50% { transform: perspective(1200px) rotateY(-8deg) translateY(-12px); }
        100% { transform: perspective(1200px) rotateY(-8deg) translateY(0px); }
      }

      .founder-image img {
        width: 100%;
        border-radius: 20px;
        object-fit: cover;
      }

      @media (max-width: 768px) {
        .hero-container {
          flex-direction: column;
          text-align: center;
        }
        .hero-container .hero-title {
          text-align: center;
        }
        .hero-btns {
          justify-content: center;
        }
      }

      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #06060E; }
      ::-webkit-scrollbar-thumb { background: #1E1E3A; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #2E2E4A; }

      ::selection { background: rgba(99,102,241,0.25); color: #F1F5F9; }
    `}</style>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [is3D, setIs3D] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const check = () => setIs3D(mql.matches);
    check();
    mql.addEventListener("change", check);
    return () => mql.removeEventListener("change", check);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#06060E" }}>
      <GlobalStyles />
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSection />
      <ErrorBoundary fallback={<FeatureGridFallback enabled={true} />}>
        <StoryModules features={CAROUSEL_FEATURES} enabled={is3D} />
      </ErrorBoundary>
      <FeatureGridFallback enabled={!is3D} />
      <TransportSection />
      <FounderSection />
      <CTASection />
      <Footer />
    </div>
  );
}