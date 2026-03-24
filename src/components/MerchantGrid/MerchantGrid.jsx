import React from 'react';
import PropTypes from 'prop-types';
import { SearchX } from 'lucide-react';
import MerchantCard, { MerchantCardSkeleton } from '../MerchantCard';

/**
 * MerchantGrid - Responsive grid of merchant cards with shimmer loading state
 */
function MerchantGrid({ merchants, loading, searchQuery, activeCategory, onClearFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-testid="merchant-grid-skeleton">
        {Array.from({ length: 6 }).map((_, i) => (
          <MerchantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!merchants || merchants.length === 0) {
    const hasFilters = searchQuery || activeCategory;
    
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4" data-testid="empty-state">
        <SearchX className="w-16 h-16 text-slate-300" />
        <h3 className="text-xl font-semibold text-slate-700">No merchants found</h3>
        <p className="text-slate-500 text-sm">
          {hasFilters 
            ? 'Try adjusting your search or category filter' 
            : 'Check back soon for cashback offers!'}
        </p>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-2"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-testid="merchant-grid">
      {merchants.map((merchant) => (
        <MerchantCard
          key={merchant.id}
          merchant={merchant}
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
      cashbackRate: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
  searchQuery: PropTypes.string,
  activeCategory: PropTypes.string,
  onClearFilters: PropTypes.func,
};

MerchantGrid.defaultProps = {
  merchants: [],
  loading: false,
  searchQuery: '',
  activeCategory: null,
  onClearFilters: () => {},
};

export default MerchantGrid;
