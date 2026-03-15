import { useState, useEffect } from 'react';
import { getWallet, getMerchants, trackMerchantClick } from './services/api';
import Header from './components/Header';
import WalletCard from './components/WalletCard';
import MerchantGrid from './components/MerchantGrid';
import TransactionList from './components/TransactionList';
import { Wallet, Clock, CheckCircle } from 'lucide-react';

function App() {
  const [wallet, setWallet] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [walletData, merchantsData] = await Promise.all([
          getWallet(1),
          getMerchants()
        ]);
        setWallet(walletData);
        setMerchants(merchantsData);
        setTransactions(walletData.transactions || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMerchantActivate = async (merchantId) => {
    try {
      const merchant = merchants.find(m => m.id === merchantId);
      if (!merchant) return;

      // Track the click
      await trackMerchantClick(merchantId);
      
      // Open merchant URL in new tab
      window.open(merchant.manualTrackingUrl, '_blank');
    } catch (err) {
      console.error('Failed to track merchant click:', err);
      alert('Failed to activate cashback. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-900 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
            <p className="text-red-600 font-semibold text-lg mb-2">Something went wrong</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header wallet={wallet} isAuthenticated={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wallet</h1>
        
        {/* Wallet Cards Grid */}
        {wallet && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <WalletCard
              icon={CheckCircle}
              label="Total Earned"
              value={wallet.totalEarned}
              color="text-success"
              bgColor="bg-emerald-50"
            />
            <WalletCard
              icon={Clock}
              label="Pending"
              value={wallet.pending}
              color="text-warning"
              bgColor="bg-amber-50"
            />
            <WalletCard
              icon={Wallet}
              label="Available for Payout"
              value={wallet.available}
              color="text-primary"
              bgColor="bg-indigo-50"
            />
          </div>
        )}

        {/* Merchants Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Shop & Earn Cashback
          </h2>
          <MerchantGrid
            merchants={merchants}
            loading={loading}
            onMerchantActivate={handleMerchantActivate}
          />
        </div>

        {/* Transaction History Section */}
        <div>
          <TransactionList
            transactions={transactions}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
