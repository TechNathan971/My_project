import { motion } from 'framer-motion'
import { ShoppingBag, Star, Heart, Sparkles, Gift, Crown } from 'lucide-react'

const FloatingElements = () => {
  const elements = [
    { Icon: ShoppingBag, delay: 0, color: 'text-blue-400' },
    { Icon: Star, delay: 0.5, color: 'text-yellow-400' },
    { Icon: Heart, delay: 1, color: 'text-pink-400' },
    { Icon: Sparkles, delay: 1.5, color: 'text-purple-400' },
    { Icon: Gift, delay: 2, color: 'text-green-400' },
    { Icon: Crown, delay: 2.5, color: 'text-orange-400' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} opacity-20`}
          style={{
            left: `${10 + index * 15}%`,
            top: `${20 + (index % 3) * 30}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + index,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <element.Icon size={32} />
        </motion.div>
      ))}
      
      {/* Additional decorative elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default FloatingElements