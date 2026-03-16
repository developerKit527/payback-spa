import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { WifiOff } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import styles from './WalletCard.module.css';

/**
 * WalletCardSkeleton - Shimmer placeholder while wallet data loads
 */
export function WalletCardSkeleton() {
  return (
    <div className={styles.walletCard} data-testid="wallet-card-skeleton">
      <div className={`${styles.shimmer} h-4 w-32 mb-6`} />
      <div className={`${styles.shimmer} h-12 w-48 mb-6`} />
      <div className="flex gap-8">
        <div>
          <div className={`${styles.shimmer} h-3 w-20 mb-2`} />
          <div className={`${styles.shimmer} h-6 w-24`} />
        </div>
        <div>
          <div className={`${styles.shimmer} h-3 w-16 mb-2`} />
          <div className={`${styles.shimmer} h-6 w-20`} />
        </div>
      </div>
    </div>
  );
}

/**
 * useCountUp - animates a number from 0 to target over ~1 second
 */
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
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCurrency(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, enabled]);

  return ref;
}

/**
 * WalletCard - Unified single-card wallet dashboard with gradient background,
 * count-up animation, skeleton loader, and error state.
 */
function WalletCard({ wallet, loading, error }) {
  const availableRef = useCountUp(wallet?.available, !loading && !error);

  if (loading) return <WalletCardSkeleton />;

  if (error) {
    return (
      <div className={styles.walletCard} data-testid="wallet-card-error">
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <WifiOff className="w-10 h-10 text-white/60" />
          <p className="text-white/80 font-medium">Could not load balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.walletCard} data-testid="wallet-card">
      {/* Available for Payout — primary value with count-up */}
      <p className="text-white/70 text-sm font-medium mb-1">Available for Payout</p>
      <p
        ref={availableRef}
        className="text-4xl font-extrabold text-white mb-6 font-heading"
        data-testid="wallet-card-value"
      >
        {formatCurrency(wallet?.available ?? 0)}
      </p>

      {/* Secondary stats */}
      <div className="flex gap-8 flex-wrap">
        <div>
          <p className="text-white/60 text-xs mb-1" data-testid="wallet-card-label-earned">
            Total Earned
          </p>
          <p className="text-success font-bold text-lg" data-testid="wallet-card-earned">
            {formatCurrency(wallet?.totalEarned ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-white/60 text-xs mb-1" data-testid="wallet-card-label-pending">
            Pending
          </p>
          <p className="text-warning font-bold text-lg" data-testid="wallet-card-pending">
            {formatCurrency(wallet?.pending ?? 0)}
          </p>
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
