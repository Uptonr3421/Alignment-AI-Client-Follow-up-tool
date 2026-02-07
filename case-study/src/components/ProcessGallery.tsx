import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
  caption: string
  description: string
}

const ProcessGallery = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images: GalleryImage[] = [
    {
      src: '/assets/1-taking-the-models-advice-good-alignment-islknowing-your-strengths-and-trusting-theres-when-appropriate.jpg',
      alt: 'Taking the model\'s advice',
      caption: 'Trusting the Tools',
      description: 'Asking the model architectural questions and deferring to its expertise. Alignment is knowing when to step back and trust your tools.'
    },
    {
      src: '/assets/2-stepping-in.jpg',
      alt: 'Stepping in',
      caption: 'Human Oversight',
      description: 'When the model gets overzealous and overlooks key foundations, we immediately intervene to reground the process.'
    },
    {
      src: '/assets/3-agentic-autoheal-technology-deployed-on-the-fly.jpg',
      alt: 'Agentic autoheal',
      caption: 'Autoheal Technology',
      description: 'Guardrails installed on the fly: if one agent goes down, the orchestrator stops the others, repairs the faulty agent, and resumes—all automatically.'
    },
    {
      src: '/assets/4-inviting-agent-swam-to-elevate-work-quality-and-installation-ease-and-stability.jpg',
      alt: 'Inviting elevation',
      caption: 'Elevating Quality',
      description: 'Spotting bare-minimum output and inviting the agents to elevate their work. Quality is non-negotiable.'
    },
    {
      src: '/assets/4_developers_1_Goal.jpg',
      alt: 'Four developers one goal',
      caption: 'Parallel Development',
      description: 'Four simultaneous workstreams: Backend API, Frontend UI, Gmail Service, and Documentation—all converging on a single goal.'
    },
    {
      src: '/assets/5-getting-called-out-for-not-keeping-up-as-a-human.jpg',
      alt: 'Getting called out',
      caption: 'Accountability Goes Both Ways',
      description: 'The orchestrator calls out the human when tasks fall behind. The foreman of the construction site is tough on everyone—including me.'
    },
    {
      src: '/assets/6-The_Human_In_the_loop_difference_catch_claude_making_a_huge_error_mistaking_a_vital_fallback_connection_for_software_with_a_hallucinated_feature.jpg',
      alt: 'Human in the loop',
      caption: 'Catching Hallucinations',
      description: 'Experience matters: spotting when Claude outputs results without making the required tool call. Human oversight catches what others miss.'
    },
    {
      src: '/assets/7-claude_back_on_track!!.jpg',
      alt: 'Claude back on track',
      caption: 'Course Correction',
      description: 'After being called out, Claude quickly gets back on track with the correct approach.'
    },
    {
      src: '/assets/8-claude_scipting_the_cleanup_with_loyalty.jpg',
      alt: 'Claude scripting cleanup',
      caption: 'AI Loyalty & Role Buy-in',
      description: 'AI agents thrive with clear roles and purpose. Give them something to rally around, and they deliver with surprising dedication.'
    },
    {
      src: '/assets/Paralel_Agents.jpg',
      alt: 'Parallel agents',
      caption: 'Orchestrated Parallelism',
      description: 'Multiple agents working in concert, each with focused responsibilities, coordinated by a central orchestrator.'
    },
    {
      src: '/assets/Onward!!.jpg',
      alt: 'Onward',
      caption: 'Forward Momentum',
      description: 'The rally cry that keeps the team moving through challenges toward delivery.'
    },
    {
      src: '/assets/Agent_standards_briefing.jpg',
      alt: 'Agent standards briefing',
      caption: 'Setting Standards',
      description: 'Establishing clear quality benchmarks and expectations before work begins.'
    },
  ]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <section 
      id="process"
      ref={ref}
      className="py-20 sm:py-28 lg:py-36 bg-mist"
      aria-labelledby="process-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-charcoal/5 text-charcoal-400 font-mono text-xs uppercase tracking-wider mb-4">
            Behind the Scenes
          </span>
          <h2 
            id="process-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
          >
            The Build Process
          </h2>
          <p className="text-lg text-charcoal-300 max-w-3xl mx-auto leading-relaxed">
            A glimpse into how we built this system—parallel agents, human oversight, 
            and the moments that make AI development both challenging and rewarding.
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-[4/3] bg-charcoal-100 rounded-xl overflow-hidden cursor-pointer touch-target"
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              role="button"
              tabIndex={0}
              aria-label={`View ${image.caption} in full size`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-mist font-medium text-sm">{image.caption}</p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-mist/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-4 h-4 text-charcoal" aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-sm"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            tabIndex={-1}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-mist/10 hover:bg-mist/20 flex items-center justify-center text-mist transition-colors duration-200 touch-target"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-mist/10 hover:bg-mist/20 flex items-center justify-center text-mist transition-colors duration-200 touch-target"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-mist/10 hover:bg-mist/20 flex items-center justify-center text-mist transition-colors duration-200 touch-target"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-16">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
              </motion.div>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-mist mb-2">
                  {images[currentIndex].caption}
                </h3>
                <p className="text-sm sm:text-base text-mist-400">
                  {images[currentIndex].description}
                </p>
                <p className="text-xs text-mist-500 mt-3 font-mono">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProcessGallery
