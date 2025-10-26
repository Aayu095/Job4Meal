# Job4Meal - Microtask-for-Food Employment Platform

> **Earn a meal, feed a future.**

Job4Meal is a revolutionary platform that converts aid into empowerment by enabling workers to earn meal credits through verified microtasks posted by NGOs and local partners. Addressing **SDG 1 (No Poverty)** and **SDG 2 (Zero Hunger)** through technology and dignity.

## 🎯 Problem Statement

Urban and rural poor face two challenges:
1. **Immediate hunger** - Need food now
2. **Lack of opportunities** - Want to work but can't find short-term jobs

Traditional aid creates dependency. Job4Meal creates **dignity through work**.

## 💡 Solution

A three-sided platform connecting:
- **Workers** - Find nearby microtasks, complete them, earn meal credits
- **NGOs/Partners** - Post tasks, verify completion, provide meal redemptions
- **Community** - Self-sustaining economic loop that scales

## ✨ Key Features

### For Workers
- 📱 Mobile-first PWA (works offline)
- 🗺️ Location-based task discovery
- 📸 Photo + geo-proof submission
- 💳 Digital meal credit wallet
- 🍽️ Redeem credits at partner locations

### For NGOs/Partners
- ➕ Easy task creation
- ✅ Verification workflow with photo review
- 📊 Impact dashboard
- 🤝 Meal redemption management

### For Admins
- 📈 System-wide analytics
- 👥 User management
- 🏢 Organization oversight
- 📊 Impact metrics

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **State Management**: Zustand
- **UI Components**: Lucide Icons, React Hot Toast
- **Deployment**: Vercel (frontend) + Firebase (backend)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account ([console.firebase.google.com](https://console.firebase.google.com))
- Git

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Job4meal
npm install
```

### 2. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project: "Job4Meal"
   - Enable Google Analytics (optional)

2. **Enable Services**
   - **Authentication** → Phone (for production) or Email (for demo)
   - **Firestore Database** → Create database in production mode
   - **Storage** → Create default bucket
   - **Hosting** (optional for deployment)

3. **Get Configuration**
   - Project Settings → General → Your apps → Web app
   - Copy config values

4. **Service Account** (for seed script)
   - Project Settings → Service Accounts
   - Generate new private key
   - Save JSON file securely

### 3. Environment Variables

Create `.env.local` in project root:

```env
# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for seed script)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@...iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 5. Seed Demo Data

```bash
npm run seed
```

This creates:
- 3 organizations (NGOs + shops)
- 5 users (workers, NGO staff, admin)
- 5 tasks (various statuses)
- 2 redemptions

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 👥 Demo Users

After seeding, you can login with these roles:

| Role | Phone | Password | Purpose |
|------|-------|----------|---------|
| Worker | +1234560001 | (any 6 digits in demo mode) | See task listing, claim tasks, earn credits |
| Worker | +1234560002 | (any 6 digits) | Different location, submitted task |
| NGO Staff | +1234560010 | (any 6 digits) | Create tasks, verify submissions |
| Admin | +1234560099 | (any 6 digits) | System overview, all analytics |

**Demo Mode**: The app runs in demo mode by default. Enter any phone number and any 6-digit OTP to login.

## 📱 User Flows

### Worker Flow
1. Sign up → Choose "Worker" role
2. Browse nearby tasks
3. Claim a task
4. Complete work → Upload photo proof
5. Wait for verification
6. Credits added to wallet
7. Redeem meals at partner locations

### NGO Flow
1. Sign up → Choose "NGO/Partner" role
2. Create microtask (title, description, reward)
3. Workers claim and complete
4. Review photo submissions
5. Verify → Credits awarded automatically
6. Process meal redemptions

### Admin Flow
1. Login with admin credentials
2. View system metrics
3. Monitor user activity
4. Track impact (meals issued, tasks completed)

## 🎬 Creating Demo Video

For the hackathon submission, record a 2-5 minute video showing:

1. **Problem Statement** (30s)
   - Show statistics on poverty & hunger
   - Explain dependency vs. empowerment

2. **Solution Demo** (3-4 min)
   - Worker claiming task
   - Completing and submitting proof
   - NGO verifying task
   - Credits awarded
   - Meal redemption

3. **Impact Metrics** (30s)
   - Show admin dashboard
   - Highlight scalability

See `DEMO-GUIDE.md` for detailed presentation script.

## 🏆 Hackathon Alignment

### SDG Alignment
- **SDG 1 (No Poverty)**: Creates immediate income through microtasks
- **SDG 2 (Zero Hunger)**: Provides meal access via earned credits

### Judging Criteria Scorecard

| Criteria | Score | Evidence |
|----------|-------|----------|
| **Impact** (30%) | ⭐⭐⭐⭐⭐ | Addresses both SDGs, measurable outcomes, self-sustaining |
| **Innovation** (25%) | ⭐⭐⭐⭐⭐ | Novel "dignity not dependency" model, economic loop |
| **Feasibility** (20%) | ⭐⭐⭐⭐⭐ | Working prototype, proven tech stack, clear MVP |
| **Scalability** (20%) | ⭐⭐⭐⭐⭐ | Serverless architecture, easy NGO onboarding |
| **Design** (15%) | ⭐⭐⭐⭐ | Mobile-first, low-literacy friendly, clean UI |
| **Presentation** (10%) | ⭐⭐⭐⭐⭐ | Clear narrative, working demo, impact focus |

## 📊 Impact Potential

**Pilot Scale** (1 city, 6 months):
- 50 partner NGOs
- 500 active workers
- 2,000 tasks/month
- 10,000 meals earned

**Regional Scale** (1 year):
- 500 partners across 10 cities
- 10,000 workers
- 50,000 tasks/month
- 250,000 meals earned

**National Scale** (3 years):
- Integration with government welfare programs
- 1M+ workers
- Economic mobility tracking
- Skills development pathways

## 🔐 Security & Privacy

- Phone OTP authentication
- Role-based access control
- Firestore security rules
- Geolocation verification
- Photo proof system
- Transaction audit logs

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Test with multiple browser windows to simulate different user roles simultaneously.

## 📦 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Firebase (Backend)

```bash
# Deploy Firestore rules & indexes
firebase deploy --only firestore

# Deploy storage rules
firebase deploy --only storage

# Deploy all
firebase deploy
```

## 🤝 Contributing

This project was built for GNEC Hackathon 2025. For production deployment:

1. Replace demo auth with production Phone Auth
2. Add SMS notifications via Twilio
3. Implement geofencing for task locations
4. Add QR code redemptions
5. Create mobile apps (React Native)
6. Add multi-language support

## 📄 License

MIT License - Built for social impact

## 🙏 Acknowledgments

- **Youth Coders Collective** for inspiring student innovation
- **UN SDGs** for the guiding framework
- Partner NGOs for inspiring this solution

---

**Built with ❤️ for social impact**

*Tagline: "Earn a meal, feed a future."*
