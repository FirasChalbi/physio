// components/ImageUpload.tsx
"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label?: string
    folder?: string
    className?: string
    /** If true, shows a compact version for inline usage */
    compact?: boolean
}

export default function ImageUpload({ value, onChange, label, folder = "/Life", className = "", compact = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Veuillez sélectionner une image")
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("L'image ne doit pas dépasser 10 Mo")
            return
        }

        setUploading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", folder)
            formData.append("fileName", `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`)

            const res = await fetch("/api/imagekit-auth", { method: "POST", body: formData })
            
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Upload échoué")
            }

            const data = await res.json()
            onChange(data.url)
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'upload")
        } finally {
            setUploading(false)
        }
    }, [folder, onChange])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) uploadFile(file)
    }, [uploadFile])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadFile(file)
        // Reset to allow re-upload of same file
        e.target.value = ""
    }

    const removeImage = () => {
        onChange("")
        setError("")
    }

    if (compact) {
        return (
            <div className={className}>
                {label && <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{label}</label>}
                <div className="flex items-center gap-3">
                    {value ? (
                        <div className="relative group">
                            <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#a78bfa',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                    >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        {uploading ? "Upload..." : value ? "Changer" : "Upload"}
                    </button>
                    <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            </div>
        )
    }

    return (
        <div className={className}>
            {label && <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{label}</label>}
            
            {value ? (
                /* ── Preview ── */
                <div className="relative rounded-xl overflow-hidden border group" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <img src={value} alt="" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm transition-colors"
                            style={{ background: 'rgba(139, 92, 246, 0.7)' }}
                        >
                            {uploading ? "Upload..." : "Changer"}
                        </button>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm transition-colors"
                            style={{ background: 'rgba(239, 68, 68, 0.7)' }}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Upload zone ── */
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-8 gap-3"
                    style={{
                        borderColor: dragOver ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255,255,255,0.08)',
                        background: dragOver ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255,255,255,0.02)',
                    }}
                >
                    {uploading ? (
                        <>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                            </div>
                            <p className="text-sm text-[#a0a0b8]">Upload en cours...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                                <ImageIcon className="w-5 h-5 text-violet-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#a0a0b8]">
                                    <span className="text-violet-400 font-medium">Cliquez</span> ou glissez une image
                                </p>
                                <p className="text-xs text-[#6a6a80] mt-1">PNG, JPG, WebP • Max 10 Mo</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>
    )
}


interface MultiImageUploadProps {
    values: string[]
    onChange: (urls: string[]) => void
    label?: string
    folder?: string
    maxImages?: number
    className?: string
}

export function MultiImageUpload({ values, onChange, label, folder = "/Life", maxImages = 10, className = "" }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Veuillez sélectionner une image")
            return
        }

        setUploading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", folder)
            formData.append("fileName", `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`)

            const res = await fetch("/api/imagekit-auth", { method: "POST", body: formData })
            if (!res.ok) throw new Error("Upload échoué")
            const data = await res.json()
            onChange([...values, data.url])
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'upload")
        } finally {
            setUploading(false)
        }
    }, [folder, onChange, values])

    const removeImage = (index: number) => {
        onChange(values.filter((_, i) => i !== index))
    }

    return (
        <div className={className}>
            {label && <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{label} ({values.length}/{maxImages})</label>}
            <div className="flex flex-wrap gap-2">
                {values.map((url, i) => (
                    <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                ))}
                {values.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors hover:border-violet-400/40"
                        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                    >
                        {uploading ? <Loader2 className="w-5 h-5 text-violet-400 animate-spin" /> : <Upload className="w-5 h-5 text-[#6a6a80]" />}
                    </button>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = "" }} className="hidden" />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>
    )
}
