import { useState, useEffect, useCallback } from 'react';
import Navbar from '../Common/Navbar';
import AQICard from './AQICard';
import Comparison from './Comparison';
import HealthRecommendation from './HealthRecommendation';
import AlertBanner from '../Alerts/AlertBanner';
import Loading from '../Common/Loading';
import { aqiService } from '../../services/aqiService';
import { outdoorService } from '../../services/outdoorService';
import { RefreshCw, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const REFRESH_INTERVAL = 60000; // 1 minute

const Dashboard = () => {
  const [indoorData, setIndoorData] = useState(null);
  const [outdoorData, setOutdoorData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (showLoader = false) => {
    if (showLoader) setRefreshing(true);

    try {
      const [aqiRes, alertsRes] = await Promise.allSettled([
        aqiService.getCurrent(),
        aqiService.getAlerts(5),
      ]);

      if (aqiRes.status === 'fulfilled') {
        setIndoorData(aqiRes.value.data);
      }

      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value.data || []);
      }

      // Fetch outdoor data in background
      outdoorService
        .getMultipleCities(['Delhi', 'Mumbai', 'Bangalore'])
        .then((res) => setOutdoorData(res.data || []))
        .catch(() => {});

      // Fetch predictions in background
      aqiService
        .getPredictions()
        .then((res) => setPredictions(res.data))
        .catch(() => {});

      setLastUpdated(new Date());
    } catch (error) {
      if (showLoader) {
        toast.error('Failed to refresh data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => fetchData(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const unreadAlerts = alerts.filter((a) => !a.is_read);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loading size="lg" text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar alertCount={unreadAlerts.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Air Quality Dashboard</h1>
            {lastUpdated && (
              <p className="text-gray-500 text-sm mt-1">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Alert Banner */}
        {unreadAlerts.length > 0 && (
          <AlertBanner alerts={unreadAlerts} />
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Indoor AQI - takes full width on mobile */}
          <div className="lg:col-span-1">
            <AQICard data={indoorData} title="Indoor AQI" />
          </div>

          {/* Outdoor Comparison */}
          <div className="lg:col-span-1">
            <Comparison indoor={indoorData} outdoor={outdoorData} />
          </div>

          {/* Health Recommendations */}
          <div className="lg:col-span-2 xl:col-span-1">
            <HealthRecommendation data={indoorData} />
          </div>

          {/* Predictions */}
          {predictions?.available && (
            <div className="lg:col-span-2 xl:col-span-3">
              <PredictionCard predictions={predictions} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const PredictionCard = ({ predictions }) => {
  const { predictions: hourly, trend, currentAQI } = predictions;

  return (
    <div className="aqi-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-gray-300">6-Hour AQI Prediction</h2>
        <span className="text-xs text-gray-500 ml-auto">Trend: {trend?.replace(/_/g, ' ')}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {hourly.map((p) => (
          <div key={p.hour} className="text-center bg-gray-800 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-2">+{p.hour}h</p>
            <div
              className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-bold text-sm mb-2"
              style={{
                backgroundColor: p.color,
                color: p.aqi <= 100 ? 'black' : 'white',
              }}
            >
              {p.aqi}
            </div>
            <p className="text-gray-500 text-xs">{p.confidence}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
