import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Wallet, Clock, CheckCircle } from 'lucide-react';
import WalletCard from './WalletCard';

describe('WalletCard', () => {
  const defaultProps = {
    icon: Wallet,
    label: 'Available Balance',
    value: 1500.50,
    color: 'text-primary',
    bgColor: 'bg-indigo-50'
  };

  describe('Rendering', () => {
    it('should render the wallet card with all elements', () => {
      render(<WalletCard {...defaultProps} />);
      
      expect(screen.getByTestId('wallet-card')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-icon')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-value')).toBeInTheDocument();
    });

    it('should display the correct label', () => {
      render(<WalletCard {...defaultProps} />);
      
      expect(screen.getByTestId('wallet-card-label')).toHaveTextContent('Available Balance');
    });

    it('should format and display the value as INR currency', () => {
      render(<WalletCard {...defaultProps} />);
      
      const valueElement = screen.getByTestId('wallet-card-value');
      expect(valueElement).toHaveTextContent('₹1,500.50');
    });

    it('should apply the correct color classes', () => {
      render(<WalletCard {...defaultProps} />);
      
      const valueElement = screen.getByTestId('wallet-card-value');
      expect(valueElement).toHaveClass('text-primary');
    });

    it('should apply the correct background color to icon container', () => {
      const { container } = render(<WalletCard {...defaultProps} />);
      
      const iconContainer = container.querySelector('.bg-indigo-50');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Different Icons', () => {
    it('should render with CheckCircle icon', () => {
      render(<WalletCard {...defaultProps} icon={CheckCircle} />);
      
      expect(screen.getByTestId('wallet-card-icon')).toBeInTheDocument();
    });

    it('should render with Clock icon', () => {
      render(<WalletCard {...defaultProps} icon={Clock} />);
      
      expect(screen.getByTestId('wallet-card-icon')).toBeInTheDocument();
    });

    it('should render with Wallet icon', () => {
      render(<WalletCard {...defaultProps} icon={Wallet} />);
      
      expect(screen.getByTestId('wallet-card-icon')).toBeInTheDocument();
    });
  });

  describe('Different Color Variants', () => {
    it('should render with success color (emerald)', () => {
      render(
        <WalletCard
          {...defaultProps}
          label="Total Earned"
          color="text-success"
          bgColor="bg-emerald-50"
        />
      );
      
      const valueElement = screen.getByTestId('wallet-card-value');
      expect(valueElement).toHaveClass('text-success');
    });

    it('should render with warning color (amber)', () => {
      render(
        <WalletCard
          {...defaultProps}
          label="Pending"
          color="text-warning"
          bgColor="bg-amber-50"
        />
      );
      
      const valueElement = screen.getByTestId('wallet-card-value');
      expect(valueElement).toHaveClass('text-warning');
    });

    it('should render with primary color (indigo)', () => {
      render(
        <WalletCard
          {...defaultProps}
          label="Available"
          color="text-primary"
          bgColor="bg-indigo-50"
        />
      );
      
      const valueElement = screen.getByTestId('wallet-card-value');
      expect(valueElement).toHaveClass('text-primary');
    });
  });

  describe('Currency Formatting', () => {
    it('should format zero correctly', () => {
      render(<WalletCard {...defaultProps} value={0} />);
      
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('₹0.00');
    });

    it('should format large numbers correctly', () => {
      render(<WalletCard {...defaultProps} value={123456.78} />);
      
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('₹1,23,456.78');
    });

    it('should format decimal values correctly', () => {
      render(<WalletCard {...defaultProps} value={99.99} />);
      
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('₹99.99');
    });

    it('should format whole numbers with .00', () => {
      render(<WalletCard {...defaultProps} value={1000} />);
      
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('₹1,000.00');
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct base styling classes', () => {
      const { container } = render(<WalletCard {...defaultProps} />);
      
      const card = screen.getByTestId('wallet-card');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('p-6');
    });

    it('should have hover effect class', () => {
      const { container } = render(<WalletCard {...defaultProps} />);
      
      const card = screen.getByTestId('wallet-card');
      expect(card).toHaveClass('hover:shadow-md');
    });

    it('should have transition class', () => {
      const { container } = render(<WalletCard {...defaultProps} />);
      
      const card = screen.getByTestId('wallet-card');
      expect(card).toHaveClass('transition-shadow');
    });

    it('should have correct typography classes for value', () => {
      render(<WalletCard {...defaultProps} />);
      
      const valueElement = screen.getByTestId('wallet-card-value');
      expect(valueElement).toHaveClass('text-3xl');
      expect(valueElement).toHaveClass('font-extrabold');
    });

    it('should have correct typography classes for label', () => {
      render(<WalletCard {...defaultProps} />);
      
      const labelElement = screen.getByTestId('wallet-card-label');
      expect(labelElement).toHaveClass('text-sm');
      expect(labelElement).toHaveClass('text-gray-600');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<WalletCard {...defaultProps} />);
      
      // Check that elements are in correct order
      const card = screen.getByTestId('wallet-card');
      const icon = screen.getByTestId('wallet-card-icon');
      const label = screen.getByTestId('wallet-card-label');
      const value = screen.getByTestId('wallet-card-value');
      
      expect(card).toContainElement(icon);
      expect(card).toContainElement(label);
      expect(card).toContainElement(value);
    });

    it('should have test ids for all key elements', () => {
      render(<WalletCard {...defaultProps} />);
      
      expect(screen.getByTestId('wallet-card')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-icon')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-card-value')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small decimal values', () => {
      render(<WalletCard {...defaultProps} value={0.01} />);
      
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('₹0.01');
    });

    it('should handle negative values (if applicable)', () => {
      render(<WalletCard {...defaultProps} value={-100} />);
      
      expect(screen.getByTestId('wallet-card-value')).toHaveTextContent('-₹100.00');
    });

    it('should handle very long labels', () => {
      const longLabel = 'This is a very long label that might wrap to multiple lines';
      render(<WalletCard {...defaultProps} label={longLabel} />);
      
      expect(screen.getByTestId('wallet-card-label')).toHaveTextContent(longLabel);
    });
  });
});
