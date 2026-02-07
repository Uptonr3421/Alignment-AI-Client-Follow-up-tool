import { Heart, Code2, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal-800 py-12 sm:py-16" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-mist">Alignment AI</span>
            </div>
            <p className="text-mist-400 text-sm leading-relaxed">
              Building mission-critical automation for nonprofits and businesses. 
              Cleveland-based, globally minded.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-mist font-semibold mb-4">Case Study Sections</h3>
            <ul className="space-y-2">
              {[
                { label: 'The Challenge', href: '#challenge' },
                { label: 'The Solution', href: '#solution' },
                { label: 'Build Process', href: '#process' },
                { label: 'Technical Details', href: '#technical' },
                { label: 'Results', href: '#results' },
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-mist-400 hover:text-orange transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Credentials */}
          <div>
            <h3 className="text-mist font-semibold mb-4">Credentials</h3>
            <ul className="space-y-2 text-sm text-mist-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange" aria-hidden="true" />
                NGLCC Certified LGBTBE
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange" aria-hidden="true" />
                6+ years AI/automation experience
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange" aria-hidden="true" />
                Amazon #1 bestselling author
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange" aria-hidden="true" />
                Based in Cleveland, Ohio
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-charcoal-600 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-mist-400 text-sm text-center sm:text-left">
              © {currentYear} Alignment AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-mist-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-orange fill-orange" aria-hidden="true" />
              <span>in Cleveland</span>
            </div>
            <a 
              href="https://alignment-ai.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-mist-400 hover:text-orange transition-colors duration-200 text-sm"
            >
              alignment-ai.io
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-8 pt-6 border-t border-charcoal-600/50 text-center">
          <p className="text-xs text-mist-500">
            Client follow-up automation system built pro bono by Alignment AI for the Cleveland LGBTQ Center. 
            Source code available under MIT license.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
