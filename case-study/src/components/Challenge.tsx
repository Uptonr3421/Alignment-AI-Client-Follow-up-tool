import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Clock, AlertTriangle, HeartCrack } from 'lucide-react'

const Challenge = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Users, value: '40%', label: 'Client Drop-off Rate', description: 'Between intake and first appointment' },
    { icon: Clock, value: '5-10hrs', label: 'Weekly Manual Work', description: 'Staff time on email follow-ups' },
    { icon: AlertTriangle, value: '~40', label: 'Clients Lost Monthly', description: 'Due to follow-up gaps' },
    { icon: HeartCrack, value: '4x', label: 'Higher Risk', description: 'LGBTQ+ youth suicide attempts' },
  ]

  return (
    <section 
      id="challenge"
      ref={ref}
      className="py-20 sm:py-28 lg:py-36 bg-mist"
      aria-labelledby="challenge-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-charcoal/5 text-charcoal-400 font-mono text-xs uppercase tracking-wider mb-4">
            The Challenge
          </span>
          <h2 
            id="challenge-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
          >
            A Critical Gap in Client Care
          </h2>
          <p className="text-lg text-charcoal-300 max-w-3xl mx-auto leading-relaxed">
            The Cleveland LGBTQ Center faced a heartbreaking reality: 40% of vulnerable clients 
            never made it from intake to their first appointment—not because they didn't need help, 
            but because follow-up fell through the cracks.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-mist-300 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-orange" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-charcoal mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-charcoal mb-1">{stat.label}</div>
              <div className="text-xs text-charcoal-400">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-charcoal rounded-2xl p-8 sm:p-12 text-center"
        >
          <div className="absolute top-6 left-8 text-6xl text-orange/20 font-serif">"</div>
          <p className="relative z-10 text-lg sm:text-xl text-mist italic leading-relaxed max-w-3xl mx-auto">
            We're a small team. We were spending hours every week on manual outreach, 
            and still losing people through the gaps.
          </p>
          <footer className="mt-6 text-mist-400 text-sm">
            — Program Director, Cleveland LGBTQ Center
          </footer>
        </motion.blockquote>

        {/* The stakes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-semibold text-charcoal mb-4">The Stakes</h3>
          <p className="text-charcoal-300 max-w-2xl mx-auto">
            For LGBTQ+ youth seeking mental health support, timely intervention is literally life-saving. 
            Every client lost to follow-up gaps is someone who needed help and didn't receive it.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Challenge
