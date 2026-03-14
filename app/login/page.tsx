// app/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Lock, Mail, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isRegister) {
        // Register flow
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Erreur lors de l'inscription")
          return
        }

        // Auto-login after registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setSuccess("Compte créé ! Connectez-vous maintenant.")
          setIsRegister(false)
        } else {
          router.push("/account")
          router.refresh()
        }
      } else {
        // Login flow
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError("Email ou mot de passe incorrect")
        } else {
          // Fetch session to check role
          const sessionRes = await fetch("/api/auth/session")
          const session = await sessionRes.json()
          const role = session?.user?.role

          if (role === "admin" || role === "staff") {
            router.push("/admin")
          } else {
            router.push("/account")
          }
          router.refresh()
        }
      }
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setSocialLoading(provider)
    await signIn(provider, { callbackUrl: "/account" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff5f9 0%, #ffe8f3 50%, #fdf0f7 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,44,146,0.08)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,119,185,0.1)' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'rgba(255,44,146,0.04)' }} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo / Brand */}
        <Link href="/" className="block text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
              boxShadow: '0 8px 32px rgba(255,44,146,0.3)',
            }}
          >
              <Image
                src="/logo.png"
                alt="Institut Physio"
                width={90}
                height={90}
                className="w-full h-full object-cover mt-1"
              />
          </div>
          <h1
            className="text-3xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Institut Physio
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Beauté & Bien-être · Sfax</p>
        </Link>

        {/* Login / Register Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl" style={{ boxShadow: '0 20px 60px rgba(255,44,146,0.1)' }}>

          {/* Tabs */}
          <div className="flex rounded-2xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => { setIsRegister(false); setError(""); setSuccess("") }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                !isRegister
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(""); setSuccess("") }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isRegister
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Social Login */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={!!socialLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Google
            </button>
            {/* <button
              onClick={() => handleSocialLogin("facebook")}
              disabled={!!socialLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              {socialLoading === "facebook" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              Facebook
            </button> */}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">ou par email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl p-3 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl p-3 text-center">
                {success}
              </div>
            )}

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-600">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Votre nom"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#ff2c92]/50 focus:ring-2 focus:ring-[#ff2c92]/10 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#ff2c92]/50 focus:ring-2 focus:ring-[#ff2c92]/10 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-600">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#ff2c92]/50 focus:ring-2 focus:ring-[#ff2c92]/10 transition-all text-sm"
                />
              </div>
              {isRegister && (
                <p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#ff2c92]/25"
              style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isRegister ? "Création..." : "Connexion..."}
                </>
              ) : (
                isRegister ? "Créer mon compte" : "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 Institut Physio. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
