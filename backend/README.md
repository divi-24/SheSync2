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
