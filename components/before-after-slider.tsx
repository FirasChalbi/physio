'use client'

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  beforeClass?: string
  afterClass?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'AVANT',
  afterLabel = 'APRÈS',
  beforeClass = '',
  afterClass = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(2, Math.min(98, (x / rect.width) * 100))
    setSliderPosition(percent)
  }

  const handleInteractionStart = (e: MouseEvent | TouchEvent) => {
    setIsDragging(true)
    if ('touches' in e) {
      handleMove(e.touches[0].clientX)
    } else {
      handleMove((e as MouseEvent).clientX)
    }
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) handleMove(e.clientX)
    }
    const handleGlobalTouchMove = (e: globalThis.TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX)
    }
    const handleGlobalMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true })
      window.addEventListener('mouseup', handleGlobalMouseUp)
      window.addEventListener('touchend', handleGlobalMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none touch-none cursor-ew-resize"
      style={{ borderRadius: '20px', aspectRatio: '4/5' }}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      {/* ── AFTER image (right / background) ── */}
      <img
        src={afterImage}
        alt="Après"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none ${afterClass}`}
      />

      {/* APRÈS label — right side, always visible */}
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div
          className="flex items-center justify-center px-2 py-3 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span
            className="text-white font-bold tracking-widest text-[9px]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {afterLabel}
          </span>
        </div>
      </div>

      {/* ── BEFORE image (left / foreground, clipped) ── */}
      <img
        src={beforeImage}
        alt="Avant"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none ${beforeClass}`}
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />

      {/* AVANT label — left side, clipped with the before image */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div
          className="flex items-center justify-center px-2 py-3 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span
            className="text-white font-bold tracking-widest text-[9px]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* ── Divider line ── */}
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Thin white line */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-white/80" />

        {/* Handle pill: ◄ ► */}
        <div
          className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.30)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {/* Left chevron */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M7 1L2 6L7 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Right chevron */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M1 1L6 6L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
