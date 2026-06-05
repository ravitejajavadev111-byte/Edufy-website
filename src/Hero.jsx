import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

// ── DATA ─────────────────────────────────────────────────────────────────
const MODULES = [
  {
    id: 'attendance',
    name: 'Attendance',
    description: 'Smart attendance tracking system',
    icon: '🟢',
    angle: -60,
    accent: '#22C55E',
    labelDir: 'right',
  },
  {
    id: 'transportation',
    name: 'Transport',
    description: 'Track real-time bus location & routes',
    icon: '🚌',
    angle: 0,
    accent: '#F59E0B',
    labelDir: 'right',
  },
  {
    id: 'fees',
    name: 'Fees',
    description: 'Online fee collection made easy',
    icon: '💳',
    angle: 60,
    accent: '#8B5CF6',
    labelDir: 'right',
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Detailed insights at your fingertips',
    icon: '📊',
    angle: 120,
    accent: '#3B82F6',
    labelDir: 'right',
  },
  {
    id: 'notifications',
    name: 'Alerts',
    description: 'Instant alerts & announcements',
    icon: '🔔',
    angle: 180,
    accent: '#14B8A6',
    labelDir: 'left',
  },
  {
    id: 'parent-app',
    name: 'Parent App',
    description: 'Stay connected anytime, anywhere',
    icon: '📱',
    angle: 240,
    accent: '#EC4899',
    labelDir: 'left',
  },
];

const BENEFITS = [
  { icon: 'UserGroup', title: 'For Schools', desc: 'One unified dashboard' },
  { icon: 'Parent', title: 'For Parents', desc: 'Real‑time updates' },
  { icon: 'Student', title: 'For Students', desc: 'Better learning' },
];

// ── HOOKS ───────────────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useViewport() {
  const resolve = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  };
  const [viewport, setViewport] = useState(resolve);
  useEffect(() => {
    const onResize = () => setViewport(resolve());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return viewport;
}

// ── ICONS (only used for left benefits) ────────────────────────────────
function Icon({ name, size = 24, className = '' }) {
  const base = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true, className: `module-icon ${className}`,
  };
  const icons = {
    PersonCheck: <svg {...base}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
    Bus: <svg {...base}><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M16 6V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2"/><circle cx="7" cy="19" r="1"/><circle cx="17" cy="19" r="1"/><line x1="12" y1="6" x2="12" y2="19"/></svg>,
    Coin: <svg {...base}><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2"/><path d="M8.5 9.5C8.5 8.1 10.1 7 12 7s3.5 1.1 3.5 2.5c0 1.6-1.5 2-3.5 2.5-2 .5-3.5 1-3.5 2.5C8.5 16 10.1 17 12 17s3.5-1 3.5-2.5"/></svg>,
    BarChart: <svg {...base}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    Bell: <svg {...base}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    MobileHeart: <svg {...base}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 17.5c-1.5-1.5-3-2.5-3-4a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 1.5-1.5 2.5-3 4z"/></svg>,
    UserGroup: <svg {...base}><circle cx="8" cy="7" r="3"/><path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="7" r="3"/><path d="M13 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/></svg>,
    Parent: <svg {...base}><circle cx="9" cy="7" r="4"/><path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/><path d="M19 11l2 2-2 2"/><path d="M17 15l4-4"/></svg>,
    Student: <svg {...base}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>,
    Sparkle: <svg {...base}><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/></svg>,
  };
  return icons[name] ?? null;
}

// ── ORBIT RINGS SVG (hidden – artwork already contains the guide) ──────
const OrbitRings = React.forwardRef((_, ref) => {
  const size = 520, cx = 260, cy = 260, r = 232; // matches 232px radius
  return (
    <svg ref={ref} className="orbit-rings-svg" width={size} height={size}
      viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(37,99,235,0.08)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke="rgba(37,99,235,0.10)"
        strokeWidth="1" strokeDasharray="4 8" />
    </svg>
  );
});

// ── BENEFIT ITEM ─────────────────────────────────────────────────────
function BenefitItem({ icon, title, desc }) {
  return (
    <div className="benefit-item">
      <span className="benefit-item__icon-circle"><Icon name={icon} size={20} /></span>
      <div className="benefit-item__text">
        <span className="benefit-item__title">{title}</span>
        <span className="benefit-item__desc">{desc}</span>
      </div>
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────
export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const viewport = useViewport();
  const isMobile = viewport === 'mobile';

  const [activeModuleId, setActiveModuleId] = useState(MODULES[0].id);
  const activeModule = MODULES.find(m => m.id === activeModuleId);

  const heroWrapperRef = useRef(null);
  const heroInnerRef = useRef(null);
  const nodesGroupRef = useRef(null);
  const nodeRefs = useRef([]);

  const headlineRef = useRef(null);
  const copyRef = useRef(null);
  const benefitsRef = useRef(null);
  const trustRef = useRef(null);
  const ctaRef = useRef(null);

  const activateModule = useCallback((id) => {
    setActiveModuleId(id);
  }, []);

  // ── Entrance animation ───────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.set([
        heroInnerRef.current,
        headlineRef.current, copyRef.current, benefitsRef.current,
        trustRef.current, ctaRef.current,
        ...nodeRefs.current,
      ].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(heroInnerRef.current, { opacity: 0 });
      gsap.set([headlineRef.current, copyRef.current, benefitsRef.current, trustRef.current, ctaRef.current].filter(Boolean), { opacity: 0, y: 20 });
      nodeRefs.current.filter(Boolean).forEach((node) => gsap.set(node, { opacity: 0, scale: 0.8 }));

      document.fonts.ready.then(() => {
        gsap.to(heroInnerRef.current, { opacity: 1, duration: 0.4 });
        gsap.to([headlineRef.current, copyRef.current, benefitsRef.current, trustRef.current, ctaRef.current].filter(Boolean), {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.3,
        });
        nodeRefs.current.filter(Boolean).forEach((node, i) => {
          gsap.to(node, { opacity: 1, scale: 1, duration: 0.3, delay: 0.5 + i * 0.05 });
        });
      });
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ── Scroll‑driven orbit rotation ───────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const wrapper = heroWrapperRef.current;
    const inner = heroInnerRef.current;
    const nodesGroup = nodesGroupRef.current;

    const totalScroll = window.innerHeight * 2; // 200vh of scroll animation
    const stageScroll = totalScroll / MODULES.length;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: `+=${totalScroll}`,
      pin: inner,
      anticipatePin: 1,
    });

    gsap.to(nodesGroup, {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: `+=${totalScroll}`,
        scrub: 1.5,
      },
      onUpdate: function () {
        const rot = gsap.getProperty(nodesGroup, 'rotation');
        nodesGroup.style.setProperty('--orbit-rotation', rot + 'deg');
      },
    });

    MODULES.forEach((mod, i) => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: `top+=${i * stageScroll} top`,
        end: `top+=${(i + 1) * stageScroll} top`,
        onEnter: () => activateModule(mod.id),
        onEnterBack: () => activateModule(mod.id),
      });
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [prefersReducedMotion, isMobile, activateModule]);

  return (
    <section ref={heroWrapperRef} className="hero-wrapper" aria-label="Edufy — School Operating System hero">
      <div ref={heroInnerRef} className="hero-inner">
        {/* Background image pinned inside hero-inner */}
        <img
          src="/assets/illustration.png"
          alt=""
          className="hero-master-bg"
          aria-hidden="true"
        />

        <div className="hero-grid">
          {/* ── LEFT CONTENT ── */}
          <div className="hero-left">
            <div className="hero-content-stack">
              <div className="eyebrow-badge">
                <Icon name="Sparkle" size={14} />
                <span>All‑in‑One School Management System</span>
              </div>

              <h1 ref={headlineRef} className="hero-headline">
                <span className="headline-line">Simplify School.</span>
                <span className="headline-line headline-line--blue">Strengthen Education.</span>
              </h1>

              <p ref={copyRef} className="supporting-text">
                One platform that connects attendance, fees, transport, reports,
                and parent communication — so you can focus on what matters.
              </p>

              <div ref={benefitsRef} className="benefit-row">
                {BENEFITS.map(b => <BenefitItem key={b.title} {...b} />)}
              </div>

              <div ref={trustRef} className="trust-line">
                Trusted by 1000+ schools across India
              </div>

              <div ref={ctaRef} className="cta-group">
                <button className="cta-primary" type="button">
                  <span>Book Demo</span>
                  <span className="cta-primary__arrow">→</span>
                </button>
                <button className="cta-secondary" type="button">
                  <span className="cta-secondary__play-icon">▶</span>
                  <span>Watch Demo</span>
                </button>
                <span className="cta-micro-trust">No setup fees • Go live in days</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT VISUAL ECOSYSTEM ── */}
          <div className="hero-right">
            <div className="orbit-workspace">
              <OrbitRings />

              {/* Dynamic icon + text node group */}
              <div
                ref={nodesGroupRef}
                className="orbit-nodes-group"
                style={{ '--orbit-rotation': '0deg' }}
              >
                {MODULES.map((mod, i) => {
                  const isActive = mod.id === activeModuleId;
                  return (
                    <div
                      key={mod.id}
                      className={`orbit-node ${isActive ? 'orbit-node--active' : ''}`}
                      style={{
                        '--module-angle': `${mod.angle}deg`,
                        '--accent': mod.accent,
                        '--badge-bg': `${mod.accent}26`,
                      }}
                      ref={el => { nodeRefs.current[i] = el; }}
                    >
                      <div className="orbit-icon-badge">
                        <span className="orbit-icon-emoji">{mod.icon}</span>
                      </div>
                      <div className={`feature-card-content label-dir--${mod.labelDir}`}>
                        <span className="feature-card__title">{mod.name}</span>
                        <span className="feature-card__desc">{mod.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}