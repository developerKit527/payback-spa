import React from 'react';
import PropTypes from 'prop-types';

function OfferCard({ offer, onActivate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-emerald-200 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-sm leading-tight">{offer.title}</h4>
          {offer.description && (
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">{offer.description}</p>
          )}
        </div>
        {offer.discountText && (
          <span className="flex-shrink-0 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100">
            {offer.discountText}
          </span>
        )}
      </div>
      <button
        onClick={() => onActivate(offer)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2.5 px-4 rounded-full transition-colors"
        aria-label={`Activate deal: ${offer.title}`}
      >
        Activate Deal →
      </button>
    </div>
  );
}

OfferCard.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    discountText: PropTypes.string,
    affiliateUrl: PropTypes.string,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default OfferCard;
