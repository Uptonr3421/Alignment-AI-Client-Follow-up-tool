# GitHub Copilot Instructions

## Project Overview
This is a **Firebase-hosted client follow-up automation system** for the Cleveland LGBTQ Center. Built with React, TypeScript, and Firebase.

## Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting

## Key Files
```
src/web/frontend/     # React app
functions/            # Cloud Functions
firebase.json         # Firebase config
firestore.rules       # Security rules
```

## Coding Standards
- TypeScript strict mode
- Functional React components with hooks
- Tailwind for styling (colors: #E6511A orange, #252422 charcoal)
- Error handling with user-friendly messages
- WCAG 2.1 AA accessibility

## When Generating Code
1. Use existing patterns in `src/web/frontend/src/components/`
2. Follow Firestore security rules in `firestore.rules`
3. Add proper TypeScript types
4. Include loading and error states
5. Use Firebase SDK v9+ modular syntax

## Testing
- Test all API calls
- Verify responsive design
- Check accessibility

## Deployment
```bash
firebase deploy
```
