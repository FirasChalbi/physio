// app/login/page.tsx
"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import Logo from "@/components/Logo"

export default function LoginPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // Prevent redirect loop: only redirect once per session
            if (!sessionStorage.getItem("loginRedirectAttempted")) {
                sessionStorage.setItem("loginRedirectAttempted", "1")
                const role = (session.user as any).role
                window.location.href = role === "admin" || role === "merchant" ? "/admin" : "/account"
            }
        } else if (status === "unauthenticated") {
            sessionStorage.removeItem("loginRedirectAttempted")
        }
    }, [status, session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError("Email ou mot de passe incorrect")
            setLoading(false)
        } else {
            window.location.href = "/admin"
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
            {/* Background effects */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(16, 185, 129, 0.05)' }} />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(6, 182, 212, 0.05)' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Logo size="lg" className="justify-center" />
                    <p className="text-[#6a6a80] mt-3 text-sm">Connectez-vous à votre compte</p>
                </div>

                {/* Form card */}
                <div className="rounded-2xl border p-6 md:p-8" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="px-4 py-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-2 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a80]" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-2 block">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a80]" />
                                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="input-dark w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6a6a80] hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <span className="text-xs text-[#6a6a80]">ou</span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    {/* Social logins */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => signIn("google", { callbackUrl: "/admin" })} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-[#a0a0b8] hover:text-white border transition-colors hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Google
                        </button>
                        <button onClick={() => signIn("facebook", { callbackUrl: "/admin" })} className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-[#a0a0b8] hover:text-white border transition-colors hover:bg-white/[0.03]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            Facebook
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#6a6a80] mt-6">
                    <Link href="/" className="text-emerald-400 hover:underline">← Retour au site</Link>
                </p>
            </div>
        </div>
    )
}
