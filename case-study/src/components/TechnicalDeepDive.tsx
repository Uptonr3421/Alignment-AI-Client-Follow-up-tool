import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Server, 
  Database, 
  Shield, 
  Code2, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const TechnicalDeepDive = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [expandedSection, setExpandedSection] = useState<string | null>('architecture')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const sections = [
    {
      id: 'architecture',
      icon: Layers,
      title: 'System Architecture',
      content: (
        <div className="space-y-6">
          {/* Architecture diagram */}
          <div className="bg-charcoal-700 rounded-xl p-6 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Client Layer */}
              <div className="border-2 border-orange/30 rounded-lg p-4 mb-4">
                <div className="text-orange font-mono text-xs uppercase tracking-wider mb-3">Client Layer</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-charcoal-600 rounded-lg p-3 text-center">
                    <div className="text-mist text-sm font-medium">Web Browser</div>
                    <div className="text-mist-400 text-xs">React</div>
                  </div>
                  <div className="bg-charcoal-600 rounded-lg p-3 text-center">
                    <div className="text-mist text-sm font-medium">Desktop App</div>
                    <div className="text-mist-400 text-xs">Tauri</div>
                  </div>
                  <div className="bg-charcoal-600 rounded-lg p-3 text-center">
                    <div className="text-mist text-sm font-medium">Setup Wizard</div>
                    <div className="text-mist-400 text-xs">5-step</div>
                  </div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center mb-4">
                <div className="text-mist-400 text-xs font-mono">HTTPS / Local IPC ↓</div>
              </div>
              
              {/* API Layer */}
              <div className="border-2 border-orange/30 rounded-lg p-4 mb-4">
                <div className="text-orange font-mono text-xs uppercase tracking-wider mb-3">API Layer — Node.js + Express</div>
                <div className="grid grid-cols-4 gap-2">
                  {['/clients', '/settings', '/templates', '/gmail'].map((route) => (
                    <div key={route} className="bg-charcoal-600 rounded px-2 py-2 text-center">
                      <code className="text-mist text-xs">{route}</code>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center mb-4">
                <div className="text-mist-400 text-xs font-mono">SQL / SQLite ↓</div>
              </div>
              
              {/* Data Layer */}
              <div className="border-2 border-orange/30 rounded-lg p-4 mb-4">
                <div className="text-orange font-mono text-xs uppercase tracking-wider mb-3">Data Layer</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-charcoal-600 rounded-lg p-3 text-center">
                    <div className="text-mist text-sm font-medium">PostgreSQL</div>
                    <div className="text-mist-400 text-xs">Web version</div>
                  </div>
                  <div className="bg-charcoal-600 rounded-lg p-3 text-center">
                    <div className="text-mist text-sm font-medium">SQLite</div>
                    <div className="text-mist-400 text-xs">Desktop, zero config</div>
                  </div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-mist-400 text-xs font-mono">↓</div>
              </div>
              
              {/* Gmail API */}
              <div className="bg-orange/20 border border-orange/30 rounded-lg p-3 text-center mt-4">
                <div className="text-orange font-mono text-xs uppercase tracking-wider">Gmail API — OAuth 2.0</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stack',
      icon: Code2,
      title: 'Technology Stack',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { layer: 'Frontend', tech: 'React + TypeScript', rationale: 'Type safety, component reusability' },
            { layer: 'Styling', tech: 'Tailwind CSS', rationale: 'Rapid development, consistency' },
            { layer: 'Backend', tech: 'Node.js + Express', rationale: 'Widely supported, fast to develop' },
            { layer: 'Database', tech: 'PostgreSQL / SQLite', rationale: 'Reliable, free, portable' },
            { layer: 'Desktop', tech: 'Tauri (Rust)', rationale: 'Secure, small footprint (&lt;50MB)' },
            { layer: 'Email', tech: 'Gmail API + OAuth', rationale: 'Center already uses Gmail' },
          ].map((item) => (
            <div key={item.layer} className="bg-mist rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-orange uppercase">{item.layer}</span>
              </div>
              <div className="font-medium text-charcoal mb-1">{item.tech}</div>
              <div className="text-sm text-charcoal-400">{item.rationale}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'database',
      icon: Database,
      title: 'Database Schema',
      content: (
        <div className="bg-charcoal-800 rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs sm:text-sm font-mono text-mist-300">
            <code>{`-- Core tables
clients (
  id, first_name, last_name, email, phone,
  intake_date, appointment_date, status,
  notes, created_at, updated_at
)

email_sequences (
  id, client_id, template_type,
  scheduled_send_at, sent_at, status,
  error_message
)

settings (
  center_name, center_address, center_phone,
  staff_name, staff_signature,
  gmail_connected, gmail_email,
  gmail_refresh_token
)

email_templates (
  id, type, name, subject, body, is_default
)`}</code>
          </pre>
        </div>
      )
    },
    {
      id: 'scheduling',
      icon: Server,
      title: 'Email Scheduling Algorithm',
      content: (
        <div className="space-y-4">
          <div className="bg-charcoal-800 rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-mist-300">
              <code>{`// On client creation with appointment date:
function calculateEmailSchedule(appointmentDate) {
  return [
    { type: 'welcome', sendAt: now() },
    { type: 'reminder', sendAt: dayBeforeAt9am(appointmentDate) },
    { type: 'no_show', sendAt: twoHoursAfter(appointmentDate) },
    { type: 're_engagement', sendAt: sevenDaysAfter(appointmentDate) }
  ];
}

// Cron job every 5 minutes:
function processScheduledEmails() {
  const dueEmails = db.query(
    "SELECT * FROM email_sequences " +
    "WHERE status = 'scheduled' AND scheduled_send_at <= NOW()"
  );
  
  for (const email of dueEmails) {
    const template = getTemplate(email.template_type);
    const client = getClient(email.client_id);
    const rendered = renderTemplate(template, client);
    
    try {
      sendEmail(rendered);
      updateStatus(email.id, 'sent');
    } catch (err) {
      updateStatus(email.id, 'failed', err.message);
    }
  }
}`}</code>
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security Measures',
      content: (
        <ul className="space-y-3">
          {[
            'OAuth 2.0 for Gmail (no passwords stored)',
            'Refresh tokens encrypted at rest',
            'HTTPS everywhere (web version)',
            'Local SQLite for desktop (data never leaves machine)',
            'Input sanitization on all user inputs',
            'CORS configured for frontend domain only',
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-charcoal-300">{item}</span>
            </li>
          ))}
        </ul>
      )
    },
  ]

  return (
    <section 
      id="technical"
      ref={ref}
      className="py-20 sm:py-28 lg:py-36 bg-white"
      aria-labelledby="technical-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-charcoal/5 text-charcoal-400 font-mono text-xs uppercase tracking-wider mb-4">
            For Engineers
          </span>
          <h2 
            id="technical-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
          >
            Technical Deep Dive
          </h2>
          <p className="text-lg text-charcoal-300 max-w-3xl mx-auto leading-relaxed">
            The architecture and implementation details behind the automation system.
          </p>
        </motion.div>

        {/* Accordion sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-mist rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-mist-100 transition-colors duration-200 touch-target"
                aria-expanded={expandedSection === section.id}
                aria-controls={`section-${section.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-orange" aria-hidden="true" />
                  </div>
                  <span className="font-semibold text-charcoal">{section.title}</span>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-charcoal-400" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-400" aria-hidden="true" />
                )}
              </button>
              
              {expandedSection === section.id && (
                <div 
                  id={`section-${section.id}`}
                  className="px-5 sm:px-6 pb-6 pt-2"
                >
                  {section.content}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechnicalDeepDive
