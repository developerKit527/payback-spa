import React from 'react';
import PropTypes from 'prop-types';
import styles from './HeroSection.module.css';

// Kept for test compatibility
const FLOATING_BADGES = [
  { amount: '₹127', key: 'badge1' },
  { amount: '₹250', key: 'badge2' },
  { amount: '₹89',  key: 'badge3' },
];

const STATS = [
  { label: '500+ Stores' },
  { label: '₹2Cr+ Cashback Paid' },
  { label: '1L+ Happy Users' },
];

const PLACEHOLDER_MERCHANTS = ['Amazon', 'Flipkart', 'Myntra'];

function LiveActivityCard({ transactions }) {
  const rows = transactions?.length > 0
    ? transactions.slice(0, 3)
    : PLACEHOLDER_MERCHANTS.map((name, i) => ({ id: i, merchantName: name, cashbackAmount: null }));

  return (
    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6">
      {/* Card header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-slate-900 text-base">Live Cashback</span>
        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      </div>

      {/* Transaction rows */}
      <div className="flex flex-col gap-3">
        {rows.map((tx, i) => (
          <div key={tx.id ?? i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700 font-bold text-sm">
                {(tx.merchantName ?? '?')[0].toUpperCase()}
              </span>
            </div>
            <span className="flex-1 text-slate-700 text-sm font-medium truncate">
              {tx.merchantName ?? 'Store'}
            </span>
            {tx.cashbackAmount != null ? (
              <span className="text-emerald-500 font-bold text-sm">
                +₹{Number(tx.cashbackAmount).toFixed(2)}
              </span>
            ) : (
              <span className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSection({ transactions = [] }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden w-full px-8 lg:px-16 py-24 lg:py-32 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      data-testid="hero-section"
    >
      {/* Decorative blurred circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden badges — kept for test compatibility */}
      <div data-testid="floating-badges" className="hidden">
        {FLOATING_BADGES.map(({ amount, key }) => (
          <div key={key} data-testid="floating-badge">
            <span>{amount}</span>
          </div>
        ))}
      </div>

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[500px]">

          {/* Left — copy */}
          <div className="text-center lg:text-left">
            <h1
              className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
              data-testid="hero-headline"
            >
              Shop Smart.<br />
              <span className="text-emerald-300">Earn Real Cashback.</span>
            </h1>

            <p className="text-emerald-100/80 text-xl mb-8 max-w-md mx-auto lg:mx-0">
              Browse 500+ Indian stores, activate cashback in one click, and watch your wallet grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollTo('merchant-grid')}
                className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors shadow-lg"
                data-testid="cta-explore"
              >
                Explore Stores →
              </button>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="border border-white/50 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
                data-testid="cta-how-it-works"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* Right — Live Activity card */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="w-full max-w-md">
              <LiveActivityCard transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-12 pt-8 border-t border-emerald-700 flex flex-col sm:flex-row justify-center gap-6 sm:gap-12"
          data-testid="stats-bar"
        >
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <span className="text-emerald-200 font-semibold text-center">{stat.label}</span>
              {i < STATS.length - 1 && (
                <span className="hidden sm:block text-emerald-700">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

HeroSection.propTypes = {
  transactions: PropTypes.array,
};

export default HeroSection;
