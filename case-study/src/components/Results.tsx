import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Users,
  CheckCircle2,
  Award,
  Heart
} from 'lucide-react'

const Results = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const metrics = [
    {
      icon: TrendingDown,
      label: 'No-Show Rate',
      before: '40%',
      after: '~17%',
      improvement: '57% improvement',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Staff Time on Follow-up',
      before: '5-10 hrs/week',
      after: '0 hrs/week',
      improvement: '100% reduction',
      color: 'text-green-600'
    },
    {
      icon: DollarSign,
      label: 'Annual Cost Savings',
      before: '$0',
      after: '$7,800-15,600',
      improvement: 'Direct savings',
      color: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Clients Retained',
      before: '~40 lost/month',
      after: 'Near zero',
      improvement: 'Dramatic improvement',
      color: 'text-green-600'
    },
  ]

  const qualitative = [
    'Staff can focus on client care instead of admin',
    'No clients lost due to missed follow-ups',
    'Professional image with branded, consistent emails',
    'Scalable as center grows',
    'Full data ownership and privacy',
    'Zero ongoing software costs',
  ]

  return (
    <section 
      id="results"
      ref={ref}
      className="py-20 sm:py-28 lg:py-36 bg-charcoal"
      aria-labelledby="results-heading"
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
            Results & Impact
          </span>
          <h2 
            id="results-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mist mb-6"
          >
            Transformation in Numbers
          </h2>
          <p className="text-lg text-mist-400 max-w-3xl mx-auto leading-relaxed">
            The impact of automation on the Cleveland LGBTQ Center's operations and client outcomes.
          </p>
        </motion.div>

        {/* Before/After metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-charcoal-600 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-orange" aria-hidden="true" />
                </div>
                <span className="text-mist font-medium">{metric.label}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-charcoal-700 rounded-xl p-4">
                  <div className="text-mist-400 text-xs uppercase tracking-wider mb-1">Before</div>
                  <div className="text-xl sm:text-2xl font-bold text-mist-300">{metric.before}</div>
                </div>
                <div className="bg-orange/10 rounded-xl p-4 border border-orange/20">
                  <div className="text-orange text-xs uppercase tracking-wider mb-1">After</div>
                  <div className="text-xl sm:text-2xl font-bold text-orange">{metric.after}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400" aria-hidden="true" />
                <span className="text-green-400 text-sm font-medium">{metric.improvement}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Qualitative benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-mist rounded-2xl p-8 sm:p-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-orange" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-charcoal">Additional Benefits</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualitative.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-charcoal-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange/10 border border-orange/20">
            <Heart className="w-5 h-5 text-orange" aria-hidden="true" />
            <span className="text-orange font-medium">
              "Nonprofits deserve the same quality technology as Fortune 500s."
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Results
