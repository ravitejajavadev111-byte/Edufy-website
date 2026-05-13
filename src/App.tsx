// App.tsx – Edufy · Premium SaaS Redesign · Mobile-First Production-Grade
import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode, CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────
// DESIGN TOKENS + GLOBAL CSS
// ─────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&display=swap');

*,::before,::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#FAFAFA;
  --bg-pure:#FFFFFF;
  --bg-dim:#F4F4F6;
  --surface:#FFFFFF;
  --b0:rgba(10,10,20,0.04);
  --b1:rgba(10,10,20,0.07);
  --b2:rgba(10,10,20,0.12);
  --b3:rgba(10,10,20,0.22);
  --ind:#1A4CF5;
  --ind-d:#1338D0;
  --ind-l:#4F76FF;
  --ind-subtle:rgba(26,76,245,0.06);
  --ind-border:rgba(26,76,245,0.16);
  --ind-glow:rgba(26,76,245,0.22);
  --jade:#059669;
  --amber:#D97706;
  --coral:#DC2626;
  --violet:#6366F1;
  --sky:#0EA5E9;
  --t0:#09090E;
  --t1:rgba(9,9,14,0.82);
  --t2:rgba(9,9,14,0.55);
  --t3:rgba(9,9,14,0.38);
  --t4:rgba(9,9,14,0.20);
  --fd:'Instrument Serif',Georgia,serif;
  --fb:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;
  --spring:cubic-bezier(0.175,0.885,0.32,1.275);
  --ex:cubic-bezier(0.16,1,0.3,1);
  --smooth:cubic-bezier(0.4,0,0.2,1);
  --inout:cubic-bezier(0.65,0,0.35,1);
  --r-xs:6px;
  --r-sm:10px;
  --r-md:14px;
  --r-lg:22px;
  --r-xl:32px;
  --r-2xl:48px;
  --sh-xs:0 1px 2px rgba(9,9,14,0.04);
  --sh-sm:0 2px 8px rgba(9,9,14,0.05),0 1px 2px rgba(9,9,14,0.04);
  --sh-md:0 4px 20px rgba(9,9,14,0.06),0 1px 4px rgba(9,9,14,0.04);
  --sh-lg:0 8px 40px rgba(9,9,14,0.07),0 2px 8px rgba(9,9,14,0.04);
  --sh-xl:0 16px 64px rgba(9,9,14,0.09),0 4px 16px rgba(9,9,14,0.05);
  --sh-colored:0 8px 36px rgba(26,76,245,0.28),0 2px 8px rgba(26,76,245,0.14);
  --sh-colored-lg:0 16px 64px rgba(26,76,245,0.32),0 4px 16px rgba(26,76,245,0.18);
}

html{
  scroll-behavior:smooth;
  overflow-x:hidden;
  -webkit-text-size-adjust:100%;
}
body{
  background:var(--bg);
  color:var(--t0);
  font-family:var(--fb);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  overflow-x:hidden;
  cursor:none;
  font-feature-settings:'ss01','ss02','cv01';
}
@media(max-width:768px){body{cursor:auto}}
button{font-family:var(--fb);border:none;cursor:pointer;background:none}
input,textarea,select{font-family:var(--fb);cursor:text}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}
::selection{background:rgba(26,76,245,0.14);color:var(--t0)}

/* ─── NOISE OVERLAY ─── */
#noise{
  position:fixed;inset:0;pointer-events:none;z-index:99997;
  opacity:0.022;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:200px;
}
@media(max-width:768px){#noise{display:none}}

/* ─── CUSTOM CURSOR ─── */
#cd{position:fixed;width:7px;height:7px;border-radius:50%;background:var(--ind);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width .18s var(--ex),height .18s var(--ex),opacity .18s}
#cr{position:fixed;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(26,76,245,0.3);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .32s var(--ex),height .32s var(--ex),border-color .22s,background .22s}
#cd.hov{width:0;height:0;opacity:0}
#cr.hov{width:48px;height:48px;background:rgba(26,76,245,0.07);border-color:rgba(26,76,245,0.22)}
@media(max-width:768px){#cd,#cr{display:none}}

/* ─── SCROLL REVEALS ─── */
.rv{opacity:0;transform:translateY(22px);transition:opacity .7s var(--smooth),transform .7s var(--smooth)}
.rv.on{opacity:1;transform:none}
.rv-s{opacity:0;transform:scale(0.97) translateY(12px);transition:opacity .65s var(--smooth),transform .65s var(--smooth)}
.rv-s.on{opacity:1;transform:none}
.rv-r{opacity:0;transform:translateX(18px);transition:opacity .7s var(--smooth),transform .7s var(--smooth)}
.rv-r.on{opacity:1;transform:none}
.rv-l{opacity:0;transform:translateX(-18px);transition:opacity .7s var(--smooth),transform .7s var(--smooth)}
.rv-l.on{opacity:1;transform:none}
@media(max-width:768px){
  .rv{transform:translateY(14px)}
  .rv-s{transform:scale(0.98) translateY(8px)}
  .rv-r{transform:translateX(10px)}
  .rv-l{transform:translateX(-10px)}
}

/* ─── KEYFRAMES ─── */
@keyframes heroIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes popIn{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:none}}
@keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.2;transform:scale(.7)}}
@keyframes drift1{0%,100%{transform:translate(0,0)}40%{transform:translate(44px,-32px)}75%{transform:translate(-28px,40px)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}35%{transform:translate(-52px,28px)}72%{transform:translate(36px,-44px)}}
@keyframes drift3{0%,100%{transform:translate(0,0)}55%{transform:translate(56px,22px)}}
@keyframes pillIn{from{opacity:0;transform:scale(.9) translateY(6px)}to{opacity:1;transform:none}}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(26,76,245,.4)}70%{box-shadow:0 0 0 12px rgba(26,76,245,0)}100%{box-shadow:0 0 0 0 rgba(26,76,245,0)}}
@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes cardSlide{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:none}}

/* ─── STICKY BAR ─── */
.sticky-bar{
  position:fixed;bottom:0;left:0;right:0;z-index:800;
  background:rgba(255,255,255,0.96);
  backdrop-filter:blur(24px) saturate(1.8);
  -webkit-backdrop-filter:blur(24px) saturate(1.8);
  border-top:1px solid var(--b1);
  padding:10px 16px;
  display:none;
  align-items:center;justify-content:space-between;gap:10px;
  box-shadow:0 -4px 24px rgba(9,9,14,0.07);
  transform:translateY(100%);
  transition:transform .42s var(--ex);
}
.sticky-bar.show{transform:translateY(0)}
.sticky-bar-text{display:flex;flex-direction:column;gap:1px;min-width:0}
.sticky-bar-title{font-size:13px;font-weight:700;color:var(--t0);letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sticky-bar-sub{font-size:11px;color:var(--t3);font-weight:500;white-space:nowrap}
.sticky-bar-cta{
  font-size:13px;font-weight:700;color:#fff;
  background:var(--ind);border-radius:var(--r-md);
  padding:10px 18px;white-space:nowrap;flex-shrink:0;
  transition:transform .2s var(--ex),box-shadow .2s;
}
.sticky-bar-cta:hover{transform:translateY(-1px);box-shadow:var(--sh-colored)}
@media(max-width:1100px){.sticky-bar{display:flex}}
@media(max-width:400px){
  .sticky-bar{padding:10px 12px}
  .sticky-bar-cta{padding:9px 14px;font-size:12px}
}

/* ─── NAVIGATION ─── */
#nav{
  position:fixed;top:0;left:0;right:0;z-index:900;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(16px,4vw,56px);height:60px;
  transition:background .4s var(--smooth),border-color .4s,backdrop-filter .4s;
  border-bottom:1px solid transparent;
}
#nav.s{
  background:rgba(250,250,250,0.92);
  backdrop-filter:blur(32px) saturate(2);
  -webkit-backdrop-filter:blur(32px) saturate(2);
  border-color:var(--b1);
}
.nav-logo{display:flex;align-items:center;gap:9px}
.nav-mark{
  width:30px;height:30px;border-radius:8px;
  background:linear-gradient(145deg,#1A4CF5,#0E32C8);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 12px rgba(26,76,245,0.32);
  flex-shrink:0;
}
.nav-name{font-size:16px;font-weight:700;letter-spacing:-.04em;color:var(--t0)}
.nav-name b{color:var(--ind);font-weight:700}
.nav-links{display:flex;align-items:center;gap:1px}
.nav-link{
  font-size:13.5px;font-weight:500;color:var(--t2);
  padding:7px 12px;border-radius:var(--r-sm);
  transition:color .18s,background .18s;white-space:nowrap;
}
.nav-link:hover{color:var(--t0);background:var(--b0)}
.nav-actions{display:flex;align-items:center;gap:8px}
.nav-wa{
  display:flex;align-items:center;gap:6px;
  font-size:13px;font-weight:600;color:#128C7E;
  background:rgba(18,140,126,0.07);border:1px solid rgba(18,140,126,0.18);
  border-radius:var(--r-md);padding:7px 14px;
  transition:background .2s,transform .2s var(--ex),box-shadow .2s;white-space:nowrap;
}
.nav-wa:hover{background:rgba(18,140,126,0.12);transform:translateY(-1px);box-shadow:0 4px 16px rgba(18,140,126,0.18)}
.nav-cta{
  font-size:13px;font-weight:700;color:#fff;letter-spacing:-.01em;
  background:var(--ind);border-radius:var(--r-md);padding:8px 18px;
  position:relative;overflow:hidden;
  transition:transform .2s var(--ex),box-shadow .2s;white-space:nowrap;
}
.nav-cta::after{content:'';position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,0.14),transparent 55%)}
.nav-cta:hover{transform:translateY(-2px);box-shadow:var(--sh-colored)}
.nav-toggle{
  display:none;width:36px;height:36px;border-radius:var(--r-sm);
  background:var(--b0);border:1px solid var(--b1);
  align-items:center;justify-content:center;flex-direction:column;gap:5px;
}
.nav-toggle span{display:block;width:18px;height:1.5px;background:var(--t0);border-radius:2px;transition:transform .3s var(--ex),opacity .3s}
.nav-toggle.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.nav-toggle.open span:nth-child(2){opacity:0}
.nav-toggle.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.mobile-nav{
  position:fixed;inset:60px 0 0 0;z-index:899;
  background:rgba(250,250,250,0.98);
  backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
  display:flex;flex-direction:column;padding:20px 16px;gap:2px;
  transform:translateY(-100%);opacity:0;pointer-events:none;
  transition:transform .38s var(--ex),opacity .32s var(--smooth);
  border-bottom:1px solid var(--b1);overflow-y:auto;
}
.mobile-nav.open{transform:none;opacity:1;pointer-events:all}
.mobile-nav-link{
  font-size:17px;font-weight:600;color:var(--t0);
  padding:13px 14px;border-radius:var(--r-md);
  transition:background .15s;display:block;letter-spacing:-.02em;
}
.mobile-nav-link:active{background:var(--b0)}
.mobile-nav-ctas{display:flex;flex-direction:column;gap:10px;margin-top:12px;padding-top:16px;border-top:1px solid var(--b1)}
.mobile-nav-wa{
  display:flex;align-items:center;justify-content:center;gap:8px;
  font-size:15px;font-weight:700;color:#128C7E;
  background:rgba(18,140,126,0.07);border:1px solid rgba(18,140,126,0.2);
  border-radius:var(--r-md);padding:14px;
}
.mobile-nav-demo{
  display:flex;align-items:center;justify-content:center;
  font-size:15px;font-weight:700;color:#fff;
  background:var(--ind);border-radius:var(--r-md);padding:14px;
  box-shadow:var(--sh-colored);
}
@media(max-width:1100px){.nav-links,.nav-wa{display:none}.nav-toggle{display:flex}}
@media(max-width:640px){.nav-cta{display:none}}

/* ─── HERO ─── */
.hero{
  min-height:100svh;
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:clamp(100px,16vh,180px) clamp(20px,5vw,80px) clamp(60px,8vh,120px);
  background:linear-gradient(180deg,#F8F8FC 0%,#F5F5FA 55%,#F2F2F8 100%);
}
.hero-content{max-width:820px;width:100%;margin:0 auto;text-align:center;position:relative;z-index:2}
.hero-orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;will-change:transform}
.hero-orb-a{width:clamp(240px,50vw,640px);height:clamp(220px,48vw,600px);background:rgba(26,76,245,0.055);top:-15%;left:-10%;animation:drift1 26s ease-in-out infinite}
.hero-orb-b{width:clamp(180px,36vw,480px);height:clamp(180px,36vw,480px);background:rgba(0,90,220,0.038);top:40%;right:-8%;animation:drift2 32s ease-in-out infinite}
.hero-orb-c{width:clamp(140px,28vw,360px);height:clamp(140px,28vw,360px);background:rgba(99,60,240,0.028);bottom:-5%;left:42%;animation:drift3 24s ease-in-out infinite}
@media(max-width:768px){
  .hero-orb-a{filter:blur(80px);opacity:.7}
  .hero-orb-b{filter:blur(80px);opacity:.7}
  .hero-orb-c{filter:blur(70px);opacity:.6}
}
.hero-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(9,9,14,0.04) 1px,transparent 1px);
  background-size:28px 28px;
  -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 40%,black 20%,transparent 80%);
  mask-image:radial-gradient(ellipse 80% 70% at 50% 40%,black 20%,transparent 80%);
}
@media(max-width:768px){.hero-grid{opacity:.5;background-size:24px 24px}}
.hero-pill{
  display:inline-flex;align-items:center;gap:7px;
  font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ind);border:1px solid var(--ind-border);
  background:var(--ind-subtle);border-radius:100px;
  padding:5px 12px 5px 6px;margin-bottom:24px;
  animation:pillIn .5s var(--ex) both;
}
.hero-pill-dot{width:16px;height:16px;border-radius:50%;background:rgba(26,76,245,0.1);border:1px solid var(--ind-border);display:flex;align-items:center;justify-content:center}
.hero-pill-pulse{width:6px;height:6px;border-radius:50%;background:var(--ind);animation:blink 2.2s ease-in-out infinite}
.hero-pill-sep{width:1px;height:10px;background:var(--ind-border)}
.hero-h1{
  font-family:var(--fd);
  font-size:clamp(44px,8.5vw,112px);
  font-weight:400;line-height:.93;
  letter-spacing:-.03em;color:var(--t0);margin-bottom:22px;
  animation:heroIn .85s var(--smooth) .06s both;
}
.hero-h1 em{font-style:italic;font-weight:400;color:var(--t2)}
.hero-h1 .gr{
  background:linear-gradient(130deg,var(--t0) 0%,var(--ind) 40%,#7FA4FF 68%,var(--t0) 92%);
  background-size:280% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  animation:shimmer 5s linear infinite;
}
.hero-sub{
  font-size:clamp(15px,1.8vw,19px);font-weight:400;
  line-height:1.62;color:var(--t2);
  max-width:520px;margin:0 auto 36px;
  animation:fadeUp .85s var(--smooth) .18s both;letter-spacing:-.01em;
}
.hero-sub strong{color:var(--t1);font-weight:600}
.hero-btns{
  display:flex;gap:10px;justify-content:center;flex-wrap:wrap;
  animation:fadeUp .85s var(--smooth) .3s both;
}
.hero-cta-primary{
  font-size:clamp(14px,1.6vw,16px);font-weight:700;color:#fff;
  letter-spacing:-.02em;background:var(--ind);border-radius:var(--r-md);
  padding:clamp(13px,1.5vw,15px) clamp(26px,3vw,38px);
  position:relative;overflow:hidden;
  transition:transform .25s var(--ex),box-shadow .25s var(--ex);white-space:nowrap;
}
.hero-cta-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,0.16),transparent 55%)}
.hero-cta-primary:hover{transform:translateY(-3px) scale(1.015);box-shadow:var(--sh-colored-lg)}
.hero-cta-primary:active{transform:scale(0.98)}
.hero-cta-sec{
  font-size:clamp(14px,1.6vw,16px);font-weight:600;color:var(--t1);
  letter-spacing:-.01em;background:var(--bg-pure);
  border:1.5px solid var(--b2);border-radius:var(--r-md);
  padding:clamp(13px,1.5vw,15px) clamp(22px,2.8vw,32px);
  display:flex;align-items:center;gap:8px;
  transition:border-color .2s,transform .22s var(--ex),box-shadow .2s;white-space:nowrap;
}
.hero-cta-sec:hover{border-color:var(--b3);transform:translateY(-2px);box-shadow:var(--sh-md)}
.hero-cta-sec svg{transition:transform .26s var(--ex)}
.hero-cta-sec:hover svg{transform:translateX(4px)}
.hero-trust{
  display:flex;align-items:center;justify-content:center;gap:clamp(10px,2vw,20px);
  margin-top:28px;flex-wrap:wrap;
  animation:fadeUp .85s var(--smooth) .42s both;
}
.hero-trust-item{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:var(--t3)}
.hero-trust-item+.hero-trust-item::before{content:'·';color:var(--t4);margin-right:4px}
.hero-trust-check{width:15px;height:15px;border-radius:50%;background:rgba(5,150,105,0.1);border:1px solid rgba(5,150,105,0.22);display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ─── HERO METRICS STRIP ─── */
.hero-metrics{
  width:100%;max-width:760px;margin:clamp(32px,5vh,56px) auto 0;
  display:grid;grid-template-columns:repeat(3,1fr);
  background:var(--bg-pure);border-radius:var(--r-xl);
  border:1px solid var(--b1);box-shadow:var(--sh-lg);overflow:hidden;
  animation:fadeUp .9s var(--smooth) .54s both;
}
.hero-metric{
  padding:clamp(16px,2.5vw,28px) clamp(12px,2vw,28px);
  border-right:1px solid var(--b0);position:relative;overflow:hidden;transition:background .2s;
}
.hero-metric:last-child{border-right:none}
.hero-metric:hover{background:var(--bg)}
.hero-metric-val{font-family:var(--fd);font-size:clamp(26px,4vw,46px);font-weight:400;letter-spacing:-.04em;color:var(--t0);line-height:1}
.hero-metric-label{font-size:clamp(10px,1.2vw,13px);font-weight:600;color:var(--t3);margin-top:5px;letter-spacing:-.01em}
.hero-metric-badge{display:inline-block;margin-top:7px;font-size:9.5px;font-weight:800;letter-spacing:.04em;color:var(--jade);background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.18);border-radius:100px;padding:2px 8px}
.hero-metric::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;opacity:0;transition:opacity .4s}
.hero-metric:nth-child(1)::after{background:linear-gradient(90deg,var(--ind),transparent)}
.hero-metric:nth-child(2)::after{background:linear-gradient(90deg,var(--jade),transparent)}
.hero-metric:nth-child(3)::after{background:linear-gradient(90deg,var(--violet),transparent)}
.hero-metric:hover::after{opacity:1}
@media(max-width:480px){
  .hero-metrics{grid-template-columns:1fr 1fr;border-radius:var(--r-lg)}
  .hero-metric:nth-child(3){grid-column:1/-1;border-right:none;border-top:1px solid var(--b0)}
}
@media(max-width:400px){
  .hero-trust-item+.hero-trust-item::before{display:none}
  .hero-trust{flex-direction:column;align-items:center;gap:6px}
}

/* ─── SECTION SHARED ─── */
.sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px)}
.sec-inner{max-width:1280px;margin:0 auto}
.sec-label{
  font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
  color:var(--ind);display:inline-flex;align-items:center;gap:8px;
  padding:4px 12px;background:var(--ind-subtle);
  border:1px solid var(--ind-border);border-radius:100px;margin-bottom:14px;
}
.sec-h2{
  font-family:var(--fd);
  font-size:clamp(30px,4.5vw,60px);
  font-weight:400;line-height:1.06;
  letter-spacing:-.03em;margin-bottom:12px;color:var(--t0);
}
.sec-h2 em{font-style:italic;color:var(--t2);font-weight:400}
.sec-body{font-size:clamp(14px,1.6vw,17px);font-weight:400;color:var(--t2);line-height:1.68;max-width:500px;letter-spacing:-.01em}

/* ─── LOGO STRIP ─── */
.logo-strip{padding:clamp(18px,3vw,28px) clamp(20px,5vw,80px);background:var(--bg-pure);border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.logo-strip-inner{max-width:1280px;margin:0 auto}
.logo-strip-label{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--t4);text-align:center;margin-bottom:18px}
.logo-strip-logos{display:flex;align-items:center;justify-content:center;flex-wrap:wrap}
.logo-pill{display:flex;align-items:center;gap:7px;padding:7px 18px;border-right:1px solid var(--b0)}
.logo-pill:last-child{border-right:none}
.logo-pill-name{font-size:13px;font-weight:700;color:var(--t3);letter-spacing:-.02em;white-space:nowrap}

/* ─── TRUST STATS ─── */
.trust-sec{padding:clamp(24px,4vw,44px) clamp(20px,5vw,80px)}
.trust-inner{max-width:1280px;margin:0 auto}
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);background:var(--bg-pure);border-radius:var(--r-xl);border:1px solid var(--b1);box-shadow:var(--sh-lg);overflow:hidden}
.trust-cell{padding:clamp(18px,2.5vw,32px) clamp(14px,2.2vw,28px);border-right:1px solid var(--b0);position:relative;transition:background .22s}
.trust-cell:last-child{border-right:none}
.trust-cell:hover{background:var(--bg)}
.trust-cell::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;opacity:0;transition:opacity .38s}
.trust-cell:nth-child(1)::after{background:linear-gradient(90deg,var(--amber),transparent)}
.trust-cell:nth-child(2)::after{background:linear-gradient(90deg,var(--jade),transparent)}
.trust-cell:nth-child(3)::after{background:linear-gradient(90deg,var(--ind),transparent)}
.trust-cell:nth-child(4)::after{background:linear-gradient(90deg,var(--violet),transparent)}
.trust-cell:hover::after{opacity:1}
.trust-val{font-family:var(--fd);font-size:clamp(26px,4vw,48px);font-weight:400;letter-spacing:-.04em;color:var(--t0);line-height:1}
.trust-lbl{font-size:clamp(10.5px,1.2vw,13px);font-weight:600;color:var(--t3);margin-top:5px}
.trust-delta{display:inline-block;margin-top:7px;font-size:9.5px;font-weight:800;letter-spacing:.04em;color:var(--jade);background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.18);border-radius:100px;padding:2px 8px}
@media(max-width:900px){.trust-grid{grid-template-columns:repeat(2,1fr)}.trust-cell:nth-child(2){border-right:none}.trust-cell:nth-child(3){border-right:1px solid var(--b0);border-top:1px solid var(--b0)}.trust-cell:nth-child(4){border-top:1px solid var(--b0)}}
@media(max-width:480px){.trust-grid{grid-template-columns:1fr 1fr}}

/* ─── MARQUEE ─── */
.marquee-wrap{overflow:hidden;position:relative;background:var(--bg-pure);padding:12px 0;border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.marquee-wrap::before,.marquee-wrap::after{content:'';position:absolute;top:0;bottom:0;width:clamp(40px,8vw,120px);z-index:2;pointer-events:none}
.marquee-wrap::before{left:0;background:linear-gradient(90deg,var(--bg-pure),transparent)}
.marquee-wrap::after{right:0;background:linear-gradient(-90deg,var(--bg-pure),transparent)}
.marquee-track{display:flex;width:max-content;animation:marquee 40s linear infinite}
.marquee-item{display:flex;align-items:center;gap:8px;padding:6px 18px;border-right:1px solid var(--b0);white-space:nowrap}
.marquee-icon{width:22px;height:22px;border-radius:6px;background:var(--bg-dim);display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;transition:background .2s}
.marquee-label{font-size:12.5px;font-weight:600;color:var(--t3);transition:color .2s;letter-spacing:-.01em}

/* ─── HOW IT WORKS ─── */
.hiw-sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px);background:var(--bg)}
.hiw-inner{max-width:1280px;margin:0 auto}
.hiw-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:48px;background:var(--bg-pure);border-radius:var(--r-xl);border:1px solid var(--b1);box-shadow:var(--sh-lg);overflow:hidden}
.hiw-step{padding:clamp(24px,3.5vw,44px) clamp(18px,2.8vw,36px);border-right:1px solid var(--b0);position:relative;overflow:hidden;transition:background .22s}
.hiw-step:last-child{border-right:none}
.hiw-step:hover{background:var(--bg)}
.hiw-num{font-family:var(--fd);font-size:clamp(48px,8vw,80px);font-weight:400;color:var(--b2);line-height:1;margin-bottom:14px;letter-spacing:-.06em;transition:color .4s}
.hiw-step:hover .hiw-num{color:rgba(26,76,245,0.1)}
.hiw-title{font-size:clamp(16px,2vw,21px);font-weight:700;color:var(--t0);letter-spacing:-.03em;margin-bottom:8px}
.hiw-desc{font-size:clamp(13px,1.4vw,14.5px);color:var(--t2);line-height:1.68;font-weight:400}
.hiw-badge{display:inline-flex;align-items:center;gap:5px;margin-top:16px;font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--jade);background:rgba(5,150,105,0.07);border:1px solid rgba(5,150,105,0.2);border-radius:100px;padding:3px 12px}
@media(max-width:900px){.hiw-steps{grid-template-columns:1fr}.hiw-step{border-right:none;border-bottom:1px solid var(--b0)}.hiw-step:last-child{border-bottom:none}}

/* ─── MODULES SECTION ─── */
.modules-sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px);background:var(--bg);border-top:1px solid var(--b0)}
.modules-inner{max-width:1280px;margin:0 auto}
.carousel-stage-wrap{
  overflow:hidden;
  border-radius:var(--r-xl);
  border:1px solid var(--b1);
  box-shadow:var(--sh-xl);
  margin-top:48px;
  position:relative;
}
.carousel-stage-wrap::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 0%,rgba(26,76,245,0.04),transparent);pointer-events:none;z-index:0;border-radius:var(--r-xl)}
.carousel-stage{
  width:100%;height:clamp(420px,50vw,560px);
  perspective:1400px;perspective-origin:50% 50%;
  position:relative;
  background:linear-gradient(180deg,var(--bg-dim) 0%,var(--bg-pure) 100%);
  overflow:visible;
}
.carousel-rotator{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;transform:rotateY(0deg);will-change:transform}
.module-card{
  position:absolute;
  width:clamp(170px,22vw,240px);height:clamp(250px,32vw,340px);
  left:clamp(-85px,-11vw,-120px);top:clamp(-150px,-19vw,-210px);
  border-radius:var(--r-xl);background:var(--bg-pure);
  box-shadow:0 20px 60px -12px rgba(9,9,14,0.28),0 0 0 1px rgba(9,9,14,0.06);
  overflow:hidden;display:flex;flex-direction:column;
  transition:box-shadow .4s var(--ex);
  backface-visibility:hidden;-webkit-backface-visibility:hidden;
}
.module-card-img{flex:1;position:relative;min-height:0;background:var(--bg-dim);overflow:hidden}
.module-card-img img{width:100%;height:100%;object-fit:cover;display:block}
.module-card-overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.78) 0%,transparent 100%);padding:20px 16px 16px;transform:translateY(100%);transition:transform .45s cubic-bezier(0.2,0.9,0.4,1.1);pointer-events:none;z-index:2}
.module-card.front .module-card-overlay{transform:translateY(0)}
.module-card-badge{display:inline-block;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:100px;background:rgba(255,255,255,0.2);backdrop-filter:blur(4px);color:#fff;margin-bottom:6px}
.module-card-title{font-size:clamp(13px,2vw,18px);font-weight:800;letter-spacing:-.02em;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.2);margin:0;line-height:1.2}
.carousel-dots{display:flex;justify-content:center;gap:7px;margin-top:18px}
.carousel-dot{width:6px;height:6px;border-radius:50%;background:var(--b2);transition:background .25s,width .3s var(--ex);border:none;padding:0;cursor:pointer}
.carousel-dot.active{width:22px;border-radius:3px;background:var(--ind)}
.carousel-mask-l,.carousel-mask-r{position:absolute;top:0;bottom:0;width:18%;z-index:10;pointer-events:none}
.carousel-mask-l{left:0;background:linear-gradient(90deg,rgba(244,244,246,0.9) 0%,transparent 100%)}
.carousel-mask-r{right:0;background:linear-gradient(-90deg,rgba(244,244,246,0.9) 0%,transparent 100%)}
@media(max-width:767px){.modules-desktop{display:none}}
@media(min-width:768px){.modules-mobile{display:none}}

/* ─── MOBILE MODULES SWIPER ─── */
.mobile-modules-swiper{
  position:relative;width:100%;overflow:hidden;margin-top:32px;
}
.mobile-modules-track{
  display:flex;gap:12px;overflow-x:auto;overflow-y:hidden;
  -webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;
  scrollbar-width:none;padding:0 4px 12px;
}
.mobile-modules-track::-webkit-scrollbar{display:none}
.mobile-module-card{
  flex:0 0 clamp(200px,72vw,280px);scroll-snap-align:center;
  border-radius:var(--r-lg);background:var(--bg-pure);
  box-shadow:var(--sh-md);overflow:hidden;
  transition:transform .3s var(--ex);
}
.mobile-module-card-img{position:relative;height:clamp(180px,48vw,240px);overflow:hidden;background:var(--bg-dim)}
.mobile-module-card-img img{width:100%;height:100%;object-fit:cover}
.mobile-module-card-overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 100%);padding:20px 14px 14px}
.mobile-module-badge{display:inline-block;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:2.5px 8px;border-radius:100px;background:rgba(255,255,255,0.2);backdrop-filter:blur(4px);color:#fff;margin-bottom:5px}
.mobile-module-title{font-size:15px;font-weight:800;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.25);letter-spacing:-.02em}
.mobile-module-sub{font-size:11.5px;color:rgba(255,255,255,0.7);font-weight:500;margin-top:3px}
.mobile-modules-dots{display:flex;justify-content:center;gap:6px;margin-top:4px}
.mobile-modules-dot{width:6px;height:6px;border-radius:50%;background:var(--b2);border:none;padding:0;transition:background .25s,width .28s var(--ex)}
.mobile-modules-dot.active{width:20px;border-radius:3px;background:var(--ind)}

/* ─── FEATURES GRID ─── */
.features-sec{padding:clamp(48px,7vw,80px) clamp(20px,5vw,80px);background:var(--bg-pure);border-top:1px solid var(--b0)}
.features-inner{max-width:1280px;margin:0 auto}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:40px;background:var(--b0);border-radius:var(--r-xl);border:1px solid var(--b1);box-shadow:var(--sh-md);overflow:hidden}
.feat-card{background:var(--bg-pure);padding:clamp(16px,2.2vw,26px) clamp(14px,2vw,24px);display:flex;align-items:flex-start;gap:13px;transition:background .2s;position:relative}
.feat-card:hover{background:var(--bg)}
.feat-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;background:var(--bg-dim);border:1px solid var(--b1);margin-top:1px}
.feat-body{display:flex;flex-direction:column;gap:3px;min-width:0}
.feat-title{font-size:13px;font-weight:700;color:var(--t0);letter-spacing:-.02em}
.feat-desc{font-size:12px;color:var(--t2);line-height:1.55;font-weight:400}
.feat-metric{display:inline-flex;align-items:center;gap:4px;margin-top:6px;font-size:10px;font-weight:800;letter-spacing:.03em;color:var(--jade);background:rgba(5,150,105,0.07);border:1px solid rgba(5,150,105,0.16);border-radius:100px;padding:2px 8px;width:fit-content}
@media(max-width:900px){.features-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){
  .features-grid{grid-template-columns:1fr;gap:0}
  .feat-card{padding:16px 16px}
}

/* ─── TESTIMONIALS ─── */
.testimonials-sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px);background:var(--bg-pure);border-top:1px solid var(--b0)}
.testimonials-inner{max-width:1280px;margin:0 auto}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2vw,24px);margin-top:48px}
.tcard{background:var(--bg);border-radius:var(--r-xl);border:1px solid var(--b0);padding:clamp(18px,2.5vw,32px);position:relative;overflow:hidden;transition:transform .35s var(--ex),box-shadow .35s,border-color .25s}
.tcard:hover{transform:translateY(-5px);box-shadow:var(--sh-lg);border-color:var(--b2)}
.tcard-bar{position:absolute;top:0;left:0;right:0;height:2px;opacity:0;transition:opacity .35s}
.tcard:hover .tcard-bar{opacity:1}
.tcard-stars{display:flex;gap:3px;margin-bottom:14px}
.tcard-star{color:#F59E0B;font-size:12px}
.tcard-quote{font-family:var(--fd);font-size:clamp(13.5px,1.6vw,16px);font-weight:400;font-style:italic;line-height:1.62;color:var(--t1);letter-spacing:-.01em;margin-bottom:20px}
.tcard-outcome{display:flex;align-items:center;gap:8px;padding:8px 11px;background:var(--bg-pure);border-radius:var(--r-sm);margin-bottom:16px;font-size:12px;font-weight:700;color:var(--jade);border:1px solid rgba(5,150,105,0.12)}
.tcard-author{display:flex;align-items:center;gap:10px;padding-top:14px;border-top:1px solid var(--b0)}
.tcard-avatar{width:36px;height:36px;border-radius:50%;background:var(--bg-dim);border:1.5px solid var(--b1);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px}
.tcard-name{font-size:13px;font-weight:700;color:var(--t0);letter-spacing:-.02em}
.tcard-role{font-size:11px;color:var(--t3);font-weight:500;margin-top:2px}
@media(max-width:900px){.testimonials-grid{grid-template-columns:1fr}}
@media(min-width:901px) and (max-width:1100px){.testimonials-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){
  .testimonials-grid{
    display:flex;gap:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;
    scroll-snap-type:x mandatory;scrollbar-width:none;
    margin-top:32px;padding:4px 0 12px;
  }
  .testimonials-grid::-webkit-scrollbar{display:none}
  .tcard{
    flex:0 0 clamp(280px,82vw,340px);scroll-snap-align:center;
    opacity:1 !important;
  }
  .tcard-scroll-ready{opacity:1 !important}
}

/* ─── COMPARISON ─── */
.comparison-sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px);background:var(--bg);border-top:1px solid var(--b0)}
.comparison-inner{max-width:880px;margin:0 auto}
.cmp-table{margin-top:44px;background:var(--bg-pure);border-radius:var(--r-xl);border:1px solid var(--b1);box-shadow:var(--sh-lg);overflow:hidden}
.cmp-header{display:grid;grid-template-columns:1fr 1fr 1fr;background:var(--bg-dim);border-bottom:1px solid var(--b1)}
.cmp-hcell{padding:clamp(10px,1.5vw,16px) clamp(12px,2vw,24px);font-size:10px;font-weight:800;color:var(--t2);text-transform:uppercase;letter-spacing:.08em}
.cmp-hcell:nth-child(3){color:var(--ind);background:var(--ind-subtle);display:flex;align-items:center;gap:7px}
.cmp-row{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid var(--b0)}
.cmp-row:last-child{border-bottom:none}
.cmp-row:hover{background:var(--bg)}
.cmp-cell{padding:clamp(11px,1.5vw,16px) clamp(12px,2vw,24px);font-size:clamp(11.5px,1.3vw,14px);font-weight:500;color:var(--t2);display:flex;align-items:center;gap:6px}
.cmp-cell:first-child{font-weight:700;color:var(--t0)}
.cmp-cell:nth-child(3){color:var(--ind);font-weight:700}
.cmp-yes{color:var(--jade);font-size:13px}
.cmp-no{color:var(--t4);font-size:13px}
@media(max-width:540px){
  .cmp-header,.cmp-row{grid-template-columns:repeat(3,1fr)}
  .cmp-cell{font-size:10px;padding:9px 8px;white-space:normal}
  .cmp-hcell{font-size:10px;padding:9px 8px}
}

/* ─── FOUNDER ─── */
.founder-sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px);background:var(--bg);border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.founder-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(36px,7vw,96px);align-items:center}
.founder-img-wrap{position:relative}
.founder-img-card{width:100%;aspect-ratio:4/5;border-radius:var(--r-xl);overflow:hidden;background:var(--bg-dim);box-shadow:var(--sh-xl);transition:transform .5s var(--ex)}
.founder-img-card:hover{transform:scale(0.987) rotate(-0.4deg)}
.founder-img-card img{width:100%;height:100%;object-fit:cover;display:block}
.founder-img-accent{position:absolute;top:-20px;right:-20px;width:64px;height:64px;border-radius:50%;background:linear-gradient(145deg,rgba(26,76,245,0.1),rgba(99,60,240,0.07));filter:blur(16px);pointer-events:none}
.founder-badge{position:absolute;bottom:clamp(14px,2.5vw,28px);left:-clamp(6px,2vw,20px);background:var(--bg-pure);box-shadow:var(--sh-xl);padding:clamp(9px,1.5vw,14px) clamp(12px,2vw,20px);border-radius:var(--r-lg);display:inline-flex;align-items:center;gap:10px;border:1px solid var(--b1)}
.founder-badge-icon{width:clamp(28px,4vw,38px);height:clamp(28px,4vw,38px);border-radius:var(--r-sm);background:linear-gradient(145deg,#1A4CF5,#0E32C8);display:flex;align-items:center;justify-content:center;font-size:clamp(12px,1.8vw,17px);flex-shrink:0}
.founder-badge-text{font-size:clamp(10.5px,1.2vw,13px);font-weight:800;color:var(--t0);letter-spacing:-.02em}
.founder-right{padding:clamp(0px,2vw,16px) 0}
.founder-quote{font-family:var(--fd);font-size:clamp(15px,2vw,22px);line-height:1.48;font-weight:400;color:var(--t0);margin:18px 0 16px;position:relative;padding-left:20px;letter-spacing:-.02em}
.founder-quote-bar{position:absolute;left:0;top:0;bottom:0;width:2.5px;background:linear-gradient(180deg,var(--ind),rgba(26,76,245,0.12));border-radius:2px}
.tam-callout{display:flex;align-items:flex-start;gap:10px;padding:13px;background:var(--ind-subtle);border:1px solid var(--ind-border);border-radius:var(--r-md);margin-top:4px}
.tam-icon{font-size:16px;flex-shrink:0;margin-top:1px}
.tam-text{font-size:clamp(12px,1.3vw,13.5px);font-weight:500;color:var(--t1);line-height:1.55}
.tam-text strong{color:var(--ind);font-weight:800}
.founder-details{margin-top:24px;padding-top:24px;border-top:1px solid var(--b0);display:flex;flex-direction:column;gap:18px}
.founder-stats{display:flex;gap:clamp(20px,4vw,40px)}
.stat-item{display:flex;flex-direction:column;gap:3px}
.stat-number{font-family:var(--fd);font-size:clamp(22px,3vw,30px);font-weight:400;color:var(--t0);line-height:1;letter-spacing:-.04em}
.stat-number span{color:var(--ind)}
.stat-lbl{font-size:11.5px;font-weight:600;color:var(--t3)}
.founder-sig{display:flex;align-items:center;gap:10px}
.founder-sig-name{font-family:var(--fd);font-size:14px;font-style:italic;color:var(--t2)}
.founder-sig-title{font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
@media(max-width:900px){
  .founder-inner{grid-template-columns:1fr;gap:36px}
  .founder-img-card{aspect-ratio:16/9;max-height:320px}
  .founder-badge{left:12px;bottom:12px}
}
@media(max-width:480px){
  .founder-img-card{aspect-ratio:4/3;max-height:280px}
  .founder-badge{
    position:relative;bottom:auto;left:auto;
    margin-top:-28px;margin-left:12px;
    display:inline-flex;z-index:2;
  }
  .founder-img-wrap{display:flex;flex-direction:column}
}

/* ─── FAQ ─── */
.faq-sec{padding:clamp(56px,10vw,120px) clamp(20px,5vw,80px);background:var(--bg);border-top:1px solid var(--b0)}
.faq-inner{max-width:720px;margin:0 auto}
.faq-list{margin-top:40px;background:var(--bg-pure);border-radius:var(--r-xl);border:1px solid var(--b1);box-shadow:var(--sh-lg);overflow:hidden}
.faq-item{border-bottom:1px solid var(--b0)}
.faq-item:last-child{border-bottom:none}
.faq-q{
  width:100%;padding:clamp(15px,2vw,20px) clamp(16px,2.2vw,24px);
  display:flex;align-items:center;justify-content:space-between;gap:14px;
  text-align:left;background:none;font-size:clamp(13px,1.5vw,15px);
  font-weight:700;color:var(--t0);letter-spacing:-.015em;
  transition:background .15s;cursor:pointer;
}
.faq-q:hover{background:var(--bg)}
.faq-icon{width:22px;height:22px;border-radius:50%;flex-shrink:0;background:var(--bg-dim);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--t3);transition:transform .3s var(--ex),background .2s,color .2s}
.faq-item.open .faq-icon{transform:rotate(45deg);background:var(--ind-subtle);color:var(--ind)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .38s var(--ex)}
.faq-a-inner{padding:0 clamp(16px,2.2vw,24px) clamp(13px,1.8vw,20px);font-size:clamp(13px,1.4vw,14.5px);color:var(--t2);line-height:1.72;font-weight:400}
.faq-item.open .faq-a{max-height:400px}

/* ─── CTA ─── */
.cta-sec{
  padding:clamp(72px,12vw,140px) clamp(20px,5vw,80px);
  padding-bottom:clamp(100px,14vw,160px);
  text-align:center;position:relative;overflow:hidden;
  background:var(--t0);
}
.cta-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 80% at 50% 0%,rgba(26,76,245,0.22),transparent),radial-gradient(ellipse 50% 60% at 80% 100%,rgba(99,60,240,0.12),transparent)}
.cta-dots{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:26px 26px}
.cta-h2{font-family:var(--fd);font-size:clamp(34px,6vw,84px);font-weight:400;line-height:1.0;letter-spacing:-.04em;margin-bottom:16px;color:#fff;position:relative}
.cta-h2 em{font-style:italic;font-weight:400;color:rgba(255,255,255,0.45)}
.cta-sub{font-size:clamp(14px,1.8vw,18px);font-weight:400;color:rgba(255,255,255,0.52);line-height:1.72;margin-bottom:12px;position:relative;letter-spacing:-.01em}
.cta-pricing{font-size:13px;font-weight:600;color:rgba(255,255,255,0.32);margin-bottom:36px;position:relative}
.cta-pricing strong{color:rgba(255,255,255,0.62);font-weight:700}
.cta-form{display:flex;flex-direction:column;gap:10px;max-width:420px;margin:0 auto;position:relative}
.cta-form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cta-input{
  font-size:clamp(13.5px,1.5vw,15px);font-weight:600;color:var(--t0);
  background:rgba(255,255,255,0.97);border:1.5px solid rgba(255,255,255,0.12);
  border-radius:var(--r-md);padding:clamp(12px,1.5vw,14px) clamp(14px,1.8vw,18px);
  width:100%;outline:none;letter-spacing:-.01em;
  transition:border-color .25s,box-shadow .25s;
  -webkit-appearance:none;appearance:none;
}
.cta-input:focus{border-color:rgba(26,76,245,0.55);box-shadow:0 0 0 4px rgba(26,76,245,0.14)}
.cta-input::placeholder{color:rgba(9,9,14,0.32)}
.cta-submit{
  font-size:clamp(14px,1.6vw,16px);font-weight:800;color:#fff;
  letter-spacing:-.01em;background:var(--ind);border-radius:var(--r-md);
  padding:clamp(13px,1.8vw,15px) 36px;position:relative;overflow:hidden;width:100%;
  transition:transform .2s var(--ex),box-shadow .2s;
}
.cta-submit::before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,0.16),transparent 55%)}
.cta-submit:hover{transform:translateY(-2px);box-shadow:0 14px 48px rgba(26,76,245,0.6)}
.cta-submit:active{transform:scale(0.98)}
.cta-submit:disabled{opacity:.7;transform:none;cursor:wait}
.cta-trust{display:flex;justify-content:center;gap:clamp(8px,2vw,14px);margin-top:22px;flex-wrap:wrap;position:relative}
.cta-trust-item{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.4)}
.cta-trust-item+.cta-trust-item::before{content:'·';margin-right:4px;color:rgba(255,255,255,0.18)}
.cta-trust-check{width:15px;height:15px;border-radius:50%;background:rgba(5,150,105,0.18);border:1px solid rgba(5,150,105,0.35);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cta-wa{display:inline-flex;align-items:center;gap:8px;margin-top:16px;position:relative;font-size:13px;font-weight:700;color:rgba(255,255,255,0.48);background:rgba(18,140,126,0.1);border:1px solid rgba(18,140,126,0.22);border-radius:var(--r-md);padding:10px 16px;transition:background .2s,color .2s}
.cta-wa:hover{background:rgba(18,140,126,0.18);color:rgba(255,255,255,0.72)}
.cta-success{display:flex;flex-direction:column;align-items:center;gap:10px;animation:popIn .4s var(--ex)}
.cta-success-box{display:inline-flex;align-items:center;gap:12px;background:rgba(5,150,105,0.1);border:1px solid rgba(5,150,105,0.28);border-radius:var(--r-lg);padding:14px 22px}
.cta-success-icon{width:26px;height:26px;border-radius:50%;background:rgba(5,150,105,0.16);border:1px solid rgba(5,150,105,0.32);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cta-success-text{font-size:14px;color:#6EE7B7;font-weight:700;letter-spacing:-.01em}
@media(max-width:520px){
  .cta-form-row{grid-template-columns:1fr}
  .cta-form{max-width:100%}
}
@media(max-width:480px){
  .cta-trust{flex-direction:column;align-items:center;gap:8px}
  .cta-trust-item+.cta-trust-item::before{display:none}
}

/* ─── FOOTER ─── */
footer{border-top:1px solid var(--b0);padding:clamp(36px,6vw,60px) clamp(20px,5vw,80px) clamp(20px,3vw,36px);background:var(--bg-pure)}
.footer-main{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;gap:clamp(28px,5vw,60px);margin-bottom:clamp(32px,4vw,52px)}
.footer-brand p{font-size:13px;color:var(--t3);line-height:1.72;max-width:270px;font-weight:400;margin-top:12px}
.footer-compliance{font-size:11.5px;font-weight:600;color:var(--t4);margin-top:8px}
.footer-social{display:flex;gap:8px;margin-top:12px}
.footer-social-btn{width:32px;height:32px;border-radius:var(--r-sm);background:var(--bg);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;font-size:13px;transition:transform .2s var(--ex),box-shadow .2s}
.footer-social-btn:hover{transform:translateY(-2px);box-shadow:var(--sh-sm)}
.footer-col-title{font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);margin-bottom:14px}
.footer-links{display:flex;flex-direction:column;gap:9px}
.footer-link{font-size:13px;font-weight:500;color:var(--t2);transition:color .18s;width:fit-content}
.footer-link:hover{color:var(--t0)}
.footer-bottom{max-width:1280px;margin:0 auto;padding-top:18px;border-top:1px solid var(--b0);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.footer-copy{font-size:12px;color:var(--t4);font-weight:500}
.footer-legal{display:flex;gap:clamp(10px,2vw,22px);flex-wrap:wrap}
.footer-made{font-size:12px;color:var(--t4);display:flex;align-items:center;gap:4px;font-weight:500}
.footer-made span{color:var(--coral)}
@media(max-width:960px){.footer-main{grid-template-columns:1fr 1fr;gap:28px}}
@media(max-width:560px){
  .footer-main{grid-template-columns:1fr 1fr;gap:24px 20px}
  .footer-brand{grid-column:1/-1}
  .footer-bottom{flex-direction:column;align-items:flex-start;gap:8px}
  .footer-legal{gap:10px}
}
@media(max-width:360px){
  .footer-main{grid-template-columns:1fr;gap:24px}
}
`;

// ─────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on] as const;
}

function useCount(end: number, ms = 2000, dec = 0) {
  const [n, setN] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !go) { setGo(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [go]);
  useEffect(() => {
    if (!go) return;
    let t0: number;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setN(parseFloat((end * e).toFixed(dec)));
      if (p < 1) requestAnimationFrame(tick); else setN(end);
    };
    requestAnimationFrame(tick);
  }, [go, end, ms, dec]);
  return [ref, n] as const;
}

function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [bp]);
  return m;
}

function Reveal({
  children, delay = 0, dir = "up", className = "", style = {}
}: {
  children: ReactNode; delay?: number; dir?: "up" | "s" | "r" | "l"; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const cls = dir === "s" ? "rv-s" : dir === "r" ? "rv-r" : dir === "l" ? "rv-l" : "rv";
  return (
    <div ref={ref} className={`${cls} ${on ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// CURSOR (desktop only)
// ─────────────────────────────────────────
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rp = useRef({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      const t = e.target as Element;
      setHov(!!(t?.closest("button") || t?.closest("a") || t?.closest("[data-cursor]")));
    };
    let raf: number;
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
      <div id="cd" ref={dot} className={hov ? "hov" : ""} />
      <div id="cr" ref={ring} className={hov ? "hov" : ""} />
    </>
  );
}

// ─────────────────────────────────────────
// STICKY BAR
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
// NAV
// ─────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setSc(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const links = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Case Studies", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <nav id="nav" className={sc ? "s" : ""}>
        <div className="nav-logo">
          <div className="nav-mark">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
              <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
              <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
              <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
            </svg>
          </div>
          <span className="nav-name">Edu<b>fy</b></span>
        </div>
        <div className="nav-links">
          {links.map(l => <a key={l.label} href={l.href} className="nav-link">{l.label}</a>)}
        </div>
        <div className="nav-actions">
          <a href="https://wa.me/919999999999?text=Hi, I want to learn more about Edufy"
            target="_blank" rel="noopener" className="nav-wa">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.524 5.848L0 24l6.336-1.502A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.373l-.359-.213-3.722.882.924-3.62-.234-.372A9.792 9.792 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/></svg>
            Chat on WhatsApp
          </a>
          <a href="#cta" className="nav-cta">Book a demo →</a>
          <button className={`nav-toggle ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-nav ${open ? "open" : ""}`}>
        {links.map(l => <a key={l.label} href={l.href} className="mobile-nav-link" onClick={close}>{l.label}</a>)}
        <div className="mobile-nav-ctas">
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener" className="mobile-nav-wa" onClick={close}>
            💬 Chat on WhatsApp
          </a>
          <a href="#cta" className="mobile-nav-demo" onClick={close}>Book a free demo →</a>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// HERO
// ─────────────────────────────────────────
function StatCount({ end, suffix = "", dec = 0 }: { end: number; suffix?: string; dec?: number }) {
  const [ref, n] = useCount(end, 2000, dec);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
      <div className="hero-orb hero-orb-c" />
      <div className="hero-grid" />
      <div className="hero-content">
        <div className="hero-pill">
          <div className="hero-pill-dot">
            <div className="hero-pill-pulse" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span>Used by 500+ schools</span>
            <span className="hero-pill-sep" />
            <span>12 states</span>
          </div>
        </div>
        <h1 className="hero-h1">
          The school<br /><em>operating system</em><br />
          <span className="gr">India has waited for</span>
        </h1>
        <p className="hero-sub">
          One platform connecting attendance, fees, transport, exams, and parents —
          <strong> built for how Indian schools actually work.</strong>
        </p>
        <div className="hero-btns">
          <a href="#cta" className="hero-cta-primary">Book a free demo →</a>
          <button className="hero-cta-sec"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
            See how it works
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <path d="M2.5 7.5h10M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="hero-trust">
          {["No credit card needed", "Free for 30 days", "Cancel anytime"].map(t => (
            <div key={t} className="hero-trust-item">
              <div className="hero-trust-check">
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <path d="M1 3.5L2.8 5.5L6 1.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {t}
            </div>
          ))}
        </div>
        <div className="hero-metrics">
          <div className="hero-metric">
            <div className="hero-metric-val"><StatCount end={500} suffix="+" /></div>
            <div className="hero-metric-label">Schools onboarded</div>
            <div className="hero-metric-badge">↑ 42% YoY</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-val"><StatCount end={98} suffix="%" /></div>
            <div className="hero-metric-label">Retention rate</div>
            <div className="hero-metric-badge">Industry best</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-val">
              <StatCount end={4} suffix="." dec={0} />
              <span style={{ fontFamily: "var(--fd)", fontSize: "inherit" }}>9</span>
            </div>
            <div className="hero-metric-label">App Store rating</div>
            <div className="hero-metric-badge">4,800+ reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// LOGO STRIP
// ─────────────────────────────────────────
function LogoStrip() {
  const schools = [
    { icon: "🏫", name: "DPS Hyderabad" }, { icon: "🎓", name: "Narayana Group" },
    { icon: "🌸", name: "Orchids International" }, { icon: "⭐", name: "Sri Chaitanya" },
    { icon: "🏛️", name: "Delhi Public School" }, { icon: "🔬", name: "Vidyashilp Academy" },
    { icon: "📚", name: "DAV Public Schools" }, { icon: "🌟", name: "Kendriya Vidyalaya" },
  ];
  return (
    <section className="logo-strip">
      <div className="logo-strip-inner">
        <div className="logo-strip-label">Trusted by schools across India</div>
        <div className="logo-strip-logos">
          {schools.map((s, i) => (
            <div key={i} className="logo-pill">
              <span>{s.icon}</span>
              <span className="logo-pill-name">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// TRUST STATS + MARQUEE
// ─────────────────────────────────────────
function StatCell({ end, suffix = "", dec = 0, label, delta }: {
  end: number; suffix?: string; dec?: number; label: string; delta?: string;
}) {
  const [ref, n] = useCount(end, 2000, dec);
  return (
    <div className="trust-cell" ref={ref}>
      <div className="trust-val">{n}{suffix}</div>
      <div className="trust-lbl">{label}</div>
      {delta && <div className="trust-delta">{delta}</div>}
    </div>
  );
}

function TrustSection() {
  const items = [
    { i: "📋", n: "Smart Attendance" }, { i: "💰", n: "Fee Collection" },
    { i: "📊", n: "Exams & Results" }, { i: "🚌", n: "Live Transport" },
    { i: "📢", n: "Parent Notices" }, { i: "💬", n: "Two-way Messaging" },
    { i: "📱", n: "Mobile App" }, { i: "🔐", n: "Role-based Access" },
    { i: "📁", n: "Report Cards" }, { i: "📆", n: "Timetables" },
    { i: "🏫", n: "Multi-campus" }, { i: "📡", n: "Offline Mode" },
  ];
  const all = [...items, ...items];
  return (
    <section className="trust-sec">
      <div className="trust-inner">
        <div className="trust-grid">
          <StatCell end={500} suffix="+" label="Schools onboarded" delta="↑ 42% YoY" />
          <StatCell end={98} suffix="%" label="Customer retention" delta="Industry best" />
          <StatCell end={2} suffix="M+" label="Student records" delta="↑ 1.2M this year" />
          <StatCell end={4.9} dec={1} label="App Store rating" delta="4,800+ reviews" />
        </div>
      </div>
      <div className="marquee-wrap" style={{ marginTop: 16 }}>
        <div className="marquee-track">
          {all.map((m, i) => (
            <div key={i} className="marquee-item">
              <div className="marquee-icon">{m.i}</div>
              <span className="marquee-label">{m.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "01", title: "Setup your school", desc: "A dedicated coordinator guides you through data import, staff training, and configuration — all done remotely with zero disruption to your school day.", time: "2 hours" },
    { num: "02", title: "Train your staff", desc: "We run a free live training session for your teachers and admin. If you can use WhatsApp, you can use Edufy — zero IT expertise required.", time: "1 session" },
    { num: "03", title: "Go live, Day 1", desc: "Enable parent notifications, start marking attendance, and collect fees online. Most schools see measurable time savings from their very first school day.", time: "Day 1" },
  ];
  return (
    <section className="hiw-sec" id="how-it-works">
      <div className="hiw-inner">
        <Reveal>
          <div className="sec-label">How it works</div>
          <h2 className="sec-h2">From contract to live school<br /><em>in under 48 hours</em></h2>
          <p className="sec-body">No lengthy implementation. No IT department needed. No disruption to your school day.</p>
        </Reveal>
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08} dir="s">
              <div className="hiw-step">
                <div className="hiw-num">{s.num}</div>
                <div className="hiw-title">{s.title}</div>
                <div className="hiw-desc">{s.desc}</div>
                <div className="hiw-badge">⏱ {s.time}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FEATURES GRID
// ─────────────────────────────────────────
const FEATURES = [
  { icon: "📋", title: "Smart Attendance", desc: "1-tap marking per class, bulk import, biometric sync, and instant parent alerts when a child is absent.", metric: "41 min saved/teacher/day", glow: "rgba(217,119,6,0.06)" },
  { icon: "💰", title: "Fee Management", desc: "Online + offline collection, auto-reminders, UPI/Razorpay integration, and reconciliation in minutes not days.", metric: "₹2.1L recovered month 1", glow: "rgba(5,150,105,0.06)" },
  { icon: "🚌", title: "Live Transport", desc: "Real-time GPS tracking for every bus route, geofence alerts, and automated arrival notifications to parents.", metric: "Zero transport enquiry calls", glow: "rgba(220,38,38,0.05)" },
  { icon: "📊", title: "Exams & Results", desc: "Custom grading schemas, board-specific report card formats, and bulk PDF generation for 1,200+ students in 4 minutes.", metric: "4 min for 1,200 report cards", glow: "rgba(99,102,241,0.06)" },
  { icon: "📢", title: "Communication", desc: "Broadcast notices with read receipts, two-way parent messaging, and emergency alerts — all in one dashboard.", metric: "3x faster announcements", glow: "rgba(14,165,233,0.06)" },
  { icon: "📁", title: "Analytics & Reports", desc: "Consolidated dashboards for multi-campus groups, custom export formats, and attendance trend analysis.", metric: "Real-time across all campuses", glow: "rgba(26,76,245,0.06)" },
];

function FeaturesGrid() {
  return (
    <section className="features-sec" id="features">
      <div className="features-inner">
        <Reveal style={{ textAlign: "center" }}>
          <div className="sec-label" style={{ display: "inline-flex", margin: "0 auto 14px" }}>Product</div>
          <h2 className="sec-h2" style={{ textAlign: "center", margin: "0 auto 8px" }}>
            Everything your school needs,<br /><em>nothing it doesn't</em>
          </h2>
          <p className="sec-body" style={{ textAlign: "center", margin: "0 auto" }}>
            Six modules. One platform. Zero chaos.
          </p>
        </Reveal>
        <Reveal dir="s" delay={0.08}>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-body">
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                  <div className="feat-metric">✓ {f.metric}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// 3D MODULES CAROUSEL (Desktop) + Mobile Swiper
// ─────────────────────────────────────────
const MODULES = [
  { title: "Smart Attendance", badge: "Core", sub: "1-tap marking with auto alerts", image: "/assets/parent-attendance.png", accent: "#D97706" },
  { title: "Exams & Results", badge: "Academic", sub: "Report cards in hours", image: "/assets/parent-reports.png", accent: "#6366F1" },
  { title: "Fee Management", badge: "Finance", sub: "Online + offline collection", image: "/assets/parent-home.png", accent: "#059669" },
  { title: "Live Transport", badge: "Safety", sub: "Real-time GPS for every bus", image: "/assets/parent-home.png", accent: "#DC2626" },
  { title: "Notice Board", badge: "Comms", sub: "Broadcast with read receipts", image: "/assets/parent-home.png", accent: "#0EA5E9" },
];

const RADIUS = 370;

function MobileModulesSwiper() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const scrollLeft = track.scrollLeft;
      const cardWidth = track.firstElementChild
        ? (track.firstElementChild as HTMLElement).offsetWidth + 12
        : 1;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveIdx(Math.min(Math.max(idx, 0), MODULES.length - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild
      ? (track.firstElementChild as HTMLElement).offsetWidth + 12
      : 0;
    track.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="mobile-modules-swiper">
      <div className="mobile-modules-track" ref={trackRef}>
        {MODULES.map((mod, i) => (
          <div key={i} className="mobile-module-card">
            <div className="mobile-module-card-img">
              <img src={mod.image} alt={mod.title} loading="lazy" />
              <div className="mobile-module-card-overlay">
                <div className="mobile-module-badge" style={{ backgroundColor: `${mod.accent}cc` }}>{mod.badge}</div>
                <div className="mobile-module-title">{mod.title}</div>
                <div className="mobile-module-sub">{mod.sub}</div>
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
  );
}

function Modules3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

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
        start: "top+=600 center",
        end: "+=280%",
        scrub: 1.4,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        snap: {
          snapTo: [0, 0.2, 0.4, 0.6, 0.8, 1],
          duration: 0.4,
          ease: "power2.out",
        },
        onUpdate(self) {
          const totalRotation = self.progress * 360;
          let bestIdx = 0, bestDiff = 999;
          for (let i = 0; i < numCards; i++) {
            let cardAngle = (i * angleStep - totalRotation % 360 + 360) % 360;
            if (cardAngle > 180) cardAngle = 360 - cardAngle;
            if (cardAngle < bestDiff) { bestDiff = cardAngle; bestIdx = i; }
          }
          setActiveIdx(bestIdx);
        },
      },
    });

    stRef.current = tween.scrollTrigger ?? null;
    return () => { stRef.current?.kill(); tween.kill(); };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="modules-sec modules-desktop" id="features-3d">
        <div className="modules-inner">
          <Reveal>
            <div className="sec-label">Modules</div>
            <h2 className="sec-h2">Every tool your school needs,<br /><em>in one place</em></h2>
            <p className="sec-body" style={{ marginBottom: 0 }}>Scroll to explore each module →</p>
          </Reveal>
          <div className="carousel-stage-wrap">
            <div className="carousel-stage">
              <div ref={rotatorRef} className="carousel-rotator">
                {MODULES.map((mod, i) => {
                  const angleDeg = (360 / MODULES.length) * i;
                  const cardTransform = `rotateY(${angleDeg}deg) translateZ(${RADIUS}px)`;
                  const isActive = i === activeIdx;
                  return (
                    <div key={i} className={`module-card${isActive ? " front" : ""}`} style={{ transform: cardTransform }}>
                      <div className="module-card-img">
                        <img src={mod.image} alt={mod.title} loading="lazy" />
                      </div>
                      <div className="module-card-overlay">
                        <div className="module-card-badge" style={{ backgroundColor: `${mod.accent}cc` }}>{mod.badge}</div>
                        <div className="module-card-title">{mod.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="carousel-mask-l" />
              <div className="carousel-mask-r" />
            </div>
          </div>
          <div className="carousel-dots">
            {MODULES.map((_, i) => (
              <button key={i} className={`carousel-dot${i === activeIdx ? " active" : ""}`} aria-label={`Module ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>
      <section className="modules-sec modules-mobile">
        <div className="modules-inner">
          <Reveal>
            <div className="sec-label">Modules</div>
            <h2 className="sec-h2">Every tool your school needs,<br /><em>in one place</em></h2>
            <p className="sec-body">Swipe to explore each module →</p>
          </Reveal>
          <MobileModulesSwiper />
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Our teachers were spending 45 minutes on attendance every morning. With Edufy, it's 4 minutes. I have no idea how we managed before.",
    outcome: "41 minutes saved per teacher daily",
    name: "Priya Sharma", role: "Principal, DPS Hyderabad", avatar: "🏫", topColor: "var(--amber)",
  },
  {
    quote: "We haven't received a single 'where is the bus' call since we switched. That alone was worth every rupee. Parents actually thank us now.",
    outcome: "Zero transport enquiry calls",
    name: "Rajan Mehta", role: "Operations Director, Orchids International", avatar: "🚌", topColor: "var(--coral)",
  },
  {
    quote: "Fee reconciliation took my team a full week every month. Now it's automated before 9 AM on the 1st. The best operational decision we've made.",
    outcome: "₹2.1L in overdue fees recovered in month 1",
    name: "Sunita Rao", role: "Finance Head, Narayana Group", avatar: "💳", topColor: "var(--jade)",
  },
];

function Testimonials() {
  const isMobileScroll = useIsMobile(641);
  return (
    <section className="testimonials-sec" id="testimonials">
      <div className="testimonials-inner">
        <Reveal style={{ textAlign: "center" }}>
          <div className="sec-label" style={{ display: "inline-flex", margin: "0 auto 16px" }}>What schools say</div>
          <h2 className="sec-h2" style={{ textAlign: "center", margin: "0 auto 12px" }}>
            Trusted by principals<br /><em>who've tried everything else</em>
          </h2>
        </Reveal>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} dir="s" className={isMobileScroll ? "tcard-scroll-ready" : ""}>
              <div className={`tcard${isMobileScroll ? " tcard-scroll-ready" : ""}`}>
                <div className="tcard-bar" style={{ background: `linear-gradient(90deg,${t.topColor},transparent)` }} />
                <div className="tcard-stars">{[...Array(5)].map((_, j) => <span key={j} className="tcard-star">★</span>)}</div>
                <div className="tcard-quote">"{t.quote}"</div>
                <div className="tcard-outcome"><span>✅</span> {t.outcome}</div>
                <div className="tcard-author">
                  <div className="tcard-avatar">{t.avatar}</div>
                  <div>
                    <div className="tcard-name">{t.name}</div>
                    <div className="tcard-role">{t.role}</div>
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

// ─────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────
const CMP_ROWS = [
  { label: "Attendance marking time", old: "45+ min/day", edufy: "Under 4 min/day" },
  { label: "Fee reconciliation", old: "5–7 days/month", edufy: "Automated, <10 min" },
  { label: "Parent communication", old: "WhatsApp groups", edufy: "In-app with read receipts" },
  { label: "Report card generation", old: "2 weeks per term", edufy: "4 min for 1,200 cards" },
  { label: "Transport tracking", old: "None (phone calls)", edufy: "Live GPS + auto alerts" },
  { label: "Setup time", old: "3–6 months", edufy: "48 hours" },
  { label: "Multi-campus support", old: "Separate logins", edufy: "One dashboard" },
];

function ComparisonTable() {
  return (
    <section className="comparison-sec" id="comparison">
      <div className="comparison-inner">
        <Reveal style={{ textAlign: "center" }}>
          <div className="sec-label" style={{ display: "inline-flex", margin: "0 auto 16px" }}>The Edufy difference</div>
          <h2 className="sec-h2" style={{ textAlign: "center", margin: "0 auto" }}>
            The old way vs.<br /><em>the Edufy way</em>
          </h2>
        </Reveal>
        <Reveal dir="s" delay={0.08}>
          <div className="cmp-table">
            <div className="cmp-header">
              <div className="cmp-hcell">What you're measuring</div>
              <div className="cmp-hcell">⚠️ Legacy / manual</div>
              <div className="cmp-hcell">
                <div className="nav-mark" style={{ width: 20, height: 20, borderRadius: 5, boxShadow: "none", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
                    <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
                    <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
                    <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
                  </svg>
                </div>
                With Edufy
              </div>
            </div>
            {CMP_ROWS.map((r, i) => (
              <div key={i} className="cmp-row">
                <div className="cmp-cell">{r.label}</div>
                <div className="cmp-cell"><span className="cmp-no">✕</span> {r.old}</div>
                <div className="cmp-cell"><span className="cmp-yes">✓</span> {r.edufy}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FOUNDER
// ─────────────────────────────────────────
function Founder() {
  const isMobile = useIsMobile(480);
  return (
    <section className="founder-sec">
      <div className="founder-inner">
        <Reveal dir="l">
          <div className="founder-img-wrap">
            <div className="founder-img-accent" />
            <div className="founder-img-card">
              <img src="/assets/founder.png" alt="Ravi Teja Maddoju, Founder & CEO" />
            </div>
            {!isMobile && (
              <div className="founder-badge">
                <div className="founder-badge-icon">🏆</div>
                <div>
                  <div className="founder-badge-text">10+ years in EdTech</div>
                </div>
              </div>
            )}
          </div>
          {isMobile && (
            <div className="founder-badge">
              <div className="founder-badge-icon">🏆</div>
              <div>
                <div className="founder-badge-text">10+ years in EdTech</div>
              </div>
            </div>
          )}
        </Reveal>
        <Reveal delay={0.1} dir="r">
          <div className="founder-right">
            <div className="sec-label">Our story</div>
            <h2 className="sec-h2">Built by educators,<br /><em>for educators</em></h2>
            <div className="founder-quote">
              <div className="founder-quote-bar" />
              We spent 6 months inside schools across Hyderabad, Pune, and Patna before writing a single line of code. We saw teachers triple-enter attendance, principals apologising about buses on WhatsApp, and finance teams reconciling spreadsheets at midnight. Every Edufy feature comes from those real conversations, not a boardroom roadmap.
            </div>
            <div className="tam-callout">
              <div className="tam-icon">📊</div>
              <div className="tam-text">
                India has <strong>1.5 million schools</strong>. Fewer than <strong>3%</strong> use modern management software. We're just getting started.
              </div>
            </div>
            <div className="founder-details">
              <div className="founder-stats">
                <div className="stat-item">
                  <div className="stat-number">500<span>+</span></div>
                  <div className="stat-lbl">Schools served</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98<span>%</span></div>
                  <div className="stat-lbl">Retention rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-lbl">States active</div>
                </div>
              </div>
              <div className="founder-sig">
                <div>
                  <div className="founder-sig-name">— Ravi Teja Maddoju</div>
                  <div className="founder-sig-title">Founder & CEO, Edufy</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────
const FAQS = [
  { q: "How long does setup actually take?", a: "Most schools are fully live within 48 hours of signing up. Our onboarding team handles the data import, and we run a free training session for your staff. You don't need an IT department — if you can use a smartphone, you can run Edufy." },
  { q: "Is our data secure? Where is it stored?", a: "All data is stored on ISO 27001-certified servers located in India. We are PDPB compliant and SOC 2 Type II certified. Your student data never leaves Indian soil, and we offer 256-bit AES encryption at rest and in transit." },
  { q: "Do you support state board formats for report cards?", a: "Yes. Edufy supports CBSE, ICSE, and all major state board formats including UP Board, Maharashtra SSC, AP/Telangana, Karnataka, Tamil Nadu, and more. We configure these for you during onboarding." },
  { q: "What happens when the free trial ends?", a: "We'll reach out before your trial ends to discuss next steps. There's no auto-charge. Plans start at ₹4,999/month per school — no per-student fees, no hidden costs. If Edufy isn't the right fit, we export your data cleanly." },
  { q: "Can we use Edufy offline?", a: "Yes. Attendance marking and a read-only view of critical data works offline. Data syncs automatically when connectivity is restored — built for Indian infrastructure realities." },
  { q: "Do you integrate with Tally and existing payment systems?", a: "We have a native Tally integration for fee accounting. We also support UPI, HDFC, ICICI, and Razorpay payment gateways. Custom payment API integration is available during onboarding." },
  { q: "How does multi-campus management work?", a: "One Edufy account can manage unlimited campuses. The group admin sees consolidated reports across all schools, switches between campuses in one click, and sets campus-specific configurations independently." },
  { q: "Do you provide training for teachers who aren't tech-savvy?", a: "Edufy feels like WhatsApp, not enterprise software. We run live video training, provide Hindi and regional language guides, and our support team is available 6 AM–10 PM IST via WhatsApp." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq-sec" id="faq">
      <div className="faq-inner">
        <Reveal style={{ textAlign: "center" }}>
          <div className="sec-label" style={{ display: "inline-flex", margin: "0 auto 16px" }}>FAQ</div>
          <h2 className="sec-h2" style={{ textAlign: "center", margin: "0 auto" }}>
            Questions schools<br /><em>always ask us</em>
          </h2>
        </Reveal>
        <Reveal dir="s" delay={0.08}>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                  {f.q}
                  <div className="faq-icon">+</div>
                </button>
                <div className="faq-a">
                  <div className="faq-a-inner">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// CTA
// ─────────────────────────────────────────
function CTA() {
  const [form, setForm] = useState({ name: "", school: "", city: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 900);
  };

  return (
    <section className="cta-sec" id="cta">
      <div className="cta-bg" />
      <div className="cta-dots" />
      <Reveal style={{ position: "relative", zIndex: 2 }}>
        <h2 className="cta-h2">Your school deserves<br /><em>better software.</em></h2>
        <p className="cta-sub">Join 500+ schools that have simplified their operations.<br />Most go live within 48 hours of signing up.</p>
        <p className="cta-pricing">Plans from <strong>₹4,999/month</strong> · No per-student charges · No setup fees</p>
        {!sent ? (
          <>
            <div className="cta-form">
              <div className="cta-form-row">
                <input className="cta-input" placeholder="Your name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="cta-input" placeholder="School name" value={form.school}
                  onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
              </div>
              <div className="cta-form-row">
                <input className="cta-input" placeholder="City" value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                <input className="cta-input" placeholder="WhatsApp number" value={form.phone}
                  inputMode="tel"
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <button className="cta-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Booking your demo..." : "Book my free demo →"}
              </button>
            </div>
            <a href="https://wa.me/919999999999?text=Hi, I want to book a demo for Edufy"
              target="_blank" rel="noopener" className="cta-wa">
              <span>💬</span> Or chat directly on WhatsApp
            </a>
          </>
        ) : (
          <div className="cta-success">
            <div className="cta-success-box">
              <div className="cta-success-icon">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4.5 8.5L9.5 2" stroke="#6EE7B7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="cta-success-text">We'll WhatsApp you within 2 hours. 🎉</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 500 }}>
              Can't wait?{" "}
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener"
                style={{ color: "rgba(255,255,255,.6)", borderBottom: "1px solid rgba(255,255,255,.2)" }}>
                Message us on WhatsApp →
              </a>
            </p>
          </div>
        )}
        <div className="cta-trust">
          {["No contract lock-in", "Free onboarding", "Cancel anytime"].map(t => (
            <div key={t} className="cta-trust-item">
              <div className="cta-trust-check">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4L3 6L7 1.5" stroke="#6EE7B7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {t}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Attendance", href: "#features" }, { label: "Fee Management", href: "#features" },
        { label: "Transport", href: "#features" }, { label: "Communication", href: "#features" },
        { label: "Reports", href: "#features" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" }, { label: "Blog", href: "#" },
        { label: "Careers", href: "#" }, { label: "Press Kit", href: "#" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Documentation", href: "#" }, { label: "Help Center", href: "#" },
        { label: "System Status", href: "#" }, { label: "WhatsApp Support", href: "https://wa.me/919999999999" },
      ]
    },
  ];

  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div className="nav-mark">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
                <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
                <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
                <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
              </svg>
            </div>
            <span className="nav-name" style={{ fontSize: 17 }}>Edu<b>fy</b></span>
          </div>
          <p>The school operating system built for Indian schools. Simplifying operations so educators can focus on education.</p>
          <div className="footer-compliance">🔒 ISO 27001 · PDPB Compliant · Data stored in India</div>
          <div className="footer-social">
            {["𝕏", "in", "▶", "💬"].map((icon, i) => (
              <button key={i} className="footer-social-btn">{icon}</button>
            ))}
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            <div className="footer-links">
              {col.links.map(l => <a key={l.label} href={l.href} className="footer-link">{l.label}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 Edufy Technologies Pvt. Ltd. All rights reserved.</span>
        <div className="footer-legal">
          {["Privacy Policy", "Terms of Service", "Security", "Cookies"].map(l => (
            <a key={l} href="#" className="footer-link" style={{ fontSize: 12 }}>{l}</a>
          ))}
        </div>
        <div className="footer-made">Made with <span>♥</span> in Hyderabad, India</div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <div id="noise" />
      <Cursor />
      <StickyBar />
      <Nav />
      <Hero />
      <FeaturesGrid />
      <Modules3D />
      <Testimonials />
      <ComparisonTable />
      <Founder />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}