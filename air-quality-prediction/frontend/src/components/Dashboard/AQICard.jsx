import { getAQIBadgeClass, getAQIBgColor } from '../../utils/aqiColors';
import { getRelativeTime } from '../../utils/formatters';
import { Wind, Thermometer, Droplets, Activity } from 'lucide-react';

const AQICard = ({ data, title = 'Indoor AQI' }) => {
  if (!data || !data.available) {
    return (
      <div className="aqi-card">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">{title}</h2>
        <div className="text-center py-8">
          <Wind className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">{data?.message || 'No sensor data available'}</p>
          <p className="text-gray-500 text-sm mt-2">Connect your ESP32 sensor to start monitoring</p>
        </div>
      </div>
    );
  }

  const { aqi, pm25, pm10, co2, temperature, humidity, category, recordedAt } = data;
  const bgColor = getAQIBgColor(aqi);

  return (
    <div className="aqi-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAQIBadgeClass(aqi)}`}>
          {category}
        </span>
      </div>

      {/* Main AQI Display */}
      <div className="flex items-center gap-6 mb-6">
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-black">{aqi}</div>
            <div className="text-xs font-medium text-black opacity-70">AQI</div>
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Last updated</p>
          <p className="text-white font-medium">{getRelativeTime(recordedAt)}</p>
          {data.sensorName && (
            <p className="text-gray-500 text-sm mt-1">📍 {data.location || 'Indoor'}</p>
          )}
        </div>
      </div>

      {/* Sensor Readings Grid */}
      <div className="grid grid-cols-2 gap-3">
        <SensorMetric icon={<Activity className="w-4 h-4" />} label="PM2.5" value={pm25} unit="µg/m³" />
        <SensorMetric icon={<Activity className="w-4 h-4" />} label="PM10" value={pm10} unit="µg/m³" />
        <SensorMetric icon={<Wind className="w-4 h-4" />} label="CO₂" value={co2} unit="ppm" />
        <SensorMetric
          icon={<Thermometer className="w-4 h-4" />}
          label="Temperature"
          value={temperature}
          unit="°C"
        />
        <SensorMetric
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={humidity}
          unit="%"
          className="col-span-2"
        />
      </div>
    </div>
  );
};

const SensorMetric = ({ icon, label, value, unit, className = '' }) => (
  <div className={`bg-gray-800 rounded-xl p-3 ${className}`}>
    <div className="flex items-center gap-2 text-gray-400 mb-1">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-white font-semibold">
      {value !== null && value !== undefined ? `${parseFloat(value).toFixed(1)} ${unit}` : 'N/A'}
    </p>
  </div>
);

export default AQICard;
