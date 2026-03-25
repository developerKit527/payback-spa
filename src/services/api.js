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
 * Fetch wallet data.
 * If token is provided, calls GET /wallet/me with Authorization header.
 * Otherwise calls GET /wallet/1 as public fallback.
 * @param {string|null} token - Optional JWT token
 * @returns {Promise} Wallet data
 */
export const getWallet = async (token = null) => {
  if (token) {
    const response = await apiClient.get('/wallet/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
  const response = await apiClient.get('/wallet/1');
  return response.data;
};

/**
 * Register a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise} { token, user }
 */
export const registerUser = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Login an existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise} { token, user }
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
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
  const response = await apiClient.get(`/merchants/${merchantId}/click`);
  return response.data;
};

/**
 * Create a transaction for the authenticated user
 * @param {number} merchantId
 * @param {number} orderAmount
 * @param {string} token - JWT token
 * @returns {Promise} TransactionDTO
 */
export const createTransaction = async (merchantId, orderAmount, token) => {
  const response = await apiClient.post(
    '/transactions',
    { merchantId, orderAmount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

/**
 * Fetch a single merchant by ID
 * @param {number|string} id - Merchant ID
 * @returns {Promise} MerchantDetailDTO
 */
export const getMerchantById = async (id) => {
  const response = await apiClient.get(`/merchants/${id}`);
  return response.data;
};

/**
 * Health check — used for cold-start detection
 * @returns {Promise} Health status
 */
export const getHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

/**
 * Update a transaction's status (admin use)
 * @param {number} transactionId
 * @param {'CONFIRMED'|'REJECTED'} status
 * @param {string} token - JWT token
 * @returns {Promise} Updated TransactionDTO
 */
export const updateTransactionStatus = async (transactionId, status, token) => {
  const response = await apiClient.put(
    `/transactions/${transactionId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

/**
 * Update user profile (display name)
 * @param {string} name - New display name
 * @param {string} token - JWT token
 * @returns {Promise} Updated UserDTO
 */
export const updateUserProfile = async (name, token) => {
  const response = await apiClient.put(
    '/users/me',
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

/**
 * Fetch referral stats for the authenticated user
 * @param {string} token - JWT token
 * @returns {Promise} { friendsJoined, bonusEarned }
 */
export const getReferralStats = async (token) => {
  const response = await apiClient.get('/referrals/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Create a withdrawal request
 * @param {string} upiId - UPI ID for payment
 * @param {number} amount - Amount to withdraw
 * @param {string} token - JWT token
 * @returns {Promise} WithdrawalDTO
 */
export const createWithdrawal = async (upiId, amount, token) => {
  const response = await apiClient.post(
    '/withdrawals',
    { upiId, amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

/**
 * Fetch withdrawal history for the authenticated user
 * @param {string} token - JWT token
 * @returns {Promise} Array of WithdrawalDTO
 */
export const getWithdrawalHistory = async (token) => {
  const response = await apiClient.get('/withdrawals', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default apiClient;
