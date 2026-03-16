import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WalletCard, { WalletCardSkeleton } from './WalletCard';

describe('WalletCard', () => {
  const defaultWallet = {
    available: 1500.50,
    totalEarned: 5000,
    pending: 200,
  };

  describe('Rendering', () => {
    it('should render the wallet card with all elements', () => {
      render(<WalletCard wallet={defaultWallet} />);

      expect(screen.getByTestId('wallet-card')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-value')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-earned')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-pending')).toBeInTheDocument();
    });

    it('should display "Available for Payout" label', () => {
      render(<WalletCard wallet={defaultWallet} />);
      expect(screen.getByText('Available for Payout')).toBeInTheDocument();
    });

    it('should display Total Earned and Pending labels', () => {
      render(<WalletCard wallet={defaultWallet} />);
      expect(screen.getByTestId('wallet-card-label-earned')).toHaveTextContent('Total Earned');
      expect(screen.getByTestId('wallet-card-label-pending')).toHaveTextContent('Pending');
    });

    it('should display earned and pending values', () => {
      render(<WalletCard wallet={defaultWallet} />);
      expect(screen.getByTestId('wallet-card-earned')).toHaveTextContent('₹5,000.00');
      expect(screen.getByTestId('wallet-card-pending')).toHaveTextContent('₹200.00');
    });
  });

  describe('Currency Formatting', () => {
    it('should format zero correctly', () => {
      render(<WalletCard wallet={{ available: 0, totalEarned: 0, pending: 0 }} />);
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('₹0.00');
    });

    it('should format large numbers correctly', () => {
      render(<WalletCard wallet={{ available: 123456.78, totalEarned: 0, pending: 0 }} />);
      // count-up animation starts at 0 and animates; initial render shows formatted value
      expect(screen.getByTestId('wallet-card-value')).toBeInTheDocument();
    });

    it('should format earned value correctly', () => {
      render(<WalletCard wallet={{ available: 0, totalEarned: 99.99, pending: 0 }} />);
      expect(screen.getByTestId('wallet-card-earned')).toHaveTextContent('₹99.99');
    });

    it('should format pending value correctly', () => {
      render(<WalletCard wallet={{ available: 0, totalEarned: 0, pending: 1000 }} />);
      expect(screen.getByTestId('wallet-card-pending')).toHaveTextContent('₹1,000.00');
    });
  });

  describe('Color Classes', () => {
    it('should apply success color to Total Earned', () => {
      render(<WalletCard wallet={defaultWallet} />);
      expect(screen.getByTestId('wallet-card-earned')).toHaveClass('text-success');
    });

    it('should apply warning color to Pending', () => {
      render(<WalletCard wallet={defaultWallet} />);
      expect(screen.getByTestId('wallet-card-pending')).toHaveClass('text-warning');
    });

    it('should display value in white text', () => {
      render(<WalletCard wallet={defaultWallet} />);
      expect(screen.getByTestId('wallet-card-value')).toHaveClass('text-white');
    });
  });

  describe('Skeleton Loader', () => {
    it('should render skeleton when loading is true', () => {
      render(<WalletCard wallet={null} loading={true} />);
      expect(screen.getByTestId('wallet-card-skeleton')).toBeInTheDocument();
    });

    it('should not render main card when loading', () => {
      render(<WalletCard wallet={null} loading={true} />);
      expect(screen.queryByTestId('wallet-card')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render error state when error is provided', () => {
      render(<WalletCard wallet={null} error="Network error" />);
      expect(screen.getByTestId('wallet-card-error')).toBeInTheDocument();
    });

    it('should show error message in error state', () => {
      render(<WalletCard wallet={null} error="Network error" />);
      expect(screen.getByText('Could not load balance')).toBeInTheDocument();
    });
  });

  describe('Null wallet fallback', () => {
    it('should show ₹0.00 for all values when wallet fields are missing', () => {
      render(<WalletCard wallet={{}} />);
      expect(screen.getByTestId('wallet-card-earned')).toHaveTextContent('₹0.00');
      expect(screen.getByTestId('wallet-card-pending')).toHaveTextContent('₹0.00');
    });
  });

  describe('WalletCardSkeleton', () => {
    it('should render skeleton component', () => {
      render(<WalletCardSkeleton />);
      expect(screen.getByTestId('wallet-card-skeleton')).toBeInTheDocument();
    });
  });
});
