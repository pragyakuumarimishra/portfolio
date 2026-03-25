import { AlertTriangle, X } from 'lucide-react';
import { getAQIBadgeClass } from '../../utils/aqiColors';
import { getRelativeTime } from '../../utils/formatters';
import { aqiService } from '../../services/aqiService';
import { useState } from 'react';

const AlertBanner = ({ alerts }) => {
  const [dismissed, setDismissed] = useState([]);

  const visibleAlerts = alerts.filter((a) => !dismissed.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  const handleDismiss = async (alertId) => {
    setDismissed((prev) => [...prev, alertId]);
    try {
      await aqiService.markAlertRead(alertId);
    } catch (e) {
      // Ignore errors
    }
  };

  const latestAlert = visibleAlerts[0];

  return (
    <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-red-300 font-semibold">Air Quality Alert</p>
            {latestAlert.aqi && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getAQIBadgeClass(latestAlert.aqi)}`}>
                AQI {latestAlert.aqi}
              </span>
            )}
            <span className="text-red-500 text-xs">{getRelativeTime(latestAlert.created_at)}</span>
          </div>
          <p className="text-red-400 text-sm mt-1">{latestAlert.message}</p>
          {visibleAlerts.length > 1 && (
            <p className="text-red-600 text-xs mt-1">
              +{visibleAlerts.length - 1} more alert{visibleAlerts.length > 2 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => handleDismiss(latestAlert.id)}
          className="text-red-500 hover:text-red-300 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
