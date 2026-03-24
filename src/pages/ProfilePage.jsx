import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wallet as WalletIcon, Receipt } from 'lucide-react';
import { getWallet, updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import TransactionList from '../components/TransactionList';

export default function ProfilePage() {
  const { user, token, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [updating, setUpdating] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      showToast('Please sign in to view your profile', 'info');
    }
  }, [isAuthenticated, navigate, showToast]);

  // Fetch profile data
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const data = await getWallet(token);
        setWalletData(data);
        setTransactions(data.transactions || []);
      } catch (err) {
        showToast('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, token, showToast]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setUpdating(true);
    try {
      const updatedUser = await updateUserProfile(nameInput.trim(), token);
      updateUser(updatedUser);
      setEditMode(false);
      showToast('Name updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update name', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile</h2>

          <div className="flex items-start gap-6">
            {/* Avatar circle with initials */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 flex-shrink-0">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>

            <div className="flex-1">
              {!editMode ? (
                <>
                  <h3 className="text-xl font-semibold text-slate-900">{user?.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setNameInput(user?.name || '');
                    }}
                    className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Edit Name
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                  <p className="text-slate-500 text-sm mt-2">{user?.email}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleSaveName}
                      disabled={updating || !nameInput.trim()}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      disabled={updating}
                      className="border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium hover:border-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Wallet Summary */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Wallet Summary</h2>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Total Earned</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(parseFloat(walletData?.totalEarned) || 0)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Pending</span>
                <span className="text-2xl font-bold text-amber-600">
                  {formatCurrency(parseFloat(walletData?.pending) || 0)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm">Available for Payout</span>
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(parseFloat(walletData?.available) || 0)}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Transaction History */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h2>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
            </div>
          ) : transactions.length > 0 ? (
            <TransactionList transactions={transactions} loading={false} />
          ) : (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No transactions yet</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Start shopping to earn cashback →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
