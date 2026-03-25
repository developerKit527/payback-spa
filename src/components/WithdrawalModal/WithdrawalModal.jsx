import { useState } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const UPI_ID_PATTERN = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
const MIN_WITHDRAWAL_AMOUNT = 100;

export default function WithdrawalModal({ isOpen, availableBalance, onSubmit, onClose }) {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [upiError, setUpiError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateUpiId = (value) => {
    if (!value) {
      setUpiError('');
      return false;
    }
    if (!UPI_ID_PATTERN.test(value)) {
      setUpiError('Invalid UPI ID format. Use: yourname@upi');
      return false;
    }
    setUpiError('');
    return true;
  };

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (!value) {
      setAmountError('');
      return false;
    }
    if (isNaN(numValue) || numValue < MIN_WITHDRAWAL_AMOUNT) {
      setAmountError(`Minimum withdrawal amount is ${formatCurrency(MIN_WITHDRAWAL_AMOUNT)}`);
      return false;
    }
    if (numValue > availableBalance) {
      setAmountError('Amount exceeds available balance');
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleUpiChange = (e) => {
    const value = e.target.value;
    setUpiId(value);
    if (value) validateUpiId(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value) validateAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isUpiValid = validateUpiId(upiId);
    const isAmountValid = validateAmount(amount);

    if (!isUpiValid || !isAmountValid) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(upiId, parseFloat(amount));
      // Reset form on success
      setUpiId('');
      setAmount('');
      setUpiError('');
      setAmountError('');
    } catch (err) {
      // Error handling is done by parent
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = 
    upiId && 
    amount && 
    !upiError && 
    !amountError && 
    UPI_ID_PATTERN.test(upiId) &&
    parseFloat(amount) >= MIN_WITHDRAWAL_AMOUNT &&
    parseFloat(amount) <= availableBalance;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Withdrawal</h2>
        
        {/* Available Balance */}
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-emerald-700 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-emerald-600">
            {formatCurrency(availableBalance)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* UPI ID Input */}
          <div>
            <label htmlFor="upiId" className="block text-sm font-medium text-slate-700 mb-2">
              UPI ID
            </label>
            <input
              id="upiId"
              type="text"
              value={upiId}
              onChange={handleUpiChange}
              placeholder="yourname@upi"
              disabled={submitting}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                upiError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {upiError && (
              <p className="mt-2 text-sm text-red-600">{upiError}</p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Minimum ${MIN_WITHDRAWAL_AMOUNT}`}
              min={MIN_WITHDRAWAL_AMOUNT}
              max={availableBalance}
              step="1"
              disabled={submitting}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                amountError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {amountError && (
              <p className="mt-2 text-sm text-red-600">{amountError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
          >
            {submitting ? 'Processing...' : 'Request Withdrawal'}
          </button>
        </form>

        {/* Info text */}
        <p className="mt-4 text-xs text-slate-500 text-center">
          Withdrawals are processed within 24-48 hours
        </p>
      </div>
    </div>
  );
}
