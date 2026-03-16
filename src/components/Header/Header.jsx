import React from 'react';
import PropTypes from 'prop-types';
import { Search, User } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

/**
 * Header - Global navigation header component (Rakuten-style)
 * @param {Object} props
 * @param {Object} props.wallet - Wallet data for displaying balance
 * @param {boolean} props.isAuthenticated - Whether user is signed in
 */
function Header({ wallet = null, isAuthenticated = false }) {
  return (
    <header className="w-full sticky top-0 text-white shadow-md z-50" style={{ backgroundColor: '#1A1A2E' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-white">
            Payback
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/60" />
            </div>
            <input
              type="text"
              placeholder="Search stores, brands, or categories..."
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg leading-5 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          {wallet && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-white/80">Available Balance</span>
              <span className="text-lg font-bold">{formatCurrency(wallet.available)}</span>
            </div>
          )}
          
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">
            <User className="h-5 w-5" />
            <span className="hidden md:inline font-medium">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  wallet: PropTypes.shape({
    available: PropTypes.number,
    totalEarned: PropTypes.number,
    pending: PropTypes.number,
  }),
  isAuthenticated: PropTypes.bool,
};

export default Header;
