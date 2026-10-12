"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Mail } from "lucide-react"

type EmailContactProps = {
  email: string
  className: string
}

export default function EmailContact({ email, className }: EmailContactProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      onClick={() => { window.location.href = `mailto:${email}` }}
      className={`${className} w-full text-left`}
    >
      <Mail className="w-5 h-5 text-[#FF2D55] shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-[#6a6a80] mb-0.5">Email</p>
        <p className="text-sm" style={{ color: "var(--text-primary)" }}>
          {mounted ? email : "Envoyer un e-mail"}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#333]" />
    </button>
  )
}