import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Wallet, LogOut } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

/**
 * Header - Global navigation header component
 * @param {Object} props
 * @param {Object} props.wallet - Wallet data for displaying balance
 * @param {Function} props.onSignIn - Opens login modal
 * @param {Function} props.onJoinNow - Opens register modal
 */
function Header({ wallet = null, onSignIn, onJoinNow }) {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-200 bg-emerald-600 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
      data-testid="header"
    >
      <div className="w-full flex items-center justify-between h-28 px-8 lg:px-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <Wallet className="h-9 w-9 text-white" />
          <h1 className="text-4xl font-black tracking-tight text-white">
            Payback
          </h1>
        </div>

        {/* Search Bar — hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/70" />
            </div>
            <input
              type="text"
              placeholder="Search stores, brands, or categories..."
              className="block w-full pl-11 pr-4 py-3.5 bg-white/20 border border-white/30 rounded-2xl text-lg text-white placeholder:text-white/70 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Right — balance + auth buttons */}
        <div className="flex items-center gap-4">
          {wallet && (
            <div className="hidden md:flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2.5">
              <span className="text-base font-semibold text-white">
                {formatCurrency(parseFloat(wallet.available) || 0)}
              </span>
            </div>
          )}

          {isAuthenticated ? (
            <>
              <span className="bg-white/20 border border-white/30 text-white rounded-full px-5 py-2.5 text-base font-semibold">
                Hi, {user?.firstName}
              </span>
              <button
                onClick={logout}
                aria-label="Logout"
                className="text-white/80 hover:text-white transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="border border-white/50 text-white rounded-full px-6 py-3 text-base font-medium hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onJoinNow}
                className="bg-white text-emerald-600 rounded-full px-6 py-3 text-base font-bold hover:bg-emerald-50 transition-colors"
              >
                Join Now
              </button>
            </>
          )}
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
  onSignIn: PropTypes.func,
  onJoinNow: PropTypes.func,
};

export default Header;
