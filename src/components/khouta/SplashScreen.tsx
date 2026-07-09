import { useEffect } from "react";
import logo from "@/assets/khouta-logo.asset.json";

/**
 * Khuta Splash Screen — cinematic assembly using the OFFICIAL logo image.
 *
 * No shapes are redrawn. Four clipped copies of the untouched official
 * logo (`khouta-logo.asset.json`) slide into place — bottom step, middle
 * step, top step, star — reconstructing the logo tile-by-tile. A final
 * un-clipped copy then fades on top to seal any seams. After assembly the
 * completed logo gently scales down ~8% to find its final resting place,
 * holds for ~4s with a subtle floating motion and soft golden glow, then
 * smoothly fades to the Login screen.
 *
 * Timeline (ms):
 *   0     background waves + particles
 *   400   bottom step slides up
 *   1000  middle step slides in from the right
 *   1600  top step drops from above
 *   2200  star sparkles in (top-right)
 *   2900  full official logo fades on top (seals seams)
 *   3300  shimmer sweep + soft golden glow
 *   3600  logo gently scales down to 0.92 (finds its resting position)
 *   4200  ── HOLD ── subtle float + soft glow
 *   8200  fade-to-white veil begins
 *   8900  onDone()  (parent fades to Login)
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 8900);
    return () => clearTimeout(t);
  }, [onDone]);

  // Logo box size (px).
  const S = 184;

  // Clip regions for each "piece" of the official logo image.
  // Values are inset(top right bottom left) as percentages of the image.
  // Tuned to the Khuta logo layout: three stacked gold steps + a star
  // in the upper-right. Each tile shows a rectangular slice of the real
  // logo, so nothing is redrawn.
  const tiles = [
    { name: "step-bottom", inset: "58% 6% 6% 6%",  from: "translateY(60px)",  delay: 400  },
    { name: "step-middle", inset: "38% 20% 42% 6%", from: "translateX(70px)", delay: 1000 },
    { name: "step-top",    inset: "18% 34% 62% 6%", from: "translateY(-60px)", delay: 1600 },
    { name: "star",        inset: "6% 6% 62% 60%", from: "scale(0.2) rotate(-25deg)", delay: 2200 },
  ];

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
        <div className="splash-stage relative" style={{ width: S, height: S }}>
          {/* Inner layer handles the subtle floating motion so the parent
              can scale independently without transform conflicts. */}
          <div className="splash-stage-inner absolute inset-0">
            {/* Assembled tiles — each is a clipped copy of the REAL logo */}
          {tiles.map((t) => (
            <img
              key={t.name}
              src={logo.url}
              alt=""
              width={S}
              height={S}
              draggable={false}
              className={`splash-tile splash-tile-${t.name} absolute inset-0 select-none`}
              style={{
                width: S,
                height: S,
                borderRadius: "22%",
                clipPath: `inset(${t.inset} round 22%)`,
                WebkitClipPath: `inset(${t.inset} round 22%)`,
                // @ts-expect-error CSS custom props
                "--from": t.from,
                "--delay": `${t.delay}ms`,
              }}
              aria-hidden
            />
          ))}

          {/* Final untouched official logo — seals any seams */}
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
          animation: splash-wash 8s ease-in-out infinite alternate;
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
          animation: splash-wave 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .splash-bg-wave-1 {
          width: 440px; height: 440px;
          left: -130px; top: -90px;
          background: radial-gradient(circle, oklch(0.85 0.10 155 / 0.55), transparent 70%);
          animation-delay: 0ms;
        }
        .splash-bg-wave-2 {
          width: 380px; height: 380px;
          right: -110px; bottom: -70px;
          background: radial-gradient(circle, oklch(0.88 0.08 155 / 0.50), transparent 70%);
          animation-delay: 250ms;
        }
        .splash-bg-wave-3 {
          width: 320px; height: 320px;
          right: -90px; top: 20%;
          background: radial-gradient(circle, oklch(0.92 0.06 155 / 0.40), transparent 70%);
          animation-delay: 500ms;
        }
        @keyframes splash-wave {
          0%   { opacity: 0; transform: scale(0.85); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1.08) translate(4px, -4px); }
        }

        .splash-bg-glow {
          position: absolute; inset: 0;
          background: radial-gradient(60% 45% at 50% 55%,
            oklch(0.98 0.02 155 / 0.9) 0%,
            oklch(0.96 0.03 155 / 0.5) 40%,
            transparent 75%);
          animation: splash-glow-pulse 5s ease-in-out infinite;
        }
        @keyframes splash-glow-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
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
          animation: splash-float 7s ease-in-out infinite;
        }
        @keyframes splash-float {
          0%   { opacity: 0; transform: translate3d(0,20px,0) scale(0.6); }
          20%  { opacity: 0.9; }
          80%  { opacity: 0.7; }
          100% { opacity: 0; transform: translate3d(0,-46px,0) scale(1.1); }
        }
        .p0  { left: 10%; top: 22%; animation-delay: 0ms;   width: 3px; height: 3px; }
        .p1  { left: 22%; top: 70%; animation-delay: 500ms; }
        .p2  { left: 35%; top: 18%; animation-delay: 900ms; width: 5px; height: 5px; }
        .p3  { left: 48%; top: 82%; animation-delay: 300ms; }
        .p4  { left: 62%; top: 26%; animation-delay: 1100ms; }
        .p5  { left: 78%; top: 68%; animation-delay: 700ms; width: 3px; height: 3px; }
        .p6  { left: 88%; top: 20%; animation-delay: 400ms; }
        .p7  { left: 15%; top: 50%; animation-delay: 1400ms; }
        .p8  { left: 70%; top: 15%; animation-delay: 1000ms; width: 5px; height: 5px; }
        .p9  { left: 30%; top: 88%; animation-delay: 1700ms; }
        .p10 { left: 55%; top: 40%; animation-delay: 800ms; }
        .p11 { left: 82%; top: 40%; animation-delay: 1300ms; }
        .p12 { left: 8%;  top: 80%; animation-delay: 600ms; }
        .p13 { left: 92%; top: 78%; animation-delay: 1500ms; width: 3px; height: 3px; }

        /* ============ Logo stage ============ */
        .splash-stage {
          transform-origin: center;
          animation: splash-float-idle 4s ease-in-out 3400ms infinite;
        }
        @keyframes splash-float-idle {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }

        /* ============ Assembled tiles (real logo, clipped) ============ */
        .splash-tile {
          opacity: 0;
          transform: var(--from);
          filter: drop-shadow(0 12px 24px oklch(0.20 0.05 155 / 0.35));
          will-change: transform, opacity;
          animation: splash-tile-in 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--delay) forwards;
        }
        @keyframes splash-tile-in {
          0%   { opacity: 0; transform: var(--from); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0,0) scale(1) rotate(0); }
        }
        .splash-tile-star {
          animation-duration: 1100ms;
          filter: drop-shadow(0 0 14px oklch(0.85 0.14 85 / 0.55));
        }

        /* Final untouched official logo — fades on top after all tiles land */
        .splash-real {
          opacity: 0;
          animation: splash-real-in 700ms ease-out 2900ms forwards;
          box-shadow:
            0 30px 60px -24px oklch(0.20 0.05 155 / 0.55),
            0 10px 24px -10px oklch(0.15 0.04 155 / 0.35);
        }
        @keyframes splash-real-in {
          from { opacity: 0; transform: scale(0.985); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Golden light sweep — once, across the completed logo */
        .splash-sheen { opacity: 0; animation: splash-sheen-show 1100ms ease-out 3300ms forwards; }
        @keyframes splash-sheen-show {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
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
          animation: splash-sheen-move 1100ms ease-out 3300ms forwards;
        }
        @keyframes splash-sheen-move {
          0%   { left: -60%; }
          100% { left: 140%; }
        }

        /* Soft golden glow pulse behind/around the completed logo */
        .splash-glow {
          border-radius: 22%;
          opacity: 0;
          animation: splash-glow 1600ms ease-out 3100ms forwards;
        }
        @keyframes splash-glow {
          0%   { opacity: 0; box-shadow: 0 0 0 0 oklch(0.85 0.14 85 / 0.0); }
          40%  { opacity: 1; box-shadow: 0 0 40px 6px oklch(0.85 0.14 85 / 0.35); }
          100% { opacity: 1; box-shadow: 0 0 26px 2px oklch(0.85 0.14 85 / 0.18); }
        }

        /* Final white veil fade — starts AFTER the 3s hold */
        .splash-veil {
          opacity: 0;
          animation: splash-veil-in 700ms ease-in 5900ms forwards;
        }
        @keyframes splash-veil-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-stage, .splash-tile, .splash-real,
          .splash-sheen, .splash-sheen-bar, .splash-glow,
          .splash-bg-wave, .splash-bg-glow, .splash-particle, .splash-veil,
          .splash-bg-wash {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
