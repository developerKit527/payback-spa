import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ icon: Icon, title, message, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-emerald-600" />
        </div>
      )}
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-md">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-emerald-500 text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;
