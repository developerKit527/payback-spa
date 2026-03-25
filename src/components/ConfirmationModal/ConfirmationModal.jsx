import React from 'react';
import { X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, merchantName, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Ready to Shop?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You're about to shop at <span className="font-semibold text-slate-900">{merchantName}</span>. 
              Make sure to complete your purchase for cashback to be tracked.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-emerald-500 text-white rounded-full px-6 py-3 font-semibold hover:bg-emerald-600 transition-colors"
            >
              Got it, Take me to {merchantName} →
            </button>
            <button
              onClick={onClose}
              className="w-full text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
