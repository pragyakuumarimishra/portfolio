import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { aqiService } from '../../services/aqiService';
import { formatTime } from '../../utils/formatters';
import Loading from '../Common/Loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HistoricalChart = ({ hours = 24 }) => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('aqi');

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await aqiService.getTrend(hours);
        setTrendData(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchTrend();
  }, [hours]);

  const metrics = [
    { key: 'aqi', label: 'AQI', color: '#6366f1', unit: '' },
    { key: 'pm25', label: 'PM2.5', color: '#f59e0b', unit: 'µg/m³' },
    { key: 'co2', label: 'CO₂', color: '#10b981', unit: 'ppm' },
    { key: 'temperature', label: 'Temperature', color: '#ef4444', unit: '°C' },
    { key: 'humidity', label: 'Humidity', color: '#3b82f6', unit: '%' },
  ];

  const currentMetric = metrics.find((m) => m.key === activeMetric);

  const chartData = {
    labels: trendData.map((d) => formatTime(d.hour)),
    datasets: [
      {
        label: currentMetric?.label,
        data: trendData.map((d) => d[activeMetric]),
        borderColor: currentMetric?.color,
        backgroundColor: `${currentMetric?.color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#9ca3af',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: (context) =>
            `${currentMetric?.label}: ${context.raw?.toFixed(1)}${currentMetric?.unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#1f2937' },
        ticks: { color: '#6b7280', maxTicksLimit: 8 },
      },
      y: {
        grid: { color: '#1f2937' },
        ticks: { color: '#6b7280' },
      },
    },
  };

  if (loading) return <Loading />;

  return (
    <div className="aqi-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-300">Historical Trends ({hours}h)</h2>
        <div className="flex gap-1 flex-wrap">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeMetric === m.key
                  ? 'text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
              style={activeMetric === m.key ? { backgroundColor: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {trendData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No trend data available</p>
          <p className="text-gray-600 text-sm mt-1">Start monitoring to see trends</p>
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default HistoricalChart;
