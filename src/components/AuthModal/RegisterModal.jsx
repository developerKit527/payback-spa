import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email, password);
      showToast('Welcome to Payback!', 'success');
      onClose();
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 rounded-2xl px-4 py-3 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-slate-100 rounded-2xl px-4 py-3 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign In →
          </button>
        </p>
      </div>
    </div>
  );
}
