import { motion } from 'framer-motion'
import { Heart, ArrowDown, Sparkles } from 'lucide-react'

const Hero = () => {
  const scrollToContent = () => {
    document.getElementById('challenge')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal"
      aria-label="Case study hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-600 to-charcoal-700" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E6511A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-orange/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-orange" aria-hidden="true" />
          <span className="text-orange font-mono text-sm uppercase tracking-wider">Pro Bono Project</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-mist mb-6 leading-tight"
        >
          <span className="block">No One Falls</span>
          <span className="block text-orange">Through the Cracks</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-mist-400 max-w-3xl mx-auto mb-4 font-light"
        >
          How we built a client follow-up automation system for the Cleveland LGBTQ Center
        </motion.p>

        {/* Impact metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-10 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange">57%</div>
            <div className="text-sm text-mist-400 mt-1 font-mono uppercase tracking-wide">No-Show Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange">5-10hrs</div>
            <div className="text-sm text-mist-400 mt-1 font-mono uppercase tracking-wide">Weekly Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange">$0</div>
            <div className="text-sm text-mist-400 mt-1 font-mono uppercase tracking-wide">Cost to Center</div>
          </div>
        </motion.div>

        {/* Client badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-mist/5 border border-mist/10"
        >
          <Heart className="w-5 h-5 text-orange" aria-hidden="true" />
          <span className="text-mist text-sm sm:text-base">
            <span className="text-mist-400">Client:</span>{' '}
            <span className="font-medium">Cleveland LGBTQ Center</span>
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mist-400 hover:text-orange transition-colors duration-300 touch-target flex flex-col items-center gap-2"
        aria-label="Scroll to case study content"
      >
        <span className="text-xs font-mono uppercase tracking-wider">Read the Story</span>
        <ArrowDown className="w-5 h-5 animate-bounce" aria-hidden="true" />
      </motion.button>
    </section>
  )
}

export default Hero
