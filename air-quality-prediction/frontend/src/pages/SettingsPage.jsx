import { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { User, Bell, Shield } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({ name: user?.name || '' });
  const [alertSettings, setAlertSettings] = useState({
    alertEnabled: user?.alert_enabled ?? true,
    alertThreshold: user?.alert_threshold ?? 100,
  });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile({ name: profileData.name });
      updateUser(res.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAlertSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateSettings(alertSettings);
      updateUser(res.data);
      toast.success('Alert settings saved');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        {/* Profile Settings */}
        <div className="aqi-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-300">Profile</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ name: e.target.value })}
                className="input-field"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="input-field opacity-60 cursor-not-allowed"
                disabled
              />
              <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Alert Settings */}
        <div className="aqi-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-300">Alert Settings</h2>
          </div>

          <form onSubmit={handleAlertSave} className="space-y-4">
            <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
              <div>
                <p className="text-white font-medium">Email Alerts</p>
                <p className="text-gray-400 text-sm">Receive alerts when AQI exceeds threshold</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.alertEnabled}
                  onChange={(e) =>
                    setAlertSettings({ ...alertSettings, alertEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {alertSettings.alertEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alert Threshold (AQI)
                </label>
                <input
                  type="number"
                  min={50}
                  max={300}
                  value={alertSettings.alertThreshold}
                  onChange={(e) =>
                    setAlertSettings({ ...alertSettings, alertThreshold: parseInt(e.target.value) })
                  }
                  className="input-field"
                />
                <p className="text-gray-500 text-xs mt-1">
                  You&apos;ll be alerted when AQI exceeds {alertSettings.alertThreshold}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              Save Alert Settings
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="aqi-card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-300">Account Information</h2>
          </div>
          <div className="space-y-3">
            <InfoRow label="Member Since" value={new Date(user?.created_at).toLocaleDateString()} />
            <InfoRow label="User ID" value={`#${user?.id}`} />
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="text-white font-medium text-sm">{value}</span>
  </div>
);

export default SettingsPage;
