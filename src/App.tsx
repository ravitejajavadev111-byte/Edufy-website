import { useState, useEffect, useRef, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   EDUFY — Elite SaaS Landing Page (Award-winning tier)
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,200;1,9..144,300;1,9..144,400&family=Cabinet+Grotesk:wght@300;400;500;600;700;800&display=swap');

*,::before,::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:         #FAFAFA;
  --bg-pure:    #FFFFFF;
  --s1:         #F5F5F7;
  --s2:         #EBEBEF;
  --s3:         #E0E0E8;
  --b0:         rgba(10,10,20,0.05);
  --b1:         rgba(10,10,20,0.09);
  --b2:         rgba(10,10,20,0.16);
  --b3:         rgba(10,10,20,0.26);
  --ind:        #1A4CF5;
  --ind-d:      rgba(26,76,245,0.1);
  --ind-g:      rgba(26,76,245,0.32);
  --ind-l:      #4D76F8;
  --ind-vl:     rgba(26,76,245,0.06);
  --jade:       #0B9A68;
  --amber:      #D97706;
  --coral:      #DC2626;
  --t0:         #0A0A14;
  --t1:         rgba(10,10,20,0.85);
  --t2:         rgba(10,10,20,0.56);
  --t3:         rgba(10,10,20,0.38);
  --t4:         rgba(10,10,20,0.18);
  --fd: 'Fraunces', Georgia, serif;
  --fb: 'Cabinet Grotesk', -apple-system, sans-serif;
  --ex:  cubic-bezier(0.16,1,0.3,1);
  --qt:  cubic-bezier(0.76,0,0.24,1);
  --smooth: cubic-bezier(0.4,0,0.2,1);
}

html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--t0);font-family:var(--fb);
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  overflow-x:hidden;cursor:none}
button{font-family:var(--fb);border:none;cursor:none}
input{font-family:var(--fb)}
a{text-decoration:none;color:inherit}
::selection{background:rgba(26,76,245,0.18);color:var(--t0)}

/* ── CURSOR ── */
#cd{position:fixed;width:6px;height:6px;border-radius:50%;
  background:var(--ind);pointer-events:none;z-index:99999;
  transform:translate(-50%,-50%);transition:width .2s var(--ex),height .2s var(--ex),background .2s}
#cr{position:fixed;width:38px;height:38px;border-radius:50%;
  border:1.5px solid rgba(26,76,245,0.35);
  pointer-events:none;z-index:99998;transform:translate(-50%,-50%);
  transition:width .35s var(--ex),height .35s var(--ex),border-color .25s,border-radius .3s}
#cd.h{width:10px;height:10px;background:var(--ind)}
#cr.h{width:58px;height:58px;border-color:rgba(26,76,245,0.22);border-radius:50%}
#cd.text-h{width:4px;height:28px;border-radius:3px;background:var(--t0)}
#cr.text-h{width:2px;height:2px;border-color:transparent}

/* ── NOISE ── */
#noise{position:fixed;inset:0;pointer-events:none;z-index:99997;opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:190px}

/* ── SCROLL REVEAL ── */
.rv{opacity:0;transform:translateY(28px) skewY(.4deg);
  transition:opacity .9s var(--ex),transform .9s var(--ex)}
.rv.on{opacity:1;transform:none}
.rv-s{opacity:0;transform:scale(.95) translateY(12px);
  transition:opacity .8s var(--ex),transform .8s var(--ex)}
.rv-s.on{opacity:1;transform:none}
.rv-r{opacity:0;transform:translateX(32px);
  transition:opacity .88s var(--ex),transform .88s var(--ex)}
.rv-r.on{opacity:1;transform:none}
.rv-l{opacity:0;transform:translateX(-32px);
  transition:opacity .88s var(--ex),transform .88s var(--ex)}
.rv-l.on{opacity:1;transform:none}

/* ── KEYFRAMES ── */
@keyframes heroIn{from{opacity:0;transform:translateY(32px) skewY(1.5deg)}to{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.8) translateY(10px)}100%{opacity:1;transform:none}}
@keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(.5deg)}}
@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.8)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes drift1{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(60px,-40px)scale(1.1)}66%{transform:translate(-40px,55px)scale(.9)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}42%{transform:translate(-70px,28px)scale(1.08)}70%{transform:translate(44px,-54px)scale(.94)}}
@keyframes drift3{0%,100%{transform:translate(0,0)scale(1)}52%{transform:translate(75px,32px)scale(1.1)}}
@keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes borderGlow{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pillIn{0%{opacity:0;transform:scale(.85) translateY(8px)}100%{opacity:1;transform:none}}

/* ── NAV ── */
#nav{position:fixed;top:0;left:0;right:0;z-index:900;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 56px;height:68px;
  transition:background .4s var(--smooth),border-color .4s,backdrop-filter .4s;
  border-bottom:1px solid transparent}
#nav.s{background:rgba(250,250,250,.82);backdrop-filter:blur(28px) saturate(1.8);
  -webkit-backdrop-filter:blur(28px) saturate(1.8);border-color:var(--b0)}
.nl{display:flex;align-items:center;gap:12px}
.nm{width:36px;height:36px;border-radius:11px;
  background:linear-gradient(145deg,#1A4CF5,#0E36D4);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(26,76,245,.35),0 0 0 1px rgba(26,76,245,.2)}
.nn{font-size:18px;font-weight:700;letter-spacing:-.04em;color:var(--t0)}
.nnb{color:var(--ind)}
.nav-links{display:flex;align-items:center;gap:4px}
.nl-item{font-size:14px;font-weight:500;color:var(--t2);background:none;
  padding:8px 14px;border-radius:8px;transition:color .2s,background .2s}
.nl-item:hover{color:var(--t0);background:var(--b0)}
.na{display:flex;align-items:center;gap:8px}
.bg{font-size:14px;font-weight:500;color:var(--t2);background:none;
  padding:9px 18px;border-radius:8px;transition:color .2s,background .2s}
.bg:hover{color:var(--t0);background:var(--b0)}
.bc{font-size:14px;font-weight:600;color:#fff;
  background:var(--ind);border-radius:9px;padding:9px 22px;
  position:relative;overflow:hidden;letter-spacing:-.01em;
  transition:transform .22s var(--ex),box-shadow .22s var(--ex),background .2s}
.bc::before{content:'';position:absolute;inset:0;
  background:linear-gradient(145deg,rgba(255,255,255,.18),transparent 55%);
  opacity:0;transition:opacity .25s}
.bc:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(26,76,245,.45)}
.bc:hover::before{opacity:1}
.bc:active{transform:translateY(0)}

/* ── HERO ── */
.hero{min-height:100vh;position:relative;overflow:hidden;
  display:flex;align-items:center;padding:130px 60px 80px;
  background:linear-gradient(180deg, #FAFAFA 0%, #F8F8FC 100%)}
.hi{max-width:1000px;margin:0 auto;width:100%;text-align:center;position:relative;z-index:2}

/* Mesh gradient blobs */
.orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none}
.oa{width:800px;height:700px;background:rgba(26,76,245,.055);
  top:-200px;left:-180px;animation:drift1 24s ease-in-out infinite}
.ob{width:560px;height:560px;background:rgba(0,100,230,.04);
  top:320px;right:-130px;animation:drift2 28s ease-in-out infinite}
.oc{width:420px;height:420px;background:rgba(100,60,240,.035);
  bottom:-40px;left:36%;animation:drift3 20s ease-in-out infinite}

/* Fine dot grid */
.dg{position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(10,10,20,.045) 1px,transparent 1px);
  background-size:28px 28px;
  -webkit-mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent);
  mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent)}

/* Hero pill badge */
.hpill{display:inline-flex;align-items:center;gap:9px;
  font-size:11.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--ind);border:1px solid rgba(26,76,245,.25);
  background:rgba(26,76,245,.05);
  border-radius:100px;padding:6px 18px 6px 8px;margin-bottom:34px;
  animation:pillIn .75s var(--ex) both}
.hpd{width:22px;height:22px;border-radius:50%;
  background:rgba(26,76,245,.12);border:1px solid rgba(26,76,245,.2);
  display:flex;align-items:center;justify-content:center}
.hpdi{width:7px;height:7px;border-radius:50%;background:var(--ind);
  animation:blink 2.4s ease-in-out infinite}
.hpill-txt{display:flex;align-items:center;gap:8px}
.hpill-sep{width:1px;height:12px;background:rgba(26,76,245,.25)}

/* Hero heading */
.hh{font-family:var(--fd);
  font-size:clamp(58px,7.5vw,104px);font-weight:300;
  line-height:.93;letter-spacing:-.036em;margin-bottom:30px;
  color:var(--t0);
  animation:heroIn 1s var(--ex) .06s both}
.hh em{font-style:italic;font-weight:200;color:var(--t2)}
.hh .gr{
  background:linear-gradient(128deg, var(--t0) 0%, var(--ind) 35%, #6D8FFF 60%, var(--t0) 85%);
  background-size:280% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 6s linear infinite}

/* Hero sub */
.hs{font-size:19px;font-weight:400;line-height:1.72;
  color:var(--t2);max-width:580px;margin:0 auto 46px;
  animation:fadeUp .95s var(--ex) .22s both;letter-spacing:-.01em}

/* Hero CTA group */
.hbt{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
  animation:fadeUp .9s var(--ex) .34s both}

/* Primary CTA */
.bph{font-size:16px;font-weight:700;color:#fff;letter-spacing:-.01em;
  background:var(--ind);border-radius:12px;padding:16px 38px;
  position:relative;overflow:hidden;
  transition:transform .28s var(--ex),box-shadow .28s var(--ex)}
.bph::after{content:'';position:absolute;inset:0;
  background:linear-gradient(145deg,rgba(255,255,255,.18),transparent 55%)}
.bph:hover{transform:translateY(-3px) scale(1.01);box-shadow:0 16px 56px rgba(26,76,245,.52)}
.bph:active{transform:translateY(0) scale(.99)}

/* Secondary CTA */
.bps{font-size:16px;font-weight:600;color:var(--t1);letter-spacing:-.01em;
  background:var(--bg-pure);border:1.5px solid var(--b2);
  border-radius:12px;padding:16px 32px;
  display:flex;align-items:center;gap:10px;
  transition:border-color .24s,background .24s,transform .24s var(--ex),box-shadow .24s}
.bps:hover{border-color:var(--b3);background:var(--bg-pure);
  transform:translateY(-2px);box-shadow:0 8px 28px rgba(10,10,20,.08)}
.bps svg{transition:transform .3s var(--ex)}
.bps:hover svg{transform:translateX(4px)}

/* Hero trust badges */
.htr{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:38px;flex-wrap:wrap;
  animation:fadeUp .9s var(--ex) .46s both}
.htb{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:var(--t3)}
.htb + .htb::before{content:'·';color:var(--t4);margin-right:0}
.htc{width:17px;height:17px;border-radius:50%;
  background:rgba(11,154,104,.1);border:1px solid rgba(11,154,104,.25);
  display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* Urgency pill */
.limited{font-size:12.5px;font-weight:700;color:var(--amber);letter-spacing:.02em;
  background:rgba(217,119,6,.07);border:1px solid rgba(217,119,6,.18);
  border-radius:100px;padding:5px 18px;margin-top:20px;display:inline-block;
  animation:fadeUp .9s var(--ex) .42s both}

/* ── SOCIAL PROOF STRIP ── */
.trust-sec{padding:36px 60px;
  border-top:1px solid var(--b0);border-bottom:1px solid var(--b0);
  background:var(--bg-pure)}
.trust-inner{max-width:1280px;margin:0 auto}
.trust-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:32px;
  border:1px solid var(--b1);border-radius:20px;overflow:hidden}
.trust-stat{padding:24px 28px;position:relative;text-align:left;
  border-right:1px solid var(--b1)}
.trust-stat:last-child{border-right:none}
.trust-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--ind),transparent);opacity:0;
  transition:opacity .4s}
.trust-stat:hover::before{opacity:1}
.trust-stat-val{font-family:var(--fd);font-size:2.8rem;font-weight:400;
  letter-spacing:-.04em;color:var(--t0);line-height:1}
.trust-stat-lbl{font-size:13px;font-weight:500;color:var(--t3);margin-top:6px}
.trust-stat-delta{font-size:11px;font-weight:700;color:var(--jade);
  background:rgba(11,154,104,.08);border:1px solid rgba(11,154,104,.2);
  border-radius:100px;padding:2px 10px;display:inline-block;margin-top:8px;letter-spacing:.04em}

/* Marquee */
.mw{overflow:hidden;position:relative}
.mw::before,.mw::after{content:'';position:absolute;top:0;bottom:0;width:180px;
  z-index:2;pointer-events:none}
.mw::before{left:0;background:linear-gradient(90deg,var(--bg-pure),transparent)}
.mw::after{right:0;background:linear-gradient(-90deg,var(--bg-pure),transparent)}
.mt{display:flex;width:max-content;animation:marquee 40s linear infinite}
.mt:hover{animation-play-state:paused}
.mi{display:flex;align-items:center;gap:10px;
  padding:10px 28px;border-right:1px solid var(--b0);white-space:nowrap;cursor:default}
.mico{width:28px;height:28px;border-radius:8px;background:var(--s1);
  display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.mlb{font-size:14px;font-weight:600;color:var(--t3);transition:color .2s;letter-spacing:-.01em}
.mi:hover .mlb{color:var(--t1)}
.mi:hover .mico{background:var(--ind-d)}

/* ── PROBLEM SECTION ── */
.problem-sec{padding:120px 60px;background:var(--bg)}
.problem-header{max-width:1280px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-bottom:64px}
.problem-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;
  max-width:1280px;margin:0 auto}
@media(min-width:900px){.problem-grid{grid-template-columns:repeat(4,1fr)}}
.problem-card{background:var(--bg-pure);border:1px solid var(--b1);border-radius:20px;
  padding:32px 28px;position:relative;overflow:hidden;
  transition:border-color .4s var(--smooth),transform .4s var(--ex),box-shadow .4s}
.problem-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--coral),rgba(220,38,38,.2));
  opacity:0;transition:opacity .4s}
.problem-card:hover{border-color:rgba(220,38,38,.2);transform:translateY(-6px);
  box-shadow:0 20px 60px rgba(10,10,20,.07)}
.problem-card:hover::before{opacity:1}
.problem-icon-wrap{width:44px;height:44px;border-radius:12px;background:var(--s1);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:20px;font-size:20px;
  transition:background .3s,transform .3s var(--ex)}
.problem-card:hover .problem-icon-wrap{background:rgba(220,38,38,.07);transform:scale(1.1)}
.problem-title{font-family:var(--fd);font-size:19px;font-weight:400;
  letter-spacing:-.025em;margin-bottom:10px;color:var(--t0);line-height:1.2}
.problem-desc{font-size:14px;font-weight:400;color:var(--t2);line-height:1.65}

/* ── SECTION SHARED ── */
.sec{padding:120px 60px}
.sin{max-width:1280px;margin:0 auto}
.slb{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  color:var(--ind);display:inline-flex;align-items:center;gap:10px;margin-bottom:20px;
  padding:5px 14px;background:var(--ind-vl);border:1px solid rgba(26,76,245,.15);
  border-radius:100px}
.sh{font-family:var(--fd);font-size:clamp(40px,5.2vw,68px);
  font-weight:300;line-height:1.03;letter-spacing:-.03em;margin-bottom:20px;color:var(--t0)}
.sh em{font-style:italic;color:var(--t2);font-weight:200}
.sh strong{font-weight:500}
.ss{font-size:18px;font-weight:400;color:var(--t2);line-height:1.75;max-width:540px;letter-spacing:-.01em}

/* ── 3D MODULES CAROUSEL ── */
.modules3d-sec{position:relative;overflow:hidden;background:var(--bg)}
.carousel-stage{perspective:2200px;width:100%;height:580px;position:relative;
  overflow:hidden;border-radius:32px;transform-style:preserve-3d;
  background:linear-gradient(180deg,var(--s1) 0%,var(--bg-pure) 100%);
  border:1px solid var(--b1);box-shadow:0 40px 80px rgba(10,10,20,.06)}
.carousel-rotator{width:100%;height:100%;transform-style:preserve-3d;
  will-change:transform;position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%)}
.module-card{position:absolute;width:290px;height:420px;
  left:50%;top:50%;margin-left:-145px;margin-top:-210px;
  border-radius:28px;background:var(--bg-pure);
  box-shadow:0 32px 64px -12px rgba(10,10,20,.2),0 0 0 1px rgba(10,10,20,.06);
  transform-origin:center center;will-change:transform,opacity;
  overflow:hidden;display:flex;flex-direction:column;
  transition:box-shadow .5s var(--ex)}
.module-card .card-header{padding:22px 22px 10px;z-index:2;display:flex;
  flex-direction:column;gap:6px}
.module-card .card-badge{display:inline-flex;align-items:center;gap:6px;
  font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ind-l);padding:3px 10px;
  background:var(--ind-vl);
  border:1px solid rgba(26,76,245,.18);
  border-radius:100px;width:fit-content}
.module-card .card-header h3{font-family:var(--fd);font-size:22px;font-weight:400;
  letter-spacing:-.03em;color:var(--t0);margin:0}
.module-card .card-image{flex:1;margin:8px 22px 24px;border-radius:20px;
  overflow:hidden;background:var(--s1);display:flex;align-items:center;
  justify-content:center;position:relative}
.module-card .card-image img{width:100%;height:100%;object-fit:contain;
  display:block;transition:transform .5s var(--ex)}
.module-card .glow-ring{position:absolute;inset:0;border-radius:28px;
  pointer-events:none;
  box-shadow:inset 0 0 0 1.5px rgba(26,76,245,.25);
  opacity:0;transition:opacity .4s}
.module-card:hover .glow-ring{opacity:1}

/* Active card indicator */
.carousel-indicator{display:flex;justify-content:center;gap:8px;margin-top:28px}
.carousel-dot{width:6px;height:6px;border-radius:50%;background:var(--b2);
  transition:background .3s,width .3s var(--ex);cursor:pointer}
.carousel-dot.active{width:24px;border-radius:3px;background:var(--ind)}

/* Mobile fallback */
.mobile-modules-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:20px;margin-top:48px}
.mobile-module-card{border-radius:22px;background:var(--bg-pure);
  border:1px solid var(--b1);overflow:hidden;
  box-shadow:0 4px 24px rgba(10,10,20,.04);
  transition:transform .35s var(--ex),box-shadow .35s}
.mobile-module-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(10,10,20,.08)}
.mobile-module-card .card-header{padding:20px 20px 10px}
.mobile-module-card .card-header h3{font-family:var(--fd);font-size:19px;
  font-weight:400;margin-bottom:0;color:var(--t0);letter-spacing:-.025em}
.mobile-module-card .card-image{margin:8px 20px 20px;height:160px;background:var(--s1);
  border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.mobile-module-card .card-image img{width:100%;height:100%;object-fit:contain}

/* ── FEATURES GRID ── */
.features-sec{padding:120px 60px;background:var(--bg-pure);
  border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.features-header{max-width:1280px;margin:0 auto 64px;text-align:center}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;
  max-width:1280px;margin:0 auto;background:var(--b0);border-radius:24px;overflow:hidden}
.feat-card{background:var(--bg-pure);padding:40px 36px;position:relative;
  overflow:hidden;transition:background .3s}
.feat-card:hover{background:var(--s1)}
.feat-icon{width:48px;height:48px;border-radius:14px;
  background:var(--ind-vl);border:1px solid rgba(26,76,245,.14);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:22px;font-size:20px;
  transition:transform .4s var(--ex),background .3s,box-shadow .3s}
.feat-card:hover .feat-icon{transform:scale(1.12) rotate(-3deg);
  background:rgba(26,76,245,.1);box-shadow:0 8px 24px rgba(26,76,245,.18)}
.feat-title{font-family:var(--fd);font-size:20px;font-weight:400;
  letter-spacing:-.025em;color:var(--t0);margin-bottom:12px}
.feat-desc{font-size:14.5px;color:var(--t2);line-height:1.65;font-weight:400}
.feat-link{display:inline-flex;align-items:center;gap:6px;
  font-size:13px;font-weight:600;color:var(--ind);margin-top:16px;
  opacity:0;transform:translateX(-4px);
  transition:opacity .3s,transform .3s var(--ex)}
.feat-card:hover .feat-link{opacity:1;transform:none}

/* ── FOUNDER ── */
.founder-section{background:var(--bg);
  border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.founder-inner{display:grid;grid-template-columns:1fr 1.1fr;
  gap:100px;align-items:center;max-width:1280px;margin:0 auto}
.founder-left{position:relative}
.founder-img-wrap{position:relative}
.founder-image-card{width:100%;aspect-ratio:4/5;border-radius:36px;overflow:hidden;
  background:var(--s2);box-shadow:0 40px 80px rgba(10,10,20,.1);
  transition:transform .5s var(--ex)}
.founder-image-card:hover{transform:scale(.98) rotate(-.5deg)}
.founder-image-card img{width:100%;height:100%;object-fit:cover;display:block}
.founder-badge{position:absolute;bottom:28px;left:-24px;
  background:var(--bg-pure);border:1px solid var(--b1);
  padding:14px 22px;border-radius:18px;
  display:inline-flex;align-items:center;gap:14px;
  box-shadow:0 16px 48px rgba(10,10,20,.1);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.founder-badge-icon{width:40px;height:40px;border-radius:12px;
  background:linear-gradient(145deg,#1A4CF5,#0E36D4);
  display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.founder-badge-text{display:flex;flex-direction:column;gap:2px}
.founder-badge-title{font-size:14px;font-weight:700;color:var(--t0);letter-spacing:-.02em}
.founder-badge-sub{font-size:12px;color:var(--t3);font-weight:500}
.founder-accent{position:absolute;top:-20px;right:-20px;width:80px;height:80px;
  border-radius:50%;background:linear-gradient(145deg,rgba(26,76,245,.12),rgba(100,60,240,.08));
  filter:blur(20px)}
.founder-right{padding:20px 0}
.founder-quote{font-family:var(--fd);font-size:clamp(22px,2.5vw,30px);
  line-height:1.35;font-weight:300;color:var(--t0);
  margin:28px 0 24px;position:relative;padding-left:28px;letter-spacing:-.02em}
.founder-quote-bar{position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--ind),rgba(26,76,245,.2));border-radius:2px}
.founder-details{margin-top:32px;padding-top:32px;
  border-top:1px solid var(--b0);
  display:flex;flex-direction:column;gap:24px}
.founder-stats{display:flex;gap:48px}
.stat-item{display:flex;flex-direction:column;gap:4px}
.stat-number{font-family:var(--fd);font-size:32px;font-weight:400;
  color:var(--t0);line-height:1;letter-spacing:-.04em}
.stat-number span{color:var(--ind)}
.stat-label{font-size:13px;font-weight:500;color:var(--t3)}
.founder-sig-wrap{display:flex;align-items:center;gap:14px}
.founder-sig-avatar{width:44px;height:44px;border-radius:50%;overflow:hidden;
  border:2px solid var(--b1);flex-shrink:0;background:var(--s2)}
.founder-sig-avatar img{width:100%;height:100%;object-fit:cover}
.founder-signature{font-family:var(--fd);font-size:15px;font-style:italic;color:var(--t3)}
.founder-sig-title{font-size:12px;font-weight:600;color:var(--t3);letter-spacing:.05em;text-transform:uppercase;margin-top:2px}

/* ── TESTIMONIALS ── */
.testimonials-sec{padding:120px 60px;background:var(--bg-pure);
  border-bottom:1px solid var(--b0)}
.testimonials-header{max-width:1280px;margin:0 auto 56px;text-align:center}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;
  max-width:1280px;margin:0 auto}
.tcard{background:var(--bg);border:1px solid var(--b1);border-radius:24px;
  padding:32px;position:relative;overflow:hidden;
  transition:transform .4s var(--ex),box-shadow .4s,border-color .3s}
.tcard:hover{transform:translateY(-6px);box-shadow:0 24px 64px rgba(10,10,20,.08);
  border-color:var(--b2)}
.tcard-quote{font-family:var(--fd);font-size:20px;font-weight:300;line-height:1.5;
  color:var(--t0);letter-spacing:-.02em;margin-bottom:24px}
.tcard-author{display:flex;align-items:center;gap:14px;padding-top:20px;
  border-top:1px solid var(--b0)}
.tcard-avatar{width:42px;height:42px;border-radius:50%;background:var(--s2);
  border:2px solid var(--b1);flex-shrink:0;display:flex;align-items:center;
  justify-content:center;font-size:16px}
.tcard-name{font-size:14px;font-weight:700;color:var(--t0);letter-spacing:-.02em}
.tcard-role{font-size:12.5px;color:var(--t3);font-weight:500;margin-top:2px}
.tcard-stars{display:flex;gap:3px;margin-bottom:20px}
.tcard-star{color:#F59E0B;font-size:13px}
.tcard-highlight{position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--ind),transparent);
  opacity:0;transition:opacity .4s}
.tcard:hover .tcard-highlight{opacity:1}

/* ── CTA ── */
.csec{padding:100px 60px;text-align:center;position:relative;overflow:hidden;
  background:var(--t0)}
.cta-mesh{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 80% at 50% 0%,rgba(26,76,245,.25),transparent),
             radial-gradient(ellipse 50% 60% at 80% 100%,rgba(100,60,240,.15),transparent),
             radial-gradient(ellipse 60% 70% at 10% 80%,rgba(26,76,245,.1),transparent)}
.cta-dg{position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px);
  background-size:28px 28px}
.ch2{font-family:var(--fd);font-size:clamp(44px,6.5vw,88px);
  font-weight:300;line-height:1.0;letter-spacing:-.04em;margin-bottom:22px;
  color:#fff;position:relative}
.ch2 em{font-style:italic;font-weight:200;color:rgba(255,255,255,.6)}
.csub{font-size:19px;font-weight:400;color:rgba(255,255,255,.6);
  line-height:1.7;margin-bottom:52px;position:relative;letter-spacing:-.01em}
.cfrm{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}
.cinp{font-size:16px;font-weight:500;color:var(--t0);
  background:rgba(255,255,255,.97);
  border:1.5px solid rgba(255,255,255,.2);border-radius:12px;padding:16px 26px;
  width:360px;outline:none;letter-spacing:-.01em;
  transition:border-color .3s,box-shadow .3s,background .2s}
.cinp:focus{border-color:rgba(26,76,245,.6);box-shadow:0 0 0 4px rgba(26,76,245,.15)}
.cinp::placeholder{color:rgba(10,10,20,.35)}
.bctal{font-size:16px;font-weight:700;color:#fff;letter-spacing:-.01em;
  background:var(--ind);border-radius:12px;padding:16px 38px;
  position:relative;overflow:hidden;
  transition:transform .24s var(--ex),box-shadow .24s var(--ex)}
.bctal::after{content:'';position:absolute;inset:0;
  background:linear-gradient(145deg,rgba(255,255,255,.18),transparent 55%)}
.bctal:hover{transform:translateY(-2px);box-shadow:0 12px 44px rgba(26,76,245,.6)}
.ctrust{display:flex;justify-content:center;gap:10px;margin-top:32px;
  flex-wrap:wrap;position:relative}
.ctrust-item{display:flex;align-items:center;gap:7px;
  font-size:13px;font-weight:500;color:rgba(255,255,255,.5)}
.ctrust-item + .ctrust-item::before{content:'·';margin-right:4px;color:rgba(255,255,255,.25)}
.ctrust-check{width:18px;height:18px;border-radius:50%;
  background:rgba(11,154,104,.2);border:1px solid rgba(11,154,104,.4);
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.smsg{display:inline-flex;align-items:center;gap:14px;
  background:rgba(11,154,104,.12);border:1px solid rgba(11,154,104,.3);
  border-radius:16px;padding:18px 32px;
  animation:pop .45s var(--ex);position:relative}
.smsgt{font-size:17px;color:#6EE7B7;font-weight:600;letter-spacing:-.01em}

/* ── FOOTER ── */
footer{border-top:1px solid var(--b0);padding:64px 60px 40px;background:var(--bg-pure)}
.footer-main{max-width:1280px;margin:0 auto;
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;margin-bottom:56px}
.footer-brand{display:flex;flex-direction:column;gap:18px}
.footer-brand p{font-size:14px;color:var(--t3);line-height:1.7;
  max-width:280px;font-weight:400}
.footer-social{display:flex;gap:10px;margin-top:8px}
.footer-social-btn{width:36px;height:36px;border-radius:10px;border:1px solid var(--b1);
  background:var(--bg);display:flex;align-items:center;justify-content:center;
  font-size:14px;transition:background .2s,border-color .2s,transform .25s var(--ex)}
.footer-social-btn:hover{background:var(--s1);border-color:var(--b2);transform:translateY(-2px)}
.footer-col-title{font-size:11px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--t3);margin-bottom:20px}
.footer-links{display:flex;flex-direction:column;gap:12px}
.ftlk{font-size:14px;font-weight:500;color:var(--t2);
  transition:color .2s;width:fit-content}
.ftlk:hover{color:var(--t0)}
.footer-bottom{max-width:1280px;margin:0 auto;padding-top:28px;
  border-top:1px solid var(--b0);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.ftcp{font-size:13px;color:var(--t4);font-weight:500}
.footer-legal{display:flex;gap:24px}
.footer-legal a{font-size:13px;color:var(--t3);font-weight:500;transition:color .2s}
.footer-legal a:hover{color:var(--t1)}
.footer-made{font-size:13px;color:var(--t4);display:flex;align-items:center;gap:6px}
.footer-made span{color:var(--coral)}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  #nav{padding:0 28px}
  .nav-links{display:none}
  .hero{padding:110px 28px 70px}
  .hi{max-width:100%}
  .sec{padding:80px 28px}
  .problem-sec{padding:80px 28px}
  .trust-sec{padding:28px 28px}
  footer{padding:48px 28px 32px}
  .csec{padding:80px 28px}
  .problem-header{grid-template-columns:1fr;gap:32px}
  .trust-stats{grid-template-columns:repeat(2,1fr)}
  .trust-stat:nth-child(2){border-right:none}
  .trust-stat:nth-child(3){border-right:1px solid var(--b1)}
  .trust-stat:nth-child(3),.trust-stat:nth-child(4){border-top:1px solid var(--b1)}
  .features-grid{grid-template-columns:repeat(2,1fr)}
  .testimonials-grid{grid-template-columns:1fr}
  .testimonials-grid .tcard:nth-child(n+2){display:none}
  .founder-inner{grid-template-columns:1fr;gap:52px}
  .founder-badge{left:0;bottom:-16px}
  .footer-main{grid-template-columns:1fr 1fr;gap:40px}
}
@media(max-width:640px){
  .hh{font-size:clamp(44px,12vw,68px)}
  .trust-stats{grid-template-columns:1fr 1fr}
  .trust-stat{border-right:none!important;border-bottom:1px solid var(--b1)}
  .trust-stat:last-child{border-bottom:none}
  .problem-grid{grid-template-columns:1fr}
  .features-grid{grid-template-columns:1fr}
  .footer-main{grid-template-columns:1fr}
  .footer-bottom{flex-direction:column;align-items:flex-start}
}
`;

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, on] as const;
}

function useCount(end: number, ms = 2000, dec = 0) {
  const [n, setN] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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

function Reveal({
  children, delay = 0, dir = "up", className = "", style = {}
}: {
  children: ReactNode; delay?: number;
  dir?: "up" | "s" | "r" | "l"; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const base = dir === "s" ? "rv-s" : dir === "r" ? "rv-r" : dir === "l" ? "rv-l" : "rv";
  return (
    <div ref={ref} className={`${base} ${on ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════════════════
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rp = useRef({ x: 0, y: 0 });
  const [big, setBig] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
      const t = e.target as Element;
      setBig(!!(t?.closest("button") || t?.closest("a") || t?.closest("input")));
    };
    const anim = () => {
      rp.current.x += (pos.current.x - rp.current.x) * 0.11;
      rp.current.y += (pos.current.y - rp.current.y) * 0.11;
      if (ring.current) {
        ring.current.style.left = rp.current.x + "px";
        ring.current.style.top = rp.current.y + "px";
      }
      requestAnimationFrame(anim);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    anim();
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div id="cd" ref={dot} className={big ? "h" : ""} />
      <div id="cr" ref={ring} className={big ? "h" : ""} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════
function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav id="nav" className={sc ? "s" : ""}>
      <div className="nl">
        <div className="nm">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
            <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
            <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
            <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
          </svg>
        </div>
        <span className="nn">Edu<span className="nnb">fy</span></span>
      </div>
      <div className="nav-links">
        {["Product", "Pricing", "Case Studies", "Docs"].map(l => (
          <button key={l} className="nl-item">{l}</button>
        ))}
      </div>
      <div className="na">
        <button className="bg">Sign in</button>
        <button className="bc">Get started free →</button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section className="hero">
      <div className="orb oa" /><div className="orb ob" /><div className="orb oc" />
      <div className="dg" />
      <div className="hi">
        <div className="hpill">
          <div className="hpd"><div className="hpdi" /></div>
          <div className="hpill-txt">
            <span>Trusted by 500+ schools across India</span>
            <span className="hpill-sep" />
            <span>Now in 12 states</span>
          </div>
        </div>
        <h1 className="hh">
          Your school,<br />
          <em>finally </em><span className="gr">running smoothly</span>
        </h1>
        <p className="hs">
          Stop juggling spreadsheets, chasing attendance records, and answering parent calls
          about bus locations. Edufy unifies operations — so you can focus on what matters.
        </p>
        <div className="hbt">
          <button className="bph">Start free trial</button>
          <button className="bps">
            See a live demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="limited">⚡ Only 50 schools can join this month — seats filling fast</div>
        <div className="htr">
          {["No credit card needed", "Free for 30 days", "Cancel anytime"].map(t => (
            <div key={t} className="htb">
              <div className="htc">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="#0B9A68" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TRUST SECTION — animated counters + pill marquee
// ═══════════════════════════════════════════════════════════════════════════
function StatCounter({ end, suffix = "", dec = 0, label, delta }: {
  end: number; suffix?: string; dec?: number; label: string; delta?: string
}) {
  const [ref, n] = useCount(end, 2200, dec);
  return (
    <div className="trust-stat" ref={ref}>
      <div className="trust-stat-val">{n}{suffix}</div>
      <div className="trust-stat-lbl">{label}</div>
      {delta && <div className="trust-stat-delta">{delta}</div>}
    </div>
  );
}

function TrustSection() {
  const items = [
    { i: "🎓", n: "Academic Management" }, { i: "📋", n: "Smart Attendance" },
    { i: "💰", n: "Fee Collection" }, { i: "📊", n: "Exams & Results" },
    { i: "🚌", n: "Live Transport" }, { i: "📢", n: "Parent Notices" },
    { i: "💬", n: "Two-way Messaging" }, { i: "📱", n: "Mobile App" },
    { i: "🔐", n: "Role-based Access" }, { i: "📁", n: "Report Cards" },
    { i: "📆", n: "Timetables" }, { i: "🏫", n: "Multi-campus" },
  ];
  const all = [...items, ...items];
  return (
    <section className="trust-sec">
      <div className="trust-inner">
        <div className="trust-stats">
          <StatCounter end={500} suffix="+" label="Schools onboarded" delta="↑ 42% YoY" />
          <StatCounter end={98} suffix="%" label="Retention rate" delta="Industry best" />
          <StatCounter end={2} suffix="M+" label="Student records managed" delta="↑ 1.2M this year" />
          <StatCounter end={4.9} suffix="" dec={1} label="Average rating" delta="App Store & Play" />
        </div>
      </div>
      <div className="mw" style={{ marginTop: 8 }}>
        <div className="mt">
          {all.map((m, i) => (
            <div key={i} className="mi">
              <div className="mico">{m.i}</div>
              <span className="mlb">{m.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM SECTION
// ═══════════════════════════════════════════════════════════════════════════
const painPoints = [
  { icon: "📋", title: "Attendance chaos", desc: "Teachers spend 45+ minutes every morning marking registers across three different systems." },
  { icon: "📞", title: "Constant parent calls", desc: "\"Where is the bus?\" — the question you answer 15 times a day instead of running your school." },
  { icon: "📊", title: "Scattered fee records", desc: "Fee dues tracked in Excel, receipts on WhatsApp, and reconciliations that never match." },
  { icon: "📄", title: "Report card bottlenecks", desc: "Two weeks to generate report cards because data lives in five different places." },
];

function ProblemSection() {
  return (
    <section className="problem-sec">
      <div className="problem-header">
        <Reveal>
          <div className="slb">The problem</div>
          <h2 className="sh">Running a school is hard.<br /><em>Your software shouldn't make it harder.</em></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="ss">
            Most school management tools were built a decade ago. They're slow, disconnected,
            and designed for IT departments — not for principals, teachers, and parents who
            just want things to work.
          </p>
        </Reveal>
      </div>
      <div className="problem-grid">
        {painPoints.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08} dir="s">
            <div className="problem-card">
              <div className="problem-icon-wrap">{p.icon}</div>
              <div className="problem-title">{p.title}</div>
              <div className="problem-desc">{p.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES GRID
// ═══════════════════════════════════════════════════════════════════════════
const FEATURES = [
  { icon: "⚡", title: "Real-time attendance", desc: "One-tap marking with auto parent notifications. Know who's absent before first period ends." },
  { icon: "🗺️", title: "Live bus tracking", desc: "GPS-powered transport monitoring with ETA notifications. End the 'where is the bus' calls forever." },
  { icon: "💳", title: "Smart fee collection", desc: "Online payments, automated reminders, and reconciliation that takes minutes — not days." },
  { icon: "📊", title: "Exam & result engine", desc: "Generate report cards in hours, not weeks. Structured grading with customizable formats." },
  { icon: "📣", title: "Instant communication", desc: "Broadcast notices, get acknowledgement receipts, enable two-way parent-teacher messaging." },
  { icon: "🔐", title: "Role-based access", desc: "Principal, teacher, parent, and student — each sees exactly what they need, nothing more." },
];

function FeaturesSection() {
  return (
    <section className="features-sec">
      <div className="features-header">
        <Reveal>
          <div className="slb" style={{ display: "inline-flex", margin: "0 auto 20px" }}>The solution</div>
          <h2 className="sh" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 20px" }}>
            Everything your school needs,<br /><em>beautifully unified</em>
          </h2>
          <p className="ss" style={{ textAlign: "center", margin: "0 auto", maxWidth: 500 }}>
            One platform. Every workflow. Built for the way Indian schools actually work.
          </p>
        </Reveal>
      </div>
      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.07} dir="s">
            <div className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              <div className="feat-link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULES 3D CAROUSEL
// ═══════════════════════════════════════════════════════════════════════════
const MODULES = [
  { title: "Smart Attendance", badge: "Core", image: "/assets/parent-attendance.png", accent: "#E07A10" },
  { title: "Exams & Results", badge: "Academics", image: "/assets/parent-reports.png", accent: "#36A6F0" },
  { title: "Fee Management", badge: "Finance", image: "/assets/parent-home.png", accent: "#0B9A68" },
  { title: "Live Transport", badge: "Safety", image: "/assets/parent-home.png", accent: "#DC2626" },
  { title: "Notice Board", badge: "Comms", image: "/assets/parent-home.png", accent: "#A855F7" },
  { title: "Complaints", badge: "Support", image: "/assets/parent-complaints.png", accent: "#F59E0B" },
  { title: "Admin Dashboard", badge: "Analytics", image: "/assets/parent-home.png", accent: "#10B981" },
  { title: "Parent Portal", badge: "Engagement", image: "/assets/parent-home.png", accent: "#3B82F6" },
];

function Modules3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRotatorRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const activeIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const numCards = MODULES.length;
  const step = 360 / numCards;
  const radius = 520;

  useLayoutEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const rotator = carouselRotatorRef.current;
    if (!section || !rotator) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length !== numCards) return;

    cards.forEach((card, i) => {
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });

    const rotateObj = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(rotateObj, {
        value: -360,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top+=600 center",
          end: "+=300%",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
        onUpdate: () => {
          const current = rotateObj.value;
          rotator.style.transform = `translate(-50%, -50%) rotateY(${current}deg)`;
          let maxFrontness = -1, maxIdx = 0;
          for (let i = 0; i < numCards; i++) {
            const card = cards[i];
            let diff = (i * step - current) % 360;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            const absDiff = Math.abs(diff);
            const frontness = 1 - Math.min(absDiff / 90, 1);
            const scale = 0.68 + frontness * 0.32;
            const opacity = 0.35 + frontness * 0.65;
            const zIndex = Math.round(1000 + frontness * 1000);
            card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px) scale(${scale})`;
            card.style.opacity = String(opacity);
            card.style.zIndex = String(zIndex);
            if (frontness > maxFrontness) { maxFrontness = frontness; maxIdx = i; }
            const glowRing = card.querySelector<HTMLElement>(".glow-ring");
            if (glowRing) glowRing.style.opacity = String(frontness * 0.7);
          }
          if (maxIdx !== activeIdxRef.current) {
            activeIdxRef.current = maxIdx;
            setActiveIdx(maxIdx);
          }
        },
      });
    }, section);
    return () => ctx.revert();
  }, [isMobile, numCards, step, radius]);

  if (isMobile) {
    return (
      <section className="sec" style={{ overflow: "visible", background: "var(--bg)" }}>
        <div className="sin">
          <Reveal>
            <div className="slb">Modules</div>
            <h2 className="sh">Everything your school needs,<br /><em>in one place</em></h2>
          </Reveal>
          <div className="mobile-modules-grid">
            {MODULES.map((mod, i) => (
              <div key={i} className="mobile-module-card" style={{ "--accent": mod.accent } as React.CSSProperties}>
                <div className="card-header"><h3>{mod.title}</h3></div>
                <div className="card-image">
                  <img src={mod.image} alt={mod.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="sec modules3d-sec">
      <div className="sin">
        <Reveal>
          <div className="slb">Modules</div>
          <h2 className="sh">Everything your school needs,<br /><em>in one place</em></h2>
        </Reveal>
        <div style={{ marginTop: 48 }}>
          <div className="carousel-stage">
            <div ref={carouselRotatorRef} className="carousel-rotator">
              {MODULES.map((mod, i) => (
                <div
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="module-card"
                  style={{ "--accent": mod.accent } as React.CSSProperties}
                >
                  <div className="card-header">
                    <div className="card-badge">{mod.badge}</div>
                    <h3>{mod.title}</h3>
                  </div>
                  <div className="card-image">
                    <img src={mod.image} alt={mod.title} />
                  </div>
                  <div className="glow-ring" />
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-indicator">
            {MODULES.map((_, i) => (
              <div key={i} className={`carousel-dot ${i === activeIdx ? "active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  {
    quote: "Edufy cut our administrative work in half. Our teachers can actually focus on teaching instead of drowning in paperwork.",
    name: "Priya Sharma",
    role: "Principal, DPS Hyderabad",
    avatar: "🏫",
  },
  {
    quote: "The parent communication features alone were worth it. We've had zero 'where's the bus' calls since we switched over.",
    name: "Rajan Mehta",
    role: "Operations Director, Orchids International",
    avatar: "🚌",
  },
  {
    quote: "Fee collection used to take a week to reconcile. Now it's done automatically before 9 AM. Genuinely game-changing.",
    name: "Sunita Rao",
    role: "Finance Head, Narayana Group",
    avatar: "💳",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-sec">
      <div className="testimonials-header">
        <Reveal>
          <div className="slb" style={{ display: "inline-flex", margin: "0 auto 20px" }}>What schools say</div>
          <h2 className="sh" style={{ textAlign: "center", margin: "0 auto" }}>
            Trusted by educators<br /><em>who've tried everything else</em>
          </h2>
        </Reveal>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1} dir="s">
            <div className="tcard">
              <div className="tcard-highlight" />
              <div className="tcard-stars">
                {[...Array(5)].map((_, j) => <span key={j} className="tcard-star">★</span>)}
              </div>
              <div className="tcard-quote">"{t.quote}"</div>
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
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOUNDER
// ═══════════════════════════════════════════════════════════════════════════
function Founder() {
  return (
    <section className="sec founder-section">
      <div className="founder-inner">
        <Reveal dir="l" className="founder-left">
          <div className="founder-img-wrap">
            <div className="founder-accent" />
            <div className="founder-image-card">
              <img src="/assets/founder.png" alt="Arjun Menon, Co-founder & CEO" />
            </div>
            <div className="founder-badge">
              <div className="founder-badge-icon">🏆</div>
              <div className="founder-badge-text">
                <div className="founder-badge-title">10+ years in EdTech</div>
                <div className="founder-badge-sub">ex-BYJU'S, Unacademy</div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} dir="r" className="founder-right">
          <div className="slb">Our story</div>
          <h2 className="sh">Built by educators,<br /><em>for educators</em></h2>
          <div className="founder-quote">
            <div className="founder-quote-bar" />
            We left established EdTech companies to solve the unglamorous but critical problem of school operations. Every feature in Edufy comes from real conversations with principals — not a product roadmap written in a boardroom.
          </div>
          <p className="ss" style={{ fontSize: 16 }}>
            We've seen firsthand how outdated software slows down schools, and we're on a
            mission to change that — one school at a time, across every state in India.
          </p>
          <div className="founder-details">
            <div className="founder-stats">
              <div className="stat-item">
                <div className="stat-number">500<span>+</span></div>
                <div className="stat-label">Schools served</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98<span>%</span></div>
                <div className="stat-label">Customer satisfaction</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">States active</div>
              </div>
            </div>
            <div className="founder-sig-wrap">
              <div className="founder-sig-avatar">
                <img src="/assets/founder.png" alt="Arjun" />
              </div>
              <div>
                <div className="founder-signature">— Arjun Menon</div>
                <div className="founder-sig-title">Co-founder & CEO, Edufy</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CTA — dark full-bleed with gradient mesh
// ═══════════════════════════════════════════════════════════════════════════
function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="csec">
      <div className="cta-mesh" />
      <div className="cta-dg" />
      <Reveal style={{ position: "relative", zIndex: 2 }}>
        <h2 className="ch2">
          Ready to give your school<br /><em>the platform it deserves?</em>
        </h2>
        <p className="csub">
          Join 500+ schools that have simplified their operations.<br />
          Start your free trial — no credit card, no commitment.
        </p>
        {!sent ? (
          <>
            <div className="cfrm">
              <input className="cinp" type="email" placeholder="principal@yourschool.in"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && email && setSent(true)} />
              <button className="bctal" onClick={() => email && setSent(true)}>
                Start free trial →
              </button>
            </div>
            <div className="limited" style={{ background: "rgba(217,119,6,.1)", borderColor: "rgba(217,119,6,.25)", marginTop: 20 }}>
              Only 50 seats available this month
            </div>
          </>
        ) : (
          <div className="smsg">
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(11,154,104,.18)", border: "1px solid rgba(11,154,104,.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="smsgt">You're on the list — we'll be in touch shortly.</span>
          </div>
        )}
        <div className="ctrust">
          {["No credit card needed", "Free for 30 days", "Cancel anytime"].map(t => (
            <div key={t} className="ctrust-item">
              <div className="ctrust-check">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2" stroke="#6EE7B7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER — multi-column, product-grade
// ═══════════════════════════════════════════════════════════════════════════
function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Attendance", "Fee Management", "Transport", "Communication", "Reports", "API"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press Kit", "Partners"],
    },
    {
      title: "Support",
      links: ["Documentation", "Help Center", "Status", "Contact", "Community"],
    },
  ];
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="nm">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
                <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
                <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".45" />
                <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
              </svg>
            </div>
            <span className="nn" style={{ fontSize: 20 }}>Edu<span className="nnb">fy</span></span>
          </div>
          <p>The school management platform built for Indian schools. Simplifying operations so educators can focus on education.</p>
          <div className="footer-social">
            {["𝕏", "in", "▶", "◉"].map((icon, i) => (
              <button key={i} className="footer-social-btn">{icon}</button>
            ))}
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            <div className="footer-links">
              {col.links.map(l => (
                <a key={l} href="#" className="ftlk">{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="ftcp">© 2025 Edufy Technologies Pvt. Ltd. All rights reserved.</span>
        <div className="footer-legal">
          {["Privacy", "Terms", "Security", "Cookies"].map(l => (
            <a key={l} href="#" className="ftlk">{l}</a>
          ))}
        </div>
        <div className="footer-made">Made with <span>♥</span> in Hyderabad, India</div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <div id="noise" />
      <Cursor />
      <Nav />
      <Hero />
      <TrustSection />
      <ProblemSection />
      <FeaturesSection />
      <Modules3D />
      <Testimonials />
      <Founder />
      <CTA />
      <Footer />
    </>
  );
}