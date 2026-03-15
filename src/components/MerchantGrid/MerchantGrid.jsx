import React from 'react';
import PropTypes from 'prop-types';
import MerchantCard, { MerchantCardSkeleton } from '../MerchantCard';

/**
 * MerchantGrid - Responsive grid of merchant cards with shimmer loading state
 */
function MerchantGrid({ merchants, loading, onMerchantActivate }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="merchant-grid-skeleton">
        {Array.from({ length: 6 }).map((_, i) => (
          <MerchantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!merchants || merchants.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center" data-testid="empty-state">
        <p className="text-gray-600 text-lg">No merchants available at the moment.</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for cashback offers!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="merchant-grid">
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
