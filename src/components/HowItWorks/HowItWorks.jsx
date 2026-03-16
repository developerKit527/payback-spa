import React, { useEffect, useRef, useState } from 'react';
import { Search, MousePointerClick, Wallet } from 'lucide-react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    icon: Search,
    title: 'Find a Store',
    description: 'Browse 500+ top brands and find the store you want to shop at.',
    color: 'bg-orange-100 text-primary',
  },
  {
    icon: MousePointerClick,
    title: 'Click & Shop',
    description: 'Click "Shop Now" to activate cashback tracking, then shop as usual.',
    color: 'bg-orange-100 text-primary',
  },
  {
    icon: Wallet,
    title: 'Earn Cashback',
    description: 'Cashback is credited to your Payback wallet after order confirmation.',
    color: 'bg-emerald-100 text-success',
  },
];

function HowItWorks() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-white py-16"
      data-testid="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-0 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gray-100 z-0" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`${styles.step} ${isVisible ? styles.visible : ''} flex-1 flex flex-col items-center text-center px-6 relative z-10`}
                data-testid={`how-it-works-step-${index + 1}`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${step.color}`}>
                  <Icon className="w-9 h-9" />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
