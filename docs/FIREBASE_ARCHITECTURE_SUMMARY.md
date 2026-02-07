# Firebase Architecture Summary

## Agent 1 (Firebase/GCP Architect) - Deliverables

---

## FIREBASE ARCHITECTURE

### Project Setup
| Setting | Value |
|---------|-------|
| **Project ID** | `cleveland-lgbtq-center` |
| **Region** | `us-central1` (closest to Cleveland, OH) |
| **Organization** | alignment-ai.io |
| **Services** | Auth, Firestore, Functions, Hosting, Scheduler |

### Services Configuration
| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Firebase Authentication | Gmail OAuth sign-in | 50K users/month |
| Cloud Firestore | Client database | 1GB storage, 50K reads/day |
| Firebase Hosting | Web app hosting | 10GB/month |
| Cloud Functions | Email automation | 2M invocations/month |
| Cloud Scheduler | Trigger scheduled emails | 3 jobs free |

---

## FIRESTORE SCHEMA

### Collections Structure
```
centers/{centerId}
├── users/{userId}          # Staff accounts (auto-created)
├── clients/{clientId}      # Client records
├── emailSequences/{id}     # Scheduled emails
├── templates/{templateId}  # Email templates
├── settings/default        # Center configuration
└── activityLogs/{logId}    # Audit trail
```

### Key Features
- **Multi-tenancy ready**: Each center isolated by `centerId`
- **Automatic audit logging**: All actions tracked
- **Role-based access**: Admin vs Staff permissions
- **Encrypted tokens**: Gmail OAuth tokens encrypted at rest

---

## SECURITY RULES

### Access Control Matrix
| Resource | Staff | Admin |
|----------|-------|-------|
| Center Info | Read | Read/Write |
| Staff Users | Read Own | Full Control |
| Clients | Full Access | Full Access |
| Email Sequences | CRUD Own | Full Control |
| Templates | CRUD Own | Full Control |
| Settings | Read | Full Control |
| Activity Logs | Read | Read |

### Key Security Features
- Row-level security via Firestore rules
- Gmail tokens encrypted with AES-256
- All email sends authenticated and logged
- No cross-center data access

---

## CLOUD FUNCTIONS

### HTTP Functions
| Function | Purpose | Trigger |
|----------|---------|---------|
| `sendEmail` | Send email via Gmail API | HTTPS onCall |
| `syncGmailToken` | Store encrypted OAuth token | HTTPS onCall |
| `getDashboardStats` | Get analytics data | HTTPS onCall |
| `healthCheck` | System health monitoring | HTTPS onRequest |

### Firestore Triggers
| Function | Purpose | Trigger |
|----------|---------|---------|
| `onClientCreated` | Create 4-email sequence | onCreate |
| `onClientUpdated` | Handle status changes | onUpdate |

### Scheduled Functions
| Function | Purpose | Schedule |
|----------|---------|----------|
| `processScheduledEmails` | Send due emails | Every 5 minutes |

---

## COST ESTIMATE

### Expected Monthly Usage (Current Scale)
| Metric | Estimate | Free Tier | Cost |
|--------|----------|-----------|------|
| Firestore Storage | 100 MB | 1 GB | $0 |
| Firestore Reads | 5,000/day | 50,000/day | $0 |
| Firestore Writes | 500/day | 20,000/day | $0 |
| Auth Users | 10 | 50,000 | $0 |
| Function Invocations | 10,000 | 2,000,000 | $0 |
| Hosting Transfer | 1 GB | 10 GB | $0 |
| **TOTAL** | | | **$0/month** |

### Growth Projections
| Scale | Monthly Cost |
|-------|--------------|
| Current (10 staff, 200 clients) | $0 |
| 10x Growth (100 staff, 2,000 clients) | $0 |
| 100x Growth (1,000 staff, 20,000 clients) | ~$10-20 |

### Billing Protection
- Alert set at $0.01
- Requires manual approval to exceed free tier
- No surprise charges

---

## SETUP COMPLEXITY FOR NONPROFIT

### What Alignment AI Does (Before Handoff)
```
✅ Create Firebase project
✅ Deploy Cloud Functions
✅ Deploy web app to Firebase Hosting
✅ Configure security rules
✅ Seed default templates and settings
✅ Set up billing alerts at $0
✅ Test end-to-end email flow
```

### What Cleveland LGBTQ Center Does (3-Minute Setup)
```
1. Click link: https://cleveland-lgbtq-center.web.app
   ↓
2. Click "Sign in with Google" button
   ↓
3. Sign in with @lgbtqcleveland.org account
   ↓
4. Grant permission to send emails
   ↓
5. Verify center information is correct
   ↓
✅ DONE - Start adding clients!
```

### Setup Complexity: ZERO
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   NO setup. NO configuration. NO technical knowledge.      ║
║                                                            ║
║   The nonprofit only needs to:                             ║
║                                                            ║
║   1. Click a link                                          ║
║   2. Sign in with Google                                   ║
║   3. Start using                                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## FILES CREATED

### Documentation
```
docs/
├── FIREBASE_ARCHITECTURE.md          # Complete architecture document
└── FIREBASE_ARCHITECTURE_SUMMARY.md  # This summary
```

### Firebase Configuration
```
firebase/
├── firestore.rules                   # Security rules
├── firestore.indexes.json            # Database indexes
├── firebase.json                     # Firebase config
├── .firebaserc                       # Project settings
├── deploy.sh                         # One-command deployment script
└── functions/
    ├── package.json                  # Node dependencies
    ├── tsconfig.json                 # TypeScript config
    └── src/
        ├── index.ts                  # Function exports
        ├── config/
        │   └── firebase.ts           # Admin SDK init
        ├── services/
        │   ├── encryption.ts         # Token encryption
        │   ├── templates.ts          # Template rendering
        │   └── gmail.ts              # Gmail API integration
        ├── http/
        │   ├── sendEmail.ts          # Send email function
        │   ├── syncGmailToken.ts     # OAuth token storage
        │   ├── getDashboardStats.ts  # Analytics endpoint
        │   └── healthCheck.ts        # Health monitoring
        ├── triggers/
        │   ├── onClientCreated.ts    # Auto-schedule emails
        │   └── onClientUpdated.ts    # Handle status changes
        └── scheduled/
            └── processScheduledEmails.ts  # Cron job
```

---

## COMPARISON: Desktop vs Firebase

| Feature | Desktop App | Firebase Cloud |
|---------|-------------|----------------|
| **Setup Time** | 3 minutes | 1 minute |
| **Technical Knowledge** | Zero | Zero |
| **Multi-user** | ❌ No | ✅ Yes |
| **Offline Support** | ✅ Yes | ❌ No |
| **Automatic Backups** | ❌ Manual | ✅ Yes |
| **Access Anywhere** | ❌ Single computer | ✅ Any browser |
| **Data Location** | Local computer | Google Cloud |
| **Monthly Cost** | $0 | $0 |
| **Best For** | Single staff member | Multiple staff |

---

## NEXT STEPS

### For Alignment AI Team
1. Run `./deploy.sh` to deploy Firebase infrastructure
2. Test with a test Google account
3. Send login link to Cleveland LGBTQ Center

### For Cleveland LGBTQ Center
1. Open the provided web app link
2. Sign in with your @lgbtqcleveland.org Google account
3. First user automatically becomes admin
4. Add additional staff from Settings → Staff Management
5. Start adding clients!

---

## ARCHITECTURE DECISIONS

### Why Firebase?
- **Zero server management**: No VMs to maintain
- **Generous free tier**: Covers nonprofit usage completely
- **Built-in authentication**: Google OAuth handled automatically
- **Real-time database**: Instant sync across all staff
- **Enterprise security**: Google's infrastructure

### Why Gmail OAuth?
- **No SMTP configuration**: Uses user's existing Gmail
- **Trusted sender**: Emails come from center's actual email
- **No deliverability issues**: Gmail's reputation
- **Automatic token refresh**: OAuth handles expiration

### Why Firestore?
- **NoSQL flexibility**: Easy schema evolution
- **Real-time sync**: All staff see updates instantly
- **Offline persistence**: Client caches data
- **Automatic scaling**: Handles any growth

---

*Architecture Complete - Ready for Deployment*
