import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

/**
 * WalletCard - Displays a single wallet statistic with icon, label, and value
 * @param {Object} props
 * @param {React.Component} props.icon - Lucide icon component
 * @param {string} props.label - Label for the stat (e.g., "Total Earned")
 * @param {number} props.value - Numeric value to display
 * @param {string} props.color - Tailwind text color class (e.g., "text-success")
 * @param {string} props.bgColor - Tailwind background color class (e.g., "bg-emerald-50")
 */
function WalletCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
      data-testid="wallet-card"
    >
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
};

export default WalletCard;
