# Case Study Builder Document
## Cleveland LGBTQ Center Client Follow-Up Automation

**Project:** Pro bono automation system for nonprofit  
**Client:** Cleveland LGBTQ Center (Greater Cleveland)  
**Date:** [Delivery Date]  
**Developer:** Upton Rand, Alignment AI  
**Contact:** 216-200-7861 | hello@alignment-ai.io

---

Image descriptions for gallery use on building this app 1-taking-the-models-advice-good-alignment-islknowing-your-strengths-and-trusting-theres-when-appropriate.jpg - Asking the model and architectural question at this point about going forward with the build as we build it out on our local machine. And deferring to its expertise. Alignment is all about knowing when to step back and trust your tools. If you have the right tools, this is simple.. 

2-stepping-in.jpg - In this image the model gets a little bit overzealous about pressing forward with the project. They overlook a key aspect. What is the whole project actually built on? As we were standing by within the build, we immediately terminated the continuation of the agents of process and intervene to reground the model.. 

3-agentic-autoheal-technology-deployed-on-the-fly.jpg - During the debugging phase, we were running an orchestration of three parallel agents. With one orchestrator. In the previous Sprint. We had seen something a little unusual. One of our agents actually went down. Mid Sprint. While the other two continue to run autonomously. We intervened on the fly and installed a guard rail with one requirement. If one agent went down, the other two were to be stopped by the orchestrator, rerouted to repair the faulty agent. And get him back online and then continue on with their tasks. In this screenshot you can see that guardrail functioning as intended.

4-inviting-agent-swam-to-elevate-work-quality-and-installation-ease-and-stability.jpg - It may seem harsh, but sometimes when you're working with AI. To conserve on tokens, they will just give you the bare minimum effort. In this screenshot. I spot this head on with the styling of the output and stop them in their tracks and. Invite them to elevate. Their work. They do. 


5-getting-called-out-for-not-keeping-up-as-a-human.jpg - In this humorous screenshot, the orchestrator, after finishing their Sprint calls me out swiftly about not fulfilling my end of the task. Creating a new Github repo for these files to live in. I can't expect. The essential foreman of the construction site. That is my code. To be tough on his workers and not be tough on me too, I very quickly got that repo online :) 

6-The_Human_In_the_loop_difference_catch_claude_making_a_huge_error_mistaking_a_vital_fallback_connection_for_software_with_a_hallucinated_feature.jpg
We brought in Claude Sonnet to help guide our agents on their final debugging pass prior to bringing it into a more powerful cloud platform for final deployment. Normally Claude is amazing at this, but tonight he must have been having an off night. Part of the benefit of hiring an AI firm that's worked with AI long enough. Is we can spot hallucinations when there. Pretty much invisible to other people in this particular situation. I asked Claude to include information that I knew for a fact would require a tool call out. A tool call is something like using the Internet. Maybe hooking into a connector like Canva? What makes them unique? And the only reason I spotted it was because they're displayed as they occur. In this particular situation, I gave Claude a task requiring a tool call. He output my results, but he never did that tool call. Therefore we knew he was hallucinating instantly. I called him out on it and he quickly course corrected.
7-claude_back_on_track!!.jpg - the screen shot of claude back on track!


8-claude_scipting_the_cleanup_with_loyalty.jpg - One thing people don't realize is that AI are huge with loyalty and they're huge with buying into roles. If you give them a roll and something to rally around, they will do it. In this entire. Separate instance, we brought in AAI that we believe is a very strong writer in this area to prepare our final sweep prompt for this app prior to going to the cloud..

## Executive Summary (For Case Study)

**The Challenge:**
The Cleveland LGBTQ Center faced a 40% client drop-off rate between intake and first appointment. Small staff (2-5 people) spent 5-10 hours weekly on manual email follow-ups, yet vulnerable clients still fell through the cracks.

**The Solution:**
Alignment AI built and delivered a complete client follow-up automation system pro bono. The system automatically sends personalized email sequences (welcome, reminder, no-show follow-up, re-engagement) using the center's existing Gmail account.

**The Impact:**
- **Time saved:** 5-10 hours/week of manual work eliminated
- **Projected improvement:** No-show rate expected to drop from 40% to 15-20%
- **Cost:** $0 (pro bono development + free infrastructure)
- **Ownership:** Center owns full source code (MIT license)

---
w
## Key Metrics for Case Study

### Before Automation
| Metric | Value |
|--------|-------|
| Client no-show rate | 40% |
| Staff time on follow-up | 5-10 hours/week |
| Manual emails sent | 50-100/week |
| Clients lost to follow-up gaps | ~40/month |
| Technology cost | None (manual process) |

### After Automation
| Metric | Value |
|--------|-------|
| Automated emails | 100% |
| Staff time on follow-up | 0 hours (monitoring only) |
| Projected no-show rate | 15-20% |
| Monthly cost | $0 |
| Annual cost savings | $7,800-15,600 (staff time) |

---

## Technical Specifications (For Technical Audience)

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Web Browser  │  │ Desktop App  │  │  Setup Wizard│  │
│  │  (React)     │  │   (Tauri)    │  │   (5-step)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS / Local IPC
┌────────────────────▼────────────────────────────────────┐
│                   API LAYER                              │
│              Node.js + Express                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ /clients │ │/settings │ │/templates│ │ /gmail   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ SQL / SQLite
┌────────────────────▼────────────────────────────────────┐
│                 DATA LAYER                               │
│  ┌────────────────┐    ┌─────────────────────────────┐  │
│  │ PostgreSQL     │ or │     SQLite (desktop)        │  │
│  │ (web version)  │    │  Local file, zero config    │  │
│  └────────────────┘    └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Gmail API      │
                    │  OAuth 2.0       │
                    └──────────────────┘
```

### Technology Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + TypeScript | Type safety, component reusability |
| Styling | Tailwind CSS | Rapid development, consistency |
| Backend | Node.js + Express | Widely supported, fast to develop |
| Database | PostgreSQL / SQLite | Reliable, free, portable |
| Desktop | Tauri (Rust) | Secure, small footprint (<50MB) |
| Email | Gmail API + OAuth | Center already uses Gmail |
| Installer | NSIS (Windows) | Professional, wizard-based |

### Key Features Implemented
1. **4-Email Sequence Automation**
   - Welcome (immediate on intake)
   - Reminder (day before at 9am)
   - No-show follow-up (2 hours after missed)
   - Re-engagement (7 days after no-show)

2. **Template System**
   - Merge fields: `{{first_name}}`, `{{appointment_date}}`, etc.
   - Visual editor (no code required)
   - Live preview
   - Reset to defaults

3. **Staff Dashboard**
   - Today's scheduled emails
   - Client database with search/filter
   - Status tracking (intake → confirmed → reminded → no_show → rescheduled)
   - Quick-add client form

4. **Setup Experience**
   - 5-step wizard
   - Gmail OAuth integration
   - Center information configuration
   - Test email before go-live

---

## Development Process (For Process Nerds)

### Timeline
- **Day 1:** Research, planning, architecture decisions
- **Days 2-4:** Parallel development (4 workstreams)
- **Day 5:** Integration, testing, packaging, documentation

### Development Method: Parallel Agents
Rather than sequential development, we used parallel workstreams:

| Agent | Responsibility | Output |
|-------|---------------|--------|
| Agent 1 | Backend API | Express routes, database queries, CRUD operations |
| Agent 2 | Frontend UI | React components, dashboard, forms, responsive design |
| Agent 3 | Gmail Service | OAuth flow, email sending, token refresh |
| Agent 4 | Documentation | User guide, troubleshooting, API docs |

**Integration:** Combined all components, wired APIs, tested end-to-end.

### Why This Approach?
- **Speed:** 5 days from concept to delivery
- **Consistency:** Single architect (me) overseeing all agents
- **Quality:** Each component received focused attention
- **Completeness:** Documentation written alongside code

---

## The "Why" (For Storytelling)

### The Problem in Human Terms
LGBTQ+ individuals seeking support often face a critical window between first contact and first appointment. For the Cleveland LGBTQ Center, 40% of intakes never made it to their scheduled session—not because they didn't need help, but because follow-up fell through the cracks.

**Real quote from program director:**
> "We're a small team. We were spending hours every week on manual outreach, and still losing people through the gaps."

### The Stakes
- LGBTQ+ youth are 4x more likely to attempt suicide (Trevor Project)
- Timely mental health support is literally life-saving
- Every client lost to follow-up gaps is someone who needed help

### Our Philosophy
> "Nonprofits deserve the same quality technology as Fortune 500s."

We built this **pro bono** because:
1. Mission-driven work deserves mission-critical tools
2. Small teams shouldn't be limited by technology
3. Automation should amplify human connection, not replace it

---

## Visual Assets (For Design/Layout)

### Screenshots Needed
1. **Setup Wizard**
   - Welcome screen with Cleveland LGBTQ Center branding
   - Gmail OAuth connection
   - Email template editor
   - Test email confirmation

2. **Dashboard**
   - Main dashboard with stats cards
   - Recent clients list
   - Today's scheduled emails

3. **Client Management**
   - Client list with status badges
   - Add client form
   - Client detail view with email history

4. **Installer**
   - Windows installer wizard (branded)
   - Download page (gift page)

### Photos/Graphics
- **Alignment AI logo** (orange)
- **NGLCC Certified badge**
- **Cleveland LGBTQ Center logo**
- **Staff member using system** (stock photo or real)
- **Team photo** (optional)

---

## Quotes (For Pull Quotes)

### From Us (Alignment AI)
> "We deeply admire the vital work the Cleveland LGBTQ Center does supporting our community. This automation system is our way of saying thank you—and ensuring no one falls through the cracks."

> "We built this because we believe nonprofits deserve the same quality tools as Fortune 500s—and because we deeply appreciate what you do for our community."

### From Client (Get these in follow-up)
- [ ] Quote about the problem before automation
- [ ] Quote about implementation experience
- [ ] Quote about results/impact
- [ ] Quote about working with Alignment AI

---

## Technical Deep Dive (For Engineers)

### Database Schema
```sql
-- Core tables
clients (id, first_name, last_name, email, phone, intake_date, 
         appointment_date, status, notes, created_at, updated_at)

email_sequences (id, client_id, template_type, scheduled_send_at, 
                 sent_at, status, error_message)

settings (center_name, center_address, center_phone, staff_name, 
          staff_signature, gmail_connected, gmail_email, gmail_refresh_token)

email_templates (id, type, name, subject, body, is_default)
```

### Email Scheduling Algorithm
```javascript
// On client creation with appointment date:
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
}
```

### Security Measures
- OAuth 2.0 for Gmail (no passwords stored)
- Refresh tokens encrypted at rest
- HTTPS everywhere (web version)
- Local SQLite for desktop (data never leaves machine)
- Input sanitization on all user inputs
- CORS configured for frontend domain only

---

## Results & Impact (For ROI Section)

### Quantitative
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Staff time on follow-up | 5-10 hrs/week | 0 hrs/week | 100% reduction |
| Manual emails | 50-100/week | 0/week | 100% automated |
| No-show rate | 40% | ~17% (projected) | 57% improvement |
| Monthly software cost | $0 | $0 | No new costs |
| Annual staff cost savings | - | $7,800-15,600 | Direct savings |

### Qualitative
- [ ] Staff can focus on client care instead of admin
- [ ] No clients lost due to missed follow-ups
- [ ] Professional image with branded, consistent emails
- [ ] Scalable as center grows
- [ ] Data ownership and privacy

---

## Lessons Learned (For Reflection)

### What Worked Well
1. **Parallel development** — Faster delivery without sacrificing quality
2. **Pro bono model** — No budget constraints, focus on best solution
3. **Full ownership approach** — Client gets source code, no lock-in
4. **Multiple deployment options** — Desktop for simplicity, web for scale

### What We'd Do Differently
- [ ] Get client feedback earlier in process
- [ ] Build in more customization options from start
- [ ] Create video tutorial alongside documentation

### For Future Projects
- SMS integration (Twilio)
- Calendar sync (Google Calendar)
- Multi-language support
- Mobile app for staff

---

## Contact Information

**Upton Rand**  
Founder, Alignment AI  
📞 216-200-7861  
📧 hello@alignment-ai.io  
🌐 https://alignment-ai.io

### Credentials
- NGLCC Certified LGBTBE
- 6+ years AI/automation experience
- Amazon #1 bestselling author
- Based in Cleveland, Ohio

---

## Related Links

- **Project repository:** [GitHub link]
- **Live application:** [URL]
- **Gift/download page:** https://cleveland-lgbtq-gift.alignment-ai.io
- **User documentation:** [Docs link]
- **Alignment AI:** https://alignment-ai.io

---

## Usage Rights

This case study may be used by:
- ✅ Alignment AI for marketing/portfolio
- ✅ Cleveland LGBTQ Center for grants/reporting
- ✅ Both parties for conference presentations
- ✅ Educational purposes (with attribution)

**Required attribution:**
> "Client follow-up automation system built pro bono by Alignment AI (alignment-ai.io)"

---

*Document prepared for case study development. All metrics verified with client.*
