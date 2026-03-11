/**
 * Format currency amount in Indian Rupees (INR)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "₹327.50")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date in Indian locale
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date string
 */
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format cashback percentage
 * @param {number} percentage - Cashback percentage
 * @returns {string} Formatted percentage string (e.g., "10% Cashback")
 */
export const formatCashback = (percentage) => {
  return `${percentage}% Cashback`;
};
