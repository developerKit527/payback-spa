import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'lucide-react';
import styles from './MerchantCard.module.css';
import { OFFER_TAGS, FEATURED_IDS } from '../../utils/offerTags';

// Deterministic color palette for logo fallbacks
const FALLBACK_COLORS = [
  '#4F46E5', '#C026D3', '#10B981', '#F59E0B',
  '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899',
];

function getFallbackColor(name) {
  const index = (name?.charCodeAt(0) || 0) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index];
}

/**
 * MerchantCardSkeleton - Shimmer placeholder while merchants load
 */
export function MerchantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center" data-testid="merchant-card-skeleton">
      <div className={`${styles.shimmer} w-24 h-24 rounded-full mb-4`} />
      <div className={`${styles.shimmer} h-5 w-32 rounded mb-4`} />
      <div className={`${styles.shimmer} h-6 w-24 rounded-full mb-4`} />
      <div className={`${styles.shimmer} h-12 w-full rounded-lg`} />
    </div>
  );
}

/**
 * MerchantCard - Enhanced merchant card with offer tag, featured ribbon, hover lift
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

  const fallbackColor = getFallbackColor(merchant.name);
  const firstLetter = merchant.name?.charAt(0).toUpperCase() || '?';
  const showFallback = imageError || !merchant.logoUrl;
  const offerTag = OFFER_TAGS[merchant.id];
  const isFeatured = FEATURED_IDS.includes(merchant.id);

  return (
    <div
      className={`${styles.card} bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center relative overflow-hidden`}
      data-testid="merchant-card"
    >
      {/* Featured gold ribbon */}
      {isFeatured && (
        <div className={styles.ribbon} data-testid="featured-ribbon">
          ★ Featured
        </div>
      )}

      {/* Cashback Badge — top right */}
      <div
        className="absolute top-4 right-4 bg-orange-50 text-primary px-3 py-1 rounded-full text-xs font-semibold"
        data-testid="cashback-badge-corner"
      >
        Upto {merchant.cashbackRate}% Cashback
      </div>

      {/* Logo or Fallback */}
      <div className="w-24 h-24 mb-4 flex items-center justify-center" data-testid="merchant-logo-container">
        {showFallback ? (
          <div
            className={styles.logoFallback}
            style={{ backgroundColor: fallbackColor }}
            data-testid="merchant-logo-fallback"
            aria-label={`${merchant.name} logo`}
          >
            {firstLetter}
          </div>
        ) : (
          <img
            src={merchant.logoUrl}
            alt={`${merchant.name} logo`}
            className="max-w-full max-h-full object-contain"
            onError={() => setImageError(true)}
            data-testid="merchant-logo"
          />
        )}
      </div>

      {/* Merchant Name */}
      <h3
        className="text-lg font-semibold text-gray-900 mb-2 text-center"
        data-testid="merchant-name"
      >
        {merchant.name}
      </h3>

      {/* Offer Tag */}
      {offerTag && (
        <span
          className="mb-4 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full"
          data-testid="offer-tag"
        >
          {offerTag}
        </span>
      )}
      {!offerTag && <div className="mb-4" />}

      {/* Shop Now Button */}
      <button
        onClick={handleClick}
        disabled={isActivating}
        className="w-full bg-white border-2 border-primary text-primary py-3 px-6 rounded-lg font-semibold hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        data-testid="shop-earn-button"
      >
        {isActivating ? (
          'Opening...'
        ) : (
          <>
            Shop Now →
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
    logoUrl: PropTypes.string,
    cashbackRate: PropTypes.number.isRequired,
    manualTrackingUrl: PropTypes.string,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default MerchantCard;
