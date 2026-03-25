import { formatCurrency } from '../../utils/formatters';

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-blue-50 text-blue-700',
  PAID: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-700'
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

export default function WithdrawalHistory({ withdrawals, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!withdrawals || withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No withdrawal requests yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-400">
              <th className="text-left px-6 py-4">UPI ID</th>
              <th className="text-right px-6 py-4">Amount</th>
              <th className="text-center px-6 py-4">Status</th>
              <th className="text-right px-6 py-4">Requested Date</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr 
                key={withdrawal.id} 
                className="hover:bg-slate-50 border-t border-slate-100 transition-colors"
              >
                <td className="px-6 py-4 text-slate-900 font-medium">
                  {withdrawal.upiId}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">
                  {formatCurrency(parseFloat(withdrawal.amount))}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[withdrawal.status] || 'bg-slate-100 text-slate-700'}`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-600 text-sm">
                  {formatDate(withdrawal.requestedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {withdrawals.map((withdrawal) => (
          <div 
            key={withdrawal.id}
            className="bg-slate-50 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 mb-1">UPI ID</p>
                <p className="font-medium text-slate-900">{withdrawal.upiId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[withdrawal.status] || 'bg-slate-100 text-slate-700'}`}>
                {withdrawal.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-500 mb-1">Amount</p>
                <p className="font-semibold text-slate-900">
                  {formatCurrency(parseFloat(withdrawal.amount))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Requested</p>
                <p className="text-sm text-slate-600">
                  {formatDate(withdrawal.requestedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
