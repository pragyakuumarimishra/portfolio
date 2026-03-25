# 🌍 Air Quality Monitoring System

A production-ready, full-stack air quality monitoring system with real-time indoor/outdoor AQI tracking, IoT sensor integration, and predictive analytics.

![Dashboard Preview](docs/images/dashboard.png)

## ✨ Features

- **Real-time Monitoring** - Live indoor air quality data from ESP32 sensors
- **Outdoor AQI** - Multi-city outdoor air quality via OpenAQ API
- **Health Recommendations** - Personalized guidance based on current AQI
- **6-Hour Predictions** - ML-based AQI forecasting
- **Email Alerts** - Notifications when AQI exceeds your threshold
- **Historical Analytics** - Charts and trend analysis
- **JWT Authentication** - Secure user accounts
- **Docker Ready** - Easy deployment with Docker Compose

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Frontend | React 18, Tailwind CSS |
| Charts | Chart.js, react-chartjs-2 |
| IoT | ESP32, PMS5003, MQ-135, DHT22 |
| Auth | JWT, bcrypt |
| Email | Nodemailer |
| Logging | Winston |
| DevOps | Docker, Docker Compose |
| Outdoor API | OpenAQ |

## 📁 Project Structure

```
air-quality-prediction/
├── backend/           # Node.js + Express API
├── frontend/          # React + Tailwind UI
├── esp32/             # Arduino firmware
├── docs/              # Documentation
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone and configure
git clone <repo-url>
cd air-quality-prediction
cp .env.example .env
# Edit .env with your settings

# Start everything
docker compose up -d

# Run database migration
docker compose exec backend node scripts/migrate.js
```

Visit http://localhost:3000

### Option 2: Manual Setup

See [INSTALLATION.md](docs/INSTALLATION.md) for detailed instructions.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/sensor/data` | Submit ESP32 data |
| GET | `/api/sensor/latest` | Latest reading |
| GET | `/api/aqi/current` | Current indoor AQI |
| GET | `/api/aqi/trend` | Trend data |
| GET | `/api/outdoor/:city` | Outdoor city AQI |
| GET | `/api/predictions` | 6-hour predictions |
| GET | `/api/alerts` | User alerts |

Full API documentation: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 🔌 ESP32 Hardware Setup

| Component | Pin |
|-----------|-----|
| PMS5003 RX | GPIO 17 |
| PMS5003 TX | GPIO 16 |
| DHT22 | GPIO 4 |
| MQ-135 | GPIO 34 (Analog) |

See [esp32/esp32_main.ino](esp32/esp32_main.ino) for firmware.

## 📊 AQI Categories

| AQI Range | Category | Color |
|-----------|----------|-------|
| 0-50 | Good | 🟢 Green |
| 51-100 | Moderate | 🟡 Yellow |
| 101-150 | Unhealthy for Sensitive Groups | 🟠 Orange |
| 151-200 | Unhealthy | 🔴 Red |
| 201-300 | Very Unhealthy | 🟣 Purple |
| 301-500 | Hazardous | 🔴 Dark Red |

## 📄 License

MIT License - see [LICENSE](LICENSE)
