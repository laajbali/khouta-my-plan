export function KhoutaLogo({ size = 88 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-3xl shadow-lg"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(145deg, oklch(0.28 0.05 155), oklch(0.18 0.04 155))",
      }}
    >
      {/* Gold sparkle */}
      <svg
        className="absolute top-2 left-2"
        width={size * 0.18}
        height={size * 0.18}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"
          fill="var(--gold)"
        />
      </svg>
      {/* Stylized stair "steps" mark */}
      <svg viewBox="0 0 48 48" width={size * 0.55} height={size * 0.55} fill="none">
        <rect x="8" y="30" width="14" height="6" rx="2" fill="var(--gold)" />
        <rect x="14" y="22" width="18" height="6" rx="2" fill="var(--gold)" />
        <rect x="20" y="14" width="20" height="6" rx="2" fill="var(--gold)" />
      </svg>
    </div>
  );
}
