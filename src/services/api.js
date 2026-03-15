import axios from 'axios';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      return Promise.reject({
        message: 'Unable to connect to service. Please try again later.',
        status: null,
        data: null
      });
    }
    // Standardize error structure
    const standardError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(standardError);
  }
);

// API methods

/**
 * Fetch wallet data for a user
 * @param {number} userId - The user ID
 * @returns {Promise} Wallet data
 */
export const getWallet = async (userId) => {
  const response = await apiClient.get(`/wallet/${userId}`);
  return response.data;
};

/**
 * Fetch all merchants
 * @returns {Promise} Array of merchants
 */
export const getMerchants = async () => {
  const response = await apiClient.get('/merchants');
  return response.data;
};

/**
 * Track merchant click
 * @param {number} merchantId - The merchant ID
 * @returns {Promise} Updated merchant data
 */
export const trackMerchantClick = async (merchantId) => {
  const response = await apiClient.post(`/merchants/${merchantId}/click`);
  return response.data;
};

export default apiClient;
