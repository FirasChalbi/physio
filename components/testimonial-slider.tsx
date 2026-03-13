"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sophie Laurent",
    text: "J'ai lutté contre une peau terne et fatiguée pendant des années, mais ces soins ont tout changé. Ma peau est propre, douce et hydratée toute la journée. Mon visage rayonne littéralement sans aucun maquillage. C'est un vrai moment de soin pour soi — je ne le recommanderai jamais assez !",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Amelia Thompson",
    text: "I've Struggled With Dull, Tired-Looking Skin For Years, But This Skincare Line Changed Everything. The Cleanser And Serum Combo Make My Skin Feel Clean, Soft, And Hydrated All Day. My Face Literally Glows Now Without Any Makeup. It Feels Like Real Self-Care In A Bottle — I Can't Recommend It Enough!",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Clara Dubois",
    text: "Le soin signature est une pure merveille. Je suis ressortie complètement détendue avec un teint éclatant. Le diagnostic de peau préalable montre vraiment leur professionnalisme et leur expertise.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  }
]

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(1)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const getPreviousIndex = () => (currentIndex - 1 + testimonials.length) % testimonials.length
  const getNextIndex = () => (currentIndex + 1) % testimonials.length

  const activeTestimonial = testimonials[currentIndex]
  const prevTestimonial = testimonials[getPreviousIndex()]
  const nextTestimonial = testimonials[getNextIndex()]

  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
        {/* Avatars */}
        <div className="relative flex justify-center items-center h-28 mb-8 w-full max-w-xs">
          {/* Previous Avatar */}
          <div className="absolute left-[5%] w-[4.5rem] h-[4.5rem] rounded-full overflow-hidden opacity-90 transition-all duration-300 z-0">
            <img src={prevTestimonial.image} alt="Previous" className="w-full h-full object-cover" />
          </div>
          
          {/* Active Avatar */}
          <div className="w-[6.5rem] h-[6.5rem] rounded-full overflow-hidden border-[3px] p-[2px] transition-all duration-300 relative z-10 bg-white" style={{ borderColor: '#ff2c92' }}>
            <img src={activeTestimonial.image} alt={activeTestimonial.name} className="w-full h-full object-cover rounded-full" />
          </div>

          {/* Next Avatar */}
          <div className="absolute right-[5%] w-[4.5rem] h-[4.5rem] rounded-full overflow-hidden opacity-90 transition-all duration-300 z-0">
            <img src={nextTestimonial.image} alt="Next" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name & Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-8 space-y-4 sm:space-y-0 relative">
          
          {/* Prev Button */}
          <button 
            onClick={prev}
            className="flex items-center gap-2 border border-gray-100 rounded-full py-1.5 pl-1.5 pr-4 hover:shadow-md transition-all bg-white z-10 hidden sm:flex"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-800 text-sm">Prev</span>
          </button>

          {/* Name */}
          <h3 className="text-2xl font-bold text-gray-900 w-full text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 pointer-events-none" style={{ fontFamily: 'Georgia, serif' }}>
            {activeTestimonial.name}
          </h3>

          {/* Next Button */}
          <button 
            onClick={next}
            className="flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 hover:opacity-90 transition-all z-10 hidden sm:flex"
            style={{ backgroundColor: '#ff2c92', boxShadow: '0 4px 14px rgba(255, 44, 146, 0.3)' }}
          >
            <span className="font-medium text-white text-sm">Next</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <ChevronRight className="w-5 h-5 text-[#ff2c92]" />
            </div>
          </button>
        </div>

        {/* Mobile Buttons (shown under name on small screens) */}
        <div className="flex w-full justify-center gap-8 sm:hidden mb-6 px-4">
          <button 
            onClick={prev}
            className="flex items-center gap-2 border border-gray-100 rounded-full py-1.5 pl-1.5 pr-4 hover:shadow-md transition-all bg-white"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-800 text-xs">Prev</span>
          </button>
          
          <button 
            onClick={next}
            className="flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 hover:opacity-90 transition-all"
            style={{ backgroundColor: '#ff2c92', boxShadow: '0 4px 14px rgba(255, 44, 146, 0.3)' }}
          >
            <span className="font-medium text-white text-xs">Next</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <ChevronRight className="w-5 h-5 text-[#ff2c92]" />
            </div>
          </button>
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-500 italic text-center text-[17px] md:text-lg leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: 'Georgia, serif' }}>
          "{activeTestimonial.text}"
        </p>
        
        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
          ))}
        </div>

      </div>
    </div>
  )
}
