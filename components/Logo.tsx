// components/Logo.tsx — Reusable LifeYvelines brand logo
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
}

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-5 h-4", life: "text-sm", yvelines: "text-[9px]" },
    md: { icon: "w-6 h-6", life: "text-lg", yvelines: "text-[10px]" },
    lg: { icon: "w-8 h-8", life: "text-xl", yvelines: "text-[11px]" },
  }
  const s = sizes[size]

  const content = (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <img 
        src="/logo-icon.png" 
        alt="Life Icon" 
        className={`${s.icon} object-contain flex-shrink-0`}
      />
      <span className="flex items-baseline gap-0.5 tracking-tight">
        <span className={`${s.life} font-bold text-white`}>Life</span>
        <span
          className={`${s.yvelines} font-semibold`}
          style={{ color: "#10b981", letterSpacing: "0.01em" }}
        >Yvelines</span>
      </span>
    </span>
  )

  if (!href) return content
  return <Link href={href}>{content}</Link>
}
