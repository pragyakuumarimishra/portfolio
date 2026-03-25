# Installation Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Docker and Docker Compose (optional)
- Git

## Option 1: Docker Compose (Recommended)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd air-quality-prediction
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_secret
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Start Services

```bash
docker compose up -d
```

### 4. Run Database Migration

```bash
docker compose exec backend node scripts/migrate.js
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## Option 2: Manual Installation

### Backend Setup

```bash
cd backend
cp .env.example .env
# Configure .env

npm install
node scripts/migrate.js
npm run dev  # Development
# npm start  # Production
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api

npm install
npm run dev  # Development
# npm run build && npm run preview  # Production
```

### Database Setup

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE air_quality_db;
```
3. Update `DATABASE_URL` in backend `.env`
4. Run: `node scripts/migrate.js`

---

## ESP32 Firmware

1. Install Arduino IDE 2.0+
2. Add ESP32 board support
3. Install libraries:
   - PMS by Mariusz Kacki
   - DHT sensor library by Adafruit
   - ArduinoJson by Benoit Blanchon
4. Open `esp32/esp32_main.ino`
5. Update WiFi and API credentials
6. Flash to ESP32

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port | 5000 |
| `DATABASE_URL` | PostgreSQL connection | - |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRE` | Token expiry | 7d |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASSWORD` | SMTP password | - |
| `OPENAQ_API_URL` | OpenAQ API URL | https://api.openaq.org/v2 |
