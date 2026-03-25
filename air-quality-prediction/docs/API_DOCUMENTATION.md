# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login

Login and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

---

## Sensor Endpoints

### POST /sensor/data (Protected)

Submit sensor reading from ESP32.

**Request Body:**
```json
{
  "deviceId": "esp32-001",
  "pm25": 12.5,
  "pm10": 25.0,
  "co2": 450,
  "temperature": 23.5,
  "humidity": 55.0
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "aqi": 52,
    "pm25": 12.5,
    "recorded_at": "2024-01-15T10:30:00Z"
  }
}
```

### GET /sensor/latest (Protected)

Get the most recent sensor reading.

### GET /sensor/readings/:days (Protected)

Get historical readings.

**Parameters:**
- `days` (1-30): Number of days of history

---

## AQI Endpoints

### GET /aqi/current (Protected)

Get current indoor AQI with health recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "aqi": 52,
    "pm25": 12.5,
    "category": "Moderate",
    "color": "#ffff00",
    "recommendations": {
      "general": "...",
      "outdoor": "...",
      "indoor": "..."
    }
  }
}
```

### GET /aqi/stats?days=7 (Protected)

Get AQI statistics for specified period.

### GET /aqi/trend?hours=24 (Protected)

Get hourly average trend data.

---

## Outdoor Endpoints

### GET /outdoor/:city (Protected)

Get outdoor AQI for a city.

**Example:** `GET /outdoor/Delhi`

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "Delhi",
    "available": true,
    "aqi": 145,
    "pm25": 55.2,
    "category": "Unhealthy for Sensitive Groups",
    "stations": 5
  }
}
```

---

## Predictions

### GET /predictions (Protected)

Get 6-hour AQI predictions.

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "currentAQI": 52,
    "predictions": [
      { "hour": 1, "aqi": 55, "category": "Moderate", "confidence": 88 },
      { "hour": 2, "aqi": 58, "category": "Moderate", "confidence": 81 }
    ],
    "trend": "slightly_increasing"
  }
}
```

---

## Alerts

### GET /alerts (Protected)

Get user's alert history.

### PUT /alerts/:id/read (Protected)

Mark alert as read.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Resource not found |
| 409 | Conflict (e.g., email already exists) |
| 429 | Rate limit exceeded |
| 500 | Internal Server Error |
