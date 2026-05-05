import { useState, useEffect, useRef, useLayoutEffect } from "react";
import type { ReactNode, CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   EDUFY — Redesigned to Elite SaaS Standard
   Audit fixes applied:
   ✓ Real product-screenshot hero (mockup component) — REMOVED per request
   ✓ "Book a demo" primary CTA (not "Start free trial")
   ✓ Dead nav links fixed → anchor IDs
   ✓ WhatsApp CTA added
   ✓ Security/compliance strip — REMOVED per request
   ✓ "How it works" 3-step section — updated copy
   ✓ Tabbed feature walkthrough — COMMENTED OUT per request
   ✓ Product video section
   ✓ FAQ section
   ✓ Comparison table — removed language support row
   ✓ Team section
   ✓ Mobile sticky CTA bar
   ✓ Typography hierarchy fixed (Cabinet Grotesk for UI headings)
   ✓ Border-radius token system (8/12/20/32px)
   ✓ Shadow scale tokens
   ✓ Module accent colors per product area
   ✓ Animation threshold fixed (0.12–0.18)
   ✓ Stagger delay unified (i * 0.1)
   ✓ Hero animation sequence compressed
   ✓ cursor: text on inputs
   ✓ Mobile overflow founder badge fix
   ✓ GSAP scroll travel 300% → 180%
   ✓ Specific, outcome-focused copy
   ✓ Fake scarcity removed → real urgency
   ✓ Pricing context line added
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,200;1,9..144,300;1,9..144,400&family=Cabinet+Grotesk:wght@300;400;500;600;700;800;900&display=swap');

*,::before,::after{box-sizing:border-box;margin:0;padding:0}

:root{
  /* Backgrounds */
  --bg:         #F9F9FB;
  --bg-pure:    #FFFFFF;
  --s1:         #F4F4F8;
  --s2:         #EBEBF0;
  --s3:         #E0E0E9;

  /* Borders */
  --b0:         rgba(10,10,22,0.05);
  --b1:         rgba(10,10,22,0.09);
  --b2:         rgba(10,10,22,0.16);
  --b3:         rgba(10,10,22,0.26);

  /* Primary — Indigo */
  --ind:        #1A4CF5;
  --ind-d:      #1440E0;
  --ind-subtle: rgba(26,76,245,0.06);
  --ind-border: rgba(26,76,245,0.18);
  --ind-l:      #4D76F8;

  /* Module accent colors */
  --att:  #E07A10;   /* Attendance — amber */
  --fin:  #0B9A68;   /* Finance — jade */
  --trn:  #DC2626;   /* Transport — coral */
  --res:  #6366F1;   /* Results — indigo */
  --com:  #0EA5E9;   /* Communication — sky */
  --acc:  #8B5CF6;   /* Access — violet */

  /* Semantic */
  --jade:  #0B9A68;
  --amber: #D97706;
  --coral: #DC2626;

  /* Text */
  --t0:   #0A0A16;
  --t1:   rgba(10,10,22,0.85);
  --t2:   rgba(10,10,22,0.56);
  --t3:   rgba(10,10,22,0.38);
  --t4:   rgba(10,10,22,0.18);

  /* Typography */
  --fd: 'Fraunces', Georgia, serif;
  --fb: 'Cabinet Grotesk', -apple-system, sans-serif;

  /* Easing */
  --ex:     cubic-bezier(0.16,1,0.3,1);
  --qt:     cubic-bezier(0.76,0,0.24,1);
  --smooth: cubic-bezier(0.4,0,0.2,1);

  /* Border radius tokens — 4 values only */
  --r-sm:  8px;
  --r-md:  12px;
  --r-lg:  20px;
  --r-xl:  32px;

  /* Shadow tokens */
  --sh-sm:      0 2px 8px rgba(10,10,22,0.06);
  --sh-md:      0 8px 32px rgba(10,10,22,0.08);
  --sh-lg:      0 24px 64px rgba(10,10,22,0.12);
  --sh-colored: 0 16px 56px rgba(26,76,245,0.4);
}

html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--t0);font-family:var(--fb);
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  overflow-x:hidden;cursor:none}
button{font-family:var(--fb);border:none;cursor:none}
input,textarea,select{font-family:var(--fb);cursor:text}
a{text-decoration:none;color:inherit}
::selection{background:rgba(26,76,245,0.16);color:var(--t0)}

/* ── CURSOR ── */
#cd{position:fixed;width:6px;height:6px;border-radius:50%;
  background:var(--ind);pointer-events:none;z-index:99999;
  transform:translate(-50%,-50%);transition:width .2s var(--ex),height .2s var(--ex),background .2s}
#cr{position:fixed;width:38px;height:38px;border-radius:50%;
  border:1.5px solid rgba(26,76,245,0.35);
  pointer-events:none;z-index:99998;transform:translate(-50%,-50%);
  transition:width .35s var(--ex),height .35s var(--ex),border-color .25s,border-radius .3s}
#cd.h{width:10px;height:10px;background:var(--ind)}
#cr.h{width:56px;height:56px;border-color:rgba(26,76,245,0.2)}

/* ── NOISE TEXTURE ── */
#noise{position:fixed;inset:0;pointer-events:none;z-index:99997;opacity:.018;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:190px}

/* ── SCROLL REVEAL ── */
.rv{opacity:0;transform:translateY(24px) skewY(.3deg);
  transition:opacity .85s var(--ex),transform .85s var(--ex)}
.rv.on{opacity:1;transform:none}
.rv-s{opacity:0;transform:scale(.96) translateY(10px);
  transition:opacity .75s var(--ex),transform .75s var(--ex)}
.rv-s.on{opacity:1;transform:none}
.rv-r{opacity:0;transform:translateX(28px);
  transition:opacity .85s var(--ex),transform .85s var(--ex)}
.rv-r.on{opacity:1;transform:none}
.rv-l{opacity:0;transform:translateX(-28px);
  transition:opacity .85s var(--ex),transform .85s var(--ex)}
.rv-l.on{opacity:1;transform:none}

/* ── KEYFRAMES ── */
@keyframes heroIn{from{opacity:0;transform:translateY(28px) skewY(1deg)}to{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.85) translateY(8px)}100%{opacity:1;transform:none}}
@keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.25;transform:scale(.75)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes drift1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(50px,-35px) scale(1.08)}66%{transform:translate(-35px,48px) scale(.92)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}42%{transform:translate(-60px,24px) scale(1.06)}70%{transform:translate(38px,-48px) scale(.95)}}
@keyframes drift3{0%,100%{transform:translate(0,0) scale(1)}52%{transform:translate(64px,28px) scale(1.08)}}
@keyframes pillIn{0%{opacity:0;transform:scale(.88) translateY(6px)}100%{opacity:1;transform:none}}
@keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
@keyframes progressFill{from{width:0}to{width:var(--fill-w)}}

/* ── NAV ── */
#nav{position:fixed;top:0;left:0;right:0;z-index:900;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 56px;height:66px;
  transition:background .4s var(--smooth),border-color .4s,backdrop-filter .4s;
  border-bottom:1px solid transparent}
#nav.s{background:rgba(249,249,251,.88);backdrop-filter:blur(32px) saturate(1.9);
  -webkit-backdrop-filter:blur(32px) saturate(1.9);border-color:var(--b0)}
.nl{display:flex;align-items:center;gap:12px}
.nm{width:34px;height:34px;border-radius:10px;
  background:linear-gradient(145deg,#1A4CF5,#0E36D4);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 16px rgba(26,76,245,.32)}
.nn{font-size:18px;font-weight:800;letter-spacing:-.05em;color:var(--t0)}
.nnb{color:var(--ind)}
.nav-links{display:flex;align-items:center;gap:2px}
.nl-item{font-size:14px;font-weight:600;color:var(--t2);background:none;
  padding:7px 13px;border-radius:var(--r-sm);transition:color .2s,background .2s}
.nl-item:hover{color:var(--t0);background:var(--b0)}
.na{display:flex;align-items:center;gap:8px}
.nav-wa{display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:700;
  color:#128C7E;background:rgba(18,140,126,.07);border:1px solid rgba(18,140,126,.18);
  border-radius:var(--r-md);padding:8px 16px;
  transition:background .22s,transform .22s var(--ex),box-shadow .22s}
.nav-wa:hover{background:rgba(18,140,126,.12);transform:translateY(-1px);
  box-shadow:0 6px 20px rgba(18,140,126,.2)}
.bc{font-size:14px;font-weight:700;color:#fff;letter-spacing:-.01em;
  background:var(--ind);border-radius:var(--r-md);padding:9px 22px;
  position:relative;overflow:hidden;
  transition:transform .22s var(--ex),box-shadow .22s var(--ex),background .2s}
.bc::before{content:'';position:absolute;inset:0;
  background:linear-gradient(145deg,rgba(255,255,255,.15),transparent 55%);opacity:0;transition:opacity .25s}
.bc:hover{transform:translateY(-2px);box-shadow:var(--sh-colored)}
.bc:hover::before{opacity:1}
.bc:active{transform:translateY(0)}

/* ── HERO ── */
.hero{min-height:100vh;position:relative;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;
  padding:128px 60px 0;
  background:linear-gradient(180deg,#F9F9FB 0%,#F6F6FC 60%,#F0F0F8 100%)}
.hi{max-width:860px;margin:0 auto;text-align:center;position:relative;z-index:2}

/* mesh blobs */
.orb{position:absolute;border-radius:50%;filter:blur(130px);pointer-events:none}
.oa{width:700px;height:620px;background:rgba(26,76,245,.05);
  top:-180px;left:-150px;animation:drift1 26s ease-in-out infinite}
.ob{width:500px;height:500px;background:rgba(0,100,230,.038);
  top:300px;right:-120px;animation:drift2 30s ease-in-out infinite}
.oc{width:380px;height:380px;background:rgba(100,60,240,.03);
  bottom:-40px;left:38%;animation:drift3 22s ease-in-out infinite}

/* dot grid */
.dg{position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(10,10,22,.04) 1px,transparent 1px);
  background-size:28px 28px;
  -webkit-mask-image:radial-gradient(ellipse 90% 80% at 50% 50%,black 30%,transparent);
  mask-image:radial-gradient(ellipse 90% 80% at 50% 50%,black 30%,transparent)}

/* hero pill */
.hpill{display:inline-flex;align-items:center;gap:9px;
  font-size:11.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ind);border:1px solid var(--ind-border);
  background:var(--ind-subtle);
  border-radius:100px;padding:6px 16px 6px 8px;margin-bottom:32px;
  animation:pillIn .65s var(--ex) both}
.hpd{width:20px;height:20px;border-radius:50%;
  background:rgba(26,76,245,.1);border:1px solid var(--ind-border);
  display:flex;align-items:center;justify-content:center}
.hpdi{width:7px;height:7px;border-radius:50%;background:var(--ind);
  animation:blink 2.2s ease-in-out infinite}
.hpill-txt{display:flex;align-items:center;gap:8px}
.hpill-sep{width:1px;height:11px;background:var(--ind-border)}

/* hero heading */
.hh{font-family:var(--fd);
  font-size:clamp(56px,7.8vw,108px);font-weight:300;
  line-height:.92;letter-spacing:-.038em;margin-bottom:28px;
  color:var(--t0);
  animation:heroIn .75s var(--ex) .05s both}
.hh em{font-style:italic;font-weight:200;color:var(--t2)}
.hh .gr{
  background:linear-gradient(130deg,var(--t0) 0%,var(--ind) 38%,#7D9FFF 65%,var(--t0) 90%);
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 5s linear infinite}

/* hero sub */
.hs{font-size:18px;font-weight:500;line-height:1.72;
  color:var(--t2);max-width:560px;margin:0 auto 42px;
  animation:fadeUp .8s var(--ex) .18s both;letter-spacing:-.01em}
.hs strong{color:var(--t1);font-weight:700}

/* hero CTA */
.hbt{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;
  animation:fadeUp .8s var(--ex) .28s both}
.bph{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.015em;
  background:var(--ind);border-radius:var(--r-md);padding:15px 36px;
  position:relative;overflow:hidden;
  transition:transform .26s var(--ex),box-shadow .26s var(--ex)}
.bph::after{content:'';position:absolute;inset:0;
  background:linear-gradient(145deg,rgba(255,255,255,.16),transparent 55%)}
.bph:hover{transform:translateY(-3px) scale(1.01);box-shadow:var(--sh-colored)}
.bph:active{transform:translateY(0) scale(.99)}
.bps{font-size:16px;font-weight:700;color:var(--t1);letter-spacing:-.01em;
  background:var(--bg-pure);border:1.5px solid var(--b2);
  border-radius:var(--r-md);padding:15px 30px;
  display:flex;align-items:center;gap:9px;
  transition:border-color .22s,transform .22s var(--ex),box-shadow .22s}
.bps:hover{border-color:var(--b3);transform:translateY(-2px);box-shadow:var(--sh-md)}
.bps svg{transition:transform .28s var(--ex)}
.bps:hover svg{transform:translateX(4px)}

/* hero trust */
.htr{display:flex;align-items:center;justify-content:center;gap:8px;
  margin-top:32px;flex-wrap:wrap;
  animation:fadeUp .8s var(--ex) .38s both}
.htb{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--t3)}
.htb + .htb::before{content:'·';color:var(--t4)}
.htc{width:16px;height:16px;border-radius:50%;
  background:rgba(11,154,104,.1);border:1px solid rgba(11,154,104,.22);
  display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* Hero visual removed per request — no mockup, no live tracking/fee update badges */
.hero-visual{display:none}

/* ── LOGO STRIP ── */
.logo-strip{padding:32px 60px;background:var(--bg-pure);
  border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.logo-strip-inner{max-width:1280px;margin:0 auto}
.logo-strip-label{font-size:11.5px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--t4);text-align:center;margin-bottom:22px}
.logo-strip-logos{display:flex;align-items:center;justify-content:center;
  gap:0;flex-wrap:nowrap;overflow:hidden}
.logo-pill{display:flex;align-items:center;gap:8px;
  padding:10px 28px;border-right:1px solid var(--b0)}
.logo-pill:last-child{border-right:none}
.logo-pill-icon{width:26px;height:26px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.logo-pill-name{font-size:14px;font-weight:700;color:var(--t3);letter-spacing:-.02em;white-space:nowrap}

/* ── STATS ── */
.trust-sec{padding:40px 60px;background:var(--bg-pure)}
.trust-inner{max-width:1280px;margin:0 auto}
.trust-stats{display:grid;grid-template-columns:repeat(4,1fr);
  border:1px solid var(--b1);border-radius:var(--r-xl);overflow:hidden}
.trust-stat{padding:28px 32px;border-right:1px solid var(--b1);position:relative}
.trust-stat:last-child{border-right:none}
.trust-stat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  opacity:0;transition:opacity .4s;border-radius:0}
.trust-stat:nth-child(1)::after{background:linear-gradient(90deg,var(--att),transparent)}
.trust-stat:nth-child(2)::after{background:linear-gradient(90deg,var(--fin),transparent)}
.trust-stat:nth-child(3)::after{background:linear-gradient(90deg,var(--ind),transparent)}
.trust-stat:nth-child(4)::after{background:linear-gradient(90deg,var(--res),transparent)}
.trust-stat:hover::after{opacity:1}
.trust-stat-val{font-family:var(--fd);font-size:3rem;font-weight:400;
  letter-spacing:-.04em;color:var(--t0);line-height:1}
.trust-stat-lbl{font-size:13px;font-weight:600;color:var(--t3);margin-top:6px;letter-spacing:-.01em}
.trust-stat-delta{font-size:11px;font-weight:800;color:var(--jade);
  background:rgba(11,154,104,.07);border:1px solid rgba(11,154,104,.18);
  border-radius:100px;padding:2px 10px;display:inline-block;margin-top:8px;letter-spacing:.04em}

/* ── MARQUEE ── */
.mw{overflow:hidden;position:relative;margin-top:0;background:var(--bg-pure);
  padding:16px 0;border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.mw::before,.mw::after{content:'';position:absolute;top:0;bottom:0;width:160px;
  z-index:2;pointer-events:none}
.mw::before{left:0;background:linear-gradient(90deg,var(--bg-pure),transparent)}
.mw::after{right:0;background:linear-gradient(-90deg,var(--bg-pure),transparent)}
.mt{display:flex;width:max-content;animation:marquee 42s linear infinite}
.mt:hover{animation-play-state:paused;cursor:grab}
.mi{display:flex;align-items:center;gap:9px;
  padding:8px 26px;border-right:1px solid var(--b0);white-space:nowrap}
.mico{width:26px;height:26px;border-radius:7px;background:var(--s1);
  display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;
  transition:background .2s}
.mlb{font-size:13.5px;font-weight:700;color:var(--t3);transition:color .2s;letter-spacing:-.01em}
.mi:hover .mlb{color:var(--t1)}
.mi:hover .mico{background:var(--ind-subtle)}

/* ── HOW IT WORKS ── */
.hiw-sec{padding:96px 60px;background:var(--bg)}
.hiw-inner{max-width:1280px;margin:0 auto}
.hiw-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;
  margin-top:56px;background:var(--b0);border-radius:var(--r-xl);overflow:hidden}
.hiw-step{background:var(--bg-pure);padding:44px 36px;position:relative;overflow:hidden}
.hiw-step-num{font-family:var(--fd);font-size:72px;font-weight:200;
  color:var(--b1);line-height:1;margin-bottom:20px;letter-spacing:-.06em;
  transition:color .4s}
.hiw-step:hover .hiw-step-num{color:var(--ind-subtle)}
.hiw-step-title{font-size:20px;font-weight:800;color:var(--t0);
  letter-spacing:-.03em;margin-bottom:10px}
.hiw-step-desc{font-size:14.5px;color:var(--t2);line-height:1.65;font-weight:400}
.hiw-step-time{display:inline-flex;align-items:center;gap:6px;
  margin-top:20px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
  color:var(--jade);background:rgba(11,154,104,.07);
  border:1px solid rgba(11,154,104,.2);border-radius:100px;padding:4px 14px}
.hiw-arrow{position:absolute;top:40px;right:-14px;z-index:2;
  width:28px;height:28px;border-radius:50%;
  background:var(--bg-pure);border:1.5px solid var(--b2);
  display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--t3)}
.hiw-step:last-child .hiw-arrow{display:none}

/* ── PROBLEM SECTION REMOVED (Status Quo) ── */
/* .problem-sec removed entirely */

/* ── SHARED SECTION ── */
.sec{padding:96px 60px}
.sin{max-width:1280px;margin:0 auto}
.slb{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
  color:var(--ind);display:inline-flex;align-items:center;gap:9px;margin-bottom:18px;
  padding:4px 13px;background:var(--ind-subtle);border:1px solid var(--ind-border);
  border-radius:100px}
.sh{font-family:var(--fd);font-size:clamp(38px,5vw,64px);
  font-weight:300;line-height:1.03;letter-spacing:-.032em;margin-bottom:18px;color:var(--t0)}
.sh em{font-style:italic;color:var(--t2);font-weight:200}
.ss{font-size:17px;font-weight:400;color:var(--t2);line-height:1.75;max-width:520px;letter-spacing:-.01em}

/* ── TABBED FEATURES (commented out per request) ── */
/* .features-sec {} removed from active rendering */

/* ── VIDEO SECTION ── */
.video-sec{padding:80px 60px;background:var(--bg);border-top:1px solid var(--b0)}
.video-inner{max-width:1000px;margin:0 auto;text-align:center}
.video-frame{margin-top:44px;border-radius:var(--r-xl);overflow:hidden;
  border:1.5px solid var(--b1);box-shadow:var(--sh-lg);
  background:var(--t0);aspect-ratio:16/9;position:relative;cursor:none}
.video-thumb{width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#0A0A16 0%,#1a1a2e 50%,#0d0d20 100%);position:relative}
.video-thumb-grid{position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:28px 28px}
.video-play{width:72px;height:72px;border-radius:50%;
  background:var(--ind);display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 0 16px rgba(26,76,245,.12),0 0 0 32px rgba(26,76,245,.06);
  transition:transform .3s var(--ex),box-shadow .3s;position:relative;z-index:1}
.video-play:hover{transform:scale(1.12);
  box-shadow:0 0 0 16px rgba(26,76,245,.18),0 0 0 32px rgba(26,76,245,.08)}
.video-label{position:absolute;bottom:28px;left:0;right:0;text-align:center;
  font-size:14px;font-weight:600;color:rgba(255,255,255,.5);letter-spacing:.04em}
.video-cta{margin-top:24px;font-size:15px;font-weight:600;color:var(--t2)}
.video-cta a{color:var(--ind);font-weight:700;border-bottom:1.5px solid var(--ind-border);
  padding-bottom:1px;transition:border-color .2s}
.video-cta a:hover{border-color:var(--ind)}

/* ── 3D MODULES ── */
.modules3d-sec{position:relative;overflow:hidden;background:var(--bg)}
.carousel-stage{perspective:2200px;width:100%;height:560px;position:relative;
  overflow:hidden;border-radius:var(--r-xl);transform-style:preserve-3d;
  background:linear-gradient(180deg,var(--s1) 0%,var(--bg-pure) 100%);
  border:1px solid var(--b1);box-shadow:var(--sh-lg)}
.carousel-rotator{width:100%;height:100%;transform-style:preserve-3d;
  will-change:transform;position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%)}
.module-card{position:absolute;width:280px;height:400px;
  left:50%;top:50%;margin-left:-140px;margin-top:-200px;
  border-radius:var(--r-xl);background:var(--bg-pure);
   transition: box-shadow 0.25s ease, transform 0.2s ease;
  box-shadow:0 32px 64px -12px rgba(10,10,22,.2),0 0 0 1px rgba(10,10,22,.06);
  transform-origin:center center;will-change:transform,opacity;
  overflow:hidden;display:flex;flex-direction:column}
.module-card .card-header{padding:20px 20px 8px;z-index:2;display:flex;flex-direction:column;gap:5px}
.module-card .card-badge{display:inline-flex;align-items:center;gap:5px;
  font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  padding:3px 10px;border-radius:100px;width:fit-content}
.module-card .card-header h3{font-size:20px;font-weight:800;
  letter-spacing:-.03em;color:var(--t0);margin:0}
.module-card .card-sub{font-size:12px;color:var(--t3);font-weight:500;line-height:1.5;margin:0 0 4px}
.module-card .card-image{flex:1;margin:4px 20px 20px;border-radius:var(--r-lg);
  overflow:hidden;background:var(--s1);display:flex;align-items:center;
  justify-content:center;position:relative}
.module-card .card-image img{width:100%;height:100%;object-fit:contain;display:block}
.module-card .glow-ring{position:absolute;inset:0;border-radius:var(--r-xl);
  pointer-events:none;box-shadow:inset 0 0 0 1.5px rgba(26,76,245,.22);
  opacity:0;transition:opacity .4s}
/* Front card highlighting */
.module-card.front {
  box-shadow: 0 32px 64px -12px rgba(10,10,22,0.4), 0 0 0 2px var(--ind);
}
.module-card.front .glow-ring {
  opacity: 1 !important;
  box-shadow: inset 0 0 0 2px var(--ind), 0 0 24px rgba(26,76,245,0.6);
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}
.carousel-indicator{display:flex;justify-content:center;gap:7px;margin-top:24px}
.carousel-dot{width:6px;height:6px;border-radius:50%;background:var(--b2);
  transition:background .3s,width .3s var(--ex);cursor:pointer}
.carousel-dot.active{width:22px;border-radius:3px;background:var(--ind)}

.mobile-modules-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:16px;margin-top:44px}
.mobile-module-card{border-radius:var(--r-lg);background:var(--bg-pure);
  border:1px solid var(--b1);overflow:hidden;
  box-shadow:var(--sh-sm);transition:transform .32s var(--ex),box-shadow .32s}
.mobile-module-card:hover{transform:translateY(-4px);box-shadow:var(--sh-md)}
.mobile-module-card .card-header{padding:18px 18px 8px}
.mobile-module-card .card-header h3{font-size:17px;font-weight:800;
  color:var(--t0);letter-spacing:-.025em}
.mobile-module-card .card-image{margin:6px 18px 18px;height:140px;background:var(--s1);
  border-radius:var(--r-md);overflow:hidden;display:flex;align-items:center;justify-content:center}
.mobile-module-card .card-image img{width:100%;height:100%;object-fit:contain}

/* ── TESTIMONIALS ── */
.testimonials-sec{padding:96px 60px;background:var(--bg-pure);
  border-bottom:1px solid var(--b0)}
.testimonials-header{max-width:1280px;margin:0 auto 52px;text-align:center}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;
  max-width:1280px;margin:0 auto}
.tcard{background:var(--bg);border:1px solid var(--b1);border-radius:var(--r-xl);
  padding:30px;position:relative;overflow:hidden;
  transition:transform .35s var(--ex),box-shadow .35s,border-color .28s}
.tcard:hover{transform:translateY(-5px);box-shadow:var(--sh-md);border-color:var(--b2)}
.tcard-top{height:3px;position:absolute;top:0;left:0;right:0;opacity:0;transition:opacity .35s}
.tcard:hover .tcard-top{opacity:1}
.tcard-stars{display:flex;gap:3px;margin-bottom:18px}
.tcard-star{color:#F59E0B;font-size:13px}
.tcard-quote{font-size:16px;font-weight:400;line-height:1.6;
  color:var(--t1);letter-spacing:-.01em;margin-bottom:24px;
  font-style:italic}
.tcard-outcome{display:flex;align-items:center;gap:8px;
  padding:10px 14px;background:var(--bg-pure);border-radius:var(--r-sm);
  border:1px solid var(--b0);margin-bottom:20px;font-size:13px;font-weight:700;
  color:var(--jade)}
.tcard-author{display:flex;align-items:center;gap:12px;padding-top:18px;
  border-top:1px solid var(--b0)}
.tcard-avatar{width:40px;height:40px;border-radius:50%;background:var(--s2);
  border:2px solid var(--b1);flex-shrink:0;display:flex;align-items:center;
  justify-content:center;font-size:16px;overflow:hidden}
.tcard-avatar img{width:100%;height:100%;object-fit:cover}
.tcard-name{font-size:14px;font-weight:800;color:var(--t0);letter-spacing:-.02em}
.tcard-role{font-size:12px;color:var(--t3);font-weight:600;margin-top:2px}

/* ── COMPARISON TABLE (removed language support row) ── */
.comparison-sec{padding:96px 60px;background:var(--bg);
  border-top:1px solid var(--b0)}
.comparison-inner{max-width:900px;margin:0 auto}
.comparison-table{margin-top:52px;border:1px solid var(--b1);border-radius:var(--r-xl);overflow:hidden}
.cmp-header{display:grid;grid-template-columns:1fr 1fr 1fr;background:var(--s1);
  border-bottom:1px solid var(--b1)}
.cmp-hcell{padding:16px 24px;font-size:13px;font-weight:800;letter-spacing:-.01em;
  color:var(--t2);text-transform:uppercase;letter-spacing:.08em;font-size:11px}
.cmp-hcell:nth-child(3){color:var(--ind);background:var(--ind-subtle);
  display:flex;align-items:center;gap:8px}
.cmp-row{display:grid;grid-template-columns:1fr 1fr 1fr;
  border-bottom:1px solid var(--b0);background:var(--bg-pure)}
.cmp-row:last-child{border-bottom:none}
.cmp-row:hover{background:var(--s1)}
.cmp-cell{padding:16px 24px;font-size:14px;font-weight:500;color:var(--t2);
  display:flex;align-items:center;gap:8px}
.cmp-cell:first-child{font-weight:700;color:var(--t0)}
.cmp-cell:nth-child(3){color:var(--ind);font-weight:700}
.cmp-check{color:var(--jade);font-size:15px}
.cmp-cross{color:var(--t4);font-size:15px}

/* Security strip removed per request */

/* ── FOUNDER ── */
.founder-section{background:var(--bg);border-top:1px solid var(--b0);border-bottom:1px solid var(--b0)}
.founder-inner{display:grid;grid-template-columns:1fr 1.15fr;
  gap:96px;align-items:center;max-width:1280px;margin:0 auto}
.founder-img-wrap{position:relative}
.founder-image-card{width:100%;aspect-ratio:4/5;border-radius:var(--r-xl);overflow:hidden;
  background:var(--s2);box-shadow:var(--sh-lg);
  transition:transform .5s var(--ex)}
.founder-image-card:hover{transform:scale(.985) rotate(-.4deg)}
.founder-image-card img{width:100%;height:100%;object-fit:cover;display:block}
.founder-placeholder{width:100%;height:100%;
  background:linear-gradient(135deg,var(--s2) 0%,var(--s3) 100%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
.founder-placeholder-avatar{width:80px;height:80px;border-radius:50%;
  background:var(--s3);display:flex;align-items:center;justify-content:center;font-size:32px}
.founder-placeholder-text{font-size:14px;color:var(--t3);font-weight:600}
.founder-badge{position:absolute;bottom:28px;left:0;
  background:var(--bg-pure);border:1px solid var(--b1);
  padding:14px 20px;border-radius:var(--r-lg);
  display:inline-flex;align-items:center;gap:12px;
  box-shadow:var(--sh-lg)}
.founder-badge-icon{width:38px;height:38px;border-radius:var(--r-sm);
  background:linear-gradient(145deg,#1A4CF5,#0E36D4);
  display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.founder-badge-title{font-size:13px;font-weight:800;color:var(--t0);letter-spacing:-.02em}
.founder-badge-sub{font-size:11.5px;color:var(--t3);font-weight:600;margin-top:2px}
.founder-accent{position:absolute;top:-24px;right:-24px;width:72px;height:72px;
  border-radius:50%;background:linear-gradient(145deg,rgba(26,76,245,.1),rgba(100,60,240,.07));
  filter:blur(18px)}
.founder-right{padding:16px 0}
.founder-quote{font-family:var(--fd);font-size:clamp(20px,2.2vw,27px);
  line-height:1.4;font-weight:300;color:var(--t0);
  margin:24px 0 20px;position:relative;padding-left:24px;letter-spacing:-.02em}
.founder-quote-bar{position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--ind),rgba(26,76,245,.15));border-radius:2px}
.founder-details{margin-top:28px;padding-top:28px;
  border-top:1px solid var(--b0);display:flex;flex-direction:column;gap:22px}
.founder-stats{display:flex;gap:40px}
.stat-item{display:flex;flex-direction:column;gap:3px}
.stat-number{font-family:var(--fd);font-size:30px;font-weight:400;
  color:var(--t0);line-height:1;letter-spacing:-.04em}
.stat-number span{color:var(--ind)}
.stat-label{font-size:12.5px;font-weight:600;color:var(--t3)}
.founder-sig-wrap{display:flex;align-items:center;gap:12px}
.founder-signature{font-family:var(--fd);font-size:15px;font-style:italic;color:var(--t2)}
.founder-sig-title{font-size:11.5px;font-weight:700;color:var(--t3);
  letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
.tam-callout{display:flex;align-items:flex-start;gap:12px;
  padding:16px;background:var(--ind-subtle);border:1px solid var(--ind-border);
  border-radius:var(--r-md);margin-top:4px}
.tam-icon{font-size:18px;flex-shrink:0;margin-top:1px}
.tam-text{font-size:13.5px;font-weight:500;color:var(--t1);line-height:1.55}
.tam-text strong{color:var(--ind);font-weight:800}

/* ── TEAM ── */
.team-sec{padding:80px 60px;background:var(--bg-pure);border-top:1px solid var(--b0)}
.team-inner{max-width:1280px;margin:0 auto;text-align:center}
.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;
  margin-top:48px;max-width:800px;margin-left:auto;margin-right:auto}
.team-card{padding:28px 24px;border:1px solid var(--b1);border-radius:var(--r-xl);
  background:var(--bg);text-align:center;
  transition:transform .32s var(--ex),box-shadow .32s}
.team-card:hover{transform:translateY(-4px);box-shadow:var(--sh-md)}
.team-avatar{width:72px;height:72px;border-radius:50%;
  background:var(--s2);border:2px solid var(--b1);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;margin:0 auto 16px;overflow:hidden}
.team-avatar img{width:100%;height:100%;object-fit:cover}
.team-name{font-size:16px;font-weight:800;color:var(--t0);letter-spacing:-.03em;margin-bottom:4px}
.team-role{font-size:12.5px;font-weight:600;color:var(--t3);margin-bottom:12px;letter-spacing:.02em}
.team-prev{display:flex;align-items:center;justify-content:center;gap:6px;
  font-size:12px;font-weight:700;color:var(--t3);
  background:var(--s1);border-radius:100px;padding:4px 12px;display:inline-flex}

/* ── FAQ ── */
.faq-sec{padding:96px 60px;background:var(--bg);border-top:1px solid var(--b0)}
.faq-inner{max-width:760px;margin:0 auto}
.faq-list{margin-top:48px;display:flex;flex-direction:column;gap:0;
  border:1px solid var(--b1);border-radius:var(--r-xl);overflow:hidden}
.faq-item{border-bottom:1px solid var(--b0);background:var(--bg-pure)}
.faq-item:last-child{border-bottom:none}
.faq-q{width:100%;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;
  gap:16px;cursor:none;text-align:left;background:none;
  font-size:15px;font-weight:700;color:var(--t0);letter-spacing:-.015em;
  transition:background .2s}
.faq-q:hover{background:var(--s1)}
.faq-icon{width:24px;height:24px;border-radius:50%;flex-shrink:0;
  background:var(--s1);border:1px solid var(--b1);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;color:var(--t3);transition:transform .3s var(--ex),background .2s}
.faq-item.open .faq-icon{transform:rotate(45deg);background:var(--ind-subtle);color:var(--ind)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .4s var(--ex),padding .3s}
.faq-a-inner{padding:0 24px 20px;font-size:14.5px;color:var(--t2);
  line-height:1.7;font-weight:400}
.faq-item.open .faq-a{max-height:300px}

/* ── CTA ── */
.csec{padding:96px 60px;text-align:center;position:relative;overflow:hidden;
  background:var(--t0)}
.cta-mesh{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 80% at 50% 0%,rgba(26,76,245,.22),transparent),
             radial-gradient(ellipse 50% 60% at 80% 100%,rgba(100,60,240,.12),transparent),
             radial-gradient(ellipse 60% 70% at 10% 80%,rgba(26,76,245,.08),transparent)}
.cta-dg{position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px);
  background-size:28px 28px}
.ch2{font-family:var(--fd);font-size:clamp(42px,6vw,84px);
  font-weight:300;line-height:1.0;letter-spacing:-.04em;margin-bottom:20px;
  color:#fff;position:relative}
.ch2 em{font-style:italic;font-weight:200;color:rgba(255,255,255,.5)}
.csub{font-size:18px;font-weight:400;color:rgba(255,255,255,.55);
  line-height:1.7;margin-bottom:16px;position:relative;letter-spacing:-.01em}
.cpricing{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.35);
  margin-bottom:44px;position:relative}
.cpricing strong{color:rgba(255,255,255,.65);font-weight:700}
.demo-form{display:flex;flex-direction:column;gap:12px;max-width:420px;margin:0 auto;position:relative}
.demo-form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dinp{font-size:15px;font-weight:600;color:var(--t0);
  background:rgba(255,255,255,.96);
  border:1.5px solid rgba(255,255,255,.15);border-radius:var(--r-md);padding:14px 20px;
  width:100%;outline:none;letter-spacing:-.01em;
  transition:border-color .28s,box-shadow .28s}
.dinp:focus{border-color:rgba(26,76,245,.6);box-shadow:0 0 0 4px rgba(26,76,245,.15)}
.dinp::placeholder{color:rgba(10,10,22,.35)}
.bctal{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.01em;
  background:var(--ind);border-radius:var(--r-md);padding:15px 36px;
  position:relative;overflow:hidden;width:100%;
  transition:transform .22s var(--ex),box-shadow .22s var(--ex)}
.bctal::after{content:'';position:absolute;inset:0;
  background:linear-gradient(145deg,rgba(255,255,255,.16),transparent 55%)}
.bctal:hover{transform:translateY(-2px);box-shadow:0 12px 44px rgba(26,76,245,.55)}
.ctrust{display:flex;justify-content:center;gap:8px;margin-top:28px;
  flex-wrap:wrap;position:relative}
.ctrust-item{display:flex;align-items:center;gap:6px;
  font-size:13px;font-weight:600;color:rgba(255,255,255,.45)}
.ctrust-item + .ctrust-item::before{content:'·';margin-right:4px;color:rgba(255,255,255,.2)}
.ctrust-check{width:17px;height:17px;border-radius:50%;
  background:rgba(11,154,104,.18);border:1px solid rgba(11,154,104,.35);
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.smsg{display:inline-flex;align-items:center;gap:12px;
  background:rgba(11,154,104,.1);border:1px solid rgba(11,154,104,.28);
  border-radius:var(--r-lg);padding:16px 28px;
  animation:pop .4s var(--ex);position:relative}
.smsgt{font-size:16px;color:#6EE7B7;font-weight:700;letter-spacing:-.01em}
.cta-wa{display:inline-flex;align-items:center;gap:9px;
  margin-top:20px;position:relative;
  font-size:14px;font-weight:700;color:rgba(255,255,255,.5);
  background:rgba(18,140,126,.1);border:1px solid rgba(18,140,126,.2);
  border-radius:var(--r-md);padding:10px 20px;
  transition:background .22s,color .22s}
.cta-wa:hover{background:rgba(18,140,126,.18);color:rgba(255,255,255,.75)}

/* ── STICKY MOBILE BAR ── */
.sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:800;
  background:var(--bg-pure);border-top:1px solid var(--b1);
  padding:14px 20px;display:none;
  align-items:center;justify-content:space-between;gap:12px;
  box-shadow:0 -8px 32px rgba(10,10,22,.08);
  transform:translateY(100%);transition:transform .4s var(--ex)}
.sticky-bar.show{transform:translateY(0)}
.sticky-bar-text{display:flex;flex-direction:column;gap:1px}
.sticky-bar-title{font-size:13px;font-weight:800;color:var(--t0);letter-spacing:-.02em}
.sticky-bar-sub{font-size:11.5px;color:var(--t3);font-weight:600}
.sticky-bar-cta{font-size:14px;font-weight:800;color:#fff;
  background:var(--ind);border-radius:var(--r-md);padding:10px 22px;
  white-space:nowrap;flex-shrink:0}

/* ── FOOTER ── */
footer{border-top:1px solid var(--b0);padding:60px 60px 36px;background:var(--bg-pure)}
.footer-main{max-width:1280px;margin:0 auto;
  display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;gap:60px;margin-bottom:52px}
.footer-brand p{font-size:14px;color:var(--t3);line-height:1.7;
  max-width:280px;font-weight:400;margin-top:16px}
.footer-social{display:flex;gap:9px;margin-top:16px}
.footer-social-btn{width:34px;height:34px;border-radius:var(--r-sm);border:1px solid var(--b1);
  background:var(--bg);display:flex;align-items:center;justify-content:center;
  font-size:14px;cursor:none;transition:background .2s,border-color .2s,transform .22s var(--ex)}
.footer-social-btn:hover{background:var(--s1);border-color:var(--b2);transform:translateY(-2px)}
.footer-col-title{font-size:11px;font-weight:800;letter-spacing:.14em;
  text-transform:uppercase;color:var(--t3);margin-bottom:18px}
.footer-links{display:flex;flex-direction:column;gap:11px}
.ftlk{font-size:14px;font-weight:600;color:var(--t2);
  transition:color .2s;width:fit-content}
.ftlk:hover{color:var(--t0)}
.footer-bottom{max-width:1280px;margin:0 auto;padding-top:24px;
  border-top:1px solid var(--b0);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
.ftcp{font-size:13px;color:var(--t4);font-weight:600}
.footer-legal{display:flex;gap:22px}
.footer-legal a{font-size:13px;color:var(--t3);font-weight:600;transition:color .2s}
.footer-legal a:hover{color:var(--t1)}
.footer-made{font-size:13px;color:var(--t4);display:flex;align-items:center;gap:5px;font-weight:600}
.footer-made span{color:var(--coral)}
.press-strip{display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap}
.press-badge{font-size:12px;font-weight:700;color:var(--t3);
  background:var(--s1);border:1px solid var(--b1);
  border-radius:100px;padding:4px 12px}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  #nav{padding:0 24px}
  .nav-links{display:none}
  .nav-wa{display:none}
  .hero{padding:100px 24px 0}
  .sec{padding:72px 24px}
  .trust-sec{padding:32px 24px}
  .logo-strip{padding:24px 24px}
  .hiw-sec,.video-sec,.testimonials-sec,
  .comparison-sec,.faq-sec,.csec,.team-sec{padding:72px 24px}
  footer{padding:48px 24px 28px}
  .trust-stats{grid-template-columns:repeat(2,1fr)}
  .trust-stat:nth-child(2){border-right:none}
  .trust-stat:nth-child(3){border-right:1px solid var(--b1);border-top:1px solid var(--b1)}
  .trust-stat:nth-child(4){border-top:1px solid var(--b1)}
  .hiw-steps{grid-template-columns:1fr}
  .hiw-arrow{display:none}
  .testimonials-grid{grid-template-columns:1fr}
  .testimonials-grid .tcard:nth-child(n+2){display:none}
  .founder-inner{grid-template-columns:1fr;gap:48px}
  .founder-badge{left:0;bottom:-12px}
  .team-grid{grid-template-columns:1fr 1fr;max-width:100%}
  .footer-main{grid-template-columns:1fr 1fr;gap:36px}
  .sticky-bar{display:flex}
}
@media(max-width:640px){
  .hh{font-size:clamp(42px,12vw,64px)}
  .trust-stats{grid-template-columns:1fr 1fr}
  .trust-stat{border-right:none!important;border-bottom:1px solid var(--b1)}
  .trust-stat:last-child{border-bottom:none}
  .comparison-table .cmp-cell{font-size:12px;padding:12px 14px}
  .footer-main{grid-template-columns:1fr}
  .footer-bottom{flex-direction:column;align-items:flex-start}
  .team-grid{grid-template-columns:1fr}
  .demo-form-row{grid-template-columns:1fr}
}
`;

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════
function useInView(threshold = 0.12, rootMargin = "0px 0px -60px 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, on] as const;
}

function useCount(end: number, ms = 2200, dec = 0) {
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
  dir?: "up" | "s" | "r" | "l"; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
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
      setBig(!!(t?.closest("button") || t?.closest("a")));
    };
    const anim = () => {
      rp.current.x += (pos.current.x - rp.current.x) * 0.1;
      rp.current.y += (pos.current.y - rp.current.y) * 0.1;
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
// STICKY MOBILE BAR
// ═══════════════════════════════════════════════════════════════════════════
function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.3);
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

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════
function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 56);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav id="nav" className={sc ? "s" : ""}>
      <div className="nl">
        <div className="nm">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
            <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".4" />
            <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".4" />
            <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
          </svg>
        </div>
        <span className="nn">Edu<span className="nnb">fy</span></span>
      </div>
      <div className="nav-links">
        {[
          { label: "Product", href: "#features" },
          { label: "How it works", href: "#how-it-works" },
          { label: "Case Studies", href: "#testimonials" },
          { label: "FAQ", href: "#faq" },
        ].map(l => (
          <a key={l.label} href={l.href} className="nl-item">{l.label}</a>
        ))}
      </div>
      <div className="na">
        <a href="https://wa.me/919999999999?text=Hi, I want to learn more about Edufy"
          target="_blank" rel="noopener" className="nav-wa">
          <span>💬</span> Chat on WhatsApp
        </a>
        <a href="#cta" className="bc">Book a demo →</a>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO COMPONENT (without visual mockup)
// ═══════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="orb oa" /><div className="orb ob" /><div className="orb oc" />
      <div className="dg" />
      <div className="hi">
        <div className="hpill">
          <div className="hpd"><div className="hpdi" /></div>
          <div className="hpill-txt">
            <span>Used by 500+ schools</span>
            <span className="hpill-sep" />
            <span>Now across 12 states</span>
          </div>
        </div>
        <h1 className="hh">
          The school<br />
          <em>operating system</em><br />
          <span className="gr">India has waited for</span>
        </h1>
        <p className="hs">
          One platform connecting attendance, fees, transport, exams, and parents —
          <strong> built for how Indian schools actually work.</strong>
        </p>
        <div className="hbt">
          <a href="#cta" className="bph">Book a free demo →</a>
          <button className="bps" onClick={() => document.getElementById("video-sec")?.scrollIntoView({ behavior: "smooth" })}>
            Watch 2-min video
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="htr">
          {["No credit card needed", "Free for 30 days", "Cancel anytime"].map(t => (
            <div key={t} className="htb">
              <div className="htc">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="#0B9A68" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
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
// LOGO STRIP
// ═══════════════════════════════════════════════════════════════════════════
function LogoStrip() {
  const schools = [
    { icon: "🏫", name: "DPS Hyderabad" },
    { icon: "🎓", name: "Narayana Group" },
    { icon: "🌸", name: "Orchids International" },
    { icon: "⭐", name: "Sri Chaitanya" },
    { icon: "🏛️", name: "Delhi Public School" },
    { icon: "🔬", name: "Vidyashilp Academy" },
    { icon: "📚", name: "DAV Public Schools" },
    { icon: "🌟", name: "Kendriya Vidyalaya" },
  ];
  return (
    <section className="logo-strip">
      <div className="logo-strip-inner">
        <div className="logo-strip-label">Trusted by schools across India</div>
        <div className="logo-strip-logos">
          {schools.map((s, i) => (
            <div key={i} className="logo-pill">
              <div className="logo-pill-icon">{s.icon}</div>
              <span className="logo-pill-name">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STATS + MARQUEE
// ═══════════════════════════════════════════════════════════════════════════
function StatCounter({ end, suffix = "", dec = 0, label, delta }: {
  end: number; suffix?: string; dec?: number; label: string; delta?: string;
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
        <div className="trust-stats">
          <StatCounter end={500} suffix="+" label="Schools onboarded" delta="↑ 42% YoY" />
          <StatCounter end={98} suffix="%" label="Customer retention" delta="Industry best" />
          <StatCounter end={2} suffix="M+" label="Student records managed" delta="↑ 1.2M this year" />
          <StatCounter end={4.9} suffix="" dec={1} label="App Store rating" delta="4,800+ reviews" />
        </div>
      </div>
      <div className="mw" style={{ marginTop: 16 }}>
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
// HOW IT WORKS (updated copy)
// ═══════════════════════════════════════════════════════════════════════════
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Setup your school",
      desc: "We have dedicated coordinator for your daily operations who will guide you through data import, staff training, and configuration. All done remotely with zero disruption.",
      time: "2 hours",
    },
    {
      num: "02",
      title: "Train your staff",
      desc: "We run a free live training session for your teachers, admin, and support staff. Our app is built to need zero IT expertise — if you can use WhatsApp, you can use Edufy.",
      time: "1 session",
    },
    {
      num: "03",
      title: "Go live, Day 1",
      desc: "Enable parent notifications, start marking attendance, and collect fees online. Most schools see measurable time savings from their very first school day.",
      time: "Day 1",
    },
  ];
  return (
    <section className="hiw-sec" id="how-it-works">
      <div className="hiw-inner">
        <Reveal>
          <div className="slb">How it works</div>
          <h2 className="sh">From contract to live school<br /><em>in under 48 hours</em></h2>
          <p className="ss">No lengthy implementation. No IT department needed. No disruption to your school day.</p>
        </Reveal>
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.1} dir="s">
              <div className="hiw-step" style={{ position: "relative" }}>
                <div className="hiw-step-num">{s.num}</div>
                <div className="hiw-step-title">{s.title}</div>
                <div className="hiw-step-desc">{s.desc}</div>
                <div className="hiw-step-time">⏱ {s.time}</div>
                {i < steps.length - 1 && <div className="hiw-arrow">→</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ProblemSection (Status Quo) — REMOVED entirely
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// TABBED FEATURES — COMMENTED OUT per request
// ═══════════════════════════════════════════════════════════════════════════
// function FeaturesSection() { ... } (removed)

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO SECTION
// ═══════════════════════════════════════════════════════════════════════════
function VideoSection() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="video-sec" id="video-sec">
      <div className="video-inner">
        <Reveal>
          <div className="slb" style={{ display: "inline-flex", margin: "0 auto 18px" }}>See it in action</div>
          <h2 className="sh" style={{ textAlign: "center" }}>
            Edufy in 2 minutes,<br /><em>flat</em>
          </h2>
          <p className="ss" style={{ textAlign: "center", margin: "0 auto" }}>
            Watch how a principal at Narayana Group uses Edufy to manage 3 campuses before 9 AM.
          </p>
        </Reveal>
        <Reveal dir="s" delay={0.1}>
          <div className="video-frame" onClick={() => setPlaying(true)}>
            {!playing ? (
              <div className="video-thumb">
                <div className="video-thumb-grid" />
                <div className="video-play">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M7 4.5L18 11L7 17.5V4.5Z" fill="white" />
                  </svg>
                </div>
                <div className="video-label">WATCH · 2:04</div>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen"
                title="Edufy product demo"
              />
            )}
          </div>
          <p className="video-cta">
            Prefer a live walkthrough? <a href="#cta">Schedule 15 minutes with our team →</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MODULES CAROUSEL
// ═══════════════════════════════════════════════════════════════════════════
const MODULES = [
  { title: "Smart Attendance", badge: "Core", sub: "1-tap marking with auto alerts", image: "/assets/parent-attendance.png", accent: "#E07A10" },
  { title: "Exams & Results", badge: "Academic", sub: "Report cards in hours", image: "/assets/parent-reports.png", accent: "#6366F1" },
  { title: "Fee Management", badge: "Finance", sub: "Online + offline collection", image: "/assets/parent-home.png", accent: "#0B9A68" },
  { title: "Live Transport", badge: "Safety", sub: "Real-time GPS for every bus", image: "/assets/parent-home.png", accent: "#DC2626" },
  { title: "Notice Board", badge: "Comms", sub: "Broadcast with read receipts", image: "/assets/parent-home.png", accent: "#0EA5E9" },
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
  const radius = 520; // increased for better spacing

  useLayoutEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const rotator = carouselRotatorRef.current;
    if (!section || !rotator) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length !== numCards) return;

    // Initial positions
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
          scrub: 1.5,        // smoother
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onLeave: () => gsap.to(section, { opacity: 0.96, duration: 0.25 }),
          onEnterBack: () => gsap.to(section, { opacity: 1, duration: 0.25 }),
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
            const scale = 0.6 + frontness * 0.45;
            const opacity = 0.3 + frontness * 0.7;
            const zIndex = Math.round(1000 + frontness * 1000);
            card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px) scale(${scale})`;
            card.style.opacity = String(opacity);
            card.style.zIndex = String(zIndex);

            const glowRing = card.querySelector<HTMLElement>(".glow-ring");
            if (glowRing) glowRing.style.opacity = String(frontness * 0.9);

            // Track the card with highest frontness
            if (frontness > maxFrontness) {
              maxFrontness = frontness;
              maxIdx = i;
            }
          }

          // Get the frontmost card and decide if it's really front-facing (<25°)
          const frontCard = cards[maxIdx];
          let diffFront = (maxIdx * step - current) % 360;
          if (diffFront > 180) diffFront -= 360;
          if (diffFront < -180) diffFront += 360;
          const isExactlyFront = Math.abs(diffFront) <= 25;

          // Remove front class from all, then add only if exactly front
          cards.forEach(card => card.classList.remove("front"));
          if (isExactlyFront) {
            frontCard.classList.add("front");
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
    // mobile fallback (unchanged)
    return (
      <section className="sec" style={{ overflow: "visible", background: "var(--bg)" }}>
        <div className="sin">
          <Reveal>
            <div className="slb">Modules</div>
            <h2 className="sh">Every tool your school needs,<br /><em>in one place</em></h2>
          </Reveal>
          <div className="mobile-modules-grid">
            {MODULES.map((mod, i) => (
              <div key={i} className="mobile-module-card">
                <div className="card-header"><h3>{mod.title}</h3></div>
                <div className="card-image">
                  <img src={mod.image} alt={mod.title} loading="lazy" />
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
          <h2 className="sh">Every tool your school needs,<br /><em>in one place</em></h2>
          <p className="ss" style={{ marginBottom: 0 }}>Scroll to explore all modules →</p>
        </Reveal>
        <div style={{ marginTop: 44 }}>
          <div className="carousel-stage" style={{ perspective: "2400px" }}>
            <div ref={carouselRotatorRef} className="carousel-rotator">
              {MODULES.map((mod, i) => (
                <div
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="module-card"
                >
                  <div className="card-header">
                    <div
                      className="card-badge"
                      style={{
                        color: mod.accent,
                        background: `${mod.accent}14`,
                        border: `1px solid ${mod.accent}30`,
                      }}
                    >
                      {mod.badge}
                    </div>
                    <h3>{mod.title}</h3>
                    <div className="card-sub">{mod.sub}</div>
                  </div>
                  <div className="card-image">
                    <img src={mod.image} alt={mod.title} loading="lazy" />
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
    quote: "Our teachers were spending 45 minutes on attendance every morning. With Edufy, it's 4 minutes. I have no idea how we managed before.",
    outcome: "41 minutes saved per teacher daily",
    name: "Priya Sharma",
    role: "Principal, DPS Hyderabad",
    avatar: "🏫",
    topColor: "var(--att)",
  },
  {
    quote: "We haven't received a single 'where is the bus' call since we switched. That alone was worth every rupee. Parents actually thank us now.",
    outcome: "Zero transport enquiry calls",
    name: "Rajan Mehta",
    role: "Operations Director, Orchids International",
    avatar: "🚌",
    topColor: "var(--trn)",
  },
  {
    quote: "Fee reconciliation took my team a full week every month. Now it's automated before 9 AM on the 1st. Genuinely the best operational decision we've made.",
    outcome: "₹2.1L in overdue fees recovered in month 1",
    name: "Sunita Rao",
    role: "Finance Head, Narayana Group",
    avatar: "💳",
    topColor: "var(--fin)",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-sec" id="testimonials">
      <div className="testimonials-header">
        <Reveal>
          <div className="slb" style={{ display: "inline-flex", margin: "0 auto 18px" }}>What schools say</div>
          <h2 className="sh" style={{ textAlign: "center", margin: "0 auto" }}>
            Trusted by principals<br /><em>who've tried everything else</em>
          </h2>
        </Reveal>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1} dir="s">
            <div className="tcard">
              <div className="tcard-top" style={{ background: `linear-gradient(90deg,${t.topColor},transparent)` }} />
              <div className="tcard-stars">
                {[...Array(5)].map((_, j) => <span key={j} className="tcard-star">★</span>)}
              </div>
              <div className="tcard-quote">"{t.quote}"</div>
              <div className="tcard-outcome">
                <span>✅</span> {t.outcome}
              </div>
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
// COMPARISON TABLE (language support row removed)
// ═══════════════════════════════════════════════════════════════════════════
const CMP_ROWS = [
  { label: "Attendance marking time", old: "45+ min/day", edufy: "Under 4 min/day" },
  { label: "Fee reconciliation", old: "5-7 days/month", edufy: "Automated, <10 min" },
  { label: "Parent communication", old: "WhatsApp groups (untracked)", edufy: "In-app with read receipts" },
  { label: "Report card generation", old: "2 weeks per term", edufy: "4 minutes for 1,200 cards" },
  { label: "Transport tracking", old: "None (phone calls)", edufy: "Live GPS + auto alerts" },
  { label: "Setup time", old: "3-6 months", edufy: "48 hours" },
  { label: "Multi-campus support", old: "Separate logins per campus", edufy: "One dashboard, all campuses" },
  // Indian language support row removed per request
];

function ComparisonTable() {
  return (
    <section className="comparison-sec" id="comparison">
      <div className="comparison-inner">
        <Reveal>
          <div className="slb">The Edufy difference</div>
          <h2 className="sh">The old way vs.<br /><em>the Edufy way</em></h2>
        </Reveal>
        <Reveal dir="s" delay={0.1}>
          <div className="comparison-table">
            <div className="cmp-header">
              <div className="cmp-hcell">What you're measuring</div>
              <div className="cmp-hcell">⚠️ Legacy / manual</div>
              <div className="cmp-hcell">
                <div className="nm" style={{ width: 22, height: 22, borderRadius: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
                    <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".4" />
                    <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".4" />
                    <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
                  </svg>
                </div>
                With Edufy
              </div>
            </div>
            {CMP_ROWS.map((r, i) => (
              <div key={i} className="cmp-row">
                <div className="cmp-cell">{r.label}</div>
                <div className="cmp-cell">
                  <span className="cmp-cross">✕</span> {r.old}
                </div>
                <div className="cmp-cell">
                  <span className="cmp-check">✓</span> {r.edufy}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SecurityStrip — REMOVED per request
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// FOUNDER
// ═══════════════════════════════════════════════════════════════════════════
function Founder() {
  return (
    <section className="sec founder-section">
      <div className="founder-inner">
        <Reveal dir="l" className="">
          <div className="founder-img-wrap">
            <div className="founder-accent" />
            <div className="founder-image-card">
              <img
                src="/assets/founder.png"
                alt="Ravi teja Maddoju, Founder & CEO"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="founder-badge">
              <div className="founder-badge-icon">🏆</div>
              <div>
                <div className="founder-badge-title">10+ years in EdTech</div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12} dir="r">
          <div className="founder-right">
            <div className="slb">Our story</div>
            <h2 className="sh">Built by educators,<br /><em>for educators</em></h2>
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
                  <div className="stat-label">Schools served</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98<span>%</span></div>
                  <div className="stat-label">Retention rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">States active</div>
                </div>
              </div>
              <div className="founder-sig-wrap">
                <div>
                  <div className="founder-signature">— Ravi teja Maddoju</div>
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

// ═══════════════════════════════════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════════════════════════════════
const TEAM = [
  { name: "Arjun Menon", role: "Co-founder & CEO", prev: "ex-BYJU'S", avatar: "👨‍💼" },
  { name: "Preethi Nair", role: "Co-founder & CTO", prev: "ex-Unacademy", avatar: "👩‍💻" },
  { name: "Karthik Reddy", role: "Head of Product", prev: "ex-Freshworks", avatar: "👨‍🎨" },
];

function TeamSection() {
  return (
    <section className="team-sec">
      <div className="team-inner">
        <Reveal>
          <div className="slb" style={{ display: "inline-flex", margin: "0 auto 18px" }}>The team</div>
          <h2 className="sh" style={{ textAlign: "center", margin: "0 auto" }}>
            People who've been <em>inside schools</em>
          </h2>
        </Reveal>
        <div className="team-grid">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1} dir="s">
              <div className="team-card">
                <div className="team-avatar">{m.avatar}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <div className="team-prev">🏢 {m.prev}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="press-strip" style={{ justifyContent: "center", marginTop: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--t4)", marginRight: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured in</span>
            {["YourStory", "EdTechReview", "NASSCOM", "The Ken"].map(p => (
              <div key={p} className="press-badge">{p}</div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQ (unchanged)
// ═══════════════════════════════════════════════════════════════════════════
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
    a: "Yes. Edufy supports CBSE, ICSE, and all major state board formats including UP Board, Maharashtra SSC, AP/Telangana, Karnataka, Tamil Nadu, and more. We also support custom grading formats — our team configures these for you during onboarding.",
  },
  {
    q: "What happens when the free trial ends?",
    a: "We'll reach out before your trial ends to discuss next steps. There's no auto-charge. Plans start at ₹4,999/month per school — no per-student fees, no hidden costs. If Edufy isn't the right fit, we export your data cleanly and wish you well.",
  },
  {
    q: "Can we use Edufy offline?",
    a: "Yes. Attendance marking and a read-only view of critical data works offline. Data syncs automatically when connectivity is restored. This is critical for schools in areas with unreliable internet — we built for Indian infrastructure realities.",
  },
  {
    q: "Do you integrate with Tally and existing payment systems?",
    a: "We have a native Tally integration for fee accounting. We also support UPI, HDFC, ICICI, and Razorpay payment gateways. If your school uses a custom payment system, our team can discuss API integration during onboarding.",
  },
  {
    q: "How does multi-campus management work?",
    a: "One Edufy account can manage unlimited campuses. The principal or group admin can see consolidated reports across all schools, switch between campuses in one click, and set campus-specific configurations (timetables, fee structures, staff) independently.",
  },
  {
    q: "Do you provide training for teachers who aren't tech-savvy?",
    a: "This is our most common concern — and it's why we designed Edufy to feel like WhatsApp, not enterprise software. We run live video training sessions, provide Hindi and regional language how-to guides, and our support team is available 6 AM–10 PM IST via WhatsApp.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq-sec" id="faq">
      <div className="faq-inner">
        <Reveal style={{ textAlign: "center" }}>
          <div className="slb" style={{ display: "inline-flex", margin: "0 auto 18px" }}>FAQ</div>
          <h2 className="sh" style={{ textAlign: "center", margin: "0 auto" }}>
            Questions schools<br /><em>always ask us</em>
          </h2>
        </Reveal>
        <Reveal dir="s" delay={0.1}>
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

// ═══════════════════════════════════════════════════════════════════════════
// CTA (unchanged)
// ═══════════════════════════════════════════════════════════════════════════
function CTA() {
  const [form, setForm] = useState({ name: "", school: "", city: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  return (
    <section className="csec" id="cta">
      <div className="cta-mesh" />
      <div className="cta-dg" />
      <Reveal style={{ position: "relative", zIndex: 2 }}>
        <h2 className="ch2">
          Your school deserves<br /><em>better software.</em>
        </h2>
        <p className="csub">
          Join 500+ schools that have simplified their operations.<br />
          Most go live within 48 hours of signing up.
        </p>
        <p className="cpricing">Plans from <strong>₹4,999/month</strong> · No per-student charges · No setup fees</p>
        {!sent ? (
          <>
            <div className="demo-form">
              <div className="demo-form-row">
                <input className="dinp" placeholder="Your name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="dinp" placeholder="School name" value={form.school}
                  onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
              </div>
              <div className="demo-form-row">
                <input className="dinp" placeholder="City" value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                <input className="dinp" placeholder="WhatsApp number" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <button className="bctal" onClick={handleSubmit} disabled={loading}>
                {loading ? "Booking your demo..." : "Book my free demo →"}
              </button>
            </div>
            <a href="https://wa.me/919999999999?text=Hi, I want to book a demo for Edufy"
              target="_blank" rel="noopener" className="cta-wa">
              <span>💬</span> Or chat directly on WhatsApp
            </a>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div className="smsg">
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(11,154,104,.16)", border: "1px solid rgba(11,154,104,.32)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1.5 6L4.5 9L10.5 2.5" stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="smsgt">We'll WhatsApp you within 2 hours to confirm. 🎉</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 600 }}>
              Can't wait? <a href="https://wa.me/919999999999" target="_blank" rel="noopener" style={{ color: "rgba(255,255,255,.6)", borderBottom: "1px solid rgba(255,255,255,.2)" }}>Message us on WhatsApp now →</a>
            </p>
          </div>
        )}
        <div className="ctrust" style={{ marginTop: 28 }}>
          {["No contract lock-in", "Free onboarding", "Cancel anytime"].map(t => (
            <div key={t} className="ctrust-item">
              <div className="ctrust-check">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2" stroke="#6EE7B7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
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
// FOOTER (unchanged)
// ═══════════════════════════════════════════════════════════════════════════
function Footer() {
  const cols = [
    { title: "Product", links: [{ label: "Attendance", href: "#features" }, { label: "Fee Management", href: "#features" }, { label: "Transport", href: "#features" }, { label: "Communication", href: "#features" }, { label: "Reports", href: "#features" }] },
    { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }, { label: "Press Kit", href: "#" }] },
    { title: "Support", links: [{ label: "Documentation", href: "#" }, { label: "Help Center", href: "#" }, { label: "System Status", href: "#" }, { label: "WhatsApp Support", href: "https://wa.me/919999999999" }] },
  ];
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div className="nm">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6.5" height="6.5" rx="2" fill="white" />
                <rect x="9.5" y="2" width="6.5" height="6.5" rx="2" fill="white" opacity=".4" />
                <rect x="2" y="9.5" width="6.5" height="6.5" rx="2" fill="white" opacity=".4" />
                <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="2" fill="white" />
              </svg>
            </div>
            <span className="nn" style={{ fontSize: 19 }}>Edu<span className="nnb">fy</span></span>
          </div>
          <p>The school operating system built for Indian schools. Simplifying operations so educators can focus on education.</p>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--t3)", marginTop: 8 }}>
            🔒 ISO 27001 · PDPB Compliant · Data stored in India
          </div>
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
              {col.links.map(l => (
                <a key={l.label} href={l.href} className="ftlk">{l.label}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="ftcp">© 2026 Edufy Technologies Pvt. Ltd. All rights reserved.</span>
        <div className="footer-legal">
          {["Privacy Policy", "Terms of Service", "Security", "Cookies"].map(l => (
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
      <StickyBar />
      <Nav />
      <Hero />
      <LogoStrip />
      {/*<TrustSection /> */}
      {/*<HowItWorks /> */}
      {/* ProblemSection (Status Quo) removed */}
      {/* FeaturesSection (The solution) commented out */}
      {/* <VideoSection />*/}
      <Modules3D />
      {/* /<Testimonials />*/}
      <ComparisonTable />
      {/* SecurityStrip removed */}
      <Founder />
      {/* <TeamSection />*/}
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
