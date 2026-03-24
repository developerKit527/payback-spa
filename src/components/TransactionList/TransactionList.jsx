import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';
import styles from './TransactionList.module.css';

const TransactionList = ({ transactions = [], loading = false, showHeading = true }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-50 text-emerald-700';
      case 'PENDING':   return 'bg-amber-50 text-amber-700';
      case 'REJECTED':  return 'bg-red-50 text-red-700';
      default:          return 'bg-slate-100 text-slate-600';
    }
  };

  // API returns amounts as strings ("1000.00") — coerce to number
  const toNum = (val) => parseFloat(val) || 0;

  if (loading) {
    return (
      <div className={styles.container}>
        {showHeading && <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.container}>
        {showHeading && <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>}
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showHeading && <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>}
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg overflow-hidden shadow-sm">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Date</th>
              <th>Order Amount</th>
              <th>Cashback</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="font-medium text-gray-900">{transaction.merchantName}</td>
                <td className="text-gray-600">{formatDate(transaction.createdAt)}</td>
                <td className="font-bold text-gray-900">{formatCurrency(toNum(transaction.orderAmount))}</td>
                <td className="font-bold text-success">{formatCurrency(toNum(transaction.cashbackAmount))}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusStyle(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{transaction.merchantName}</h3>
                <p className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</p>
              </div>
              <span className={`${styles.statusBadge} ${getStatusStyle(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Order Amount</p>
                <p className="font-bold text-gray-900">{formatCurrency(toNum(transaction.orderAmount))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Cashback</p>
                <p className="font-bold text-success">{formatCurrency(toNum(transaction.cashbackAmount))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      merchantName: PropTypes.string.isRequired,
      orderAmount: PropTypes.number.isRequired,
      cashbackAmount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ),
  loading: PropTypes.bool,
  showHeading: PropTypes.bool
};

export default TransactionList;
