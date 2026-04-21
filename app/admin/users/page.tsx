// app/admin/users/page.tsx
"use client"
import { useEffect, useState } from "react"
import { Search, Users, Shield, Store, User } from "lucide-react"

type AppUser = { _id: string; name: string; email: string; role: string; active: boolean; provider?: string; createdAt?: string }

const roleConfig: Record<string, { bg: string; text: string; icon: any }> = {
    admin: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', icon: Shield },
    merchant: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', icon: Store },
    client: { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4', icon: User },
}

export default function UsersPage() {
    const [users, setUsers] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    useEffect(() => { fetch('/api/clients').then(r => r.json()).then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).filter(u => roleFilter === 'all' || u.role === roleFilter)

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-white">Utilisateurs</h1><p className="text-sm text-[#6a6a80] mt-1">{users.length} utilisateurs au total</p></div>
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><Search className="w-4 h-4 text-[#6a6a80]" /><input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" /></div>
                <div className="flex gap-2">
                    {['all', 'admin', 'merchant', 'client'].map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${roleFilter === r ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`} style={roleFilter === r ? { background: 'rgba(16, 185, 129, 0.15)' } : { background: 'rgba(255,255,255,0.04)' }}>
                            {r === 'all' ? 'Tous' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Utilisateur</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Email</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Rôle</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Provider</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th></tr></thead>
                    <tbody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={5}><div className="h-4 shimmer rounded w-48" /></td></tr>) : filtered.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucun utilisateur trouvé</td></tr> : filtered.map(u => {
                            const rc = roleConfig[u.role] || roleConfig.client
                            return (
                                <tr key={u._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    <td className="py-3.5 px-5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>{u.name[0]?.toUpperCase()}</div><span className="text-sm font-medium text-white">{u.name}</span></div></td>
                                    <td className="py-3.5 px-5 text-sm text-[#8888a0] hidden md:table-cell">{u.email}</td>
                                    <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: rc.bg, color: rc.text }}>{u.role}</span></td>
                                    <td className="py-3.5 px-5 text-sm text-[#6a6a80] capitalize hidden md:table-cell">{u.provider || 'credentials'}</td>
                                    <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={u.active !== false ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { background: 'rgba(255,255,255,0.05)', color: '#6a6a80' }}>{u.active !== false ? 'Actif' : 'Inactif'}</span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
