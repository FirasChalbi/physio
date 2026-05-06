"use client"

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  { src: '/s1.jfif', alt: 'Promo 1' },
  { src: '/s2.jfif', alt: 'Promo 2' },
  { src: '/s3.jfif', alt: 'Promo 3' },
]

export default function PromoSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  // Auto-scroll every 4s
  useEffect(() => {
    if (!emblaApi) return
    const timer = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(timer)
  }, [emblaApi])

  return (
    <section className="px-4 mb-8">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {SLIDES.map((slide, i) => (
              <div key={i} className="flex-none w-full">
                <div className="relative  overflow-hidden rounded-2xl">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows — top right */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={scrollPrev}
            disabled={!canPrev}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-opacity disabled:opacity-30"
            style={{ background: 'rgba(0,0,0,0.35)' }}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canNext}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-opacity disabled:opacity-30"
            style={{ background: 'rgba(0,0,0,0.35)' }}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}
