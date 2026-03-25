import React, { useState } from 'react';
import { Copy, Share2, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';

export default function ReferralCard({ referralCode, stats }) {
  const { showToast } = useToast();
  const [copying, setCopying] = useState(false);

  const referralLink = `https://payback.app/ref/${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      showToast('Referral code copied!', 'success');
    } catch (err) {
      showToast('Failed to copy code', 'error');
    }
  };

  const handleCopyLink = async () => {
    if (copying) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast('Referral link copied!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  const handleShare = (platform) => {
    const text = `Join Payback and earn real cashback on every purchase! Use my referral code: ${referralCode}`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(referralLink);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedText}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-900">Refer & Earn</h2>
      </div>

      {/* Referral Code Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Referral Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralCode}
            readOnly
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono font-semibold text-slate-900 focus:outline-none"
          />
          <button
            onClick={handleCopyCode}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
            title="Copy code"
          >
            <Copy className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Copy Referral Link Button */}
      <button
        onClick={handleCopyLink}
        disabled={copying}
        className="w-full mb-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copying ? 'Copied!' : 'Copy Referral Link'}
      </button>

      {/* Social Sharing Buttons */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Share via</p>
        <div className="flex gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors border border-green-200"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm">WhatsApp</span>
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors border border-blue-200"
            title="Share on Twitter"
          >
            <Twitter className="w-5 h-5" />
            <span className="font-medium text-sm">Twitter</span>
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors border border-indigo-200"
            title="Share on Facebook"
          >
            <Facebook className="w-5 h-5" />
            <span className="font-medium text-sm">Facebook</span>
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Friends Joined</p>
            <p className="text-3xl font-bold text-emerald-600">
              {stats?.friendsJoined || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Bonus Earned</p>
            <p className="text-3xl font-bold text-emerald-600">
              {formatCurrency(parseFloat(stats?.bonusEarned) || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
