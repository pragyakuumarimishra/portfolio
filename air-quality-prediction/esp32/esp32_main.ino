/**
 * Air Quality Monitor - ESP32 Firmware
 * Reads from PMS5003, MQ-135, and DHT22 sensors
 * and sends data to the backend API
 *
 * Hardware:
 * - ESP32 DevKit
 * - PMS5003 Particulate Matter Sensor (UART2: RX=16, TX=17)
 * - MQ-135 Gas Sensor (Analog: A0/GPIO34)
 * - DHT22 Temperature/Humidity Sensor (GPIO4)
 *
 * Libraries needed:
 * - PMS library by Mariusz Kacki
 * - DHT sensor library by Adafruit
 * - ArduinoJson by Benoit Blanchon
 * - HTTPClient (built-in ESP32)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "PMS.h"

// ============================================================
// CONFIGURATION - Update these values
// ============================================================
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* API_URL = "http://YOUR_SERVER_IP:5000/api/sensor/data";
const char* AUTH_TOKEN = "YOUR_JWT_TOKEN";  // Get from login endpoint
const char* DEVICE_ID = "esp32-001";        // Unique device identifier

// Sensor pins
#define DHT_PIN 4
#define DHT_TYPE DHT22
#define MQ135_PIN 34  // Analog input

// Reading interval (milliseconds)
#define READ_INTERVAL 30000  // 30 seconds

// ============================================================
// GLOBAL OBJECTS
// ============================================================
DHT dht(DHT_PIN, DHT_TYPE);
HardwareSerial pmsSerial(2);  // UART2 for PMS5003
PMS pms(pmsSerial);
PMS::DATA pmsData;

// Timing
unsigned long lastReadTime = 0;
unsigned long wifiReconnectTime = 0;

// ============================================================
// SETUP
// ============================================================
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== Air Quality Monitor ESP32 ===");

  // Initialize sensors
  dht.begin();
  pmsSerial.begin(9600, SERIAL_8N1, 16, 17);  // RX=16, TX=17 for PMS5003
  pms.passiveMode();

  Serial.println("Sensors initialized");

  // Connect to WiFi
  connectWiFi();
}

// ============================================================
// MAIN LOOP
// ============================================================
void loop() {
  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    unsigned long now = millis();
    if (now - wifiReconnectTime > 30000) {
      Serial.println("WiFi disconnected. Reconnecting...");
      connectWiFi();
      wifiReconnectTime = now;
    }
    delay(1000);
    return;
  }

  // Read sensors at intervals
  unsigned long now = millis();
  if (now - lastReadTime >= READ_INTERVAL || lastReadTime == 0) {
    lastReadTime = now;
    readAndSendData();
  }

  delay(100);
}

// ============================================================
// READ SENSORS AND SEND DATA
// ============================================================
void readAndSendData() {
  Serial.println("\n--- Reading sensors ---");

  // Read PM sensor
  float pm25 = -1, pm10 = -1;
  if (readPMSensor(pm25, pm10)) {
    Serial.printf("PM2.5: %.1f µg/m³, PM10: %.1f µg/m³\n", pm25, pm10);
  } else {
    Serial.println("PMS5003 read failed, using fallback");
    pm25 = 0;  // Fallback value
  }

  // Read DHT22
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT22 read failed");
    temperature = -1;
    humidity = -1;
  } else {
    Serial.printf("Temperature: %.1f°C, Humidity: %.1f%%\n", temperature, humidity);
  }

  // Read MQ-135 (CO2 approximation)
  float co2 = readMQ135CO2();
  Serial.printf("CO2 (approx): %.0f ppm\n", co2);

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["pm25"] = pm25;

  if (pm10 >= 0) doc["pm10"] = pm10;
  if (co2 > 0) doc["co2"] = (int)co2;
  if (temperature != -1) doc["temperature"] = temperature;
  if (humidity != -1) doc["humidity"] = humidity;

  String payload;
  serializeJson(doc, payload);
  Serial.println("Payload: " + payload);

  // Send to API
  sendToAPI(payload);
}

// ============================================================
// READ PMS5003 SENSOR
// ============================================================
bool readPMSensor(float &pm25, float &pm10) {
  pms.requestRead();
  if (pms.readUntil(pmsData, 2000)) {
    pm25 = pmsData.PM_AE_UG_2_5;
    pm10 = pmsData.PM_AE_UG_10_0;
    return true;
  }
  return false;
}

// ============================================================
// READ MQ-135 AND ESTIMATE CO2
// ============================================================
float readMQ135CO2() {
  // Read analog value (0-4095 for 12-bit ADC)
  int rawValue = analogRead(MQ135_PIN);
  float voltage = rawValue * (3.3 / 4095.0);

  // Simplified CO2 estimation
  // In production, calibrate sensor for accurate readings
  // Rs/R0 ratio calculation
  float Rs = ((3.3 - voltage) / voltage) * 10.0;  // RL = 10kΩ
  float ratio = Rs / 3.6;  // R0 approximation for clean air

  // Logarithmic conversion (approximate)
  float co2_ppm = 116.6020682 * pow(ratio, -2.769034857);

  // Clamp to reasonable range
  if (co2_ppm < 300) co2_ppm = 400;   // Fresh air minimum
  if (co2_ppm > 5000) co2_ppm = 5000;

  return co2_ppm;
}

// ============================================================
// SEND DATA TO API
// ============================================================
void sendToAPI(const String &payload) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping send");
    return;
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(AUTH_TOKEN));
  http.setTimeout(10000);

  int httpCode = http.POST(payload);

  if (httpCode > 0) {
    String response = http.getString();
    if (httpCode == 201) {
      Serial.println("✓ Data sent successfully");
      Serial.println("Response: " + response);
    } else {
      Serial.printf("✗ HTTP Error: %d\n", httpCode);
      Serial.println("Response: " + response);
    }
  } else {
    Serial.printf("✗ Connection error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

// ============================================================
// WIFI CONNECTION
// ============================================================
void connectWiFi() {
  Serial.printf("Connecting to WiFi: %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("Signal Strength: %d dBm\n", WiFi.RSSI());
  } else {
    Serial.println("\n✗ WiFi connection failed!");
  }
}
