import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   EDUFY — Side‑by‑side 3D Carousel (Pixel quality)
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

*,::before,::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:         #FFFFFF;
  --s1:         #F8F9FF;
  --s2:         #F4F5F8;
  --s3:         #ECEEF4;
  --s4:         #E2E5EE;
  --b0:         rgba(13,15,18,0.06);
  --b1:         rgba(13,15,18,0.1);
  --b2:         rgba(13,15,18,0.18);
  --b3:         rgba(13,15,18,0.28);
  --ind:        #2055F4;
  --ind-d:      rgba(32,85,244,0.12);
  --ind-g:      rgba(32,85,244,0.38);
  --ind-l:      #4D78F7;
  --jade:       #0E9E6B;
  --amber:      #E07A10;
  --coral:      #E24B4A;
  --sky:        #36A6F0;
  --t0:         #0D0F12;
  --t1:         rgba(13,15,18,0.88);
  --t2:         rgba(13,15,18,0.6);
  --t3:         rgba(13,15,18,0.4);
  --t4:         rgba(13,15,18,0.2);
  --fd: 'Fraunces', Georgia, serif;
  --fb: 'DM Sans', -apple-system, sans-serif;
  --ex:  cubic-bezier(0.16,1,0.3,1);
  --qt:  cubic-bezier(0.76,0,0.24,1);
}

html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--t0);font-family:var(--fb);
  -webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
button{font-family:var(--fb);border:none;cursor:none}
input{font-family:var(--fb)}
a{text-decoration:none;color:inherit}
::selection{background:rgba(32,85,244,0.2)}

/* ── CURSOR (blue) ── */
#cd{position:fixed;width:7px;height:7px;border-radius:50%;
  background:var(--ind);pointer-events:none;z-index:99999;
  transform:translate(-50%,-50%)}
#cr{position:fixed;width:36px;height:36px;border-radius:50%;
  border:1px solid rgba(32,85,244,0.4);
  pointer-events:none;z-index:99998;transform:translate(-50%,-50%)}
#cd.h{width:14px;height:14px}
#cr.h{width:54px;height:54px;border-color:rgba(32,85,244,0.3)}

/* ── NOISE ── */
#noise{position:fixed;inset:0;pointer-events:none;z-index:99997;opacity:.018;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:190px}

/* ── SCROLL REVEAL ── */
.rv{opacity:0;transform:translateY(30px);
  transition:opacity .88s var(--ex),transform .88s var(--ex)}
.rv.on{opacity:1;transform:none}
.rv-s{opacity:0;transform:scale(.93);
  transition:opacity .82s var(--ex),transform .82s var(--ex)}
.rv-s.on{opacity:1;transform:none}
.rv-r{opacity:0;transform:translateX(30px);
  transition:opacity .88s var(--ex),transform .88s var(--ex)}
.rv-r.on{opacity:1;transform:none}

/* ── KEYFRAMES ── */
@keyframes heroIn{from{opacity:0;transform:translateY(24px) skewY(1.2deg)}to{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.82) translateY(8px)}100%{opacity:1;transform:none}}
@keyframes shimmer{from{background-position:220% center}to{background-position:-220% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes breathe{0%,100%{opacity:.1;transform:scale(1)}50%{opacity:.18;transform:scale(1.07)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(32,85,244,.35)}50%{box-shadow:0 0 0 9px rgba(32,85,244,0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes drift1{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(48px,-34px)scale(1.09)}66%{transform:translate(-30px,46px)scale(.92)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}42%{transform:translate(-58px,22px)scale(1.06)}70%{transform:translate(34px,-44px)scale(.96)}}
@keyframes drift3{0%,100%{transform:translate(0,0)scale(1)}52%{transform:translate(65px,28px)scale(1.08)}}

/* ── NAV ── */
#nav{position:fixed;top:0;left:0;right:0;z-index:900;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 60px;height:68px;
  transition:background .4s,border-color .4s,backdrop-filter .4s;
  border-bottom:1px solid transparent}
#nav.s{background:rgba(255,255,255,.78);backdrop-filter:blur(30px) saturate(170%);
  border-color:var(--b0)}
.nl{display:flex;align-items:center;gap:11px}
.nm{width:34px;height:34px;border-radius:10px;
  background:linear-gradient(140deg,#2055F4,#1540CC);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 26px rgba(32,85,244,.3)}
.nn{font-size:18px;font-weight:600;letter-spacing:-.03em}
.nls{display:flex;gap:36px}
.nla{font-size:14px;font-weight:500;color:var(--t2);background:none;
  padding:0;transition:color .2s;position:relative}
.nla::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1px;
  background:var(--ind-l);transform:scaleX(0);transition:transform .25s var(--ex)}
.nla:hover{color:var(--t0)}
.nla:hover::after{transform:scaleX(1)}
.na{display:flex;align-items:center;gap:10px}
.bg{font-size:14px;font-weight:500;color:var(--t2);background:none;
  padding:8px 16px;transition:color .2s}
.bg:hover{color:var(--t0)}
.bc{font-size:14px;font-weight:600;color:#fff;
  background:var(--ind);border-radius:9px;padding:9px 22px;
  position:relative;overflow:hidden;
  transition:transform .22s var(--ex),box-shadow .22s var(--ex)}
.bc::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.15),transparent 60%);
  opacity:0;transition:opacity .25s}
.bc:hover{transform:translateY(-2px);box-shadow:0 9px 38px rgba(32,85,244,.48)}
.bc:hover::before{opacity:1}
.bc:active{transform:none}

/* ── HERO ── */
.hero{min-height:100vh;position:relative;overflow:hidden;
  display:flex;align-items:center;padding:124px 60px 80px}
.hi{max-width:980px;margin:0 auto;width:100%;text-align:center;position:relative;z-index:2}

.orb{position:absolute;border-radius:50%;filter:blur(115px);pointer-events:none}
.oa{width:680px;height:580px;background:rgba(32,85,244,.06);
  top:-170px;left:-150px;animation:drift1 22s ease-in-out infinite}
.ob{width:480px;height:480px;background:rgba(0,90,220,.04);
  top:280px;right:-110px;animation:drift2 26s ease-in-out infinite}
.oc{width:360px;height:360px;background:rgba(32,85,244,.04);
  bottom:0;left:38%;animation:drift3 19s ease-in-out infinite}

.dg{position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(13,15,18,.04) 1px,transparent 1px);
  background-size:27px 27px;
  -webkit-mask-image:radial-gradient(ellipse 82% 82% at 50% 50%,black 25%,transparent);
  mask-image:radial-gradient(ellipse 82% 82% at 50% 50%,black 25%,transparent)}

.hl{position:relative;z-index:2}
.hpill{display:inline-flex;align-items:center;gap:8px;
  font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ind);border:1px solid rgba(32,85,244,.28);
  border-radius:100px;padding:5px 16px;margin-bottom:30px;
  animation:pop .7s var(--ex) both}
.hpd{width:6px;height:6px;border-radius:50%;background:var(--ind);
  animation:blink 2.2s ease-in-out infinite}
.hh{font-family:var(--fd);
  font-size:clamp(56px,7vw,96px);font-weight:400;
  line-height:.96;letter-spacing:-.032em;margin-bottom:26px;
  animation:heroIn .95s var(--ex) .07s both}
.hh strong{font-weight:500}
.hh .gr{
  background:linear-gradient(118deg,var(--t0) 8%,var(--ind-l) 42%,var(--t0) 72%);
  background-size:250% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 5.5s linear infinite}
.hs{font-size:18px;font-weight:400;line-height:1.75;
  color:var(--t2);max-width:620px;margin:0 auto 42px;
  animation:fadeUp .9s var(--ex) .22s both}
.hbt{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;animation:fadeUp .9s var(--ex) .34s both}
.bph{font-size:16px;font-weight:600;color:#fff;
  background:var(--ind);border-radius:11px;padding:15px 36px;
  position:relative;overflow:hidden;
  transition:transform .24s var(--ex),box-shadow .24s var(--ex)}
.bph::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.16),transparent 60%);
  opacity:0;transition:opacity .28s}
.bph:hover{transform:translateY(-3px);box-shadow:0 14px 52px rgba(32,85,244,.5)}
.bph:hover::before{opacity:1}
.htr{display:flex;align-items:center;justify-content:center;gap:22px;margin-top:36px;flex-wrap:wrap;
  animation:fadeUp .9s var(--ex) .46s both}
.htb{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--t3)}
.htc{width:16px;height:16px;border-radius:50%;
  background:rgba(14,158,107,.1);border:1px solid rgba(14,158,107,.24);
  display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* limited seats badge */
.limited{font-size:13px;font-weight:600;color:var(--amber);
  background:rgba(224,122,16,.08);border:1px solid rgba(224,122,16,.2);
  border-radius:100px;padding:4px 16px;margin-top:16px;display:inline-block}

/* ── MARQUEE ── */
.mw{border-top:1px solid var(--b0);border-bottom:1px solid var(--b0);
  padding:17px 0;overflow:hidden;position:relative}
.mw::before,.mw::after{content:'';position:absolute;top:0;bottom:0;width:160px;
  z-index:2;pointer-events:none}
.mw::before{left:0;background:linear-gradient(90deg,var(--bg),transparent)}
.mw::after{right:0;background:linear-gradient(-90deg,var(--bg),transparent)}
.mt{display:flex;width:max-content;animation:marquee 36s linear infinite}
.mt:hover{animation-play-state:paused}
.mi{display:flex;align-items:center;gap:11px;
  padding:0 30px;border-right:1px solid var(--b0);white-space:nowrap}
.mico{font-size:16px}
.mlb{font-size:15.5px;font-weight:500;color:var(--t3);transition:color .2s}
.mi:hover .mlb{color:var(--t1)}

/* ── SECTION ── */
.sec{padding:100px 60px}
.sin{max-width:1260px;margin:0 auto}
.slb{font-size:12px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;
  color:var(--ind-l);display:flex;align-items:center;gap:10px;margin-bottom:18px}
.slbl{width:28px;height:1px;background:var(--ind-l);opacity:.7}
.sh{font-family:var(--fd);font-size:clamp(38px,5vw,64px);
  font-weight:400;line-height:1.05;letter-spacing:-.025em;margin-bottom:18px;color:var(--t0)}
.sh em{font-style:italic;color:var(--t2)}
.sh strong{font-weight:500}
.ss{font-size:17px;color:var(--t2);line-height:1.72;max-width:560px}

/* ── TRANSPORT CARD ── */
.bcc{background:var(--s1);border:1.5px solid var(--b1);
  border-radius:20px;padding:18px;position:relative;height: 560px;overflow:hidden;
  transition:border-color .35s,background .35s}
.bcc::before{content:'';position:absolute;inset:0;border-radius:20px;
  background:radial-gradient(580px circle at var(--mx,50%) var(--my,50%),rgba(32,85,244,.04),transparent 55%);
  opacity:0;transition:opacity .4s}
.bcc:hover{border-color:rgba(32,85,244,.35)}
.bcc:hover::before{opacity:1}
.btag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;padding:4px 14px;border-radius:100px;margin-bottom:16px}
.tj{background:rgba(14,158,107,.08);color:var(--jade);border:1px solid rgba(14,158,107,.2)}
.bt{font-family:var(--fd);font-size:22px;font-weight:400;
  letter-spacing:-.02em;margin-bottom:10px;line-height:1.18;color:var(--t0)}
.bd{font-size:13.5px;color:var(--t2);line-height:1.65}

/* map */
.mm{flex:1;margin-top:16px;background:rgba(0,0,14,.03);
  border:1px solid var(--b1);border-radius:14px;position:relative;overflow:hidden;min-height:0px}
.mgl{position:absolute;inset:0;
  background-image:linear-gradient(rgba(13,15,18,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(13,15,18,.04) 1px,transparent 1px);
  background-size:29px 29px}
.mr{position:absolute;background:rgba(13,15,18,.05);border-radius:3px}
.mb{position:absolute;width:20px;height:12px;border-radius:4px;background:var(--ind);
  box-shadow:0 0 22px rgba(32,85,244,.55),0 0 60px rgba(32,85,244,.15);z-index:3;
  transition:left 1.5s cubic-bezier(.4,0,.2,1),top 1.5s cubic-bezier(.4,0,.2,1)}
.mp{position:absolute;width:12px;height:12px;border-radius:50%;
  border:2px solid var(--jade);animation:glow 2.2s ease-in-out infinite}
.mbar{position:absolute;bottom:11px;left:12px;right:12px;
  display:flex;justify-content:space-between;align-items:center}
.mcp{font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px}
.mcl{background:rgba(14,158,107,.08);color:var(--jade);border:1px solid rgba(14,158,107,.3)}
.mce{background:rgba(13,15,18,.03);color:var(--t2);border:1px solid var(--b1)}

/* ── SIDE‑BY‑SIDE GRID ── */
.mod-grid {
    display: grid;
     min-width: 0;
     gap: 10px;
  grid-template-columns: 1fr 1.9fr;
  margin-top: 48px;
  align-items: stretch;
}

/* ── 3D CAROUSEL (right column) ── */
.carousel-wrap{
  height:100%;
  position:relative;
  overflow:visible;
  width: 100%;
  /* perspective is applied inline or via class */
}
.carousel-perspective{
  width:100%;
  height:100%;
  perspective:1400px;
  position:relative;
}
.carousel-3d{
  position:absolute;
  inset:0;
  transform-style:preserve-3d;
  will-change:transform;
}
.carousel-card{
  position:absolute;
  width:230px;
  height:390px;
  left:50%;
  top:50%;
  margin-left:-115px;
  margin-top:-195px;
  border-radius:28px;
  overflow:hidden;
  box-shadow: 0 30px 60px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05);
  transform-origin:center center;
  will-change:transform,opacity;
  background:var(--s2);

}
.carousel-card img{
  display:block;
  width:100%;
  height:100%;
  object-fit:cover;
}
/* fallback placeholder */
.card-placeholder{
  display:none;
  width:100%;
  height:100%;
  align-items:center;
  justify-content:center;
}
.carousel-card:not(:has(img[src])) .card-placeholder{
  display:flex;
}
.phone-mock-small{
  width:80%;
  height:80%;
  background:var(--bg);
  border-radius:18px;
  border:2px solid var(--b1);
}
/* Center overlay text */
.carousel-overlay{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  text-align:center;
  z-index:20;
  pointer-events:none;
  transition:color 0.4s;
}
.carousel-overlay h3{
  font-family:var(--fd);
  font-size:40px;
  font-weight:400;
  letter-spacing:-0.03em;
  margin-bottom:10px;
}
.carousel-overlay p{
  font-size:17px;
  opacity:0.75;
  max-width:280px;
  margin:0 auto;
}

/* ── ENHANCED FEATURES ── */
.fg{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:start}
.fst{position:sticky;top:96px}
.fl{display:flex;flex-direction:column}
.fi{display:flex;gap:24px;padding:28px 0;border-bottom:1.5px solid var(--b1);
  transition:transform .35s var(--ex),border-color .35s,background .35s;
  background:transparent;border-radius:12px;padding:24px;margin-bottom:4px}
.fi:hover{background:var(--s2);border-color:var(--b2);transform:translateX(6px)}
.fi:last-child{border-bottom:none}
.fico{width:48px;height:48px;border-radius:14px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:22px;
  background:var(--s2);border:1.5px solid var(--b1);
  transition:background .3s,border-color .3s,color .3s;color:var(--t2)}
.fi:hover .fico{background:var(--ind);border-color:var(--ind);color:#fff}
.fn{font-family:var(--fd);font-size:20px;font-weight:400;
  letter-spacing:-.02em;margin-bottom:7px;color:var(--t0)}
.fd2{font-size:14.5px;color:var(--t2);line-height:1.66}

/* phone mockup (unchanged) */
.phone-mock{position:relative;width:240px;height:480px;border-radius:36px;
  background:var(--bg);border:3px solid var(--b1);
  box-shadow:0 30px 60px rgba(0,0,0,.1);overflow:hidden;margin:0 auto;
  animation:float 6s ease-in-out infinite}
.pm-top{height:28px;display:flex;align-items:center;justify-content:center;gap:8px;
  padding-top:8px}
.pm-notch{width:80px;height:18px;background:rgba(13,15,18,.1);border-radius:9px}
.pm-screen{background:var(--s2);margin:8px 12px;border-radius:20px;padding:16px;
  display:flex;flex-direction:column;gap:12px;height:calc(100% - 52px);overflow:hidden}
.pm-card{background:var(--bg);border:1px solid var(--b0);border-radius:12px;
  padding:12px;display:flex;align-items:center;gap:10px;font-size:13px;
  transition:transform .3s}
.pm-card:hover{transform:scale(1.02)}
.pm-avatar{width:32px;height:32px;border-radius:50%;background:var(--ind-d);
  display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:var(--ind)}

/* ── FOUNDER ── */
.founder-quote{background:var(--bg);border:1.5px solid var(--b1);border-radius:14px;
  padding:20px;font-family:var(--fd);font-style:italic;font-size:20px;color:var(--t1);
  line-height:1.6}

/* ── CTA ── */
.csec{padding:110px 60px;text-align:center;position:relative;overflow:hidden;
  border-top:1px solid var(--b0)}
.corb{position:absolute;width:720px;height:520px;border-radius:50%;
  background:rgba(32,85,244,.06);filter:blur(140px);
  top:-170px;left:50%;transform:translateX(-50%);pointer-events:none}
.ch2{font-family:var(--fd);font-size:clamp(42px,6vw,80px);
  font-weight:400;line-height:1.03;letter-spacing:-.03em;margin-bottom:18px;position:relative;color:var(--t0)}
.ch2 em{font-style:italic;color:var(--t2)}
.csub{font-size:18px;color:var(--t2);line-height:1.72;margin-bottom:48px;position:relative}
.cfrm{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}
.cinp{font-size:16px;color:var(--t0);background:var(--s2);
  border:1.5px solid var(--b1);border-radius:11px;padding:15px 24px;
  width:340px;outline:none;transition:border-color .3s,box-shadow .3s}
.cinp:focus{border-color:rgba(32,85,244,.5);box-shadow:0 0 0 3px rgba(32,85,244,.08)}
.cinp::placeholder{color:var(--t3)}
.bctal{font-size:16px;font-weight:600;color:#fff;background:var(--ind);
  border-radius:11px;padding:15px 36px;position:relative;overflow:hidden;
  transition:transform .24s var(--ex),box-shadow .24s var(--ex)}
.bctal::before{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.16),transparent 60%);
  opacity:0;transition:opacity .28s}
.bctal:hover{transform:translateY(-3px);box-shadow:0 14px 52px rgba(32,85,244,.5)}
.bctal:hover::before{opacity:1}
.ctrust{display:flex;justify-content:center;gap:30px;margin-top:30px;
  flex-wrap:wrap;position:relative}
.smsg{display:inline-flex;align-items:center;gap:12px;
  background:rgba(14,158,107,.08);border:1px solid rgba(14,158,107,.24);
  border-radius:14px;padding:16px 28px;
  animation:pop .4s var(--ex);position:relative}
.smsgt{font-size:16px;color:var(--jade);font-weight:600}

/* ── FOOTER ── */
footer{border-top:1px solid var(--b0);padding:38px 60px;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;background:var(--bg)}
.ftl{display:flex;align-items:center;gap:28px}
.ftbr{display:flex;align-items:center;gap:10px}
.ftn{font-size:16px;font-weight:600;letter-spacing:-.028em;color:var(--t0)}
.ftcp{font-size:13px;color:var(--t3)}
.ftls{display:flex;gap:28px}
.ftlk{font-size:13.5px;color:var(--t3);transition:color .2s}
.ftlk:hover{color:var(--t2)}

/* ── RESPONSIVE ── */
@media(max-width:1060px){
  #nav{padding:0 24px}
  .nls{display:none}
  .hero{padding:108px 24px 60px}
  .hi{max-width:100%}
  .sec{padding:70px 24px}
  .fg{grid-template-columns:1fr;gap:40px}
  .fst{position:static}
  .mod-grid{grid-template-columns:1fr}
  footer{padding:28px 24px}
  .csec{padding:80px 24px}
}
`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.09) {
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

function useCount(end: number, ms = 2300, dec = 0) {
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

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────────────
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
      { threshold: 0.07 }
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

// ─── CURSOR ───────────────────────────────────────────────────────────────────
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav id="nav" className={sc ? "s" : ""}>
      <div className="nl">
        <div className="nm">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.8" fill="white" />
            <rect x="9" y="2" width="6" height="6" rx="1.8" fill="white" opacity=".5" />
            <rect x="2" y="9" width="6" height="6" rx="1.8" fill="white" opacity=".5" />
            <rect x="9" y="9" width="6" height="6" rx="1.8" fill="white" />
          </svg>
        </div>
        <span className="nn">Edufy</span>
      </div>
      <div className="nls">
        {["Product", "Features", "Pricing", "Security", "Blog"].map(l => (
          <button key={l} className="nla">{l}</button>
        ))}
      </div>
      <div className="na">
        <button className="bg">Sign in</button>
        <button className="bc">Get started free</button>
      </div>
    </nav>
  );
}

// ─── BUS MAP (unchanged) ─────────────────────────────────────────────────────
function BusMap() {
  const pts = [
    { left: "8%", top: "24%" }, { left: "27%", top: "15%" },
    { left: "52%", top: "23%" }, { left: "72%", top: "13%" },
    { left: "85%", top: "32%" }, { left: "67%", top: "55%" },
    { left: "40%", top: "63%" }, { left: "14%", top: "51%" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % pts.length), 1500);
    return () => clearInterval(t);
  }, []);
  const p = pts[i];
  return (
    <div className="mm">
      <div className="mgl" />
      <div className="mr" style={{ left: "4%", top: "23%", width: "92%", height: 6, transform: "rotate(-1.5deg)" }} />
      <div className="mr" style={{ left: "35%", top: "8%", width: 6, height: "78%", transform: "rotate(3.5deg)" }} />
      <div className="mr" style={{ left: "62%", top: "12%", width: "36%", height: 6, transform: "rotate(2deg)" }} />
      <div className="mr" style={{ left: "4%", top: "52%", width: "60%", height: 6, transform: "rotate(.8deg)" }} />
      <div className="mp" style={{ right: "11%", top: "17%" }} />
      <div style={{ position: "absolute", right: "9%", top: "6%", fontSize: 9, color: "var(--t3)", fontWeight: 700, letterSpacing: ".08em" }}>SCHOOL</div>
      <div className="mb" style={{ left: p.left, top: p.top }} />
      <div className="mbar">
        <div className="mcp mcl">● Live · Bus #3</div>
        <div className="mcp mce">ETA 6 min</div>
      </div>
    </div>
  );
}

// ─── FIXED 3D CAROUSEL (inside right column) ─────────────────────────────────
const features = [
  { title: "Home", desc: "Overview of school operations", color: "#2055F4", image: "/images/home.png" },
  { title: "Attendance", desc: "Track student presence", color: "#E07A10", image: "/images/attendance.png" },
  { title: "Reports", desc: "Marks, exams and performance", color: "#36A6F0", image: "/images/reports.png" },
  { title: "Support", desc: "Help and communication", color: "#E24B4A", image: "/images/support.png" }
];

function ModuleCarousel(triggerRef?: React.RefObject<HTMLDivElement | null>;) {
  const carousel3dRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayTitleRef = useRef<HTMLHeadingElement>(null);
  const overlayDescRef = useRef<HTMLParagraphElement>(null);

  const numCards = features.length;
  const step = 360 / numCards;
  const radius = 380;
  const SMOOTHING = 0.08;

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    // Initial positioning (replace string transform with GSAP properties)
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotationY: i * step,
        z: radius,
        scale: 0.65,
        opacity: 0.2,
        transformOrigin: 'center center',
      });
    });

    // Quick setters for maximum performance – no string concatenation
    const setters = cards.map((card) => ({
      rotationY: gsap.quickSetter(card, 'rotationY', 'deg'),
      z: gsap.quickSetter(card, 'z', 'px'),
      scale: gsap.quickSetter(card, 'scale'),
      opacity: gsap.quickSetter(card, 'opacity'),
    }));

    // Smooth interpolation state – NO React setState inside animation
    let current = 0;
    let target = 0;
    const rotation = { value: 0 };

    const updateCards = () => {
      // Loop through all cards and set transforms based on smoothed `current`
      for (let i = 0; i < numCards; i++) {
        let angle = i * step - current;
        // Normalize to [-180, 180]
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        const absAngle = Math.abs(angle);
        // Scale: 1 when front, 0.65 when at 90°
        const scale = 1 - (absAngle / 90) * 0.35;
        const clampedScale = Math.max(0.65, Math.min(1, scale));
        // Opacity: 1 when front, 0.2 when at 90°
        const opacity = 1 - (absAngle / 90) * 0.8;
        const clampedOpacity = Math.max(0.2, Math.min(1, opacity));

        setters[i].rotationY(i * step - current);
        setters[i].z(radius);
        setters[i].scale(clampedScale);
        setters[i].opacity(clampedOpacity);
        // z-index based on frontness (lower absAngle = higher index)
        cards[i].style.zIndex = String(Math.round(100 - absAngle));
      }

      // Update overlay text (front card) without React state
      let frontIdx = 0;
      let minAngle = 360;
      for (let i = 0; i < numCards; i++) {
        let angle = i * step - current;
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        const abs = Math.abs(angle);
        if (abs < minAngle) {
          minAngle = abs;
          frontIdx = i;
        }
      }
      if (overlayTitleRef.current && overlayDescRef.current && overlayRef.current) {
        const feat = features[frontIdx];
        overlayTitleRef.current.textContent = feat.title;
        overlayDescRef.current.textContent = feat.desc;
        overlayRef.current.style.color = feat.color;
      }
    };

    const ctx = gsap.context(() => {
      gsap.to(rotation, {
        value: -360,
        ease: 'none',
      scrollTrigger: {
        trigger,
        start: "top center",
        end: "bottom top",
        scrub: 1.2,
      },
        onUpdate: () => {
          // Smooth interpolation: target chases raw rotation value
          target = rotation.value;
          current += (target - current) * SMOOTHING;
          updateCards();
        },
      });
    }, trigger);

    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <div className="carousel-wrap">
      <div className="carousel-perspective" style={{ perspective: "1500px" }}>
        <div ref={carousel3dRef} className="carousel-3d">
          {features.map((feat, i) => (
            <div
              key={i}
              ref={(el) => {cardRefs.current[i] = el;}}
              className="carousel-card"
            >
              <img
                src={feat.image}
                alt={feat.title}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="card-placeholder">
                <div className="phone-mock-small" />
              </div>
            </div>
          ))}
        </div>
        {/* Dynamic overlay with refs – updated directly in animation */}
        <div className="carousel-overlay" ref={overlayRef} style={{ color: features[0].color }}>
          <h3 ref={overlayTitleRef}>{features[0].title}</h3>
          <p ref={overlayDescRef}>{features[0].desc}</p>
        </div>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="orb oa" /><div className="orb ob" /><div className="orb oc" />
      <div className="dg" />
      <div className="hi">
        <div className="hpill"><div className="hpd" />Introducing Edufy</div>
        <h1 className="hh">
          Run your school with<br />
          one <span className="gr">unified platform</span>
        </h1>
        <p className="hs">
          Edufy replaces scattered spreadsheets, WhatsApp groups, and disconnected software with one intelligent system — built for the way schools actually work.
        </p>
        <div className="hbt">
          <button className="bph">Start free trial</button>
        </div>
        <div className="limited">Only 50 schools can join this month — seats filling fast</div>
        <div className="htr">
          {["No credit card required", "Free for 30 days", "GDPR compliant"].map(t => (
            <div key={t} className="htb">
              <div className="htc">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="#0E9E6B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
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
    <div className="mw">
      <div className="mt">
        {all.map((m, i) => (
          <div key={i} className="mi">
            <span className="mico">{m.i}</span>
            <span className="mlb">{m.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PLATFORM MODULES (side‑by‑side) ─────────────────────────────────────────
function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const mm = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sec"
      style={{
        overflow: "visible",
        minHeight: "160vh"   // 🔥 gives scroll room
      }}
    >
      <div className="sin">

        {/* HEADER stays same */}
        <Reveal>
          <div className="slb">
            <div className="slbl" />Platform modules
          </div>
          <h2 className="sh">
            Everything in <strong>one place</strong>,<br />
            <em>nothing scattered</em>
          </h2>
          <p className="ss" style={{ marginBottom: 0 }}>
            Eight tightly integrated modules that speak to each other — your data stays consistent, private, and always yours.
          </p>
        </Reveal>

        {/* GRID */}
        <div
          className="mod-grid"
          style={{
            position: "sticky",
            top: "80px",   // aligns below navbar
          }}
        >

          {/* ✅ LEFT — FIXED */}
          <div
            className="bcc"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "560px",
            }}
            onMouseMove={mm}
          >
            <Reveal delay={0}>
              <>
                <div className="btag tj">Live Feature</div>
                <div className="bt">Real-time Transport Tracking</div>
                <div className="bd">
                  Parents see exactly where the school bus is. No calls, no anxiety — live location and ETA, always.
                </div>
              </>
            </Reveal>

            <BusMap />
          </div>

          {/* ✅ RIGHT — FIXED */}
          <div style={{ height: "560px", width: "100%" }}>
            <Reveal delay={0.1}>
              <ModuleCarousel triggerRef={sectionRef} />
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── ENHANCED FEATURES ────────────────────────────────────────────────────────
function Features() {
    const feats = [
      { icon: "🎓", name: "Academic Structure", desc: "Students, sections..." },
      { icon: "📋", name: "Smart Attendance", desc: "Teachers mark..." },
      { icon: "💰", name: "Fee Management", desc: "Track dues..." },
      { icon: "📊", name: "Exams & Report Cards", desc: "Generate reports..." },
      { icon: "📢", name: "Targeted Notices", desc: "Send announcements..." },
      { icon: "💬", name: "Parent Messaging", desc: "Two-way communication..." },
    ];

   return (
     <section className="sec" style={{ background: "var(--s2)", borderTop: "1px solid var(--b0)", borderBottom: "1px solid var(--b0)" }}>
       <div className="sin">
         <div className="fg">
           <div className="fst">
             <Reveal>
               <div className="slb"><div className="slbl" />Why Edufy</div>
               <h2 className="sh">Built for<br /><em>how schools</em><br /><strong>actually work</strong></h2>
               <p className="ss" style={{ marginBottom: 36 }}>
                 Every feature came from conversations with principals, teachers, and parents — not guesswork.
               </p>
               <button className="bc bph" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                 See every feature in action
                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                   <path d="M1 6H11M11 6L7 2M11 6L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                 </svg>
               </button>
             </Reveal>
           </div>
           <div className="fl">
             {feats.map((f, i) => (
               <Reveal key={f.name} delay={i * 0.07} dir="r">
                 <div className="fi">
                   <div className="fico">{f.icon}</div>
                   <div>
                     <div className="fn">{f.name}</div>
                     <div className="fd2">{f.desc}</div>
                   </div>
                 </div>
               </Reveal>
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 }

// ─── FOUNDER ──────────────────────────────────────────────────────────────────
function Founder() {
  return (
    <section className="sec" style={{ background: "var(--s1)", borderTop: "1px solid var(--b0)" }}>
      <div className="sin" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <Reveal>
          <div style={{ position: "relative" }}>
            <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 24, background: "linear-gradient(135deg, #DDEAFF, #C5D5FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72 }}>
              👨‍💼
            </div>
            <div className="founder-quote" style={{ position: "absolute", bottom: -20, left: 20, right: 20 }}>
              "We built Edufy after seeing a principal manage 1,200 students on three Excel sheets."
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, fontFamily: "var(--fb)", fontStyle: "normal" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ind-d)", border: "1px solid var(--b1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👨‍💻</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t0)" }}>Arjun Menon</div>
                  <div style={{ fontSize: 12, color: "var(--t3)" }}>Co-founder & CEO</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="slb"><div className="slbl" />Our Story</div>
          <h2 className="sh">Built by educators,<br /><em>for educators</em></h2>
          <p className="ss" style={{ fontSize: 17 }}>We left EdTech giants to solve the unsexy but critical problem of school infrastructure. Every pixel of Edufy is shaped by conversations with principals, teachers, and parents.</p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="csec">
      <div className="corb" />
      <div className="dg" style={{ maskImage: "radial-gradient(ellipse 65% 75% at 50% 50%,black,transparent)" }} />
      <Reveal style={{ position: "relative" }}>
        <h2 className="ch2">
          Ready to transform<br /><em>your school?</em>
        </h2>
        <p className="csub">
          Join 200+ schools already running on Edufy.<br />
          Start free — no credit card, no commitment.
        </p>
        {!sent ? (
          <>
            <div className="cfrm">
              <input className="cinp" type="email" placeholder="principal@yourschool.in"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && email && setSent(true)} />
              <button className="bctal" onClick={() => email && setSent(true)}>
                Get started free
              </button>
            </div>
            <div className="limited" style={{ marginTop: 18 }}>Only 50 seats left for this month</div>
          </>
        ) : (
          <div className="smsg">
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(14,158,107,.15)", border: "1px solid rgba(14,158,107,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 7L5 10L11 3" stroke="#0E9E6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="smsgt">You're on the list — we'll be in touch shortly.</span>
          </div>
        )}
        <div className="ctrust">
          {["No credit card required", "Free for 30 days", "Cancel anytime"].map(t => (
            <div key={t} className="htb">
              <div className="htc">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="#0E9E6B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <div className="ftl">
        <div className="ftbr">
          <div className="nm" style={{ width: 28, height: 28, borderRadius: 8 }}>
            <svg width="13" height="13" viewBox="0 0 17 17" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.8" fill="white" />
              <rect x="9" y="2" width="6" height="6" rx="1.8" fill="white" opacity=".5" />
              <rect x="2" y="9" width="6" height="6" rx="1.8" fill="white" opacity=".5" />
              <rect x="9" y="9" width="6" height="6" rx="1.8" fill="white" />
            </svg>
          </div>
          <span className="ftn">Edufy</span>
        </div>
        <span className="ftcp">© 2025 Edufy. All rights reserved.</span>
      </div>
      <div className="ftls">
        {["Privacy", "Terms", "Security", "Contact", "Status"].map(l => (
          <a key={l} href="#" className="ftlk">{l}</a>
        ))}
      </div>
    </footer>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <div id="noise" />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <PlatformSection />
      <Features />
      <Founder />
      <CTA />
      <Footer />
    </>
  );
}