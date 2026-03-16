import React from 'react';
import styles from './HeroSection.module.css';

const FLOATING_BADGES = [
  { amount: '₹127', key: 'badge1', styleClass: styles.badge1 },
  { amount: '₹250', key: 'badge2', styleClass: styles.badge2 },
  { amount: '₹89',  key: 'badge3', styleClass: styles.badge3 },
];

const STATS = [
  { label: '500+ Stores' },
  { label: '₹2Cr+ Cashback Paid' },
  { label: '1L+ Happy Users' },
];

function HeroSection() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} data-testid="hero-section">
      {/* Absolutely positioned floating badges */}
      <div data-testid="floating-badges">
        {FLOATING_BADGES.map(({ amount, key, styleClass }) => (
          <div
            key={key}
            className={`${styles.badge} ${styleClass} bg-white/20 backdrop-blur-sm border border-white/30 text-white font-heading font-bold text-xl px-6 py-4 rounded-2xl shadow-lg`}
            data-testid="floating-badge"
          >
            <span className="text-accent text-2xl">{amount}</span>
            <span className="block text-xs text-white/70 font-body font-normal mt-1">cashback earned</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-16 md:pt-20 md:pb-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left — copy */}
          <div className="flex-1 text-center md:text-left">
            <h1
              className="font-heading text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6"
              data-testid="hero-headline"
            >
              Shop Smart.<br />
              Earn Real Cashback.
            </h1>

            <p className="text-white/80 text-lg mb-8 max-w-md">
              Browse 500+ top brands, activate cashback in one click, and watch your wallet grow.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => scrollTo('merchant-grid')}
                className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors"
                data-testid="cta-explore"
              >
                Explore Stores →
              </button>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
                data-testid="cta-how-it-works"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* Right — spacer so badges have room on desktop */}
          <div className="hidden md:block flex-1" aria-hidden="true" />
        </div>

        {/* Stats bar */}
        <div
          className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-center gap-6 sm:gap-12"
          data-testid="stats-bar"
        >
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <span className="text-white font-semibold text-center">{stat.label}</span>
              {i < STATS.length - 1 && (
                <span className="hidden sm:block text-white/30">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
