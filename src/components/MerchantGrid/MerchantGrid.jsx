import React from 'react';
import PropTypes from 'prop-types';
import MerchantCard from '../MerchantCard';

/**
 * MerchantGrid - Container component that displays merchants in a responsive grid
 * @param {Object} props
 * @param {Array} props.merchants - Array of merchant objects
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onMerchantActivate - Callback when a merchant is activated
 */
function MerchantGrid({ merchants, loading, onMerchantActivate }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skeleton Loaders */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
            data-testid="merchant-skeleton"
          >
            <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!merchants || merchants.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl shadow-sm p-12 text-center"
        data-testid="empty-state"
      >
        <p className="text-gray-600 text-lg">No merchants available at the moment.</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for cashback offers!</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      data-testid="merchant-grid"
    >
      {merchants.map((merchant) => (
        <MerchantCard
          key={merchant.id}
          merchant={merchant}
          onActivate={onMerchantActivate}
        />
      ))}
    </div>
  );
}

MerchantGrid.propTypes = {
  merchants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logoUrl: PropTypes.string.isRequired,
      cashbackPercentage: PropTypes.number.isRequired,
      manualTrackingUrl: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  onMerchantActivate: PropTypes.func.isRequired,
};

MerchantGrid.defaultProps = {
  merchants: [],
  loading: false,
};

export default MerchantGrid;
