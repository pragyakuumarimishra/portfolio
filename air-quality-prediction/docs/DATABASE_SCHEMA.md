# Database Schema

## Tables

### users
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique user ID |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(255) UNIQUE | Email address |
| password_hash | VARCHAR(255) | bcrypt hash |
| alert_enabled | BOOLEAN | Email alerts on/off |
| alert_threshold | INTEGER | AQI alert threshold (default: 100) |
| created_at | TIMESTAMPTZ | Registration time |
| updated_at | TIMESTAMPTZ | Last update |

### sensors
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Sensor ID |
| user_id | INTEGER (FK) | Owner user ID |
| device_id | VARCHAR(100) | ESP32 device identifier |
| name | VARCHAR(100) | Human-readable name |
| location | VARCHAR(255) | Physical location |
| last_seen | TIMESTAMPTZ | Last data submission |
| created_at | TIMESTAMPTZ | Registration time |

### readings
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Reading ID |
| sensor_id | INTEGER (FK) | Sensor reference |
| user_id | INTEGER (FK) | User reference |
| pm25 | NUMERIC(8,2) | PM2.5 in µg/m³ |
| pm10 | NUMERIC(8,2) | PM10 in µg/m³ |
| co2 | NUMERIC(8,2) | CO2 in ppm |
| temperature | NUMERIC(6,2) | Temperature in °C |
| humidity | NUMERIC(5,2) | Relative humidity % |
| aqi | INTEGER | Calculated AQI value |
| recorded_at | TIMESTAMPTZ | Measurement time |

### alerts
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Alert ID |
| user_id | INTEGER (FK) | User reference |
| type | VARCHAR(100) | Alert type identifier |
| message | TEXT | Alert message |
| aqi | INTEGER | AQI at time of alert |
| severity | VARCHAR(20) | info/warning/danger/critical |
| is_read | BOOLEAN | Read status |
| read_at | TIMESTAMPTZ | Time marked as read |
| created_at | TIMESTAMPTZ | Alert creation time |

## Indexes

```sql
-- Performance indexes
idx_readings_user_id        -- readings(user_id)
idx_readings_recorded_at    -- readings(recorded_at DESC)
idx_readings_user_recorded  -- readings(user_id, recorded_at DESC)
idx_sensors_user_id         -- sensors(user_id)
idx_sensors_device_id       -- sensors(device_id)
idx_alerts_user_id          -- alerts(user_id)
idx_alerts_created_at       -- alerts(created_at DESC)
idx_alerts_user_read        -- alerts(user_id, is_read)
```

## Relationships

```
users ──< sensors ──< readings
users ──< alerts
```
