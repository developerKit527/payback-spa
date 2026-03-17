import React, { useEffect, useRef, useState } from 'react';
import { Search, MousePointerClick, Wallet } from 'lucide-react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    icon: Search,
    title: 'Find a Store',
    description: 'Browse 500+ top brands and find the store you want to shop at.',
    iconBg: 'bg-emerald-100',
    numBg: 'bg-emerald-500',
  },
  {
    icon: MousePointerClick,
    title: 'Click & Shop',
    description: 'Click "Shop Now" to activate cashback tracking, then shop as usual.',
    iconBg: 'bg-emerald-100',
    numBg: 'bg-emerald-500',
  },
  {
    icon: Wallet,
    title: 'Earn Cashback',
    description: 'Cashback is credited to your Payback wallet after order confirmation.',
    iconBg: 'bg-emerald-100',
    numBg: 'bg-emerald-500',
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
      className="bg-gradient-to-b from-emerald-50 to-white py-16 border-y border-slate-200"
      data-testid="how-it-works"
    >
      <div className="w-full px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
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
                {/* Step number */}
                <div className={`w-8 h-8 rounded-full ${step.numBg} text-white text-sm font-bold flex items-center justify-center mb-3`}>
                  {index + 1}
                </div>
                {/* Icon circle */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${step.iconBg}`}>
                  <Icon className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
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
