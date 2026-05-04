// components/Logo.tsx — Reusable LifeYvelines brand logo
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
}

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-4 h-4", life: "text-sm", yvelines: "text-[9px]" },
    md: { icon: "w-4 h-4", life: "text-lg", yvelines: "text-[10px]" },
    lg: { icon: "w-4 h-7", life: "text-xl", yvelines: "text-[11px]" },
  }
  const s = sizes[size]

  const content = (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <img 
        src="/logo2.png" 
        alt="Life Icon" 
        className={`${s.icon} object-contain flex-shrink-0 mb-0`}
      />
      <span className="flex items-baseline gap-0.5 tracking-tight">
        <span className={`${s.life} font-bold`}
        style={{ letterSpacing: "0.03em", fontSize: "1.7em", color: 'var(--text-primary)' }}
        >Life</span>
        {/* <span
          className={`${s.yvelines} font-semibold`}
          style={{ color: "#FF2D55", letterSpacing: "0.01em" }}
        >Yvelines</span> */}
      </span>
    </span>
  )

  if (!href) return content
  return <Link href={href}>{content}</Link>
}
{/* <span
          className={`${s.life} font-bold text-white lowercase tracking-tighter`}
          style={{ fontFamily: "var(--font-fredoka), sans-serif", letterSpacing: "0.05em", fontSize: "1.7em" }}
        >life</span>
        <span
          className={`${s.yvelines} font-semibold`}
          style={{ color: "#FF2D55", letterSpacing: "0.03em" ,fontFamily: "var(--font-fredoka), sans-serif"}}
        >Yvelines</span>
      </span> */}