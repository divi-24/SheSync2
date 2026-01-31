# SheSync Backend - Production Setup

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 📊 New Period Tracker API

The latest addition to SheSync is a comprehensive period tracking system with the following features:

### ✨ Features

- **🔄 Cycle Tracking**: Monitor menstrual cycles with prediction algorithms
- **😊 Mood Monitoring**: Track emotional patterns with severity levels
- **🩺 Symptom Analysis**: Detailed symptom tracking with severity ratings
- **😴 Sleep Patterns**: Monitor sleep quality and duration
- **🤖 AI Health Tips**: Personalized health recommendations
- **📈 Analytics**: Comprehensive health insights and trends
- **🔒 Privacy Controls**: Private, parent-shared, or doctor-shared options

### 🛡️ Security & Production Features

- **JWT Authentication**: Secure user authentication
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Production-ready error responses
- **Database Optimization**: Indexed queries and performance optimization
- **Data Privacy**: User-owned data with access controls

## 🏗️ Architecture

```
backend/
├── controllers/
│   ├── periodTrackerController.js  # ✨ NEW - Period tracking logic
│   ├── authController.js
│   └── ...
├── models/
│   ├── PeriodTracker.js           # ✨ NEW - Period tracking schema
│   ├── User.js
│   └── ...
├── routes/
│   ├── periodTrackerRoutes.js     # ✨ NEW - Period tracking endpoints
│   ├── auth.js
│   └── ...
├── middleware/
│   ├── auth.js                    # Authentication middleware
│   └── ...
├── docs/
│   └── PeriodTrackerAPI.md        # ✨ NEW - API documentation
└── server.js                      # Main server configuration
```

## 🛠️ Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/shesync
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/shesync

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📚 API Endpoints

### Period Tracker Endpoints

| Method   | Endpoint                           | Description               |
| -------- | ---------------------------------- | ------------------------- |
| `POST`   | `/api/period-tracker`              | Create new period tracker |
| `GET`    | `/api/period-tracker/active`       | Get active tracker        |
| `PUT`    | `/api/period-tracker/:id`          | Update tracker            |
| `GET`    | `/api/period-tracker/history`      | Get tracking history      |
| `GET`    | `/api/period-tracker/analytics`    | Get health analytics      |
| `POST`   | `/api/period-tracker/:id/mood`     | Add mood tracking         |
| `POST`   | `/api/period-tracker/:id/symptoms` | Add symptom tracking      |
| `POST`   | `/api/period-tracker/:id/sleep`    | Add sleep tracking        |
| `DELETE` | `/api/period-tracker/:id`          | Delete tracker            |

### Authentication Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login`    | User login        |
| `GET`  | `/api/auth/profile`  | Get user profile  |
| `POST` | `/api/auth/logout`   | User logout       |

### Other Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| `GET`  | `/api/health`      | Server health check |
| `POST` | `/api/waitlist`    | Join waitlist       |
| `GET`  | `/api/communities` | Get communities     |
| `POST` | `/api/posts`       | Create post         |

## 🔧 Testing the Period Tracker API

### 1. Register/Login a User

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123",
    "role": "user"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "securepassword123"
  }'
```

### 2. Create Period Tracker

```bash
curl -X POST http://localhost:5000/api/period-tracker \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cycleInfo": {
      "cycleDuration": 28,
      "lastPeriodStart": "2024-01-15",
      "lastPeriodDuration": 5
    },
    "moodTracking": [{
      "moodTypes": ["Happy", "Energized"],
      "intensity": "medium",
      "date": "2024-01-20"
    }],
    "symptomTracking": [{
      "symptoms": [
        {"name": "Lower Abdomen Cramps", "severity": "mild"},
        {"name": "Bloating", "severity": "moderate"}
      ],
      "date": "2024-01-16"
    }],
    "sleepTracking": [{
      "duration": 8.5,
      "quality": "good",
      "date": "2024-01-20"
    }]
  }'
```

### 3. Get Active Tracker

```bash
curl -X GET http://localhost:5000/api/period-tracker/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Database Schema

### PeriodTracker Model

```javascript
{
  userId: ObjectId,           // Reference to User
  cycleInfo: {
    cycleDuration: Number,    // 15-50 days
    lastPeriodStart: Date,
    lastPeriodDuration: Number, // 1-15 days
    nextPeriodPrediction: Date,
    irregularCycle: Boolean
  },
  moodTracking: [{
    moodTypes: [String],      // ['Happy', 'Sad', 'Calm', etc.]
    intensity: String,        // 'low', 'medium', 'high'
    date: Date,
    notes: String
  }],
  symptomTracking: [{
    symptoms: [{
      name: String,           // 'Lower Abdomen Cramps', etc.
      severity: String        // 'none', 'mild', 'moderate', 'severe'
    }],
    date: Date,
    notes: String
  }],
  sleepTracking: [{
    duration: Number,         // 0-24 hours
    quality: String,          // 'poor', 'fair', 'good', 'excellent'
    date: Date,
    notes: String
  }],
  healthTips: [{
    tip: String,
    category: String,         // 'cycle', 'symptoms', 'mood', 'sleep'
    generated: Date
  }],
  isActive: Boolean,
  privacy: String,            // 'private', 'shared_with_parent', 'shared_with_doctor'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

### Rate Limiting

- **Create Operations**: 5 requests/15 minutes
- **Update Operations**: 20 requests/15 minutes
- **Data Addition**: 30 requests/15 minutes
- **General Operations**: 100 requests/15 minutes

### Authentication

- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes middleware
- Session management

### Data Validation

- Input sanitization
- Schema validation with Mongoose
- Custom validation rules
- Error handling with detailed messages

## 🚀 Deployment

### Prerequisites

- Node.js 18+
- MongoDB 5.0+
- Environment variables configured

### Production Deployment

1. **Build and Install**

   ```bash
   npm ci --production
   ```

2. **Environment Setup**

   ```bash
   export NODE_ENV=production
   export PORT=5000
   export MONGO_URI=your-production-mongodb-uri
   export JWT_SECRET=your-production-jwt-secret
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Monitoring & Logging

### Health Checks

- **General Health**: `GET /api/health`
- **Period Tracker Health**: `GET /api/period-tracker/health`
- **Database Connection**: Automatic MongoDB connection monitoring

### Logging

- Request/Response logging
- Error tracking
- Performance monitoring
- Database query logging

## 🧪 Development & Testing

### Development Setup

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run in development mode
NODE_ENV=development npm run dev
```

### API Testing

- Use the provided cURL examples
- Import Postman collections from `/backend/*.postman_collection.json`
- Use the interactive API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the API documentation in `/docs/PeriodTrackerAPI.md`
- Review the code examples above
- Create an issue in the repository

---

**Happy Coding! 🎉**

The SheSync Period Tracker API is now ready for production use with comprehensive health tracking capabilities!

## 🧠 Hybrid Context Memory System (New)

This system builds a privacy-first, AI-ready memory of each user's health context by combining snapshotting, change detection, hybrid summarization (rule-based + Gemini), and vector memory retrieval.

### Why this exists

- Keep a current, consent-aware context snapshot per user for fast access.
- Detect meaningful changes to the context and compress historical state into human-readable memories.
- Enable retrieval over past summaries using vector similarity (MongoDB Atlas Vector Search) for better personalization.

### Key properties

- Privacy-first: honors `User.aiConsent`; sensitive fields are excluded when consent is false.
- Hybrid: rule-based stats → AI 2–3 sentence narrative → vector embedding.
- Resilient: no-AI fallbacks for both summarization and embeddings ensure pipeline still works.
- Modular: clean separation of concerns across services.

---

### Architecture overview

Files and their responsibilities:

- Models

  - `models/ContextSnapshot.js`
    - Latest aggregated context per user, with a stable SHA256 `hash` for change detection.
    - Schema: `{ userId, context: Mixed, hash: String, updatedAt }` (unique per userId).
  - `models/ContextMemory.js`
    - Historical memories: compressed narrative + numeric embedding for vector search.
    - Schema: `{ userId, summaryText, embedding: [Number], createdAt, meta?: { sourceHash, stats } }`.

- Services (Context)
  - `services/context/contextAggregator.js`
    - Re-exports `getAggregatedContext` from the main aggregator to keep modular structure.
  - `services/contextAggregator.js` (existing)
    - Aggregates from `Cycle`, `Symptoms`, and `PeriodTracker`.
    - Applies consent gating (excludes sensitive fields if `aiConsent` is false).
    - Ensures derived fields: `cycleAnalysis`, `periodAnalysis`, `daysUntilNextPeriod`.
  - `services/context/contextComparator.js`
    - Stable JSON canonicalization (sorted keys) and `hashContext` (SHA256).
    - `hasSignificantChange(prevHash, nextHash)` → boolean.
  - `services/context/contextSnapshotCache.js`
    - `getLastSnapshot(userId)` → returns `{ context, hash, updatedAt } | null`.
    - `saveSnapshot(userId, context, hash)` → upserts latest snapshot.
  - `services/context/contextArchiver.js`
    - `computeStats(prevContext)` → rule-based compression/stats: avg cycle length, irregularity, symptom frequency, days until next period.
    - `archivePreviousSnapshot(userId, sourceHash, prevContext)` → create summary, embed it, store in `ContextMemory`.
  - `services/context/summarizerService.js`
    - Uses `@google/generative-ai` (Gemini 1.5 Flash) for 2–3 sentence narratives.
    - If `GEMINI_API_KEY` missing or errors occur, uses a deterministic fallback text.
  - `services/context/vectorMemoryService.js`
    - Creates embeddings via `@google/generative-ai` (default `text-embedding-004`).
    - Fallback: deterministic hashing-based numeric embedding.
    - Vector search via MongoDB Atlas `$vectorSearch` (if configured), else cosine similarity in JS over recent memories.
  - `services/context/orchestrator.js`
    - Runs the whole pipeline: aggregate → compare → archive (if changed) → upsert snapshot → return context.

---

### Data flow (pipeline)

1. Aggregate: Fetch latest, consent-aware context (Cycle, Symptoms, PeriodTracker; add deriveds).
2. Hash: Canonicalize JSON and compute SHA256.
3. Compare: Check against previous snapshot hash.
4. Archive (only if changed):
   - Rule-based stats/trends
   - 2–3 sentence summary (Gemini or fallback)
   - Embedding (Gemini or fallback)
   - Store in `ContextMemory`
5. Save: Upsert new snapshot (`ContextSnapshot`)
6. Return: Latest context + change status (+ archived doc if created)

---

### Environment variables (additional)

Add these to your `.env` (in addition to the ones listed earlier):

```env
# Google Generative AI
GEMINI_API_KEY=your-google-generative-ai-key
GEMINI_MODEL=gemini-1.5-flash            # optional, default shown
GEMINI_EMBEDDING_MODEL=text-embedding-004 # optional, default shown
```

Note: If `GEMINI_API_KEY` is not set, the system uses robust fallbacks for both summarization and embeddings.

---

### Setup

1. Install dependencies (from `backend/` directory):

```powershell
npm install
```

2. Ensure MongoDB Atlas (or local) is configured and `MONGO_URI` is set.

3. Optional: Configure a MongoDB Atlas Vector Index for `ContextMemory.embedding`.

   - Create a vector index named `context_memory_embedding_index` on the `embedding` path.
   - Set `numDimensions` to match your embedding model's output size. To confirm the dimension, log `embedding.length` after a run.

---

### Using the orchestrator (programmatic)

```js
// Example usage inside a controller or job
import { runContextPipeline } from "./services/context/orchestrator.js";

// userId is a Mongo ObjectId or a string
const { context, changed, archived } = await runContextPipeline(userId);
// context: latest aggregated, consent-aware context JSON
// changed: boolean indicating whether snapshot changed vs previous
// archived: the ContextMemory doc created when a change was detected (if any)
```

Optional Express route (not included by default):

```js
router.post("/api/context/run", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await runContextPipeline(userId);
    res.json(result);
  } catch (e) {
    next(e);
  }
});
```

### Querying vector memories (programmatic)

```js
import {
  embedText,
  queryMemories,
} from "./services/context/vectorMemoryService.js";

const query = "cramps and sleep patterns this month";
const vec = await embedText(query);
const topK = await queryMemories(userId, vec, 5);
// Returns top-k summaries with scores (Atlas) or cosine scores (fallback)
```

---

### Privacy and consent

- If `User.aiConsent` is false or missing, sensitive fields (e.g., notes, fertility windows, tracking arrays, health tips) are excluded at aggregation time.
- Stored summaries are compressed narratives; embeddings are numeric vectors.

### Error handling and fallbacks

- Summarization fallback: deterministic 2–3 sentence generation from rule-based stats.
- Embedding fallback: deterministic hashing-based vector.
- Vector search fallback: cosine similarity over recent memories if Atlas `$vectorSearch` is unavailable.

---

### Short flowchart (arrow form)

Aggregate Context → Hash → Compare → [Changed?]
→ Yes → Compress Stats → Summarize (Gemini/fallback) → Embed (Gemini/fallback) → Store ContextMemory
→ Save New Snapshot → Return Latest Context
