import { Helmet } from 'react-helmet-async'
import Hero from './components/Hero'
import Challenge from './components/Challenge'
import Solution from './components/Solution'
import ProcessGallery from './components/ProcessGallery'
import TechnicalDeepDive from './components/TechnicalDeepDive'
import Results from './components/Results'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  // Schema.org CaseStudy structured data
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    "headline": "Cleveland LGBTQ Center Client Automation Case Study",
    "description": "How Alignment AI built a free client follow-up automation system for the Cleveland LGBTQ Center, achieving 75% faster follow-ups with zero monthly cost.",
    "url": "https://alignment-ai.io/projects/nonprofit-client-automation/case-study/",
    "datePublished": "2026-02-01",
    "dateModified": "2026-02-06",
    "author": {
      "@type": "Organization",
      "name": "Alignment AI",
      "url": "https://alignment-ai.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alignment-ai.io/logo.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alignment AI",
      "url": "https://alignment-ai.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alignment-ai.io/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "mainEntity": {
      "@type": "NGO",
      "name": "Cleveland LGBTQ Center",
      "url": "https://www.lgbtcleveland.org",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cleveland",
        "addressRegion": "OH",
        "addressCountry": "US"
      }
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "Client Follow-Up Automation System",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Windows, Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    "citation": {
      "@type": "CreativeWork",
      "name": "Cleveland LGBTQ Center Client Automation Project"
    },
    "keywords": ["nonprofit automation", "client follow-up", "LGBTQ Center", "Cleveland", "free software", "case management"],
    "inLanguage": "en-US",
    "image": {
      "@type": "ImageObject",
      "url": "https://alignment-ai.io/og-image.jpg",
      "width": 1200,
      "height": 630
    }
  }

  // Breadcrumb Structured Data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://alignment-ai.io/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Projects",
        "item": "https://alignment-ai.io/projects/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Case Study: Cleveland LGBTQ Center",
        "item": "https://alignment-ai.io/projects/nonprofit-client-automation/case-study/"
      }
    ]
  }

  // LocalBusiness Structured Data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Alignment AI",
    "url": "https://alignment-ai.io",
    "telephone": "+1-216-200-7861",
    "email": "hello@alignment-ai.io",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cleveland",
      "addressRegion": "OH",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.4993",
      "longitude": "-81.6944"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "41.4993",
        "longitude": "-81.6944"
      },
      "geoRadius": "200000"
    },
    "priceRange": "$$",
    "sameAs": [
      "https://linkedin.com/company/alignment-ai"
    ]
  }

  // FAQ Structured Data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this automation system really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely. The Cleveland LGBTQ Center owns the software entirely—source code, data, and full rights to modify or distribute. There are no subscription fees, no hidden costs, and no usage limits."
        }
      },
      {
        "@type": "Question",
        "name": "Can other nonprofits use this system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. The project is open source under the MIT License. Other nonprofits can fork the repository, customize the email templates for their needs, and deploy following our setup guides."
        }
      },
      {
        "@type": "Question",
        "name": "Do we need technical expertise to use this system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The Windows Desktop app installs like any other Windows program. The setup wizard guides you through connecting Gmail and customizing templates. Most users are up and running in under 5 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "Is our data secure with this system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. With the Desktop app, all data stays on your local computer. We use encryption at rest and in transit. No third parties have access to your client information."
        }
      }
    ]
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Cleveland LGBTQ Center Case Study | Alignment AI</title>
        <meta name="description" content="How we built a free client automation system for the Cleveland LGBTQ Center. 75% faster follow-ups, zero monthly cost. Read the full case study." />
        <meta name="keywords" content="Cleveland LGBTQ Center, nonprofit automation, client follow-up system, free automation, Alignment AI case study" />
        <meta name="author" content="Alignment AI" />
        <meta name="copyright" content="Alignment AI" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://alignment-ai.io/projects/nonprofit-client-automation/case-study/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://alignment-ai.io/projects/nonprofit-client-automation/case-study/" />
        <meta property="og:title" content="Cleveland LGBTQ Center Case Study | Alignment AI" />
        <meta property="og:description" content="How we built a free client automation system for the Cleveland LGBTQ Center. 75% faster follow-ups, zero monthly cost." />
        <meta property="og:image" content="https://alignment-ai.io/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Alignment AI" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content="2026-02-01T00:00:00+00:00" />
        <meta property="article:modified_time" content="2026-02-06T00:00:00+00:00" />
        <meta property="article:author" content="https://alignment-ai.io" />
        <meta property="article:section" content="Case Studies" />
        <meta property="article:tag" content="Nonprofit Automation" />
        <meta property="article:tag" content="Cleveland" />
        <meta property="article:tag" content="LGBTQ" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@alignment_ai" />
        <meta name="twitter:creator" content="@alignment_ai" />
        <meta name="twitter:title" content="Cleveland LGBTQ Center Case Study | Alignment AI" />
        <meta name="twitter:description" content="How we built a free client automation system for the Cleveland LGBTQ Center. 75% faster follow-ups, zero monthly cost." />
        <meta name="twitter:image" content="https://alignment-ai.io/og-image.jpg" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="US-OH" />
        <meta name="geo.placename" content="Cleveland" />
        <meta name="geo.position" content="41.4993;-81.6944" />
        <meta name="ICBM" content="41.4993, -81.6944" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(caseStudySchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <main className="min-h-screen bg-mist" role="main">
        <Hero />
        <Challenge />
        <Solution />
        <ProcessGallery />
        <TechnicalDeepDive />
        <Results />
        <CTA />
        <Footer />
      </main>
    </>
  )
}

export default App
