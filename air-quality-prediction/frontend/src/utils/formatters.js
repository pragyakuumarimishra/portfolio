/**
 * Data Formatters
 */

/**
 * Format timestamp to readable date/time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date/time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format timestamp to time only
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format number with fixed decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  return parseFloat(value).toFixed(decimals);
};

/**
 * Get relative time string (e.g., "2 minutes ago")
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Never';
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
};
