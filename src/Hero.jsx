import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "@phosphor-icons/react";
import "./Hero.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_ORBIT_MODULES = [
  { id: "analytics", name: "Analytics", icon: "ChartBar", desc: "Real-time dashboards with actionable insights, built for school leaders." },
  { id: "transport", name: "Transport", icon: "Bus", desc: "Live GPS tracking, route optimization, and parent alerts." },
  { id: "communication", name: "Communication", icon: "ChatCircle", desc: "Instant circulars, incident reports, and parent-teacher chat." },
  { id: "parents", name: "Parents", icon: "Users", desc: "A single portal for grades, attendance, fees, and school updates." },
  { id: "exams", name: "Exams", icon: "FileText", desc: "End-to-end exam scheduling, hall tickets, and digital results." },
  { id: "fees", name: "Fees", icon: "CurrencyInr", desc: "Automated fee collection, defaulter tracking, and instant receipts." },
  { id: "attendance", name: "Attendance", icon: "UsersThree", desc: "Period‑level attendance, live dashboards, and biometric sync." }
];

const moduleCount = HERO_ORBIT_MODULES.length;
HERO_ORBIT_MODULES.forEach((mod, i) => {
  mod.angleDeg = -90 + (i * (360 / moduleCount));
});

const STAGE_COPY = {
  intro: "Edufy simplifies school operations and enhances collaboration between teachers, students and parents.",
  finale: "A complete operating system for modern schools. No more fragmented tools. Just one platform that works the way you do."
};

const STATS_DATA = [
  { id: "time", value: "80%", label: "Time Saved", icon: "Clock" },
  { id: "paper", value: "70%", label: "Paperwork Reduced", icon: "FileText" },
  { id: "transparency", value: "100%", label: "Transparency", icon: "ShieldCheck" }
];

const MagneticButton = ({ children, variant = "primary", onClick }) => {
  const buttonRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const intensity = variant === "primary" ? 0.15 : 0.08;
    setCoords({ x: (clientX - centerX) * intensity, y: (clientY - centerY) * intensity });
  };

  const handleMouseLeave = () => setCoords({ x: 0, y: 0 });

  return (
    <motion.button
      ref={buttonRef}
      className={`cta-btn btn-${variant}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: coords.x, y: coords.y }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default function Hero() {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const ringSvgRef = useRef(null);
  const nodeLayerRef = useRef(null);
  const visualArenaRef = useRef(null);

  const [activeStage, setActiveStage] = useState("intro");
  const [activeModuleIdx, setActiveModuleIdx] = useState(-1);
  const activeModule = activeModuleIdx >= 0 ? HERO_ORBIT_MODULES[activeModuleIdx] : null;

  // CHANGED: Initial state set to the smaller desktop radius (190) instead of 280
  const [radius, setRadius] = useState(190);
  const [isMobile, setIsMobile] = useState(false);

  const nodeRefMap = useRef({});
  useEffect(() => {
      const handleResize = () => {
        const w = window.innerWidth;
        const mobileFlag = w < 1024;
        setIsMobile(mobileFlag);

        if (mobileFlag) {
          setRadius(150); // Pushed out slightly for mobile
        } else if (w < 1440) {
          setRadius(240); // Pushed out for laptops
        } else {
          // INCREASED: Pushed out significantly for large screens
          setRadius(240);
        }
      };
      window.addEventListener("resize", handleResize);
      handleResize(); // Fire immediately on mount
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  useLayoutEffect(() => {
    HERO_ORBIT_MODULES.forEach((mod) => {
      const el = nodeRefMap.current[mod.id];
      if (!el) return;
      const rad = (mod.angleDeg * Math.PI) / 180;
      gsap.set(el, {
        x: Math.cos(rad) * radius,
        y: Math.sin(rad) * radius,
        xPercent: -50,
        yPercent: -50,
        force3D: true,
        transformOrigin: "center center"
      });
    });
  }, [radius, isMobile]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (isMobile) {
        gsap.fromTo(".interactive-ui-carousel-node",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }
        );
        return;
      }

      const ringEl = ringSvgRef.current;
      const nodeLayerEl = nodeLayerRef.current;
      const nodeEls = gsap.utils.toArray(".interactive-ui-carousel-node");
      const arenaEl = visualArenaRef.current;

      gsap.set([ringEl, nodeLayerEl], { transformOrigin: "center center" });

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=300%",
          pin: pinRef.current,
          pinSpacing: true,
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;

            let stage = "intro";
            let idx = -1;

            if (p < 0.05) {
              stage = "intro";
              idx = -1;
            } else if (p > 0.90) {
              stage = "finale";
              idx = -2;
            } else {
              stage = "showcase";
              const normalizedP = (p - 0.05) / 0.85;
              idx = Math.min(
                Math.floor(normalizedP * HERO_ORBIT_MODULES.length),
                HERO_ORBIT_MODULES.length - 1
              );
            }

            setActiveStage(stage);
            setActiveModuleIdx(idx);
          }
        }
      });

      masterTimeline.fromTo(nodeEls,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.05, ease: "power2.out" },
        0
      );

      masterTimeline.to([ringEl, nodeLayerEl], {
        rotation: 360,
        ease: "none",
        duration: 0.8
      }, 0.05);

      masterTimeline.to(nodeEls, {
        rotation: -360,
        ease: "none",
        duration: 0.8
      }, 0.05);

      masterTimeline.to(arenaEl, {
        opacity: 0,
        y: -40,
        scale: 0.95,
        ease: "power2.inOut",
        duration: 0.1
      }, 0.90);

    }, wrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={wrapperRef} className="master-hero-spatial-container">
      <div className="ambient-mesh-glow"></div>

      <div ref={pinRef} className="inner-hero-viewport-lock">
        <div className="hero-structural-grid">

          <div className="hero-editorial-narrative-panel">
            <div className="eyebrow-badge">
              <span>THE COMPLETE SCHOOL ECOSYSTEM</span>
            </div>

            <h1 className="editorial-headline-display">
              <span className="hdr-l1">One Platform.</span>
              <span className="hdr-l2-wrapper">
                <span className="hdr-l2">Every Advantage.</span>
              </span>
            </h1>

            <div className="subheadline-frame">
              <AnimatePresence mode="wait">
                {activeStage === "showcase" && activeModule ? (
                  <motion.div
                    key={`mod-${activeModule.id}`}
                    className="module-showcase-card"
                    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="module-showcase-icon">
                      {React.createElement(Icons[activeModule.icon] || Icons.Circle, { size: 28, weight: "fill" })}
                    </div>
                    <div className="module-showcase-content">
                      <h4 className="module-showcase-title">{activeModule.name}</h4>
                      <p className="module-showcase-desc">{activeModule.desc}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key={activeStage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="subheadline-copy-text"
                  >
                    {STAGE_COPY[activeStage]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="cta-cluster-group">
              <MagneticButton variant="primary">
                <span>Book a Demo</span>
                <Icons.ArrowRight size={16} weight="bold" />
              </MagneticButton>
              <MagneticButton variant="secondary">
                <Icons.PlayCircle size={20} weight="fill" />
                <span>Watch Video</span>
              </MagneticButton>
            </div>

            <div className="real-results-analytics-card">
              <h5 className="analytics-card-title">Real Results. Real Impact.</h5>
              <div className="analytics-metrics-row">
                {STATS_DATA.map((stat) => {
                  const StatIcon = Icons[stat.icon] || Icons.Circle;
                  return (
                    <div key={stat.id} className="metric-metric-block">
                      <div className="metric-icon-bubble">
                        <StatIcon size={16} weight="regular" />
                      </div>
                      <div className="metric-text-combo">
                        <span className="metric-pct-value">{stat.value}</span>
                        <span className="metric-lbl-desc">{stat.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={visualArenaRef} className="hero-theater-canvas-panel">
            <div className="canvas-orbital-sandbox-universe">

              <div className="central-asset-glow-backdrop"></div>

              <svg
                ref={ringSvgRef}
                className="orbit-ring-svg"
                style={{ width: radius * 2 + 80, height: radius * 2 + 80 }}
                viewBox={`0 0 ${radius * 2 + 80} ${radius * 2 + 80}`}
              >
                <circle
                  cx={(radius * 2 + 80) / 2}
                  cy={(radius * 2 + 80) / 2}
                  r={radius}
                  fill="none"
                  stroke="rgba(203, 213, 225, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
              </svg>

              <div className="central-showcase-asset">
                <img
                  src="/assets/hero-base.png"
                  alt="Edufy Campus Ecosystem"
                  className="showcase-building-img"
                />
              </div>

              <div ref={nodeLayerRef} className="node-layer-parallax">
                {HERO_ORBIT_MODULES.map((node, i) => {
                  const NodeIcon = Icons[node.icon] || Icons.Circle;
                  const isActive = activeModuleIdx === i;
                  return (
                    <div
                      key={node.id}
                      ref={(el) => (nodeRefMap.current[node.id] = el)}
                      className={`interactive-ui-carousel-node ${isActive ? "node-active" : ""}`}
                    >
                      <div className="node-floating-card-sphere">
                        <NodeIcon size={24} weight={isActive ? "fill" : "duotone"} className="node-card-vector-icon" />
                      </div>
                      <span className="node-underlying-label-text">{node.name}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}