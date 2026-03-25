import { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import HistoricalChart from '../components/Charts/HistoricalChart';
import AlertHistory from '../components/Alerts/AlertHistory';
import { Clock, Bell } from 'lucide-react';

const HOUR_OPTIONS = [
  { value: 24, label: 'Last 24 Hours' },
  { value: 48, label: 'Last 48 Hours' },
  { value: 168, label: 'Last 7 Days' },
];

const HistoryPage = () => {
  const [selectedHours, setSelectedHours] = useState(24);
  const [activeTab, setActiveTab] = useState('charts');

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">History & Analytics</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'charts'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Trend Charts
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            Alert History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'charts' && (
          <div>
            {/* Time Range Selector */}
            <div className="flex gap-2 mb-4">
              {HOUR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedHours(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedHours === opt.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <HistoricalChart hours={selectedHours} />
          </div>
        )}

        {activeTab === 'alerts' && <AlertHistory />}
      </main>
    </div>
  );
};

export default HistoryPage;
