import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Store, Wallet, User } from 'lucide-react';

function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const TABS = [
    { id: 'home',    label: 'Home',   Icon: Home,   action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'stores',  label: 'Stores', Icon: Store,  action: () => { navigate('/'); setTimeout(() => document.getElementById('merchant-grid')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
    { id: 'wallet',  label: 'Wallet', Icon: Wallet, action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'profile', label: 'Profile',Icon: User,   action: () => navigate('/profile') },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40"
      data-testid="mobile-bottom-nav"
    >
      <div className="flex">
        {TABS.map(({ id, label, Icon, action }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                action?.();
              }}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                isActive ? 'text-emerald-500 border-t-2 border-emerald-500' : 'text-gray-500'
              }`}
              data-testid={`nav-tab-${id}`}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
