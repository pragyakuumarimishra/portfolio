# Troubleshooting Guide

## Common Issues

### Backend Issues

#### "Cannot connect to PostgreSQL"
- Ensure PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `.env`
- In Docker: wait for `postgres` container to be healthy

#### "JWT_SECRET not set"
- Copy `.env.example` to `.env`
- Set `JWT_SECRET` to a random string

#### "Email sending failed"
- For Gmail: Enable 2FA and create an App Password
- Use App Password in `EMAIL_PASSWORD`, not your main password
- This is non-critical - the system works without email

---

### Frontend Issues

#### "API calls fail with CORS error"
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- In development, Vite proxy handles this automatically

#### "Login redirects to login page"
- Clear localStorage: `localStorage.clear()` in browser console
- Check browser console for errors

---

### Docker Issues

#### "Backend container keeps restarting"
```bash
docker compose logs backend
```
- Usually means database isn't ready yet - wait for it

#### "Port already in use"
```bash
# Find the process
lsof -i :5000
lsof -i :3000
# Kill it
kill <PID>
```

#### Rebuild containers after code changes
```bash
docker compose up -d --build
```

---

### ESP32 Issues

#### "WiFi not connecting"
- Double-check SSID and password
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- Check serial monitor at 115200 baud

#### "HTTP POST failing"
- Verify `API_URL` points to your server
- Ensure `AUTH_TOKEN` is a valid JWT
- Check firewall allows port 5000

#### "PMS5003 no readings"
- Verify connections: RX=16, TX=17
- Sensor needs 30 seconds warm-up after power-on
- Check 5V power supply (PMS5003 requires 5V)

---

### Database Issues

#### Reset database
```bash
docker compose down -v  # Removes volumes too
docker compose up -d
docker compose exec backend node scripts/migrate.js
```

#### View database
```bash
docker compose exec postgres psql -U postgres -d air_quality_db
\dt  -- list tables
SELECT * FROM users;
```
