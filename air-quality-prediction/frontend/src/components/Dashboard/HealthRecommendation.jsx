import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const HealthRecommendation = ({ data }) => {
  if (!data?.available) {
    return null;
  }

  const { aqi, recommendations, description, healthImplication } = data;

  const getIcon = (aqi) => {
    if (aqi <= 50) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (aqi <= 100) return <Shield className="w-5 h-5 text-yellow-400" />;
    if (aqi <= 200) return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const borderColor = aqi <= 50
    ? 'border-green-500'
    : aqi <= 100
    ? 'border-yellow-500'
    : aqi <= 200
    ? 'border-orange-500'
    : 'border-red-500';

  return (
    <div className={`aqi-card border-l-4 ${borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        {getIcon(aqi)}
        <h2 className="text-lg font-semibold text-gray-300">Health Recommendations</h2>
      </div>

      <p className="text-gray-400 text-sm mb-4">{description}</p>

      <div className="space-y-3">
        <RecommendationItem
          label="General"
          text={recommendations?.general}
          icon="🏃"
        />
        <RecommendationItem
          label="Outdoors"
          text={recommendations?.outdoor}
          icon="🌿"
        />
        <RecommendationItem
          label="Indoors"
          text={recommendations?.indoor}
          icon="🏠"
        />
        {healthImplication && healthImplication !== 'None' && (
          <RecommendationItem
            label="Health Impact"
            text={healthImplication}
            icon="⚕️"
          />
        )}
      </div>
    </div>
  );
};

const RecommendationItem = ({ label, text, icon }) => {
  if (!text || text === 'None') return null;

  return (
    <div className="flex gap-3 bg-gray-800 rounded-xl p-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <p className="text-gray-400 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-gray-200 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default HealthRecommendation;
