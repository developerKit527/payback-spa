import { Wallet } from 'lucide-react';

const LINKS = {
  Platform: ['Browse Stores', 'Top Offers', 'New Arrivals', 'Trending'],
  Categories: ['Fashion', 'Electronics', 'Travel', 'Food & Dining'],
  Support: ['Help Center', 'Contact Us', 'FAQs', 'Report an Issue'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
};

function Footer() {
  return (
    <footer className="bg-white py-20 border-t border-slate-200">
      <div className="w-full px-8 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <span className="text-lg font-black tracking-tight text-slate-900">Payback</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              India's smartest cashback platform. Shop at 500+ stores and earn real money back.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-slate-900 font-semibold text-sm mb-4">{heading}</h3>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-emerald-600 transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 mt-12 pt-8 text-center">
          <p className="text-slate-400 text-sm">© 2026 Payback India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
