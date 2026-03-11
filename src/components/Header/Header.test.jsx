import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  describe('Rendering', () => {
    it('should render the header with all elements', () => {
      render(<Header />);
      
      expect(screen.getByText('Payback')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search stores/i)).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should display the logo', () => {
      render(<Header />);
      
      const logo = screen.getByText('Payback');
      expect(logo).toHaveClass('text-white');
      expect(logo).toHaveClass('font-bold');
    });

    it('should display search bar with placeholder', () => {
      render(<Header />);
      
      const searchInput = screen.getByPlaceholderText(/Search stores, brands, or categories/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should display Profile button', () => {
      render(<Header />);
      
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });

  describe('Wallet Balance Display', () => {
    it('should display available balance when wallet data provided', () => {
      const wallet = {
        available: 500,
        totalEarned: 1000,
        pending: 200,
      };
      
      render(<Header wallet={wallet} />);
      
      expect(screen.getByText('Available Balance')).toBeInTheDocument();
      expect(screen.getByText('₹500.00')).toBeInTheDocument();
    });

    it('should not display balance when wallet is null', () => {
      render(<Header wallet={null} />);
      
      expect(screen.queryByText('Available Balance')).not.toBeInTheDocument();
    });

    it('should format balance correctly', () => {
      const wallet = {
        available: 1250.50,
        totalEarned: 5000,
        pending: 750,
      };
      
      render(<Header wallet={wallet} />);
      
      expect(screen.getByText('₹1,250.50')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have sticky positioning', () => {
      const { container } = render(<Header />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
    });

    it('should have indigo-700 background', () => {
      const { container } = render(<Header />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-indigo-700');
      expect(header).toHaveClass('text-white');
    });

    it('should have shadow', () => {
      const { container } = render(<Header />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('shadow-md');
    });

    it('should have proper z-index for stacking', () => {
      const { container } = render(<Header />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('z-50');
    });

    it('should have full width', () => {
      const { container } = render(<Header />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('w-full');
    });
  });

  describe('Search Bar Styling', () => {
    it('should have semi-transparent background', () => {
      const { container } = render(<Header />);
      
      const searchInput = container.querySelector('input[type="text"]');
      expect(searchInput).toHaveClass('bg-white/10');
    });
  });
});
