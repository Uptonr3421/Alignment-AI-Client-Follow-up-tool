# Gift Page Deployment Guide

## What This Is

A **gracious, branded landing page** specifically for the Cleveland LGBTQ Center to download their automation system.

**URL will be:** `https://cleveland-lgbtq-gift.alignment-ai.io` (or similar)

## What's Included

- `gift-page.html` — The main landing page (gracious, appreciative tone)
- `alignment-ai-logo.png` — Your logo
- Placeholders for:
  - `lgbt-center-logo.png` — Their logo (add yours)
  - `nglcc-logo.png` — NGLCC certification badge
  - `woman-at-desk.png` — Hero image
  - Screenshots (marked in HTML as placeholders)

## How to Deploy (Free)

### Option 1: Vercel (Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd presentation
   vercel --prod
   ```

3. **Set custom domain:**
   ```bash
   vercel domains add cleveland-lgbtq-gift.alignment-ai.io
   ```

### Option 2: Netlify Drag & Drop

1. Go to https://app.netlify.com/drop
2. Drag the `presentation/` folder onto the page
3. Get instant URL
4. Set custom domain in settings

### Option 3: GitHub Pages

1. Create repo `cleveland-lgbtq-gift`
2. Push these files
3. Enable GitHub Pages in repo settings
4. Set custom domain

## Before Deploying

### 1. Add Required Images

Download/rename these images to the `presentation/` folder:

| File | Source | Notes |
|------|--------|-------|
| `lgbt-center-logo.png` | [Cleveland LGBT Center](https://www.lgbtcleveland.org/) | Their official logo |
| `nglcc-logo.png` | [NGLCC](https://www.nglcc.org/) | Your certification badge |
| `woman-at-desk.png` | Your screenshot | Staff using the app |

### 2. Add Screenshots (Optional)

Replace the placeholder divs in `gift-page.html`:

```html
<!-- Find these placeholders -->
<div class="step-image">
    [Screenshot: Windows installer wizard]
</div>

<!-- Replace with actual screenshots -->
<div class="step-image">
    <img src="screenshot-1-installer.png" alt="Windows installer wizard">
</div>
```

Screenshot checklist:
- [ ] Windows installer welcome screen
- [ ] Application setup wizard
- [ ] Gmail connection screen
- [ ] Email template editor
- [ ] Dashboard with sample data

### 3. Update Contact Info

In `gift-page.html`, verify:
- Phone: 216-200-7861 ✓
- Email: hello@alignment-ai.io ✓
- Website: alignment-ai.io ✓
- Name: Upton Rand ✓

### 4. Test the Download Links

Make sure these files exist and are linked correctly:
- `LGBTQ-Center-Automation-Setup.exe` — Windows installer
- `setup-guide.pdf` — (optional) Printable guide

## Content Highlights

The page is written to be:

✅ **Gracious** — "We deeply admire the vital work you do"  
✅ **Professional** — Clean design, your branding  
✅ **Clear** — 5-step setup, obvious download buttons  
✅ **Supportive** — "We're here to help" with contact info  
✅ **No strings** — "Yours forever at absolutely no cost"

## What They See

1. **Header** — Alignment AI + Cleveland LGBTQ Center logos
2. **Hero** — "A Gift for Cleveland LGBTQ Center" (warm, appreciative)
3. **Download Box** — Two options (Windows Desktop recommended, Web alternative)
4. **Setup Steps** — 5 steps with screenshots
5. **Features** — What the system does (icons + brief text)
6. **About Section** — Why you built this, your credentials
7. **Contact** — Phone, email, website (prominent)
8. **Footer** — "Built with care in Cleveland, for Cleveland"

## Email to Send

```
Subject: A Gift for Cleveland LGBTQ Center — Client Follow-Up Automation

Dear [Name],

I hope this email finds you well. I'm Upton Rand from Alignment AI, a Cleveland-based 
automation consultancy and NGLCC Certified LGBTBE business.

We've built something for you.

We deeply admire the vital work the Cleveland LGBTQ Center does supporting our community. 
To help you serve even more people effectively, we've created a custom client follow-up 
automation system — and we want to give it to you, completely free.

**What it does:**
Automatically sends personalized follow-up emails to clients between intake and their 
first appointment. Welcome emails, reminders, no-show follow-ups, re-engagement — all 
happening automatically so your staff can focus on client care, not admin.

**Your download:**
https://cleveland-lgbtq-gift.alignment-ai.io

The page walks you through everything: download, install, setup, and first use. Most 
centers are up and running in under 10 minutes.

**This is yours forever:**
- Zero monthly costs (runs on free infrastructure)
- Full source code included (MIT license)
- Your data stays yours
- 30 days of email support included

**If you need help:**
Call me directly at 216-200-7861 or email hello@alignment-ai.io. I'm happy to walk 
through setup together, answer questions, or discuss other ways we might support your work.

We built this because we believe nonprofits deserve the same quality tools as Fortune 
500s — and because we deeply appreciate what you do for our community.

With gratitude,

Upton Rand
Alignment AI
216-200-7861 | hello@alignment-ai.io
https://alignment-ai.io

P.S. — We'd love to do more. If there are other ways we can support the LGBTQ+ community 
in Cleveland, or if you know other nonprofits who could benefit from automation, please 
let us know.
```

## Next Steps

1. [ ] Add the Cleveland LGBTQ Center logo
2. [ ] Add your NGLCC badge
3. [ ] Add screenshots (or remove placeholders)
4. [ ] Deploy to Vercel/Netlify
5. [ ] Set custom domain
6. [ ] Test download links
7. [ ] Send email to center
8. [ ] Follow up with phone call

## Questions?

Contact: 216-200-7861 | hello@alignment-ai.io
