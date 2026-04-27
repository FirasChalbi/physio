"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
    images: string[]
    alt?: string
    className?: string
    showDots?: boolean
    showArrows?: boolean
}

export default function ImageCarousel({
    images,
    alt = "",
    className = "w-full h-full object-cover",
    showDots = true,
    showArrows = true,
}: ImageCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
    const isDragging = useRef(false)
    const pointerStart = useRef({ x: 0, y: 0 })

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on("select", onSelect)
        onSelect()
    }, [emblaApi, onSelect])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        pointerStart.current = { x: e.clientX, y: e.clientY }
        isDragging.current = false
    }, [])

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        const dx = Math.abs(e.clientX - pointerStart.current.x)
        const dy = Math.abs(e.clientY - pointerStart.current.y)
        if (dx > 5 || dy > 5) {
            isDragging.current = true
        }
    }, [])

    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        if (isDragging.current) {
            e.preventDefault()
            e.stopPropagation()
            isDragging.current = false
        }
    }, [])

    const scrollPrev = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            emblaApi?.scrollPrev()
        },
        [emblaApi]
    )

    const scrollNext = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            emblaApi?.scrollNext()
        },
        [emblaApi]
    )

    const scrollTo = useCallback(
        (index: number) => (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            emblaApi?.scrollTo(index)
        },
        [emblaApi]
    )

    // Single image — no carousel needed
    if (images.length <= 1) {
        return (
            <img
                src={images[0] || ""}
                alt={alt}
                className={className}
            />
        )
    }

    return (
        <div className="relative w-full h-full overflow-hidden group" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onClickCapture={handleContainerClick}>
            <div ref={emblaRef} className="overflow-hidden w-full h-full">
                <div className="flex h-full">
                    {images.map((src, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                            <img
                                src={src}
                                alt={`${alt} ${i + 1}`}
                                className={className}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next arrows */}
            {showArrows && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {showDots && scrollSnaps.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {scrollSnaps.map((_, i) => (
                        <button
                            key={i}
                            onClick={scrollTo(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                i === selectedIndex
                                    ? "bg-white w-3"
                                    : "bg-white/50 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
