import logo from "@/assets/khouta-logo.asset.json";

export function KhoutaLogo({ size = 88, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logo.url}
      alt="خُطى"
      width={size}
      height={size}
      className={`rounded-[22%] shadow-lg select-none ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow:
          "0 20px 40px -18px oklch(0.20 0.05 155 / 0.55), 0 6px 12px -6px oklch(0.15 0.04 155 / 0.35)",
      }}
      draggable={false}
    />
  );
}
