"use client"

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper/types"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
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
    const swiperRef = useRef<SwiperType | null>(null)
    const wasSwiped = useRef(false)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)

    // Single image — no carousel needed
    if (images.length <= 1) {
        return <img src={images[0] || ""} alt={alt} className={className} />
    }

    return (
        <div
            className="relative w-full h-full overflow-hidden group"
            onClickCapture={(e) => {
                // Block parent <Link> navigation when user just swiped
                if (wasSwiped.current) {
                    e.preventDefault()
                    e.stopPropagation()
                    wasSwiped.current = false
                }
            }}
        >
            <Swiper
                modules={[Navigation, Pagination]}
                loop={true}
                navigation={{
                    nextEl: nextRef.current!,
                    prevEl: prevRef.current!,
                }}
                pagination={
                    showDots
                        ? { clickable: true, type: "bullets" }
                        : false
                }
                className="w-full h-full"
                style={{ touchAction: "pan-y" }}
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                onTouchEnd={() => {
                    // Mark as swiped so the subsequent click is blocked
                    if (swiperRef.current && swiperRef.current.animating) {
                        wasSwiped.current = true
                        setTimeout(() => { wasSwiped.current = false }, 200)
                    }
                }}
                onSlideChange={() => {
                    wasSwiped.current = true
                    setTimeout(() => { wasSwiped.current = false }, 200)
                }}
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i} className="overflow-hidden">
                        <img src={src} alt={`${alt} ${i + 1}`} className={className} draggable={false} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Prev / Next arrows — desktop only, visible on hover */}
            {showArrows && (
                <>
                    <button
                        ref={prevRef}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </>
            )}

        </div>
    )
}
