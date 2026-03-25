import { getAQIBgColor, getAQIBadgeClass } from '../../utils/aqiColors';

const Comparison = ({ indoor, outdoor }) => {
  const cities = outdoor || [];

  return (
    <div className="aqi-card">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">Indoor vs Outdoor AQI</h2>

      {/* Indoor Summary */}
      {indoor?.available && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Indoor (Your Sensor)</p>
              <p className="text-2xl font-bold text-white mt-1">{indoor.aqi}</p>
              <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold ${getAQIBadgeClass(indoor.aqi)}`}>
                {indoor.category}
              </span>
            </div>
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl"
              style={{ backgroundColor: getAQIBgColor(indoor.aqi), color: 'black' }}
            >
              {indoor.aqi}
            </div>
          </div>
        </div>
      )}

      {/* Outdoor Cities */}
      <div className="space-y-2">
        {cities.length === 0 && (
          <p className="text-gray-500 text-center py-4">No outdoor data available</p>
        )}
        {cities.map((city) => (
          <div
            key={city.city}
            className="flex items-center justify-between bg-gray-800 rounded-xl p-3"
          >
            <div>
              <p className="text-white font-medium">{city.city}</p>
              {city.available ? (
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${getAQIBadgeClass(city.aqi)}`}>
                  {city.category}
                </span>
              ) : (
                <span className="text-gray-500 text-xs">No data</span>
              )}
            </div>
            {city.available && (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-bold"
                style={{ backgroundColor: city.color, color: city.aqi <= 100 ? 'black' : 'white' }}
              >
                {city.aqi}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;
