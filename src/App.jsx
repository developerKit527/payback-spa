import { useState, useEffect, useRef } from 'react';
import { getWallet, getMerchants, trackMerchantClick, getHealth } from './services/api';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryPills from './components/CategoryPills';
import HowItWorks from './components/HowItWorks';
import MobileBottomNav from './components/MobileBottomNav';
import WalletCard, { WalletCardSkeleton } from './components/WalletCard';
import MerchantGrid from './components/MerchantGrid';
import TransactionList from './components/TransactionList';
import { MERCHANT_CATEGORIES } from './utils/merchantCategories';

function App() {
  const { showToast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverWaking, setServerWaking] = useState(false);
  const wakingTimerRef = useRef(null);

  const filteredMerchants = activeCategory
    ? merchants.filter(m => MERCHANT_CATEGORIES[m.name] === activeCategory)
    : merchants;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Health check — show "waking up" banner if server doesn't respond within 3s
        wakingTimerRef.current = setTimeout(() => setServerWaking(true), 3000);
        await getHealth();
        clearTimeout(wakingTimerRef.current);
        setServerWaking(false);

        const [walletData, merchantsData] = await Promise.all([
          getWallet(1),
          getMerchants()
        ]);
        setWallet(walletData);
        setMerchants(merchantsData);
        setTransactions(walletData.transactions || []);
        setError(null);
      } catch (err) {
        clearTimeout(wakingTimerRef.current);
        setServerWaking(false);
        console.error('Failed to fetch data:', err);
        setError(err.message);
        showToast(err.message || 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => clearTimeout(wakingTimerRef.current);
  }, []);

  const handleMerchantActivate = async (merchantId) => {
    try {
      // GET /api/v1/merchants/{id}/click — returns redirect URL in response
      const result = await trackMerchantClick(merchantId);
      const url = result?.redirectUrl || result?.url || result;
      if (!url || typeof url !== 'string') {
        showToast('Merchant link not available yet.', 'info');
        return;
      }
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to track merchant click:', err);
      showToast('Failed to activate cashback. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {serverWaking && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm text-center py-2 px-4">
            ⏳ Waking up server, please wait a moment...
          </div>
        )}
        <HeroSection />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-12">
            <WalletCardSkeleton />
          </div>
          <div className="h-8 w-64 bg-gray-200 rounded mb-6 animate-pulse" />
          <MerchantGrid merchants={[]} loading={true} onMerchantActivate={() => {}} />
        </main>
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
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wallet</h1>
        
        {/* Wallet Card — unified */}
        <div className="mb-12">
          <WalletCard
            wallet={wallet}
            loading={loading}
            error={error}
          />
        </div>

        {/* Merchants Section */}
        <div id="merchant-grid" className="mb-12">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Shop & Earn Cashback
          </h2>
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="mt-6">
            <MerchantGrid
              merchants={filteredMerchants}
              loading={loading}
              onMerchantActivate={handleMerchantActivate}
            />
          </div>
        </div>

        {/* Transaction History Section */}
        <div>
          <TransactionList
            transactions={transactions}
            loading={loading}
          />
        </div>
      </main>

      {/* How It Works */}
      <HowItWorks />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default App;
