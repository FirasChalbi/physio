// components/ImageUpload.tsx — Enhanced drag-and-drop with client-side compression
"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, Image as ImageIcon, Check, Zap } from "lucide-react"

// ── Client-side image compression ──
async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<File> {
    // Skip if already small or is a gif/svg
    if (file.size < 200 * 1024 || file.type === 'image/gif' || file.type === 'image/svg+xml') return file

    return new Promise((resolve) => {
        const img = new window.Image()
        const canvas = document.createElement('canvas')
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)
            let { width, height } = img
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width)
                width = maxWidth
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    if (blob && blob.size < file.size) {
                        resolve(new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' }))
                    } else {
                        resolve(file) // Keep original if compression didn't help
                    }
                },
                'image/webp',
                quality
            )
        }
        img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
        img.src = url
    })
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label?: string
    folder?: string
    className?: string
    compact?: boolean
}

export default function ImageUpload({ value, onChange, label, folder = "/Life", className = "", compact = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState("")
    const [progress, setProgress] = useState<{ original: number; compressed: number } | null>(null)
    const [done, setDone] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Veuillez sélectionner une image")
            return
        }
        if (file.size > 15 * 1024 * 1024) {
            setError("L'image ne doit pas dépasser 15 Mo")
            return
        }

        setUploading(true)
        setError("")
        setDone(false)

        try {
            // Compress
            const originalSize = file.size
            const compressed = await compressImage(file)
            setProgress({ original: originalSize, compressed: compressed.size })

            const formData = new FormData()
            formData.append("file", compressed)
            formData.append("folder", folder)
            formData.append("fileName", `${Date.now()}-${compressed.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`)

            const res = await fetch("/api/imagekit-auth", { method: "POST", body: formData })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Upload échoué")
            }

            const data = await res.json()
            onChange(data.url)
            setDone(true)
            setTimeout(() => { setDone(false); setProgress(null) }, 2000)
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'upload")
            setProgress(null)
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
        e.target.value = ""
    }

    const removeImage = () => { onChange(""); setError(""); setProgress(null) }

    if (compact) {
        return (
            <div className={className}>
                {label && <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{label}</label>}
                <div className="flex items-center gap-3">
                    {value ? (
                        <div className="relative group">
                            <img src={value} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                            <button type="button" onClick={removeImage}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : null}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
                        style={{
                            background: dragOver ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                            color: '#a78bfa',
                            border: `1px solid ${dragOver ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
                        }}
                    >
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : done ? <Check className="w-3.5 h-3.5 text-[#FF2D55]" /> : <Upload className="w-3.5 h-3.5" />}
                        {uploading ? "Compression..." : done ? "Uploadé !" : value ? "Changer" : "Glissez ou cliquez"}
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                {progress && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <Zap className="w-3 h-3 text-violet-400" />
                        <span className="text-[10px] text-[#6a6a80]">
                            {formatFileSize(progress.original)} → {formatFileSize(progress.compressed)}
                            {progress.compressed < progress.original && (
                                <span className="text-[#FF2D55] ml-1">(-{Math.round((1 - progress.compressed / progress.original) * 100)}%)</span>
                            )}
                        </span>
                    </div>
                )}
                {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            </div>
        )
    }

    return (
        <div className={className}>
            {label && <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{label}</label>}

            {value ? (
                <div className="relative rounded-xl overflow-hidden border group" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <img src={value} alt="" className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-white backdrop-blur-sm transition-all hover:scale-105"
                            style={{ background: 'rgba(139, 92, 246, 0.8)' }}>
                            {uploading ? "Upload..." : "Changer"}
                        </button>
                        <button type="button" onClick={removeImage}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-white backdrop-blur-sm transition-all hover:scale-105"
                            style={{ background: 'rgba(239, 68, 68, 0.8)' }}>
                            Supprimer
                        </button>
                    </div>
                    {done && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-medium text-[#FF2D55] flex items-center gap-1" style={{ background: 'rgba(255,45,85,0.15)' }}>
                            <Check className="w-3 h-3" /> Uploadé
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className="relative rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-10 gap-3 group"
                    style={{
                        borderColor: dragOver ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255,255,255,0.08)',
                        background: dragOver ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                    }}
                >
                    {uploading ? (
                        <>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.12)' }}>
                                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#a0a0b8]">Compression & upload...</p>
                                {progress && (
                                    <p className="text-[10px] text-[#6a6a80] mt-1 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 text-violet-400" />
                                        {formatFileSize(progress.original)} → {formatFileSize(progress.compressed)}
                                    </p>
                                )}
                            </div>
                            {/* Animated progress bar */}
                            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', width: '70%' }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors group-hover:scale-105" style={{ background: dragOver ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }}>
                                <ImageIcon className="w-6 h-6 text-violet-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#a0a0b8]">
                                    <span className="text-violet-400 font-semibold">Glissez une image ici</span> ou cliquez pour choisir
                                </p>
                                <p className="text-xs text-[#6a6a80] mt-1">PNG, JPG, WebP • Max 15 Mo • Compression auto</p>
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
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) { setError("Veuillez sélectionner une image"); return }

        setUploading(true)
        setError("")

        try {
            const compressed = await compressImage(file)
            const formData = new FormData()
            formData.append("file", compressed)
            formData.append("folder", folder)
            formData.append("fileName", `${Date.now()}-${compressed.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`)

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

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
        if (files.length > 0) uploadFile(files[0])
    }, [uploadFile])

    const removeImage = (index: number) => onChange(values.filter((_, i) => i !== index))

    return (
        <div className={className}>
            {label && <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{label} ({values.length}/{maxImages})</label>}
            <div className="flex flex-wrap gap-2">
                {values.map((url, i) => (
                    <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                ))}
                {values.length < maxImages && (
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer hover:border-violet-400/40 gap-1"
                        style={{
                            borderColor: dragOver ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255,255,255,0.08)',
                            background: dragOver ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                        }}
                    >
                        {uploading ? <Loader2 className="w-5 h-5 text-violet-400 animate-spin" /> : (
                            <>
                                <Upload className="w-4 h-4 text-[#6a6a80]" />
                                <span className="text-[9px] text-[#6a6a80]">Ajouter</span>
                            </>
                        )}
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = "" }} className="hidden" />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>
    )
}
