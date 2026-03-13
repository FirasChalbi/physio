"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from 'lucide-react'

interface AnimatedHeartProps {
  isLiked: boolean
  onClick: () => void
}

export default function AnimatedHeart({ isLiked, onClick }: AnimatedHeartProps) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.8 }}
        className="text-white hover:scale-110 transition-transform relative z-10 bg-black/10 backdrop-blur-xs p-1 rounded-full hover:bg-black/50"
      >
        <motion.div
          key={`heart-main-${Date.now()}`}
          animate={{
            scale: [1, 1.3, 1],
            transition: { duration: 0.4 }
          }}
        >
          <Heart
            className="w-6 h-6 fill-red-500 text-red-500"
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        <div className="absolute pointer-events-none" key={`hearts-container-${Date.now()}`}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`heart-${i}-${Date.now()}`}
              initial={{ 
                scale: 0,
                x: 0,
                y: 0,
                opacity: 1
              }}
              animate={{ 
                scale: [0, 1, 0],
                x: Math.cos(i * 45 * (Math.PI / 180)) * 30,
                y: Math.sin(i * 45 * (Math.PI / 180)) * -30 - 10,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                times: [0, 0.4, 1]
              }}
              className="absolute top-0 left-0"
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
