import { useState, useEffect } from 'react';
import { aqiService } from '../../services/aqiService';
import { getAQIBadgeClass } from '../../utils/aqiColors';
import { formatDateTime } from '../../utils/formatters';
import { Bell, Check } from 'lucide-react';
import Loading from '../Common/Loading';

const AlertHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await aqiService.getAlerts(50);
      setAlerts(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    await aqiService.markAlertRead(alertId);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  if (loading) return <Loading />;

  return (
    <div className="aqi-card">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-gray-300">Alert History</h2>
        {unreadCount > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-10 h-10 text-gray-700 mx-auto mb-2" />
          <p className="text-gray-500">No alerts yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border transition-colors ${
                alert.is_read
                  ? 'bg-gray-800/50 border-gray-800'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      getSeverityClass(alert.severity)
                    }`}>
                      {alert.severity?.toUpperCase()}
                    </span>
                    {alert.aqi && (
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getAQIBadgeClass(alert.aqi)}`}>
                        AQI {alert.aqi}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${alert.is_read ? 'text-gray-500' : 'text-gray-300'}`}>
                    {alert.message}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{formatDateTime(alert.created_at)}</p>
                </div>
                {!alert.is_read && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="text-gray-500 hover:text-green-400 flex-shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getSeverityClass = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-900 text-red-300';
    case 'danger': return 'bg-orange-900 text-orange-300';
    case 'warning': return 'bg-yellow-900 text-yellow-300';
    default: return 'bg-blue-900 text-blue-300';
  }
};

export default AlertHistory;
