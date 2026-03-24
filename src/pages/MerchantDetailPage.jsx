import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SearchX, Tag, Layers } from 'lucide-react';
import { getMerchantById, createTransaction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import CashbackCalculator from '../components/CashbackCalculator';
import CategoryGrid from '../components/CategoryGrid';
import OfferCard from '../components/OfferCard';
import LoginModal from '../components/AuthModal/LoginModal';
import RegisterModal from '../components/AuthModal/RegisterModal';

// ─── Skeleton ────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="h-16 bg-white border-b border-slate-200" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="h-5 w-32 bg-slate-200 rounded mb-6" />
        <div className="bg-slate-200 rounded-3xl h-52 mb-8" />
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            <div className="bg-slate-200 rounded-2xl h-48" />
            <div className="bg-slate-200 rounded-2xl h-64" />
          </div>
          <div className="space-y-4">
            <div className="bg-slate-200 rounded-2xl h-40" />
            <div className="bg-slate-200 rounded-2xl h-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 404 State ───────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
        <SearchX className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Merchant not found</h1>
      <p className="text-slate-500 text-sm text-center max-w-xs">
        This merchant doesn't exist or may have been removed.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 bg-emerald-500 text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Stores
      </Link>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
const FALLBACK_COLORS = ['#4F46E5','#C026D3','#10B981','#F59E0B','#EF4444','#3B82F6'];
function getFallbackColor(name) {
  return FALLBACK_COLORS[(name?.charCodeAt(0) || 0) % FALLBACK_COLORS.length];
}

function MerchantLogo({ merchant, size = 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';

  if (imgError || !merchant.logoUrl) {
    return (
      <div
        className={`${dim} rounded-2xl flex items-center justify-center text-white font-bold ${textSize} flex-shrink-0`}
        style={{ backgroundColor: getFallbackColor(merchant.name) }}
        aria-label={`${merchant.name} logo`}
      >
        {merchant.name?.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={merchant.logoUrl}
      alt={`${merchant.name} logo`}
      className={`${dim} rounded-2xl object-contain bg-white p-2 flex-shrink-0`}
      onError={() => setImgError(true)}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MerchantDetailPage() {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const { authModal, setAuthModal } = useAuthModal();
  const { showToast } = useToast();

  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getMerchantById(id)
      .then((data) => {
        if (!cancelled) setMerchant(data);
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.status === 404) setNotFound(true);
          else showToast(err.message || 'Failed to load merchant', 'error');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  // Wallet refresh is handled via walletUpdated custom event dispatched to App.jsx

  const handleCategoryClick = async (category) => {
    if (isActivating) return;
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    setIsActivating(true);
    try {
      const tx = await createTransaction(merchant.id, 1000, token);
      const cashback = tx?.cashbackAmount ?? (1000 * (merchant.cashbackRate / 100));
      window.open(category.affiliateUrl, '_blank');
      showToast(`Cashback activated! Shop and earn ${formatCurrency(cashback)}`, 'success');
      window.dispatchEvent(new Event('walletUpdated'));
    } catch (err) {
      showToast(err.message || 'Could not activate cashback', 'error');
    } finally {
      setIsActivating(false);
    }
  };

  const handleOfferActivate = async (offer) => {
    if (isActivating) return;
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    setIsActivating(true);
    try {
      await createTransaction(merchant.id, 1000, token);
      window.open(offer.affiliateUrl, '_blank');
      showToast('Deal activated! Cashback tracking started', 'success');
      window.dispatchEvent(new Event('walletUpdated'));
    } catch (err) {
      showToast(err.message || 'Could not activate deal', 'error');
    } finally {
      setIsActivating(false);
    }
  };

  const handleCalculatorActivate = async () => {
    if (isActivating) return;
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }

    // Use entered amount or default to 1000
    const orderAmount = parseFloat(calculatorAmount) || 1000;
    
    // Validate amount is positive
    if (orderAmount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setIsActivating(true);
    try {
      const tx = await createTransaction(merchant.id, orderAmount, token);
      const cashback = tx?.cashbackAmount ?? (orderAmount * (merchant.cashbackRate / 100));
      
      // Open merchant website
      if (merchant.websiteUrl || merchant.manualTrackingUrl) {
        window.open(merchant.websiteUrl || merchant.manualTrackingUrl, '_blank');
      }
      
      showToast(`Cashback activated! You'll earn ${formatCurrency(cashback)}`, 'success');
      window.dispatchEvent(new Event('walletUpdated'));
    } catch (err) {
      showToast(err.message || 'Could not record transaction', 'error');
      // Still open URL on error
      if (merchant.websiteUrl || merchant.manualTrackingUrl) {
        window.open(merchant.websiteUrl || merchant.manualTrackingUrl, '_blank');
      }
    } finally {
      setIsActivating(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (notFound || !merchant) return <NotFound />;

  const hasOffers = merchant.offers && merchant.offers.filter(o => o.isActive !== false).length > 0;
  const activeOffers = hasOffers ? merchant.offers.filter(o => o.isActive !== false) : [];

  return (
    <div className="min-h-screen bg-slate-50">
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

      {/* Minimal top nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stores
        </Link>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500 text-sm truncate">{merchant.name}</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8 mb-8 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <MerchantLogo merchant={merchant} size="lg" />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                {merchant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  Upto {merchant.cashbackRate}% Cashback
                </span>
                {merchant.categories?.length > 0 && (
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {merchant.categories.length} categories
                  </span>
                )}
                {hasOffers && (
                  <span className="bg-amber-400/20 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {activeOffers.length} active deals
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <CashbackCalculator
              cashbackRate={merchant.cashbackRate}
              merchantName={merchant.name}
              amount={calculatorAmount}
              onAmountChange={setCalculatorAmount}
              onActivate={handleCalculatorActivate}
              disabled={isActivating}
            />

            {merchant.categories?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <CategoryGrid
                  categories={merchant.categories}
                  onCategoryClick={handleCategoryClick}
                  disabled={isActivating}
                />
              </div>
            )}
          </div>

          {/* Right column — Offers */}
          <div>
            {hasOffers ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-500" />
                  Today's Best Deals
                </h3>
                <div className="space-y-3">
                  {activeOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onActivate={handleOfferActivate}
                      disabled={isActivating}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Tag className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">No active deals right now.</p>
                <p className="text-slate-400 text-xs mt-1">Check back soon for offers!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
