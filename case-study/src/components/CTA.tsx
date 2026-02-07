import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Phone, Mail, Calendar } from 'lucide-react'

const CTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      id="contact"
      ref={ref}
      className="py-20 sm:py-28 lg:py-36 bg-orange"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 
            id="cta-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Automate Your Mission?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you're a nonprofit seeking pro bono support or a business looking to streamline operations, 
            we bring the same dedication and expertise to every project.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="mailto:hello@alignment-ai.io"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange rounded-xl font-semibold hover:bg-mist transition-colors duration-200 touch-target w-full sm:w-auto justify-center"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>Get in Touch</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="tel:216-200-7861"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-700 text-white rounded-xl font-semibold hover:bg-orange-800 transition-colors duration-200 touch-target w-full sm:w-auto justify-center border border-white/20"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-white/80">
            <a 
              href="tel:216-200-7861" 
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono">216-200-7861</span>
            </a>
            <a 
              href="mailto:hello@alignment-ai.io" 
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono">hello@alignment-ai.io</span>
            </a>
            <a 
              href="https://alignment-ai.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>alignment-ai.io</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
