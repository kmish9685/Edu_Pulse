# ANTIGRAVITY BUILD PROMPTS: EDUPULSE SEQUENTIAL IMPLEMENTATION
## Copy-Paste Prompts for AI Coding Agent

**HOW TO USE THIS DOCUMENT:**
1. Copy each prompt EXACTLY as written
2. Paste into AntiGravity AI agent
3. Review generated code before proceeding to next prompt
4. Each prompt builds on previous ones (sequential dependencies)
5. Test functionality after each phase before moving forward

**ESTIMATED TIMELINE:**
- Phase 1 (Setup): 4-6 hours
- Phase 2 (Core Features): 12-16 hours
- Phase 3 (Priority Features): 10-14 hours
- Phase 4 (Polish): 6-8 hours
- **Total: 32-44 hours of AI-assisted development**

---

## PHASE 1: PROJECT SETUP & FOUNDATION

### **PROMPT 1.1: Initialize Full-Stack Project**

```
Create a full-stack web application for EduPulse, a real-time classroom feedback system. 

REQUIREMENTS:
- Frontend: React.js with Vite, Tailwind CSS for styling
- Backend: Node.js with Express.js
- Database: PostgreSQL with Prisma ORM
- Real-time: Start with REST polling (5-second interval), Socket.io can be added later
- Deployment-ready: Structured for Vercel (frontend) and Railway (backend + database)

PROJECT STRUCTURE:
```
edupulse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, rate limiting, etc.
│   │   ├── utils/        # Helper functions
│   │   └── index.js      # Entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
└── README.md
```

FRONTEND DEPENDENCIES:
- react, react-dom
- react-router-dom (for navigation)
- axios (for API calls)
- tailwindcss
- chart.js, react-chartjs-2 (for charts)
- qrcode.react (for QR code generation)
- @fingerprintjs/fingerprintjs (for device ID)

BACKEND DEPENDENCIES:
- express
- @prisma/client
- bcryptjs (for password hashing)
- jsonwebtoken (for JWT auth)
- cors
- dotenv
- express-rate-limit

ENVIRONMENT VARIABLES:
Create .env files with:
```
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/edupulse"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001

# Frontend (.env)
VITE_API_URL="http://localhost:3001/api"
```

INITIAL SETUP TASKS:
1. Create project structure with folders
2. Initialize package.json for both client and server
3. Install all dependencies
4. Set up Tailwind CSS configuration
5. Create basic Express server that responds to /api/health
6. Create basic React app that renders "EduPulse - Coming Soon"
7. Set up Prisma with initial connection test

DELIVERABLE:
- Both servers running (frontend on :5173, backend on :3001)
- /api/health returns { status: "ok" }
- Frontend displays simple "EduPulse" heading with Tailwind styling
- Prisma connection successful (run: npx prisma db pull)

Do NOT implement features yet - just project scaffolding.
```

---

### **PROMPT 1.2: Database Schema Implementation**

```
Implement the complete PostgreSQL database schema for EduPulse using Prisma.

CONTEXT:
EduPulse is a classroom feedback system where:
- Students signal confusion anonymously (no login)
- Teachers view real-time confusion data in dashboard
- Admins view institutional analytics
- System tracks confusion signals with timestamps and topics

DATABASE SCHEMA (Prisma format):

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Institution {
  id                String    @id @default(uuid())
  name              String
  location          String
  campusLatitude    Float
  campusLongitude   Float
  campusRadius      Int       @default(500)
  subscriptionTier  String    @default("pilot")
  courses           Course[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model Course {
  id            String      @id @default(uuid())
  name          String
  code          String
  department    String
  institution   Institution @relation(fields: [institutionId], references: [id])
  institutionId String
  sessions      Session[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@index([institutionId])
}

model Session {
  id               String            @id @default(uuid())
  course           Course            @relation(fields: [courseId], references: [id])
  courseId         String
  teacher          User              @relation(fields: [teacherId], references: [id])
  teacherId        String
  startTime        DateTime          @default(now())
  endTime          DateTime?
  qrCode           String?
  clarityScore     Int?
  confusionSignals ConfusionSignal[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  
  @@index([courseId])
  @@index([teacherId])
}

model ConfusionSignal {
  id          String    @id @default(uuid())
  session     Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId   String
  deviceId    String
  topic       String?
  timestamp   DateTime  @default(now())
  latitude    Float?
  longitude   Float?
  resolved    Boolean   @default(false)
  
  @@index([sessionId])
  @@index([timestamp])
  @@index([topic])
}

model Topic {
  id          String   @id @default(uuid())
  name        String
  category    String
  course      String
  createdAt   DateTime @default(now())
}

model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  name        String
  role        String    @default("teacher")
  institution String
  sessions    Session[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([email])
}

model LearningOutcome {
  id              String   @id @default(uuid())
  sessionId       String
  courseId        String
  assessmentType  String
  averageScore    Float
  controlScore    Float?
  createdAt       DateTime @default(now())
  
  @@index([courseId])
  @@index([sessionId])
}
```

IMPLEMENTATION TASKS:
1. Replace the existing schema.prisma with this complete schema
2. Run: npx prisma migrate dev --name init
3. Run: npx prisma generate
4. Create a seed script (prisma/seed.js) that adds:
   - 1 demo institution (Galgotias University)
   - 3 demo courses (Database Systems, Data Structures, Web Development)
   - 2 demo users (1 teacher, 1 admin)
   - 10 sample topics for each course
5. Run seed: npx prisma db seed

SEED DATA EXAMPLE:
```javascript
// Institution
{
  name: "Galgotias University",
  location: "Greater Noida, India",
  campusLatitude: 28.4744,
  campusLongitude: 77.5040,
  campusRadius: 500,
  subscriptionTier: "pilot"
}

// User (Teacher)
{
  email: "amit.kumar@galgotias.ac.in",
  password: bcrypt.hashSync("demo123", 10),
  name: "Dr. Amit Kumar",
  role: "teacher",
  institution: "Galgotias University"
}

// Topics for Database Systems
[
  "Database Normalization - 1NF",
  "Database Normalization - 2NF",
  "Database Normalization - 3NF",
  "SQL Joins - Inner Join",
  "SQL Joins - Outer Join",
  "Transactions and ACID",
  "Indexing Strategies",
  "ER Diagrams",
  "Foreign Key Constraints",
  "Query Optimization"
]
```

DELIVERABLE:
- Database schema migrated successfully
- Prisma Client generated
- Seed data loaded (verify with Prisma Studio: npx prisma studio)
- All tables visible in database
- Indexes created correctly

Test with: node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.institution.findMany().then(console.log)"
```

---

## PHASE 2: CORE FEATURES (P0 - CRITICAL)

### **PROMPT 2.1: Student Confusion Signal Flow**

```
Implement the complete student-facing confusion signal submission flow.

CONTEXT:
Students access EduPulse via QR code (no login required). They anonymously signal confusion during class. System must prevent spam via device fingerprinting and rate limiting.

REQUIREMENTS:

**Backend API Endpoints:**

1. GET /api/session/:sessionId/join
   - Purpose: Student scans QR code, loads this endpoint
   - Response: Session info + available topics for confusion signaling
   - Example response:
   ```json
   {
     "sessionId": "uuid",
     "courseName": "Database Systems",
     "courseCode": "CS301",
     "startTime": "2026-02-14T10:00:00Z",
     "topics": [
       "Database Normalization - 3NF",
       "SQL Joins",
       "Transactions and ACID",
       "Other (specify)"
     ]
   }
   ```

2. POST /api/signal/submit
   - Purpose: Student submits confusion signal
   - Body:
   ```json
   {
     "sessionId": "uuid",
     "deviceId": "fingerprintjs-generated-id",
     "topic": "Database Normalization - 3NF" | null,
     "latitude": 28.4744 | null,
     "longitude": 77.5040 | null
   }
   ```
   - Validation:
     - Session must be active (endTime is null)
     - Device ID required
     - Rate limit: 1 signal per 30 seconds per deviceId (use in-memory store or Redis)
     - Geofencing: If lat/lon provided, check distance from campus center (<= campus radius)
   - Response: { success: true, message: "Signal received" } OR error
   - Rate limit response (429): { success: false, message: "Please wait 30 seconds before signaling again" }

**Backend Implementation:**
- Create routes/signal.js with above endpoints
- Create controllers/signalController.js with business logic
- Create middleware/rateLimiter.js using express-rate-limit + custom device ID check
- Create utils/geofencing.js with haversine distance formula
- Store rate limit in-memory Map: deviceId -> lastSignalTime

**Frontend Components:**

1. StudentView.jsx (page)
   - Route: /session/:sessionId
   - Loads session info on mount (GET /api/session/:sessionId/join)
   - Displays:
     - Course name and code at top
     - Large "I'm Confused" button (prominent, center)
     - Optional dropdown: "What are you confused about?" (topics from API)
     - Status message: "Signal sent!" (toast notification, 2 seconds)
     - Cooldown indicator: "Please wait 27 seconds..." (countdown)
   - Uses FingerprintJS to generate deviceId on mount
   - Geolocation: Request browser location, send with signal (optional, graceful fallback if denied)

2. ConfusionButton.jsx (component)
   - Props: sessionId, deviceId, onSignalSent
   - State: isLoading, cooldown (seconds remaining)
   - onClick: Submit signal, show loading, handle response
   - Cooldown: Disable button for 30 seconds after successful signal
   - Styling: Large, orange/red button, pulse animation when active

**Frontend Utilities:**
- utils/api.js: Axios instance with base URL from env
- utils/fingerprint.js: Initialize FingerprintJS, get device ID

**User Experience:**
1. Student scans QR code → Redirected to /session/:sessionId
2. Page loads session info instantly
3. Student clicks "I'm Confused" → Button shows loading spinner
4. Response: "Signal sent!" toast appears
5. Button disabled for 30 seconds with countdown: "Wait 27s..."
6. Student can select topic before clicking (optional dropdown)

**Error Handling:**
- Session not found: Show "This session is no longer active"
- Rate limited: Show "Please wait before signaling again"
- Network error: Show "Connection issue, please try again"
- Geofencing failed: Show "You must be on campus to use EduPulse" (only if location provided)

DELIVERABLE:
- POST /api/signal/submit working (test with Postman)
- GET /api/session/:sessionId/join returning correct data
- Student view rendering at /session/:sessionId
- FingerprintJS generating device ID
- Confusion signal successfully saved to database
- Rate limiting working (second click within 30s blocked)
- Toast notifications appearing

TEST:
1. Create a test session in database (Prisma Studio)
2. Visit /session/{test-session-id}
3. Click "I'm Confused" → Signal saved to ConfusionSignal table
4. Click again immediately → Blocked with "Wait 30s" message
5. Wait 30 seconds → Click again → New signal saved
```

---

### **PROMPT 2.2: Teacher Dashboard - Real-Time Confusion Display**

```
Implement the teacher dashboard that displays real-time confusion signals with Confusion Clustering and Clarity Score.

CONTEXT:
Teachers need to see:
1. How many students are currently confused
2. WHAT they're confused about (topic clustering)
3. Overall session health (Clarity Score)
4. Real-time updates (poll every 5 seconds)

REQUIREMENTS:

**Backend API Endpoint:**

GET /api/session/:sessionId/dashboard
- Purpose: Provide real-time confusion data for teacher dashboard
- Authentication: JWT required (teacher or admin)
- Response:
```json
{
  "sessionId": "uuid",
  "courseName": "Database Systems",
  "startTime": "2026-02-14T10:00:00Z",
  "activeSignals": 27,
  "totalSignalsToday": 45,
  "clarityScore": 64,
  "clarityStatus": "STRUGGLING",
  "confusionClustering": {
    "primary": {
      "topic": "Database Normalization - 3NF",
      "count": 18,
      "percentage": 67
    },
    "secondary": [
      { "topic": "Foreign Key Constraints", "count": 6, "percentage": 22 },
      { "topic": "SQL Joins", "count": 3, "percentage": 11 }
    ]
  },
  "recentSignals": [
    { "timestamp": "2026-02-14T10:23:15Z", "topic": "3NF", "deviceId": "xxx" },
    ...last 10 signals
  ]
}
```

**Clarity Score Algorithm (implement in backend):**
```javascript
function calculateClarityScore(session) {
  const now = new Date();
  const signals = session.confusionSignals.filter(s => {
    const age = (now - s.timestamp) / 1000 / 60; // minutes
    return age <= 15; // Only signals from last 15 minutes
  });
  
  if (signals.length === 0) return 100;
  
  const totalStudents = 40; // Hardcode for now, make dynamic later
  const confusionPercentage = (signals.length / totalStudents) * 100;
  
  // Base score
  let score = 100 - confusionPercentage;
  
  // Penalty for recent spike (>10 signals in last 5 min)
  const recentSignals = signals.filter(s => {
    const age = (now - s.timestamp) / 1000 / 60;
    return age <= 5;
  });
  if (recentSignals.length > 10) score -= 10;
  
  // Bonus if confusion resolved (signals decreasing)
  const last5min = recentSignals.length;
  const prev5min = signals.filter(s => {
    const age = (now - s.timestamp) / 1000 / 60;
    return age > 5 && age <= 10;
  }).length;
  if (last5min < prev5min * 0.5) score += 5; // 50% reduction = bonus
  
  return Math.max(0, Math.min(100, Math.round(score)));
}
```

**Confusion Clustering Algorithm:**
```javascript
function clusterConfusion(signals) {
  const topicCounts = {};
  signals.forEach(s => {
    const topic = s.topic || "General Confusion";
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });
  
  const sorted = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: Math.round((count / signals.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
  
  return {
    primary: sorted[0],
    secondary: sorted.slice(1, 4) // Top 3 secondary
  };
}
```

**Backend Implementation:**
- Create routes/dashboard.js
- Create controllers/dashboardController.js
- Implement calculateClarityScore() and clusterConfusion()
- Add JWT auth middleware (verify teacher/admin role)

**Frontend Components:**

1. TeacherDashboard.jsx (page)
   - Route: /teacher/session/:sessionId
   - Auth required (check JWT in localStorage)
   - Poll /api/session/:sessionId/dashboard every 5 seconds (use setInterval)
   - Layout:
     ```
     ┌─────────────────────────────────────────┐
     │  Database Systems - Section A           │
     │  Started: 10:00 AM                      │
     └─────────────────────────────────────────┘
     
     ┌─────────────────────────────────────────┐
     │  SESSION CLARITY SCORE                  │
     │                                         │
     │       64 / 100  🟡                      │
     │       STRUGGLING                        │
     │                                         │
     │  Your Avg: 71    Dept Avg: 68          │
     └─────────────────────────────────────────┘
     
     ┌─────────────────────────────────────────┐
     │  🎯 MAIN CONFUSION DETECTED             │
     │                                         │
     │  Topic: Database Normalization - 3NF    │
     │  Students: 67% (18 of 27 signaling)    │
     │  Status: 🔴 Active                      │
     └─────────────────────────────────────────┘
     
     ┌─────────────────────────────────────────┐
     │  SECONDARY ISSUES                       │
     │  • Foreign Keys: 22% (6 students)       │
     │  • SQL Joins: 11% (3 students)          │
     └─────────────────────────────────────────┘
     ```

2. ClarityScoreCard.jsx (component)
   - Props: score, status
   - Display: Large number (64), status badge (STRUGGLING), color (green/yellow/red)
   - Color logic:
     - 80-100: Green (CLEAR)
     - 60-79: Yellow (STRUGGLING)
     - 0-59: Red (CRITICAL)

3. ConfusionClusterCard.jsx (component)
   - Props: primary, secondary
   - Display: Primary confusion prominently, secondary as list

**Auto-Refresh Logic:**
```javascript
useEffect(() => {
  const fetchDashboard = async () => {
    const res = await api.get(`/session/${sessionId}/dashboard`);
    setDashboardData(res.data);
  };
  
  fetchDashboard(); // Initial load
  const interval = setInterval(fetchDashboard, 5000); // Every 5 seconds
  
  return () => clearInterval(interval); // Cleanup
}, [sessionId]);
```

DELIVERABLE:
- GET /api/session/:sessionId/dashboard returns correct data structure
- Clarity Score calculated correctly (test with sample signals)
- Confusion Clustering working (test: add signals with different topics, verify grouping)
- Teacher dashboard rendering at /teacher/session/:sessionId
- Dashboard auto-refreshes every 5 seconds
- Clarity Score color changes based on value (green/yellow/red)
- Main confusion topic displayed prominently

TEST:
1. Add 20 confusion signals to test session (10 with topic "3NF", 5 with "Joins", 5 with "Transactions")
2. Visit /teacher/session/{test-session-id}
3. Verify: Primary confusion shows "3NF - 50%", Secondary shows other topics
4. Verify: Clarity Score calculates (should be ~50-60 with 20 signals out of 40 students)
5. Add 10 more signals with "3NF" → Dashboard updates within 5 seconds
```

---

### **PROMPT 2.3: Recommended Teaching Actions (AI Engine)**

```
Implement the rule-based intelligence engine that provides teaching action recommendations based on confusion patterns.

CONTEXT:
Based on real-time confusion data, system should recommend specific actions to teachers (e.g., "Pause and recap", "Continue teaching", "Take a break").

REQUIREMENTS:

**Backend Logic - recommendedActions.js (utils/):**

```javascript
function getRecommendedAction(dashboardData) {
  const {
    activeSignals,
    clarityScore,
    confusionClustering,
    recentSignals,
    session
  } = dashboardData;
  
  const now = new Date();
  const sessionDuration = (now - new Date(session.startTime)) / 1000 / 60; // minutes
  
  // Rule 1: Sudden spike (15+ signals in last 5 minutes)
  const last5min = recentSignals.filter(s => {
    const age = (now - new Date(s.timestamp)) / 1000 / 60;
    return age <= 5;
  }).length;
  
  if (last5min >= 15) {
    return {
      action: "PAUSE_AND_RECAP",
      title: "⚡ Pause and recap last 2 concepts",
      description: "18 new confusion signals in last 5 minutes (spike detected)",
      estimatedTime: "3-4 minutes",
      expectedOutcome: "Confusion should decrease by 40-60% after clarification",
      priority: "HIGH"
    };
  }
  
  // Rule 2: High persistent confusion (>40% for 10+ minutes)
  if (clarityScore < 60 && sessionDuration > 10) {
    return {
      action: "DEEP_DIVE",
      title: "🎯 Deep dive: Break down concept step-by-step",
      description: `Persistent confusion about ${confusionClustering.primary.topic}`,
      estimatedTime: "10-15 minutes",
      expectedOutcome: "Address fundamental misunderstanding before continuing",
      priority: "HIGH"
    };
  }
  
  // Rule 3: Steady low confusion (clarity 70-80)
  if (clarityScore >= 70 && clarityScore < 80) {
    return {
      action: "CONTINUE_WITH_CHECKS",
      title: "✓ Continue - Class is following adequately",
      description: "Minor confusion is normal. Quick check-in recommended.",
      estimatedTime: "1-2 minutes",
      expectedOutcome: "Periodic \"Everyone following?\" question",
      priority: "LOW"
    };
  }
  
  // Rule 4: Clear understanding (clarity 80+)
  if (clarityScore >= 80) {
    return {
      action: "CONTINUE_NORMALLY",
      title: "✅ Excellent! Continue teaching",
      description: "Class comprehension is high. Maintain current pace.",
      estimatedTime: "N/A",
      expectedOutcome: "Students are following well",
      priority: "LOW"
    };
  }
  
  // Rule 5: Time-based fatigue (30+ minutes into session, confusion increasing)
  if (sessionDuration > 30 && clarityScore < 70) {
    return {
      action: "TAKE_BREAK",
      title: "⏰ Students may be losing focus",
      description: "Consider a 2-minute active exercise or short break",
      estimatedTime: "2-3 minutes",
      expectedOutcome: "Re-energize students, improve attention",
      priority: "MEDIUM"
    };
  }
  
  // Rule 6: Moderate confusion (clarity 60-70)
  return {
    action: "CLARIFY_BRIEFLY",
    title: "💡 Provide quick clarification",
    description: `Address confusion about ${confusionClustering.primary.topic}`,
    estimatedTime: "2-3 minutes",
    expectedOutcome: "Targeted explanation without losing momentum",
    priority: "MEDIUM"
  };
}

module.exports = { getRecommendedAction };
```

**Update Dashboard API Response:**
Modify /api/session/:sessionId/dashboard to include:
```json
{
  ...existing fields,
  "recommendedAction": {
    "action": "PAUSE_AND_RECAP",
    "title": "⚡ Pause and recap last 2 concepts",
    "description": "18 new confusion signals in last 5 minutes (spike detected)",
    "estimatedTime": "3-4 minutes",
    "expectedOutcome": "Confusion should decrease by 40-60% after clarification",
    "priority": "HIGH"
  }
}
```

**Frontend Component:**

1. RecommendedActionCard.jsx
   - Props: recommendedAction
   - Display:
     ```
     ┌────────────────────────────────────────┐
     │  ⚡ RECOMMENDED ACTION                  │
     ├────────────────────────────────────────┤
     │  Pause and recap last 2 concepts       │
     │                                        │
     │  Estimated time: 3-4 minutes           │
     │                                        │
     │  Reason: 18 new confusion signals in   │
     │  last 5 minutes (spike detected)       │
     │                                        │
     │  Expected outcome: Confusion should    │
     │  decrease by 40-60% after clarification│
     │                                        │
     │  [Take Action] [Ignore] [Snooze 5min]  │
     └────────────────────────────────────────┘
     ```
   - Styling:
     - HIGH priority: Red border, pulse animation
     - MEDIUM priority: Yellow border
     - LOW priority: Green border
   - Buttons:
     - "Take Action": Log action taken (future: track outcomes)
     - "Ignore": Dismiss card
     - "Snooze 5min": Hide for 5 minutes

**Action Tracking (Backend):**
Create endpoint: POST /api/session/:sessionId/action-taken
- Body: { action: "PAUSE_AND_RECAP", timestamp: ISO }
- Purpose: Track which recommendations teachers follow (for future ML)
- Store in database (new table: TeacherActions)

**Frontend Integration:**
- Add RecommendedActionCard to TeacherDashboard below confusion clustering
- Only show if recommendedAction exists and priority is MEDIUM or HIGH
- Animate entry (slide in from right)
- Auto-dismiss LOW priority recommendations after 30 seconds

DELIVERABLE:
- getRecommendedAction() function working with all 6 rules
- Dashboard API returns recommendedAction in response
- RecommendedActionCard component renders correctly
- Priority-based styling working (red/yellow/green)
- Action tracking endpoint created (POST /api/session/:sessionId/action-taken)

TEST:
1. Create test session with 0 signals → Recommended action: "Continue normally"
2. Add 20 signals in last 5 minutes → Recommended action: "Pause and recap"
3. Add 25 signals with clarity <60 for 15 minutes → Recommended action: "Deep dive"
4. Set session duration to 35 minutes with clarity 65 → Recommended action: "Take break"
5. Click "Take Action" button → Action logged to database
```

---

## PHASE 3: PRIORITY FEATURES (P1 - HIGH PRIORITY)

### **PROMPT 3.1: Confusion Timeline Visualization**

```
Implement an interactive confusion timeline chart showing when confusion occurred during the session.

CONTEXT:
Teachers review this after class to identify which moments caused confusion, helping them improve future lectures.

REQUIREMENTS:

**Backend API Endpoint:**

GET /api/session/:sessionId/timeline
- Purpose: Get time-series confusion data for charting
- Response:
```json
{
  "sessionId": "uuid",
  "startTime": "2026-02-14T10:00:00Z",
  "endTime": "2026-02-14T10:50:00Z",
  "timelineData": [
    { "minute": 0, "confusionCount": 0, "confusionPercentage": 0 },
    { "minute": 5, "confusionCount": 3, "confusionPercentage": 8 },
    { "minute": 10, "confusionCount": 5, "confusionPercentage": 13 },
    { "minute": 15, "confusionCount": 12, "confusionPercentage": 30 },
    { "minute": 20, "confusionCount": 18, "confusionPercentage": 45 },
    { "minute": 25, "confusionCount": 8, "confusionPercentage": 20 },
    { "minute": 30, "confusionCount": 4, "confusionPercentage": 10 },
    ...
  ],
  "teacherActions": [
    { "minute": 23, "action": "PAUSE_AND_RECAP", "description": "Paused to clarify 3NF" }
  ]
}
```

**Backend Implementation:**
- Group confusion signals into 5-minute buckets
- Calculate confusion count and percentage per bucket
- Include teacher actions from TeacherActions table (if any)

**Frontend Component:**

1. ConfusionTimeline.jsx (using Chart.js)
   - Props: timelineData, teacherActions
   - Chart type: Line chart with markers
   - X-axis: Time (minutes from session start)
   - Y-axis: Confusion percentage (0-100%)
   - Line: Confusion trend (blue line)
   - Markers: Teacher actions (vertical red lines with labels)
   - Interactive: Hover over point to see:
     - Exact time
     - Topic (if available - most common topic in that 5-min window)
     - Number of signals

**Chart Configuration:**
```javascript
const chartData = {
  labels: timelineData.map(d => `${d.minute} min`),
  datasets: [{
    label: 'Confusion %',
    data: timelineData.map(d => d.confusionPercentage),
    borderColor: 'rgb(59, 130, 246)', // blue
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.3, // Smooth curve
    pointRadius: 5,
    pointHoverRadius: 8
  }]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Confusion Timeline' },
    tooltip: {
      callbacks: {
        afterLabel: (context) => {
          const minute = context.parsed.x;
          const action = teacherActions.find(a => a.minute === minute);
          return action ? `Teacher: ${action.description}` : '';
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: { display: true, text: 'Confusion %' }
    },
    x: {
      title: { display: true, text: 'Session Time (minutes)' }
    }
  }
};
```

**Frontend Integration:**
- Add ConfusionTimeline to TeacherDashboard as a new section (below recommended actions)
- Make it collapsible (expand/collapse with button)
- Show "Session in Progress - Timeline updates live" if session active
- Show "Session Complete - Review Timeline" if session ended

**Visual Enhancements:**
- Add annotations for teacher actions (vertical lines with labels)
- Color spikes red (confusion >40%), normal range blue
- Show resolution moments (confusion drops 50%+ in 5 min) with green markers

DELIVERABLE:
- GET /api/session/:sessionId/timeline returns time-series data
- ConfusionTimeline component renders line chart correctly
- Hover tooltips show details (time, topic, teacher actions)
- Chart updates in real-time (if session active)
- Teacher actions marked on timeline (vertical lines)

TEST:
1. Create session with signals at various times
2. Visit teacher dashboard
3. Verify chart displays with correct data points
4. Hover over point → Tooltip shows minute and confusion count
5. Add teacher action → Vertical marker appears at that minute
```

---

### **PROMPT 3.2: Recurring Gap Detection (Institutional Intelligence)**

```
Implement cross-session analysis to identify topics that repeatedly confuse students.

CONTEXT:
This is THE feature that differentiates EduPulse internationally. It shows institutional-level patterns, not just single-class insights.

REQUIREMENTS:

**Backend API Endpoint:**

GET /api/institution/:institutionId/recurring-gaps
- Purpose: Analyze confusion patterns across all sessions for this institution
- Query params: ?courseId={optional}, ?timeframe={semester|year}
- Authentication: Admin or teacher (teachers see only their courses)
- Response:
```json
{
  "institutionId": "uuid",
  "timeframe": "semester",
  "recurringGaps": [
    {
      "topic": "Database Normalization - 3NF",
      "severity": "CRITICAL",
      "frequency": {
        "total": 12,
        "affectedSessions": 8,
        "totalSessions": 10,
        "percentage": 80
      },
      "avgConfusionPercentage": 67,
      "courses": ["CS301-Database Systems", "CS401-Advanced Databases"],
      "teachers": ["Dr. Amit Kumar", "Dr. Priya Sharma"],
      "firstDetected": "2026-01-15T10:00:00Z",
      "lastDetected": "2026-02-14T10:00:00Z",
      "interventions": [],
      "recommendations": [
        "Add prerequisite module on functional dependencies",
        "Create supplementary video explainer",
        "Faculty training on alternative teaching methods"
      ]
    },
    {
      "topic": "SQL Joins - Outer Join",
      "severity": "HIGH",
      "frequency": { ... },
      ...
    },
    ...
  ]
}
```

**Severity Classification:**
```javascript
function calculateSeverity(gap) {
  const { frequency, avgConfusionPercentage } = gap;
  
  // CRITICAL: >75% sessions affected AND >60% avg confusion
  if (frequency.percentage > 75 && avgConfusionPercentage > 60) {
    return "CRITICAL";
  }
  
  // HIGH: >50% sessions affected OR >70% avg confusion
  if (frequency.percentage > 50 || avgConfusionPercentage > 70) {
    return "HIGH";
  }
  
  // MEDIUM: >25% sessions affected OR >50% avg confusion
  if (frequency.percentage > 25 || avgConfusionPercentage > 50) {
    return "MEDIUM";
  }
  
  return "LOW";
}
```

**Backend Implementation:**
```javascript
async function findRecurringGaps(institutionId, timeframe = 'semester') {
  // 1. Get all sessions for institution in timeframe
  const sessions = await prisma.session.findMany({
    where: {
      course: { institutionId },
      startTime: { gte: getTimeframeStart(timeframe) }
    },
    include: {
      confusionSignals: true,
      course: true,
      teacher: true
    }
  });
  
  // 2. Group signals by topic
  const topicAnalysis = {};
  sessions.forEach(session => {
    session.confusionSignals.forEach(signal => {
      const topic = signal.topic || "General";
      if (!topicAnalysis[topic]) {
        topicAnalysis[topic] = {
          sessionIds: new Set(),
          totalSignals: 0,
          courses: new Set(),
          teachers: new Set(),
          timestamps: []
        };
      }
      topicAnalysis[topic].sessionIds.add(session.id);
      topicAnalysis[topic].totalSignals++;
      topicAnalysis[topic].courses.add(session.course.name);
      topicAnalysis[topic].teachers.add(session.teacher.name);
      topicAnalysis[topic].timestamps.push(signal.timestamp);
    });
  });
  
  // 3. Calculate metrics and filter for recurring patterns
  const recurringGaps = Object.entries(topicAnalysis)
    .filter(([topic, data]) => data.sessionIds.size >= 3) // At least 3 sessions
    .map(([topic, data]) => {
      const frequency = {
        total: data.totalSignals,
        affectedSessions: data.sessionIds.size,
        totalSessions: sessions.length,
        percentage: Math.round((data.sessionIds.size / sessions.length) * 100)
      };
      
      const avgConfusionPercentage = Math.round(
        data.totalSignals / data.sessionIds.size / 40 * 100
      );
      
      return {
        topic,
        severity: calculateSeverity({ frequency, avgConfusionPercentage }),
        frequency,
        avgConfusionPercentage,
        courses: Array.from(data.courses),
        teachers: Array.from(data.teachers),
        firstDetected: data.timestamps.sort()[0],
        lastDetected: data.timestamps.sort().reverse()[0],
        recommendations: generateRecommendations(topic, frequency, avgConfusionPercentage)
      };
    })
    .sort((a, b) => {
      const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  
  return recurringGaps;
}

function generateRecommendations(topic, frequency, avgConfusion) {
  const recs = [];
  
  if (avgConfusion > 70) {
    recs.push("🎯 Curriculum review strongly recommended");
  }
  
  if (frequency.percentage > 75) {
    recs.push("📚 Add prerequisite module or foundational material");
  }
  
  if (frequency.affectedSessions > 5) {
    recs.push("👥 Faculty training session on alternative teaching methods");
  }
  
  recs.push(`📹 Create supplementary video explainer for "${topic}"`);
  recs.push(`📝 Develop practice exercises specifically for "${topic}"`);
  
  return recs;
}
```

**Frontend Components:**

1. RecurringGapsView.jsx (Admin page)
   - Route: /admin/recurring-gaps
   - Display:
     ```
     ┌───────────────────────────────────────────┐
     │  🔍 INSTITUTIONAL LEARNING GAPS            │
     │  Semester: Spring 2026 | Total Sessions: 120│
     └───────────────────────────────────────────┘
     
     ┌───────────────────────────────────────────┐
     │  🔴 CRITICAL GAP                           │
     ├───────────────────────────────────────────┤
     │  Database Normalization - 3NF              │
     │                                           │
     │  Frequency: 8 of 10 sections (80%)        │
     │  Avg Confusion: 67% of students           │
     │  Courses: Database Systems, Advanced DB    │
     │  Teachers: Dr. Kumar, Dr. Sharma          │
     │                                           │
     │  First Detected: Jan 15, 2026             │
     │  Last Detected: Feb 14, 2026              │
     │                                           │
     │  📋 RECOMMENDATIONS:                      │
     │  • Curriculum review strongly recommended │
     │  • Add prerequisite module                │
     │  • Faculty training session               │
     │  • Create video explainer                 │
     │                                           │
     │  [View Details] [Mark as Addressed]       │
     └───────────────────────────────────────────┘
     ```

2. GapCard.jsx (component)
   - Props: gap (recurring gap object)
   - Severity styling:
     - CRITICAL: Red border, red badge
     - HIGH: Orange border, orange badge
     - MEDIUM: Yellow border, yellow badge
     - LOW: Gray border, gray badge

**Frontend Features:**
- Filter by severity (show only CRITICAL and HIGH by default)
- Filter by course/department
- Export to PDF for accreditation reports
- "Mark as Addressed" button (adds intervention record)

DELIVERABLE:
- GET /api/institution/:institutionId/recurring-gaps returns analysis
- Severity classification working correctly
- Recommendations generated automatically
- RecurringGapsView renders list of gaps sorted by severity
- Each gap shows frequency, courses, teachers, recommendations
- Export to PDF button functional

TEST:
1. Create 10 sessions for "Database Systems" course
2. Add confusion signals with topic "3NF" to 8 of them (high frequency)
3. Add signals with topic "Joins" to 3 of them (medium frequency)
4. Visit /admin/recurring-gaps
5. Verify "3NF" appears as CRITICAL or HIGH severity
6. Verify recommendations are logical
7. Click "Export PDF" → PDF downloads with gap analysis
```

---

### **PROMPT 3.3: ROI Calculator & Competitive Comparison**

```
Create two pitch-focused features: ROI Calculator for showing financial value, and Competitive Comparison Dashboard.

CONTEXT:
These are sales/pitch tools to convince universities to adopt EduPulse and to show judges why we're better than competitors.

REQUIREMENTS:

**1. ROI CALCULATOR**

Frontend Component: ROICalculator.jsx
- Route: /pitch/roi-calculator (public, no auth)
- Interactive calculator with inputs:
  ```
  Institution Size:
  [ ] Small (<5,000 students)
  [x] Medium (5,000-15,000 students)
  [ ] Large (>15,000 students)
  
  Current Dropout Rate: [18]% (slider 10-30%)
  
  Average Tuition: ₹[120,000]/year
  ```

- Real-time calculation display:
  ```
  ┌────────────────────────────────────────┐
  │  FINANCIAL IMPACT ANALYSIS             │
  ├────────────────────────────────────────┤
  │  Current State                         │
  │  • Total Students: 10,000              │
  │  • Dropout Rate: 18%                   │
  │  • Students Lost/Year: 1,800           │
  │  • Lost Revenue: ₹21.6 crore           │
  │                                        │
  │  With EduPulse (10% improvement)       │
  │  • Students Retained: 180 additional   │
  │  • Revenue Protected: ₹2.16 crore      │
  │  • EduPulse Cost: ₹8 lakh (Enterprise) │
  │                                        │
  │  NET BENEFIT: ₹2.08 crore              │
  │  ROI: 2,600% in Year 1                 │
  │  Payback Period: 0.4 months            │
  │                                        │
  │  [Generate PDF Report]                 │
  │  [Email to Stakeholders]               │
  └────────────────────────────────────────┘
  ```

**Calculation Logic:**
```javascript
function calculateROI(inputs) {
  const { institutionSize, dropoutRate, avgTuition } = inputs;
  
  // Student counts by size
  const studentCounts = {
    'small': 3000,
    'medium': 10000,
    'large': 25000
  };
  const totalStudents = studentCounts[institutionSize];
  
  // Current state
  const studentsLost = Math.round(totalStudents * (dropoutRate / 100));
  const lostRevenue = studentsLost * avgTuition;
  
  // With EduPulse (conservative 10% improvement)
  const improvementRate = 0.10;
  const studentsRetained = Math.round(studentsLost * improvementRate);
  const revenueProtected = studentsRetained * avgTuition;
  
  // Pricing by size
  const pricing = {
    'small': 200000,    // ₹2L
    'medium': 800000,   // ₹8L
    'large': 1500000    // ₹15L
  };
  const edupulseCost = pricing[institutionSize];
  
  // ROI calculation
  const netBenefit = revenueProtected - edupulseCost;
  const roi = Math.round((netBenefit / edupulseCost) * 100);
  const paybackMonths = (edupulseCost / revenueProtected * 12).toFixed(1);
  
  return {
    totalStudents,
    dropoutRate,
    studentsLost,
    lostRevenue,
    studentsRetained,
    revenueProtected,
    edupulseCost,
    netBenefit,
    roi,
    paybackMonths
  };
}
```

**PDF Generation:**
- Use jsPDF library
- Include: Calculator inputs, results, EduPulse logo, contact info
- Endpoint: POST /api/generate-roi-pdf
- Body: ROI calculation results
- Response: PDF file download

---

**2. COMPETITIVE COMPARISON DASHBOARD**

Frontend Component: CompetitiveComparison.jsx
- Route: /pitch/comparison (public)
- Static comparison table:

```
┌──────────────────────────────────────────────────────────────┐
│  EduPulse vs. Traditional Methods                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Feature          │Verbal Q's│End Survey│Poll Evr│EduPulse  │
│  ────────────────────────────────────────────────────────── │
│  Participation    │   12%    │   45%    │  45%   │  74% ⭐  │
│  Timeliness       │ Real-time│ 24hr lag │Real-time│Real-time│
│  Specificity      │  Vague   │  Medium  │Teacher │  AI    ⭐│
│  Setup Time       │  None    │  5 min   │ 5-10min│  None ⭐ │
│  Anonymity        │    No    │   Yes    │  Yes   │  Yes   │
│  Learning Intel   │    No    │    No    │   No   │  Yes  ⭐ │
│  Cost/Dept        │  Free    │  Free    │ ₹1.4L  │ ₹1.0L ⭐ │
│                                                              │
│  ⭐ = EduPulse Advantage                                     │
└──────────────────────────────────────────────────────────────┘

KEY DIFFERENTIATORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Highest participation rate (74% vs. 12-45%)
✓ Purpose-built for learning gaps (not general polling)
✓ Institutional learning intelligence (recurring gap detection)
✓ Zero setup time (always ready)
✓ 30% cheaper than Poll Everywhere
✓ AI-powered recommendations (unique feature)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHY NOT POLL EVERYWHERE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Poll Everywhere: General-purpose polling tool
  → Teacher must create polls manually
  → No learning-specific intelligence
  → No institutional memory

EduPulse: Purpose-built learning gap detection
  → Zero setup, always ready
  → AI-powered pattern recognition
  → Cross-session institutional insights
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Implementation:**
- Static React component with styled table
- Use Tailwind for professional styling
- Add icons for ⭐ advantages
- Responsive design (works on projector and mobile)

DELIVERABLE:
- ROI Calculator fully functional with real-time updates
- Calculation logic tested and accurate
- PDF generation working (download with institution logo)
- Competitive Comparison page rendering with clean design
- Both pages accessible from pitch deck (QR code or link)

TEST:
1. Visit /pitch/roi-calculator
2. Adjust sliders → Numbers update instantly
3. Click "Generate PDF" → PDF downloads with correct data
4. Visit /pitch/comparison
5. Verify table displays all data clearly
6. Test on mobile → Responsive layout works
```

---

## PHASE 4: POLISH & DEPLOYMENT

### **PROMPT 4.1: Authentication & Authorization**

```
Implement complete authentication system for teachers and admins.

REQUIREMENTS:

**Backend - Authentication:**

1. POST /api/auth/register
   - Body: { email, password, name, role, institution }
   - Validation: Email format, password >=8 chars, role in ['teacher', 'admin']
   - Hash password with bcryptjs (10 rounds)
   - Create user in database
   - Return: { success: true, message: "User created" }

2. POST /api/auth/login
   - Body: { email, password }
   - Validate credentials
   - Generate JWT token (expires in 7 days)
   - Return: { token, user: { id, email, name, role } }

3. GET /api/auth/me
   - Headers: Authorization: Bearer {token}
   - Validate JWT
   - Return current user info

**JWT Middleware (middleware/auth.js):**
```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
```

**Apply Auth to Protected Routes:**
- /api/session/:id/dashboard → authenticateToken + requireRole(['teacher', 'admin'])
- /api/admin/* → authenticateToken + requireRole(['admin'])

**Frontend - Login/Signup:**

1. Login.jsx (page at /login)
   - Form: Email, Password
   - Submit: POST /api/auth/login
   - On success: Save token to localStorage, redirect to /teacher/dashboard

2. Signup.jsx (page at /signup)
   - Form: Email, Password, Name, Institution
   - Role: Hardcode 'teacher' (admin accounts created manually)
   - Submit: POST /api/auth/register
   - On success: Auto-login

3. ProtectedRoute.jsx (component)
   - Checks localStorage for token
   - If no token: Redirect to /login
   - If token: Render children

**Update App.jsx Routing:**
```javascript
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/session/:id" element={<StudentView />} />
  <Route path="/pitch/*" element={<PitchRoutes />} />
  
  {/* Protected routes */}
  <Route path="/teacher/*" element={
    <ProtectedRoute>
      <TeacherRoutes />
    </ProtectedRoute>
  } />
  <Route path="/admin/*" element={
    <ProtectedRoute requiredRole="admin">
      <AdminRoutes />
    </ProtectedRoute>
  } />
</Routes>
```

**Logout Functionality:**
- Add "Logout" button to teacher/admin dashboards
- onClick: Clear localStorage, redirect to /login

DELIVERABLE:
- POST /api/auth/register working (test with Postman)
- POST /api/auth/login returning JWT token
- JWT middleware protecting routes
- Login page functional
- Signup page functional
- Protected routes redirecting to /login if not authenticated
- Logout working

TEST:
1. Visit /teacher/dashboard → Redirected to /login
2. Create account via /signup → Success
3. Login via /login → Token saved, redirected to dashboard
4. Refresh page → Still logged in (token persists)
5. Logout → Token cleared, redirected to /login
6. Try accessing /admin/* as teacher → 403 Forbidden
```

---

### **PROMPT 4.2: Session Management & QR Codes**

```
Implement complete session lifecycle management for teachers.

REQUIREMENTS:

**Backend Endpoints:**

1. POST /api/session/create
   - Auth: Teacher only
   - Body: { courseId }
   - Logic:
     - Create new session with startTime = now
     - Generate unique session URL: /session/{sessionId}
     - Generate QR code for URL (use qrcode package)
     - Save QR code as base64 string
   - Return: { sessionId, qrCode (base64), sessionUrl }

2. POST /api/session/:id/end
   - Auth: Teacher only (must own session)
   - Logic: Set endTime = now
   - Return: { success: true }

3. GET /api/teacher/:id/sessions
   - Auth: Teacher only (own sessions) or Admin
   - Return: List of all sessions for this teacher
   - Response:
   ```json
   {
     "sessions": [
       {
         "id": "uuid",
         "course": { "name": "Database Systems", "code": "CS301" },
         "startTime": "2026-02-14T10:00:00Z",
         "endTime": "2026-02-14T10:50:00Z",
         "clarityScore": 72,
         "totalSignals": 45,
         "status": "completed"
       },
       ...
     ]
   }
   ```

**Frontend - Teacher Session Management:**

1. StartSessionPage.jsx (at /teacher/start-session)
   - Display: List of teacher's courses (fetch from API)
   - "Start New Session" button for each course
   - On click: POST /api/session/create
   - On success: Redirect to /teacher/session/:id

2. SessionView.jsx (enhanced teacher dashboard)
   - Add QR code display at top:
     ```
     ┌──────────────────────────────────┐
     │  SESSION ACTIVE                  │
     │  Course: Database Systems        │
     │  Started: 10:00 AM               │
     │                                  │
     │  ███████████                     │
     │  ███ QR ████  ← Display QR       │
     │  ███████████                     │
     │                                  │
     │  Students scan to join           │
     │  [End Session]                   │
     └──────────────────────────────────┘
     ```
   - "End Session" button: POST /api/session/:id/end, redirect to history

3. SessionHistory.jsx (at /teacher/sessions)
   - Table of past sessions:
     | Date | Course | Duration | Clarity Score | Signals | Actions |
     | 2/14 | DB Sys | 50 min   | 72           | 45      | [View] |
   - Click "View" → Open /teacher/session/:id in review mode

**QR Code Generation (Backend):**
```javascript
const QRCode = require('qrcode');

async function generateSessionQR(sessionId) {
  const url = `${process.env.FRONTEND_URL}/session/${sessionId}`;
  const qrDataURL = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  return qrDataURL; // base64 data URL
}
```

DELIVERABLE:
- POST /api/session/create generates session + QR code
- QR code displays correctly on teacher dashboard
- Student can scan QR → Redirected to /session/:id
- "End Session" button works (sets endTime)
- Session history page shows past sessions
- Teacher can review completed sessions

TEST:
1. Login as teacher
2. Click "Start New Session" for "Database Systems"
3. Session created → QR code displayed
4. Scan QR with phone → Student view loads
5. End session → Redirected to history
6. History shows completed session with stats
```

---

### **PROMPT 4.3: Final Polish & Production Deployment**

```
Prepare application for production deployment on Vercel (frontend) and Railway (backend + database).

REQUIREMENTS:

**1. Environment Configuration:**

Frontend (.env.production):
```
VITE_API_URL=https://edupulse-api.up.railway.app/api
```

Backend (.env on Railway):
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
JWT_SECRET=your-secure-secret-key-change-this
PORT=3001
FRONTEND_URL=https://edupulse.vercel.app
NODE_ENV=production
```

**2. Backend Deployment (Railway):**

Create railway.json:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Update package.json scripts:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "db:migrate": "npx prisma migrate deploy",
    "db:seed": "npx prisma db seed"
  }
}
```

Deployment steps:
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add PostgreSQL addon in Railway
4. Set environment variables in Railway dashboard
5. Run migrations: railway run npm run db:migrate
6. Deploy: Automatic on git push

**3. Frontend Deployment (Vercel):**

Update vite.config.js:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173
  }
});
```

Create vercel.json:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Deployment steps:
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variable: VITE_API_URL
4. Deploy: Automatic on git push

**4. Error Handling & Loading States:**

Add global error boundary (ErrorBoundary.jsx):
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}
```

Add loading spinners:
- Use state: isLoading
- Show spinner component while fetching data
- Skeleton screens for dashboard (optional but nice)

**5. Security Hardening:**

Backend:
- Add helmet middleware: `app.use(helmet())`
- Rate limiting: `app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 100 }))`
- CORS: `app.use(cors({ origin: process.env.FRONTEND_URL }))`
- Input validation: Use express-validator

Frontend:
- Sanitize user inputs (prevent XSS)
- Use HTTPS only (Vercel provides automatically)
- Store JWT in httpOnly cookies (more secure than localStorage) - optional upgrade

**6. Performance Optimization:**

Backend:
- Add database indexes (already in schema)
- Enable connection pooling: Prisma handles this
- Cache frequently accessed data (future: Redis)

Frontend:
- Code splitting: React.lazy() for routes
- Image optimization: Use WebP format
- Minification: Vite handles automatically

**7. Monitoring & Logging:**

Backend:
- Add morgan for HTTP logging: `app.use(morgan('combined'))`
- Error logging: console.error() (Railway captures logs)

Frontend:
- Console.error for debugging
- Optional: Add Sentry for error tracking (free tier)

**8. Testing Checklist:**

Manual testing:
- [ ] Student can signal confusion via QR code
- [ ] Teacher sees signals in real-time
- [ ] Clarity Score calculates correctly
- [ ] Recommended Actions display
- [ ] Confusion Timeline renders
- [ ] Recurring Gaps detect patterns
- [ ] ROI Calculator computes correctly
- [ ] Authentication works (login/logout)
- [ ] Session create/end works
- [ ] Mobile responsive (test on phone)

Load testing (optional):
- Use Artillery or k6 to simulate 100 concurrent users
- Target: <2s response time for dashboard API

DELIVERABLE:
- Backend deployed on Railway with PostgreSQL
- Frontend deployed on Vercel
- Both services connected and working
- All features functional in production
- Error handling in place
- Security middleware added
- Performance optimized

TEST IN PRODUCTION:
1. Visit https://edupulse.vercel.app
2. Create teacher account
3. Start session
4. Scan QR on phone → Student view loads
5. Submit confusion signal → Appears on teacher dashboard within 5 seconds
6. End session → Data persists
7. Check recurring gaps (if enough data)
8. Test ROI calculator
```

---

## APPENDIX: QUICK REFERENCE

### **Feature Checklist:**

**P0 (Critical - Build First):**
- [x] Confusion Signal Submission (Student)
- [x] Real-Time Dashboard (Teacher)
- [x] Confusion Clustering
- [x] Clarity Score
- [x] Recommended Actions

**P1 (High Priority - Build Second):**
- [x] Confusion Timeline
- [x] Recurring Gap Detection
- [x] ROI Calculator
- [x] Competitive Comparison

**P2 (Nice to Have - After Competition):**
- [ ] Self-Service Onboarding
- [ ] Faculty Champion Portal
- [ ] Anomaly Detection
- [ ] Accreditation Reports

### **API Endpoints Summary:**

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/signal/submit | No | Student submits confusion |
| GET | /api/session/:id/join | No | Student loads session |
| GET | /api/session/:id/dashboard | JWT | Teacher dashboard data |
| POST | /api/session/create | JWT | Create new session |
| POST | /api/session/:id/end | JWT | End session |
| GET | /api/teacher/:id/sessions | JWT | Session history |
| GET | /api/institution/:id/recurring-gaps | JWT | Recurring gaps analysis |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/register | No | Signup |

### **Tech Stack:**
- **Frontend:** React, Vite, Tailwind CSS, Chart.js, React Router
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Auth:** JWT, bcryptjs
- **Deployment:** Vercel (frontend), Railway (backend + DB)
- **Other:** FingerprintJS, QRCode, jsPDF

### **Database Tables:**
- Institution, Course, Session, ConfusionSignal, Topic, User, LearningOutcome

### **Key Metrics to Track:**
- Student participation rate (target 70%+)
- Clarity Score average (target 70+)
- Teacher action follow-rate (target 70%+)
- Quiz score improvement (target 5-10 points)
- Sessions deployed (target 50)

---

**END OF ANTIGRAVITY BUILD PROMPTS**

**Usage:** Copy each prompt sequentially, paste into AntiGravity, review output, test, then proceed to next prompt. Estimated total build time: 32-44 hours.
