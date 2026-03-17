import { useEffect, useRef } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { WifiOff, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import styles from './WalletCard.module.css';

export function WalletCardSkeleton() {
  return (
    <div className={`${styles.walletCard} w-full`} data-testid="wallet-card-skeleton">
      <div className={`${styles.shimmer} h-4 w-32 mb-6`} />
      <div className={`${styles.shimmer} h-12 w-48 mb-6`} />
      <div className="flex gap-4">
        <div className={`${styles.shimmer} h-10 w-32 rounded-full`} />
        <div className={`${styles.shimmer} h-10 w-32 rounded-full`} />
      </div>
    </div>
  );
}

function useCountUp(target, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled || target == null) return;
    const el = ref.current;
    if (!el) return;

    const duration = 1000;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCurrency(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, enabled]);

  return ref;
}

function WalletCard({ wallet, loading, error }) {
  const available = parseFloat(wallet?.available) || 0;
  const totalEarned = parseFloat(wallet?.totalEarned) || 0;
  const pending = parseFloat(wallet?.pending) || 0;

  const availableRef = useCountUp(available, !loading && !error);

  if (loading) return <WalletCardSkeleton />;

  if (error) {
    return (
      <div className={`${styles.walletCard} w-full`} data-testid="wallet-card-error">
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <WifiOff className="w-10 h-10 text-slate-400" />
          <p className="text-slate-500 font-medium">Could not load balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.walletCard} w-full border-t-4 border-l-4 border-emerald-500 border border-emerald-100 shadow-lg`} data-testid="wallet-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-emerald-100 rounded-full p-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="text-slate-500 text-sm font-medium">My Wallet</span>
      </div>

      {/* Available balance with count-up */}
      <p className="text-slate-500 text-sm font-medium mb-1">Available for Payout</p>
      <p
        ref={availableRef}
        className="text-5xl font-black text-emerald-600 mb-6"
        data-testid="wallet-card-value"
      >
        {formatCurrency(available)}
      </p>

      {/* Chips */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
          <span className="text-xs text-slate-500 mr-1" data-testid="wallet-card-label-earned">Total Earned</span>
          <span className="text-emerald-700 font-bold text-sm" data-testid="wallet-card-earned">
            {formatCurrency(totalEarned)}
          </span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
          <span className="text-xs text-slate-500 mr-1" data-testid="wallet-card-label-pending">Pending</span>
          <span className="text-amber-700 font-bold text-sm" data-testid="wallet-card-pending">
            {formatCurrency(pending)}
          </span>
        </div>
      </div>
    </div>
  );
}

WalletCard.propTypes = {
  wallet: PropTypes.shape({
    totalEarned: PropTypes.number,
    pending: PropTypes.number,
    available: PropTypes.number,
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

WalletCard.defaultProps = {
  wallet: null,
  loading: false,
  error: null,
};

export default WalletCard;
