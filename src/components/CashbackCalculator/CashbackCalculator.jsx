import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CashbackCalculator.module.css';

function CashbackCalculator({ cashbackRate, merchantName, onActivate }) {
  const [inputAmount, setInputAmount] = useState('');

  const amount = parseFloat(inputAmount) || 0;
  const cashback = amount * (cashbackRate / 100);

  const ctaText = amount > 0
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
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
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
        onClick={() => onActivate(amount)}
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
  onActivate: PropTypes.func.isRequired,
};

export default CashbackCalculator;
