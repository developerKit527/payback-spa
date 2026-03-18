import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { updateTransactionStatus } from '../services/api';
import apiClient from '../services/api';

const ADMIN_PASSWORD = 'payback@admin2026';

const STATUS_STYLES = {
  PENDING:   'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  REJECTED:  'bg-red-50 text-red-700',
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function AdminPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/transactions/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setUnlocked(true);
      setPasswordError('');
      fetchTransactions();
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateTransactionStatus(id, status, token);
      showToast(`Transaction ${status.toLowerCase()}`, 'success');
      await fetchTransactions();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 w-full max-w-sm">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Lock className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
            <p className="text-slate-500 text-sm text-center">Enter the admin password to manage transactions.</p>
          </div>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
              placeholder="Password"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-600 text-xs font-medium">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full py-3 text-sm transition-colors"
            >
              Unlock
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 text-sm transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Transaction table ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-slate-900 font-bold text-sm">Admin — Transaction Management</span>
        </div>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Merchant</th>
                  <th className="px-6 py-4 text-right">Order Amt</th>
                  <th className="px-6 py-4 text-right">Cashback</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Created At</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                      Loading transactions...
                    </td>
                  </tr>
                )}
                {!loading && transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No transactions found.
                    </td>
                  </tr>
                )}
                {!loading && transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{tx.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{tx.merchantName}</td>
                    <td className="px-6 py-4 text-right text-slate-700">{formatCurrency(tx.orderAmount)}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-semibold">{formatCurrency(tx.cashbackAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`${STATUS_STYLES[tx.status] || 'bg-slate-100 text-slate-600'} rounded-full px-3 py-1 text-xs font-bold`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(tx.createdAt)}</td>
                    <td className="px-6 py-4">
                      {tx.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(tx.id, 'CONFIRMED')}
                            disabled={updatingId === tx.id}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(tx.id, 'REJECTED')}
                            disabled={updatingId === tx.id}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {loading && (
              <p className="px-6 py-12 text-center text-slate-400 text-sm">Loading transactions...</p>
            )}
            {!loading && transactions.length === 0 && (
              <p className="px-6 py-12 text-center text-slate-400 text-sm">No transactions found.</p>
            )}
            {!loading && transactions.map((tx) => (
              <div key={tx.id} className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">{tx.merchantName}</span>
                  <span className={`${STATUS_STYLES[tx.status] || 'bg-slate-100 text-slate-600'} rounded-full px-3 py-1 text-xs font-bold`}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>#{tx.id} · {formatDate(tx.createdAt)}</span>
                  <span className="text-emerald-600 font-semibold">+{formatCurrency(tx.cashbackAmount)}</span>
                </div>
                {tx.status === 'PENDING' && (
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleStatusUpdate(tx.id, 'CONFIRMED')}
                      disabled={updatingId === tx.id}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(tx.id, 'REJECTED')}
                      disabled={updatingId === tx.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
