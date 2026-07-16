import { useEffect } from "react";
import logo from "@/assets/khouta-logo.asset.json";

/**
 * Khuta Splash Screen — cinematic assembly of the official logo.
 *
 * The three golden steps + star are approximated as decorative shapes
 * during the assembly. Once the dark-green rounded square scales up behind
 * them, the whole composition crossfades to the UNTOUCHED official logo
 * image (`khouta-logo.asset.json`). Nothing about the real logo is
 * redesigned — the shapes are only in-flight scaffolding.
 *
 * Total duration ≈ 3400 ms → onDone().
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
 useEffect(() => {
 const t = setTimeout(onDone, 3400);
 return () => clearTimeout(t);
 }, [onDone]);

 // Logo box size (px). Everything inside is positioned relative to this.
 const S = 176;

 return (
 <div className="splash-root absolute inset-0 overflow-hidden bg-white">
 {/* ============ Animated luxury background ============ */}
 <div className="splash-bg-wash" />
 <div className="splash-bg-wave splash-bg-wave-1" />
 <div className="splash-bg-wave splash-bg-wave-2" />
 <div className="splash-bg-wave splash-bg-wave-3" />
 <div className="splash-bg-glow" />

 {/* Floating golden particles */}
 <div className="splash-particles" aria-hidden>
 {Array.from({ length: 14 }).map((_, i) => (
 <span key={i} className={`splash-particle p${i}`} />
 ))}
 </div>

 {/* ============ Logo stage ============ */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div
 className="splash-stage relative"
 style={{ width: S, height: S }}
 >
 {/* Dark green rounded square — grows from center at step 6 */}
 <div
 className="splash-square absolute inset-0"
 style={{
 borderRadius: "22%",
 background:
 "linear-gradient(140deg, oklch(0.30 0.06 155) 0%, oklch(0.20 0.05 155) 55%, oklch(0.13 0.04 155) 100%)",
 boxShadow:
 "0 30px 60px -24px oklch(0.20 0.05 155 / 0.55), 0 10px 24px -10px oklch(0.15 0.04 155 / 0.35)",
 }}
 />

 {/* Assembly scaffolding — approximations of the golden parts */}
 <div className="splash-assembly absolute inset-0" aria-hidden>
 {/* Bottom step — rises from below */}
 <span
 className="splash-step splash-step-1"
 style={{
 position: "absolute",
 left: "16%",
 bottom: "22%",
 width: "68%",
 height: "12%",
 borderRadius: "6px",
 background:
 "linear-gradient(180deg, oklch(0.88 0.14 88) 0%, oklch(0.76 0.15 82) 100%)",
 boxShadow:
 "0 4px 10px -4px oklch(0.60 0.15 80 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.35)",
 }}
 />
 {/* Middle step — slides in from the right */}
 <span
 className="splash-step splash-step-2"
 style={{
 position: "absolute",
 left: "22%",
 bottom: "40%",
 width: "56%",
 height: "12%",
 borderRadius: "6px",
 background:
 "linear-gradient(180deg, oklch(0.88 0.14 88) 0%, oklch(0.76 0.15 82) 100%)",
 boxShadow:
 "0 4px 10px -4px oklch(0.60 0.15 80 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.35)",
 }}
 />
 {/* Top step — drops from above */}
 <span
 className="splash-step splash-step-3"
 style={{
 position: "absolute",
 left: "30%",
 bottom: "58%",
 width: "42%",
 height: "12%",
 borderRadius: "6px",
 background:
 "linear-gradient(180deg, oklch(0.88 0.14 88) 0%, oklch(0.76 0.15 82) 100%)",
 boxShadow:
 "0 4px 10px -4px oklch(0.60 0.15 80 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.35)",
 }}
 />

 {/* Sparkle → grows → becomes the star */}
 <span
 className="splash-star"
 style={{
 position: "absolute",
 top: "14%",
 right: "18%",
 width: "22%",
 height: "22%",
 }}
 >
 <svg viewBox="0 0 24 24" width="100%" height="100%">
 <defs>
 <linearGradient id="splash-gold" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="oklch(0.90 0.14 88)" />
 <stop offset="100%" stopColor="oklch(0.74 0.15 82)" />
 </linearGradient>
 </defs>
 <path
 d="M12 2 L14.6 8.5 L21.5 9.2 L16.3 13.7 L18 20.5 L12 16.9 L6 20.5 L7.7 13.7 L2.5 9.2 L9.4 8.5 Z"
 fill="url(#splash-gold)"
 stroke="oklch(0.65 0.14 80)"
 strokeWidth="0.4"
 strokeLinejoin="round"
 />
 </svg>
 </span>
 </div>

 {/* Real official logo — crossfades in on top when square is complete */}
 <img
 src={logo.url}
 alt="خُطى"
 width={S}
 height={S}
 draggable={false}
 className="splash-real absolute inset-0 select-none"
 style={{ width: S, height: S, borderRadius: "22%" }}
 />

 {/* Single golden shimmer sweep across the finished logo */}
 <div
 className="splash-sheen absolute inset-0 pointer-events-none"
 style={{ borderRadius: "22%", overflow: "hidden" }}
 >
 <span className="splash-sheen-bar" />
 </div>

 {/* Soft golden glow pulse */}
 <div className="splash-glow absolute inset-0 pointer-events-none" />
 </div>
 </div>

 {/* Final fade-to-white transition veil */}
 <div className="splash-veil absolute inset-0 pointer-events-none bg-white" />

 <style>{`
 /* ============ Background ============ */
.splash-root { isolation: isolate; }

.splash-bg-wash {
 position: absolute; inset: 0;
 background:
 radial-gradient(120% 80% at 20% 10%, oklch(0.97 0.03 155 / 0.9), transparent 60%),
 radial-gradient(120% 80% at 80% 90%, oklch(0.96 0.04 155 / 0.8), transparent 55%),
 linear-gradient(180deg, #ffffff 0%, oklch(0.985 0.01 155) 50%, #ffffff 100%);
 animation: splash-wash 6s ease-in-out infinite alternate;
 }
 @keyframes splash-wash {
 0% { filter: hue-rotate(0deg); }
 100% { filter: hue-rotate(6deg); }
 }

.splash-bg-wave {
 position: absolute;
 border-radius: 50%;
 filter: blur(60px);
 opacity: 0;
 animation: splash-wave 5s ease-out forwards;
 }
.splash-bg-wave-1 {
 width: 420px; height: 420px;
 left: -120px; top: -80px;
 background: radial-gradient(circle, oklch(0.85 0.10 155 / 0.55), transparent 70%);
 animation-delay: 0ms;
 }
.splash-bg-wave-2 {
 width: 360px; height: 360px;
 right: -100px; bottom: -60px;
 background: radial-gradient(circle, oklch(0.88 0.08 155 / 0.50), transparent 70%);
 animation-delay: 200ms;
 }
.splash-bg-wave-3 {
 width: 300px; height: 300px;
 right: -80px; top: 20%;
 background: radial-gradient(circle, oklch(0.92 0.06 155 / 0.40), transparent 70%);
 animation-delay: 400ms;
 }
 @keyframes splash-wave {
 0% { opacity: 0; transform: scale(0.85); }
 40% { opacity: 1; }
 100% { opacity: 1; transform: scale(1.08) translate(4px, -4px); }
 }

.splash-bg-glow {
 position: absolute; inset: 0;
 background: radial-gradient(60% 45% at 50% 55%,
 oklch(0.98 0.02 155 / 0.9) 0%,
 oklch(0.96 0.03 155 / 0.5) 40%,
 transparent 75%);
 animation: splash-glow-pulse 4s ease-in-out infinite;
 }
 @keyframes splash-glow-pulse {
 0%, 100% { opacity: 0.7; }
 50% { opacity: 1; }
 }

 /* ============ Golden particles ============ */
.splash-particles { position: absolute; inset: 0; pointer-events: none; }
.splash-particle {
 position: absolute;
 width: 4px; height: 4px;
 border-radius: 9999px;
 background: radial-gradient(circle, oklch(0.88 0.14 88) 0%, oklch(0.80 0.15 82 / 0) 70%);
 box-shadow: 0 0 6px oklch(0.85 0.14 85 / 0.7);
 opacity: 0;
 animation: splash-float 6s ease-in-out infinite;
 }
 @keyframes splash-float {
 0% { opacity: 0; transform: translate3d(0,20px,0) scale(0.6); }
 20% { opacity: 0.9; }
 80% { opacity: 0.7; }
 100% { opacity: 0; transform: translate3d(0,-40px,0) scale(1.1); }
 }
.p0 { left: 10%; top: 22%; animation-delay: 0ms; width: 3px; height: 3px; }
.p1 { left: 22%; top: 70%; animation-delay: 400ms; }
.p2 { left: 35%; top: 18%; animation-delay: 800ms; width: 5px; height: 5px; }
.p3 { left: 48%; top: 82%; animation-delay: 200ms; }
.p4 { left: 62%; top: 26%; animation-delay: 1000ms; }
.p5 { left: 78%; top: 68%; animation-delay: 600ms; width: 3px; height: 3px; }
.p6 { left: 88%; top: 20%; animation-delay: 300ms; }
.p7 { left: 15%; top: 50%; animation-delay: 1200ms; }
.p8 { left: 70%; top: 15%; animation-delay: 900ms; width: 5px; height: 5px; }
.p9 { left: 30%; top: 88%; animation-delay: 1500ms; }
.p10 { left: 55%; top: 40%; animation-delay: 700ms; }
.p11 { left: 82%; top: 40%; animation-delay: 1100ms; }
.p12 { left: 8%; top: 80%; animation-delay: 500ms; }
.p13 { left: 92%; top: 78%; animation-delay: 1300ms; width: 3px; height: 3px; }

 /* ============ Logo stage ============ */
.splash-stage {
 transform-origin: center;
 animation: splash-finish 2400ms ease-in-out 1500ms forwards, splash-float-idle 3s ease-in-out 2400ms infinite;
 }
 @keyframes splash-finish {
 0% { transform: scale(1) translateY(0); }
 25% { transform: scale(1.03) translateY(-2px); }
 60% { transform: scale(1.0) translateY(0); }
 100% { transform: scale(1.0) translateY(0); }
 }
 @keyframes splash-float-idle {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-3px); }
 }

 /* Green square — grows from center at step 6 */
.splash-square {
 transform: scale(0);
 opacity: 0;
 animation: splash-square-in 700ms cubic-bezier(0.22, 1, 0.36, 1) 1500ms forwards;
 }
 @keyframes splash-square-in {
 0% { transform: scale(0); opacity: 0; }
 40% { opacity: 1; }
 100% { transform: scale(1); opacity: 1; }
 }

 /* Scaffolding assembly fades out as real logo takes over */
.splash-assembly {
 animation: splash-assembly-out 400ms ease-out 2100ms forwards;
 }
 @keyframes splash-assembly-out {
 from { opacity: 1; }
 to { opacity: 0; }
 }

 /* Steps — each with its own entrance */
.splash-step { opacity: 0; will-change: transform, opacity; }
.splash-step-1 {
 transform: translateY(140%);
 animation: splash-step1 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards;
 }
 @keyframes splash-step1 {
 0% { transform: translateY(140%); opacity: 0; }
 60% { opacity: 1; }
 100% { transform: translateY(0); opacity: 1; }
 }
.splash-step-2 {
 transform: translateX(160%);
 animation: splash-step2 650ms cubic-bezier(0.22, 1, 0.36, 1) 650ms forwards;
 }
 @keyframes splash-step2 {
 0% { transform: translateX(160%); opacity: 0; }
 50% { opacity: 1; }
 100% { transform: translateX(0); opacity: 1; }
 }
.splash-step-3 {
 transform: translateY(-160%);
 animation: splash-step3 650ms cubic-bezier(0.22, 1, 0.36, 1) 1050ms forwards;
 }
 @keyframes splash-step3 {
 0% { transform: translateY(-160%); opacity: 0; }
 50% { opacity: 1; }
 100% { transform: translateY(0); opacity: 1; }
 }

 /* Star: sparkle → grow → settle */
.splash-star {
 opacity: 0;
 transform: scale(0.05);
 filter: drop-shadow(0 0 8px oklch(0.85 0.14 85 / 0));
 animation: splash-star-in 900ms cubic-bezier(0.22, 1, 0.36, 1) 1400ms forwards;
 }
 @keyframes splash-star-in {
 0% { opacity: 0; transform: scale(0.05) rotate(-30deg);
 filter: drop-shadow(0 0 2px oklch(1 0 0 / 0.9)); }
 25% { opacity: 1; transform: scale(0.25) rotate(-10deg);
 filter: drop-shadow(0 0 12px oklch(1 0 0 / 0.9)); }
 70% { opacity: 1; transform: scale(1.08) rotate(3deg);
 filter: drop-shadow(0 0 14px oklch(0.85 0.14 85 / 0.7)); }
 100% { opacity: 1; transform: scale(1) rotate(0);
 filter: drop-shadow(0 0 8px oklch(0.85 0.14 85 / 0.35)); }
 }

 /* Real official logo — crossfades on top exactly when scaffolding fades */
.splash-real {
 opacity: 0;
 animation: splash-real-in 500ms ease-out 2100ms forwards;
 box-shadow:
 0 30px 60px -24px oklch(0.20 0.05 155 / 0.55),
 0 10px 24px -10px oklch(0.15 0.04 155 / 0.35);
 }
 @keyframes splash-real-in {
 from { opacity: 0; }
 to { opacity: 1; }
 }

 /* Golden light sweep — once */
.splash-sheen { opacity: 0; animation: splash-sheen-show 900ms ease-out 2700ms forwards; }
 @keyframes splash-sheen-show {
 0% { opacity: 0; }
 20% { opacity: 1; }
 100% { opacity: 0; }
 }
.splash-sheen-bar {
 position: absolute;
 top: -20%; bottom: -20%;
 left: -60%;
 width: 45%;
 background: linear-gradient(115deg,
 transparent 0%,
 oklch(1 0 0 / 0.0) 30%,
 oklch(0.95 0.14 85 / 0.55) 50%,
 oklch(1 0 0 / 0.0) 70%,
 transparent 100%);
 transform: skewX(-18deg);
 animation: splash-sheen-move 900ms ease-out 2700ms forwards;
 }
 @keyframes splash-sheen-move {
 0% { left: -60%; }
 100% { left: 140%; }
 }

 /* Golden glow pulse behind the logo */
.splash-glow {
 border-radius: 22%;
 box-shadow: 0 0 0 0 oklch(0.85 0.14 85 / 0.0);
 opacity: 0;
 animation: splash-glow 1400ms ease-out 2500ms forwards;
 }
 @keyframes splash-glow {
 0% { opacity: 0; box-shadow: 0 0 0 0 oklch(0.85 0.14 85 / 0.0); }
 40% { opacity: 1; box-shadow: 0 0 40px 6px oklch(0.85 0.14 85 / 0.35); }
 100% { opacity: 1; box-shadow: 0 0 26px 2px oklch(0.85 0.14 85 / 0.18); }
 }

 /* Final white veil fade into login */
.splash-veil {
 opacity: 0;
 animation: splash-veil-in 500ms ease-in 3000ms forwards;
 }
 @keyframes splash-veil-in {
 from { opacity: 0; }
 to { opacity: 1; }
 }

 @media (prefers-reduced-motion: reduce) {
.splash-stage,.splash-square,.splash-step,.splash-star,
.splash-real,.splash-sheen,.splash-sheen-bar,.splash-glow,
.splash-bg-wave,.splash-bg-glow,.splash-particle,.splash-veil,
.splash-assembly,.splash-bg-wash {
 animation-duration: 0.01ms!important;
 animation-iteration-count: 1!important;
 }
 }
 `}</style>
 </div>
 );
}
