import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';
import styles from './WalletCard.module.css';

/**
 * WalletCardSkeleton - Shimmer placeholder while wallet data loads
 */
export function WalletCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6" data-testid="wallet-card-skeleton">
      <div className={`${styles.shimmer} w-12 h-12 rounded-full mb-4`} />
      <div className={`${styles.shimmer} h-4 w-24 rounded mb-3`} />
      <div className={`${styles.shimmer} h-8 w-32 rounded`} />
    </div>
  );
}

/**
 * WalletCard - Displays a single wallet statistic with icon, label, and value.
 * Pass glass={true} for the glassmorphic variant (Total Earned / Pending).
 */
function WalletCard({ icon: Icon, label, value, color, bgColor, glass = false }) {
  const cardClass = glass
    ? `${styles.glassCard} rounded-2xl p-6 hover:shadow-lg transition-shadow`
    : 'bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow';

  return (
    <div className={cardClass} data-testid="wallet-card">
      <div className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} data-testid="wallet-card-icon" />
      </div>
      <div className="text-sm text-gray-600 mb-2" data-testid="wallet-card-label">
        {label}
      </div>
      <div className={`text-3xl font-extrabold ${color}`} data-testid="wallet-card-value">
        {formatCurrency(value)}
      </div>
    </div>
  );
}

WalletCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  glass: PropTypes.bool,
};

export default WalletCard;
