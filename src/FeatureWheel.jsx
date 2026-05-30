// FeatureWheel.jsx
import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const features = [
  {
    label: "Messages",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Grades",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
  {
    label: "Attendance",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
  },
  {
    label: "Events",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function FeatureWheel({ imageSrc }) {
  const wheelRef = useRef(null);
  const angle = useMotionValue(0);
  const speed = useMotionValue(0.9);
  const springAngle = useSpring(angle, { stiffness: 25, damping: 20 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const tiltY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    let frame;
    const update = () => {
      angle.set(angle.get() + 0.06 * speed.get());
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [angle, speed]);

  const handleMouseMove = (e) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  const handleMouseEnter = () => speed.set(0.02);
  const handleMouseLeave = () => {
    speed.set(0.9);
    mouseX.set(0);
    mouseY.set(0);
  };

  const ringRadius = 154;

  return (
    <motion.div
      ref={wheelRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-[380px] h-[380px] lg:w-[420px] lg:h-[420px] select-none"
      style={{
        perspective: 900,
        rotateX: tiltX,
        rotateY: tiltY,
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/40 blur-3xl opacity-70" />

      {/* Rotating ring */}
      <motion.div
        className="absolute inset-0"
        style={{ rotate: springAngle }}
      >
        {features.map((feature, i) => {
          const baseAngle = i * 90;
          const x = Math.cos((baseAngle * Math.PI) / 180) * ringRadius;
          const y = Math.sin((baseAngle * Math.PI) / 180) * ringRadius;
          return (
            <div
              key={feature.label}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                width: 72,
                height: 72,
              }}
            >
              <motion.div
                className="w-full h-full rounded-2xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-[0_8px_28px_rgba(147,197,253,0.28)] flex flex-col items-center justify-center gap-1 text-[#1e40af] hover:shadow-[0_16px_36px_rgba(99,102,241,0.35)] hover:scale-105 transition-all duration-300"
                style={{ rotate: useTransform(springAngle, (a) => -a) }}
              >
                <span className="text-[#2563eb]">{feature.icon}</span>
                <span className="text-[10px] font-bold tracking-wide uppercase leading-none">
                  {feature.label}
                </span>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Center image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] lg:w-[220px] lg:h-[220px]">
        <div className="w-full h-full rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(37,99,235,0.3)] border-2 border-white/90 bg-white">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Edufy platform"
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
          )}
        </div>
        {/* Decorative ring */}
        <motion.div
          className="absolute inset-[-8px] rounded-[36px] border-2 border-white/40 shadow-[inset_0_0_20px_rgba(191,219,254,0.3)] pointer-events-none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}