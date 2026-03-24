import React from 'react';
import PropTypes from 'prop-types';
import styles from './CashbackCalculator.module.css';

function CashbackCalculator({ cashbackRate, merchantName, amount, onAmountChange, onActivate, disabled }) {
  const orderAmount = parseFloat(amount) || 0;
  const cashback = orderAmount * (cashbackRate / 100);

  const ctaText = orderAmount > 0
    ? `Shop on ${merchantName} & Earn ₹${cashback.toFixed(2)} →`
    : 'Activate Cashback & Shop →';

  return (
    <div className={styles.calculator}>
      <h3 className="text-lg font-bold text-slate-900 mb-1">Cashback Calculator</h3>
      <p className="text-sm text-slate-500 mb-4">See how much you'll earn before you shop</p>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        I plan to spend:
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.currencySymbol}>₹</span>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className={styles.amountInput}
          aria-label="Spend amount"
        />
      </div>

      <div className={styles.resultCard}>
        <p className={styles.earnLabel}>You will earn:</p>
        <p className={styles.earnAmount}>₹{cashback.toFixed(2)} cashback</p>
        <p className={styles.offLabel}>That's like {cashbackRate}% OFF your purchase!</p>
      </div>

      <button
        className={styles.ctaButton}
        onClick={onActivate}
        disabled={disabled}
        aria-label={ctaText}
      >
        {ctaText}
      </button>
    </div>
  );
}

CashbackCalculator.propTypes = {
  cashbackRate: PropTypes.number.isRequired,
  merchantName: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CashbackCalculator.defaultProps = {
  disabled: false,
};

export default CashbackCalculator;
