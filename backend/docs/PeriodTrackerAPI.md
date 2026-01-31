# SheSync Period Tracker API Documentation

## Overview

This is a production-ready REST API for period tracking with comprehensive health monitoring capabilities. The API provides secure endpoints for tracking menstrual cycles, mood, symptoms, and sleep patterns.

## Base URL

```
http://localhost:5000/api/period-tracker
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **Create Operations**: 5 requests per 15 minutes
- **Update Operations**: 20 requests per 15 minutes
- **Data Addition**: 30 requests per 15 minutes
- **General Operations**: 100 requests per 15 minutes

## API Endpoints

### 1. Create Period Tracker

**POST** `/api/period-tracker`

Creates a new period tracking entry for the authenticated user.

**Request Body:**

```json
{
  "cycleInfo": {
    "cycleDuration": 28,
    "lastPeriodStart": "2024-01-15",
    "lastPeriodDuration": 5,
    "nextPeriodPrediction": "2024-02-12"
  },
  "moodTracking": [
    {
      "moodTypes": ["Happy", "Energized"],
      "intensity": "medium",
      "date": "2024-01-20",
      "notes": "Feeling great today"
    }
  ],
  "symptomTracking": [
    {
      "symptoms": [
        {
          "name": "Lower Abdomen Cramps",
          "severity": "mild"
        },
        {
          "name": "Bloating",
          "severity": "moderate"
        }
      ],
      "date": "2024-01-16",
      "notes": "Minor discomfort"
    }
  ],
  "sleepTracking": [
    {
      "duration": 8.5,
      "quality": "good",
      "date": "2024-01-20",
      "notes": "Restful night"
    }
  ],
  "privacy": "private"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Period tracker created successfully",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "data": {
    "_id": "65ab123456789",
    "userId": "65ab987654321",
    "cycleInfo": {
      "cycleDuration": 28,
      "lastPeriodStart": "2024-01-15T00:00:00.000Z",
      "lastPeriodDuration": 5,
      "nextPeriodPrediction": "2024-02-12T00:00:00.000Z"
    },
    "moodTracking": [...],
    "symptomTracking": [...],
    "sleepTracking": [...],
    "healthTips": [...],
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### 2. Get Active Period Tracker

**GET** `/api/period-tracker/active`

Retrieves the user's currently active period tracker.

**Response:**

```json
{
  "success": true,
  "message": "Active period tracker retrieved successfully",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "data": {
    "_id": "65ab123456789",
    "userId": {
      "_id": "65ab987654321",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    },
    "cycleInfo": {...},
    "moodTracking": [...],
    "symptomTracking": [...],
    "sleepTracking": [...],
    "healthTips": [...],
    "daysUntilNextPeriod": 23,
    "cycleAnalysis": "normal",
    "periodAnalysis": "normal"
  }
}
```

### 3. Update Period Tracker

**PUT** `/api/period-tracker/:id`

Updates an existing period tracker.

**Request Body:**

```json
{
  "cycleInfo": {
    "cycleDuration": 30,
    "irregularCycle": true
  },
  "privacy": "shared_with_parent",
  "isActive": true
}
```

### 4. Add Mood Tracking

**POST** `/api/period-tracker/:id/mood`

Adds a new mood tracking entry to an existing tracker.

**Request Body:**

```json
{
  "moodTypes": ["Happy", "Calm"],
  "intensity": "high",
  "date": "2024-01-21",
  "notes": "Feeling wonderful after yoga session"
}
```

### 5. Add Symptom Tracking

**POST** `/api/period-tracker/:id/symptoms`

Adds a new symptom tracking entry.

**Request Body:**

```json
{
  "symptoms": [
    {
      "name": "Lower Abdomen Cramps",
      "severity": "severe"
    },
    {
      "name": "Headaches",
      "severity": "mild"
    }
  ],
  "date": "2024-01-16",
  "notes": "Pain started in the morning"
}
```

### 6. Add Sleep Tracking

**POST** `/api/period-tracker/:id/sleep`

Adds a new sleep tracking entry.

**Request Body:**

```json
{
  "duration": 7.5,
  "quality": "excellent",
  "date": "2024-01-21",
  "notes": "Woke up refreshed"
}
```

### 7. Get Tracking History

**GET** `/api/period-tracker/history?page=1&limit=10`

Retrieves paginated tracking history for the user.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**

```json
{
  "success": true,
  "message": "Tracking history retrieved successfully",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "data": {
    "trackers": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalTrackers": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 8. Get Analytics

**GET** `/api/period-tracker/analytics`

Retrieves comprehensive analytics and insights.

**Response:**

```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "data": {
    "totalTrackers": 15,
    "averageCycleDuration": 28,
    "averagePeriodDuration": 5,
    "mostCommonMood": "Happy",
    "mostCommonSymptom": "Lower Abdomen Cramps",
    "averageSleepDuration": 7.8,
    "cycleRegularity": "regular",
    "lastUpdate": "2024-01-20T10:30:00.000Z"
  }
}
```

### 9. Delete Period Tracker

**DELETE** `/api/period-tracker/:id`

Deletes a specific period tracker.

**Response:**

```json
{
  "success": true,
  "message": "Period tracker deleted successfully",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 10. Health Check

**GET** `/api/period-tracker/health`

Checks the health status of the period tracker service.

**Response:**

```json
{
  "success": true,
  "message": "Period tracker service is healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "service": "period-tracker"
}
```

## Data Models

### Cycle Information

```json
{
  "cycleDuration": 28, // 15-50 days
  "lastPeriodStart": "2024-01-15",
  "lastPeriodDuration": 5, // 1-15 days
  "nextPeriodPrediction": "2024-02-12",
  "irregularCycle": false
}
```

### Mood Tracking

```json
{
  "moodTypes": ["Happy", "Sad", "Calm", "Angry", "Tired", "Energized"],
  "intensity": "low|medium|high",
  "date": "2024-01-20",
  "notes": "Optional notes"
}
```

### Symptom Tracking

```json
{
  "symptoms": [
    {
      "name": "Lower Abdomen Cramps|Back Pain|Bloating|Fatigue|Headaches|Nausea|Sleep Disruption|Digestive Issues",
      "severity": "none|mild|moderate|severe"
    }
  ],
  "date": "2024-01-20",
  "notes": "Optional notes"
}
```

### Sleep Tracking

```json
{
  "duration": 8.5, // 0-24 hours
  "quality": "poor|fair|good|excellent",
  "date": "2024-01-20",
  "notes": "Optional notes"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "errors": ["Cycle duration must be between 15 and 50 days"]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authenticated",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Period tracker not found or access denied",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "User already has an active period tracker",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "message": "Too many tracker creation attempts. Please try again in 15 minutes.",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## Frontend Integration Example

```javascript
// Create new period tracker
const createPeriodTracker = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("/api/period-tracker", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (response.data.success) {
      console.log("Tracker created:", response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error creating tracker:", error.response?.data?.message);
    throw error;
  }
};

// Get active tracker
const getActiveTracker = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/period-tracker/active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("No active tracker found");
      return null;
    }
    throw error;
  }
};
```

## Testing

### Using cURL

```bash
# Create a new period tracker
curl -X POST http://localhost:5000/api/period-tracker \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cycleInfo": {
      "cycleDuration": 28,
      "lastPeriodStart": "2024-01-15",
      "lastPeriodDuration": 5
    }
  }'

# Get active tracker
curl -X GET http://localhost:5000/api/period-tracker/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add mood tracking
curl -X POST http://localhost:5000/api/period-tracker/TRACKER_ID/mood \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moodTypes": ["Happy"],
    "intensity": "medium"
  }'
```

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Rate Limiting**: Protects against API abuse
3. **Input Validation**: Comprehensive validation on all inputs
4. **Data Sanitization**: Prevents injection attacks
5. **Access Control**: Users can only access their own data
6. **Error Handling**: Secure error messages without sensitive data exposure

## Performance Optimizations

1. **Database Indexing**: Optimized queries with proper indexing
2. **Pagination**: Prevents large data retrieval
3. **Data Limits**: Prevents excessive data storage per user
4. **Efficient Queries**: Population and selection optimization
5. **Caching Headers**: Proper HTTP caching strategies
