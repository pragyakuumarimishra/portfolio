# Usage Guide

## Getting Started

### 1. Create an Account

Navigate to http://localhost:3000/register and create your account.
- Name, email, and password (min 8 chars, uppercase + number)

### 2. Connect Your ESP32

After logging in:
1. Get your JWT token from the login response
2. Update `esp32_main.ino` with:
   - Your WiFi credentials
   - Your server IP address
   - Your JWT token
3. Flash to ESP32 and monitor serial output

### 3. View Dashboard

The dashboard shows:
- **Indoor AQI Card** - Real-time readings from your ESP32
- **Indoor vs Outdoor** - Compare your indoor air to cities
- **Health Recommendations** - What to do based on AQI
- **6-Hour Predictions** - Where AQI is heading

### 4. Set Up Alerts

Go to Settings → Alert Settings:
- Enable email alerts
- Set your threshold (default: AQI 100)
- You'll receive emails when AQI exceeds this value

### 5. View History

Go to History page to:
- View AQI trends over 24h, 48h, or 7 days
- Switch between AQI, PM2.5, CO₂, Temperature, Humidity charts
- Review your alert history

---

## Understanding AQI

| AQI | Category | Who is affected |
|-----|----------|-----------------|
| 0-50 | **Good** | Nobody |
| 51-100 | **Moderate** | Very sensitive people |
| 101-150 | **Unhealthy for Sensitive Groups** | Sensitive groups |
| 151-200 | **Unhealthy** | Everyone |
| 201-300 | **Very Unhealthy** | Everyone seriously |
| 301-500 | **Hazardous** | Everyone, emergency |

---

## Sensor Data Format (ESP32 API)

```json
POST /api/sensor/data
{
  "deviceId": "esp32-001",
  "pm25": 12.5,
  "pm10": 25.0,
  "co2": 450,
  "temperature": 23.5,
  "humidity": 55.0
}
```

Only `pm25` is required. Other fields are optional.

---

## Data Retention

- Readings: Stored indefinitely (consider cleanup for production)
- Alerts: Auto-deleted after 30 days (via DELETE /api/alerts/old)
