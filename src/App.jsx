import { useState, useEffect, useRef, useCallback } from 'react';
import { getWallet, getMerchants, getHealth } from './services/api';
import { useToast } from './hooks/useToast';
import { useAuth } from './context/AuthContext';
import { useAuthModal } from './context/AuthModalContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryPills from './components/CategoryPills';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import WalletCard, { WalletCardSkeleton } from './components/WalletCard';
import { Wallet } from 'lucide-react';
import MerchantGrid from './components/MerchantGrid';
import TransactionList from './components/TransactionList';
import LoginModal from './components/AuthModal/LoginModal';
import RegisterModal from './components/AuthModal/RegisterModal';
import { MERCHANT_CATEGORIES } from './utils/merchantCategories';

function App() {
  const { showToast } = useToast();
  const { token, isAuthenticated } = useAuth();
  const { authModal, setAuthModal } = useAuthModal();
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Health check — show "waking up" banner if server doesn't respond within 3s
      wakingTimerRef.current = setTimeout(() => setServerWaking(true), 3000);
      await getHealth();
      clearTimeout(wakingTimerRef.current);
      setServerWaking(false);

      // Pass token so authenticated users get /wallet/me, others get /wallet/1
      const [walletData, merchantsData] = await Promise.all([
        getWallet(token),
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
  }, [token, showToast]);

  // Re-fetch whenever auth state changes (login, logout, token restored)
  useEffect(() => {
    fetchData();
    return () => clearTimeout(wakingTimerRef.current);
  }, [isAuthenticated]);

  // Listen for walletUpdated events dispatched by MerchantDetailPage after transactions
  useEffect(() => {
    const handleWalletUpdated = async () => {
      try {
        const updated = await getWallet(token);
        setWallet(updated);
        setTransactions(updated.transactions || []);
      } catch { /* non-critical */ }
    };
    window.addEventListener('walletUpdated', handleWalletUpdated);
    return () => window.removeEventListener('walletUpdated', handleWalletUpdated);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header onSignIn={() => setAuthModal('login')} onJoinNow={() => setAuthModal('register')} />
        {serverWaking && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm text-center py-2 px-8">
            ⏳ Waking up server, please wait a moment...
          </div>
        )}
        <HeroSection />
        <main className="w-full px-8 lg:px-16 py-12">
          <div className="mb-12">
            <WalletCardSkeleton />
          </div>
          <div className="h-8 w-64 bg-slate-200 rounded mb-6 animate-pulse" />
          <MerchantGrid
              merchants={[]}
              loading={true}
            />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header onSignIn={() => setAuthModal('login')} onJoinNow={() => setAuthModal('register')} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
            <p className="text-red-600 font-semibold text-lg mb-2">Something went wrong</p>
            <p className="text-slate-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        wallet={wallet}
        onSignIn={() => setAuthModal('login')}
        onJoinNow={() => setAuthModal('register')}
      />

      {/* Auth Modals */}
      {authModal === 'login' && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onSwitchToRegister={() => setAuthModal('register')}
        />
      )}
      {authModal === 'register' && (
        <RegisterModal
          onClose={() => setAuthModal(null)}
          onSwitchToLogin={() => setAuthModal('login')}
        />
      )}

      <HeroSection transactions={transactions} />

      <main className="w-full px-8 lg:px-16 pb-20 md:pb-8">
        {/* Wallet Section */}
        {isAuthenticated ? (
          <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 py-12 px-8 lg:px-16 -mx-8 lg:-mx-16">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">My Wallet</h1>
            <WalletCard wallet={wallet} loading={loading} error={error} />
          </section>
        ) : (
          <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 py-12 px-8 lg:px-16 -mx-8 lg:-mx-16">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center text-center gap-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your wallet is waiting</h2>
              <p className="text-slate-500 text-sm">Sign in or create an account to track your cashback earnings.</p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className="border border-slate-200 text-slate-700 rounded-full px-5 py-2.5 text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="bg-emerald-500 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Join Now
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

        {/* Merchants Section */}
        <section id="merchant-grid" className="py-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Shop &amp; Earn Cashback
          </h2>
          <div className="sticky top-[112px] z-40 bg-white border-b border-slate-200 py-3 -mx-8 lg:-mx-16 px-8 lg:px-16">
            <CategoryPills
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          <div className="mt-6">
            <MerchantGrid
              merchants={filteredMerchants}
              loading={loading}
            />
          </div>
        </section>

        {/* Transaction History Section — only shown when logged in */}
        {isAuthenticated && (
          <section className="py-12">
            <TransactionList transactions={transactions} loading={loading} />
          </section>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      </main>

      <HowItWorks />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default App;
