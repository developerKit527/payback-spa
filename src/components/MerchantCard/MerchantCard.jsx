import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'lucide-react';

/**
 * MerchantCard - Displays a merchant with logo, cashback rate, and action button
 * @param {Object} props
 * @param {Object} props.merchant - Merchant data object
 * @param {number} props.merchant.id - Merchant ID
 * @param {string} props.merchant.name - Merchant name
 * @param {string} props.merchant.logoUrl - URL to merchant logo
 * @param {number} props.merchant.cashbackPercentage - Cashback rate (e.g., 10 for 10%)
 * @param {string} props.merchant.manualTrackingUrl - Affiliate tracking URL
 * @param {Function} props.onActivate - Callback when Shop & Earn is clicked
 */
function MerchantCard({ merchant, onActivate }) {
  const [isActivating, setIsActivating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = async () => {
    if (isActivating) return;
    
    setIsActivating(true);
    try {
      await onActivate(merchant.id);
    } finally {
      setIsActivating(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback placeholder image
  const placeholderImage = `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${encodeURIComponent(merchant.name)}`;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center relative"
      data-testid="merchant-card"
    >
      {/* Cashback Badge - Top Right */}
      <div
        className="absolute top-4 right-4 bg-success/10 text-success px-3 py-1 rounded-full text-xs font-semibold"
        data-testid="cashback-badge-corner"
      >
        {merchant.cashbackPercentage}% Cashback
      </div>

      {/* Merchant Logo */}
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <img
          src={imageError ? placeholderImage : merchant.logoUrl}
          alt={`${merchant.name} logo`}
          className="max-w-full max-h-full object-contain"
          onError={handleImageError}
          data-testid="merchant-logo"
        />
      </div>

      {/* Merchant Name */}
      <h3
        className="text-lg font-semibold text-gray-900 mb-4 text-center"
        data-testid="merchant-name"
      >
        {merchant.name}
      </h3>

      {/* Shop & Earn Button */}
      <button
        onClick={handleClick}
        disabled={isActivating}
        className="w-full bg-fuchsia-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        data-testid="shop-earn-button"
      >
        {isActivating ? (
          'Opening...'
        ) : (
          <>
            Shop & Earn
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

MerchantCard.propTypes = {
  merchant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    cashbackPercentage: PropTypes.number.isRequired,
    manualTrackingUrl: PropTypes.string.isRequired,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default MerchantCard;
