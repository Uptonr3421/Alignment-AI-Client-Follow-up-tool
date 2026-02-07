import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Mail, 
  LayoutDashboard, 
  Settings, 
  Shield, 
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react'

const Solution = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Mail,
      title: '4-Email Sequence',
      description: 'Automated welcome, reminder, no-show follow-up, and re-engagement emails sent at optimal times.',
      details: ['Welcome (immediate)', 'Reminder (day before 9am)', 'No-show (2 hours after)', 'Re-engagement (7 days later)']
    },
    {
      icon: LayoutDashboard,
      title: 'Staff Dashboard',
      description: 'Intuitive interface to manage clients, track status, and monitor scheduled emails.',
      details: ['Client database with search', 'Status tracking', "Today's scheduled emails", 'Quick-add client form']
    },
    {
      icon: Settings,
      title: 'Template System',
      description: 'Visual editor for customizing emails with merge fields—no coding required.',
      details: ['Merge fields support', 'Visual editor', 'Live preview', 'Reset to defaults']
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'OAuth 2.0 authentication, encrypted tokens, and local data storage option.',
      details: ['OAuth 2.0 (no passwords)', 'Encrypted refresh tokens', 'Local SQLite option', 'HTTPS everywhere']
    },
  ]

  return (
    <section 
      id="solution"
      ref={ref}
      className="py-20 sm:py-28 lg:py-36 bg-white"
      aria-labelledby="solution-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-mono text-xs uppercase tracking-wider mb-4">
            The Solution
          </span>
          <h2 
            id="solution-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
          >
            Complete Automation, Zero Complexity
          </h2>
          <p className="text-lg text-charcoal-300 max-w-3xl mx-auto leading-relaxed">
            We built and delivered a complete client follow-up automation system pro bono. 
            The system runs on the center's existing Gmail account—no new subscriptions, no learning curve.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-mist rounded-2xl p-6 sm:p-8 hover:bg-mist-100 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-orange/10 flex items-center justify-center mb-5 group-hover:bg-orange/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-orange" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-3">{feature.title}</h3>
              <p className="text-charcoal-300 mb-5 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-2 text-sm text-charcoal-400">
                    <CheckCircle2 className="w-4 h-4 text-orange flex-shrink-0" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-charcoal rounded-2xl p-8 sm:p-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6 text-orange" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-mist">5-Day Delivery Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { day: 'Day 1', task: 'Research & Planning', desc: 'Architecture decisions' },
              { day: 'Day 2', task: 'Parallel Dev', desc: '4 workstreams active' },
              { day: 'Day 3', task: 'Parallel Dev', desc: 'Feature completion' },
              { day: 'Day 4', task: 'Parallel Dev', desc: 'Integration begins' },
              { day: 'Day 5', task: 'Delivery', desc: 'Testing & packaging' },
            ].map((item, index) => (
              <div 
                key={item.day}
                className="relative bg-charcoal-600 rounded-xl p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange" aria-hidden="true" />
                  <span className="text-orange font-mono text-sm font-medium">{item.day}</span>
                </div>
                <div className="text-mist font-medium text-sm mb-1">{item.task}</div>
                <div className="text-mist-400 text-xs">{item.desc}</div>
                {index < 4 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 w-4 h-px bg-orange/30" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Solution
