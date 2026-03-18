import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransactionList from './TransactionList';

describe('TransactionList', () => {
  const mockTransactions = [
    {
      id: 1,
      merchantName: 'Amazon',
      orderAmount: 1500,
      cashbackAmount: 75,
      status: 'CONFIRMED',
      createdAt: '2024-03-10T10:30:00'
    },
    {
      id: 2,
      merchantName: 'Flipkart',
      orderAmount: 2000,
      cashbackAmount: 100,
      status: 'PENDING',
      createdAt: '2024-03-09T14:20:00'
    },
    {
      id: 3,
      merchantName: 'Myntra',
      orderAmount: 800,
      cashbackAmount: 40,
      status: 'REJECTED',
      createdAt: '2024-03-08T09:15:00'
    }
  ];

  describe('Rendering', () => {
    it('renders transaction history heading', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
    });

    it('renders all transactions', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getAllByText('Amazon')).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByText('Flipkart')).toHaveLength(2);
      expect(screen.getAllByText('Myntra')).toHaveLength(2);
    });

    it('renders merchant names', () => {
      render(<TransactionList transactions={mockTransactions} />);
      mockTransactions.forEach(transaction => {
        expect(screen.getAllByText(transaction.merchantName).length).toBeGreaterThan(0);
      });
    });

    it('renders order amounts', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getAllByText('₹1,500.00')).toHaveLength(2);
      expect(screen.getAllByText('₹2,000.00')).toHaveLength(2);
      expect(screen.getAllByText('₹800.00')).toHaveLength(2);
    });

    it('renders cashback amounts', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getAllByText('₹75.00')).toHaveLength(2);
      expect(screen.getAllByText('₹100.00')).toHaveLength(2);
      expect(screen.getAllByText('₹40.00')).toHaveLength(2);
    });
  });

  describe('Status Badges', () => {
    it('renders CONFIRMED status with emerald color', () => {
      render(<TransactionList transactions={[mockTransactions[0]]} />);
      const badges = screen.getAllByText('CONFIRMED');
      badges.forEach(badge => {
        expect(badge).toHaveClass('bg-emerald-50');
        expect(badge).toHaveClass('text-emerald-700');
      });
    });

    it('renders PENDING status with amber color', () => {
      render(<TransactionList transactions={[mockTransactions[1]]} />);
      const badges = screen.getAllByText('PENDING');
      badges.forEach(badge => {
        expect(badge).toHaveClass('bg-amber-50');
        expect(badge).toHaveClass('text-amber-700');
      });
    });

    it('renders REJECTED status with red color', () => {
      render(<TransactionList transactions={[mockTransactions[2]]} />);
      const badges = screen.getAllByText('REJECTED');
      badges.forEach(badge => {
        expect(badge).toHaveClass('bg-red-50');
        expect(badge).toHaveClass('text-red-700');
      });
    });

    it('renders all status badges with correct text colors', () => {
      render(<TransactionList transactions={mockTransactions} />);
      const confirmed = screen.getAllByText('CONFIRMED');
      confirmed.forEach(b => expect(b).toHaveClass('text-emerald-700'));
      const pending = screen.getAllByText('PENDING');
      pending.forEach(b => expect(b).toHaveClass('text-amber-700'));
      const rejected = screen.getAllByText('REJECTED');
      rejected.forEach(b => expect(b).toHaveClass('text-red-700'));
    });
  });

  describe('Date Formatting', () => {
    it('formats dates in Indian locale', () => {
      render(<TransactionList transactions={mockTransactions} />);
      // Dates should be formatted as "10 Mar 2024" style
      expect(screen.getAllByText(/Mar 2024/)).toHaveLength(6); // 3 transactions × 2 views
    });

    it('displays day, month, and year', () => {
      const transaction = {
        id: 1,
        merchantName: 'Test',
        orderAmount: 100,
        cashbackAmount: 5,
        status: 'CONFIRMED',
        createdAt: '2024-03-15T10:00:00'
      };
      render(<TransactionList transactions={[transaction]} />);
      expect(screen.getAllByText(/15 Mar 2024/)).toHaveLength(2);
    });
  });

  describe('Loading State', () => {
    it('displays skeleton loaders when loading', () => {
      const { container } = render(<TransactionList loading={true} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('displays heading during loading', () => {
      render(<TransactionList loading={true} />);
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
    });

    it('does not display transactions when loading', () => {
      render(<TransactionList transactions={mockTransactions} loading={true} />);
      expect(screen.queryByText('Amazon')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty message when no transactions', () => {
      render(<TransactionList transactions={[]} />);
      expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    });

    it('displays empty message when transactions is undefined', () => {
      render(<TransactionList />);
      expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    });

    it('displays heading in empty state', () => {
      render(<TransactionList transactions={[]} />);
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders desktop table view', () => {
      const { container } = render(<TransactionList transactions={mockTransactions} />);
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('renders mobile card view', () => {
      const { container } = render(<TransactionList transactions={mockTransactions} />);
      const mobileCards = container.querySelectorAll('.md\\:hidden > div');
      expect(mobileCards.length).toBe(mockTransactions.length);
    });

    it('table has correct column headers', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getByText('Merchant')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getAllByText('Order Amount')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Cashback')[0]).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    it('formats currency with INR symbol', () => {
      render(<TransactionList transactions={mockTransactions} />);
      const currencyElements = screen.getAllByText(/₹/);
      expect(currencyElements.length).toBeGreaterThan(0);
    });

    it('formats currency with two decimal places', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getAllByText(/\.00$/)).toHaveLength(12); // 6 amounts × 2 views
    });

    it('formats currency with thousand separators', () => {
      render(<TransactionList transactions={mockTransactions} />);
      expect(screen.getAllByText('₹1,500.00')).toHaveLength(2);
      expect(screen.getAllByText('₹2,000.00')).toHaveLength(2);
    });
  });

  describe('Styling', () => {
    it('applies bold typography to order amounts', () => {
      const { container } = render(<TransactionList transactions={mockTransactions} />);
      const orderAmounts = container.querySelectorAll('td:nth-child(3)');
      orderAmounts.forEach(amount => {
        expect(amount).toHaveClass('font-bold');
      });
    });

    it('applies success color to cashback amounts', () => {
      const { container } = render(<TransactionList transactions={mockTransactions} />);
      const cashbackAmounts = container.querySelectorAll('td:nth-child(4)');
      cashbackAmounts.forEach(amount => {
        expect(amount).toHaveClass('text-success');
      });
    });

    it('applies rounded pill design to status badges', () => {
      const { container } = render(<TransactionList transactions={mockTransactions} />);
      const badges = container.querySelectorAll('[class*="statusBadge"]');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles single transaction', () => {
      render(<TransactionList transactions={[mockTransactions[0]]} />);
      expect(screen.getAllByText('Amazon')).toHaveLength(2);
    });

    it('handles large order amounts', () => {
      const largeTransaction = {
        id: 1,
        merchantName: 'Test',
        orderAmount: 99999.99,
        cashbackAmount: 5000,
        status: 'CONFIRMED',
        createdAt: '2024-03-10T10:00:00'
      };
      render(<TransactionList transactions={[largeTransaction]} />);
      expect(screen.getAllByText('₹99,999.99')).toHaveLength(2);
    });

    it('handles zero amounts', () => {
      const zeroTransaction = {
        id: 1,
        merchantName: 'Test',
        orderAmount: 0,
        cashbackAmount: 0,
        status: 'REJECTED',
        createdAt: '2024-03-10T10:00:00'
      };
      render(<TransactionList transactions={[zeroTransaction]} />);
      expect(screen.getAllByText('₹0.00')).toHaveLength(4); // 2 amounts × 2 views
    });

    it('handles unknown status gracefully', () => {
      const unknownStatusTransaction = {
        id: 1,
        merchantName: 'Test',
        orderAmount: 100,
        cashbackAmount: 5,
        status: 'UNKNOWN',
        createdAt: '2024-03-10T10:00:00'
      };
      const { container } = render(<TransactionList transactions={[unknownStatusTransaction]} />);
      const badges = container.querySelectorAll('[class*="statusBadge"]');
      expect(badges.length).toBeGreaterThan(0);
    });
  });
});
