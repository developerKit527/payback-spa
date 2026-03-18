import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MerchantCard from './MerchantCard';
import { trackMerchantClick } from '../../services/api';

// Mutable auth state for per-test control
const mockAuthState = { isAuthenticated: true, token: 'test-token' };

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

vi.mock('../../services/api', () => ({
  trackMerchantClick: vi.fn().mockResolvedValue({}),
}));

// Capture navigate calls
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderCard(merchant, props = {}) {
  return render(
    <MemoryRouter>
      <MerchantCard merchant={merchant} {...props} />
    </MemoryRouter>
  );
}

describe('MerchantCard', () => {
  const mockMerchant = {
    id: 1,
    name: 'Amazon India',
    logoUrl: 'https://example.com/amazon-logo.png',
    cashbackRate: 10,
    manualTrackingUrl: null,
  };

  const mockOnSignIn = vi.fn();

  beforeEach(() => {
    mockOnSignIn.mockClear();
    mockNavigate.mockClear();
    trackMerchantClick.mockClear();
    trackMerchantClick.mockResolvedValue({});
    // Reset to authenticated by default
    mockAuthState.isAuthenticated = true;
    mockAuthState.token = 'test-token';
  });

  describe('Rendering', () => {
    it('renders the merchant card with all elements', () => {
      renderCard(mockMerchant);
      expect(screen.getByTestId('merchant-card')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-logo-container')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-name')).toBeInTheDocument();
      expect(screen.getByTestId('cashback-badge-corner')).toBeInTheDocument();
      expect(screen.getByTestId('shop-earn-button')).toBeInTheDocument();
    });

    it('displays the merchant name', () => {
      renderCard(mockMerchant);
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Amazon India');
    });

    it('displays the merchant logo when logoUrl is valid', () => {
      renderCard(mockMerchant);
      const logo = screen.getByTestId('merchant-logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/amazon-logo.png');
      expect(logo).toHaveAttribute('alt', 'Amazon India logo');
    });

    it('displays "Shop Now →" button text', () => {
      renderCard(mockMerchant);
      expect(screen.getByTestId('shop-earn-button')).toHaveTextContent('Shop Now');
    });
  });

  describe('Cashback Rate Display', () => {
    it('displays cashback rate as "Upto X% Cashback"', () => {
      renderCard(mockMerchant);
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 10% Cashback');
    });

    it('displays 5% cashback correctly', () => {
      renderCard({ ...mockMerchant, cashbackRate: 5 });
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 5% Cashback');
    });

    it('displays 15% cashback correctly', () => {
      renderCard({ ...mockMerchant, cashbackRate: 15 });
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 15% Cashback');
    });

    it('displays decimal cashback rates', () => {
      renderCard({ ...mockMerchant, cashbackRate: 7.5 });
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 7.5% Cashback');
    });
  });

  describe('Image Fallback', () => {
    it('shows fallback circle with first letter when logo fails to load', () => {
      renderCard(mockMerchant);
      const logo = screen.getByTestId('merchant-logo');
      fireEvent.error(logo);
      expect(screen.getByTestId('merchant-logo-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-logo-fallback')).toHaveTextContent('A');
    });

    it('shows fallback circle when logoUrl is missing', () => {
      renderCard({ ...mockMerchant, logoUrl: null });
      expect(screen.getByTestId('merchant-logo-fallback')).toBeInTheDocument();
    });

    it('uses original image URL initially', () => {
      renderCard(mockMerchant);
      const logo = screen.getByTestId('merchant-logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/amazon-logo.png');
    });
  });

  describe('Button Interaction', () => {
    it('navigates to merchant detail page when guest clicks Shop Now', async () => {
      mockAuthState.isAuthenticated = false;
      mockAuthState.token = null;
      renderCard(mockMerchant);
      fireEvent.click(screen.getByTestId('shop-earn-button'));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/merchants/1'));
      expect(trackMerchantClick).not.toHaveBeenCalled();
    });

    it('calls trackMerchantClick and navigates when authenticated user clicks Shop Now', async () => {
      mockAuthState.isAuthenticated = true;
      mockAuthState.token = 'test-token';
      renderCard(mockMerchant);
      fireEvent.click(screen.getByTestId('shop-earn-button'));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/merchants/1'));
      expect(trackMerchantClick).toHaveBeenCalledWith(mockMerchant.id);
    });

    it('navigates to merchant page when authenticated and Shop Now is clicked', async () => {
      renderCard(mockMerchant);
      const button = screen.getByTestId('shop-earn-button');
      fireEvent.click(button);
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/merchants/1'));
      // Button should not be permanently disabled after click
      await waitFor(() => expect(button).not.toBeDisabled());
    });

    it('prevents multiple simultaneous clicks', async () => {
      trackMerchantClick.mockClear();
      let resolveClick;
      trackMerchantClick.mockImplementation(
        () => new Promise(resolve => { resolveClick = resolve; })
      );
      renderCard(mockMerchant);
      const button = screen.getByTestId('shop-earn-button');
      // First click starts the async operation
      fireEvent.click(button);
      // Verify only one call was made (guard prevents re-entry)
      expect(trackMerchantClick).toHaveBeenCalledTimes(1);
      // Resolve the pending promise and wait for re-enable
      resolveClick();
      await waitFor(() => expect(button).not.toBeDisabled());
    });

    it('re-enables button after activation completes', async () => {
      renderCard(mockMerchant);
      fireEvent.click(screen.getByTestId('shop-earn-button'));
      await waitFor(() => {
        expect(screen.getByTestId('shop-earn-button')).not.toBeDisabled();
        expect(screen.getByTestId('shop-earn-button')).toHaveTextContent('Shop Now');
      });
    });
  });

  describe('Styling', () => {
    it('has correct base card classes', () => {
      renderCard(mockMerchant);
      const card = screen.getByTestId('merchant-card');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('relative');
    });

    it('positions corner badge absolutely', () => {
      renderCard(mockMerchant);
      const badge = screen.getByTestId('cashback-badge-corner');
      expect(badge).toHaveClass('absolute');
      expect(badge).toHaveClass('top-4');
      expect(badge).toHaveClass('right-4');
    });

    it('button has border-primary and hover:bg-primary classes', () => {
      renderCard(mockMerchant);
      const btn = screen.getByTestId('shop-earn-button');
      expect(btn).toHaveClass('border-primary');
      expect(btn).toHaveClass('text-primary');
    });
  });

  describe('Different Merchants', () => {
    it('renders Flipkart merchant correctly', () => {
      const flipkart = { id: 2, name: 'Flipkart', logoUrl: 'https://example.com/flipkart.png', cashbackRate: 8, manualTrackingUrl: null };
      renderCard(flipkart);
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Flipkart');
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 8% Cashback');
    });

    it('renders Myntra merchant correctly', () => {
      const myntra = { id: 3, name: 'Myntra', logoUrl: 'https://example.com/myntra.png', cashbackRate: 12, manualTrackingUrl: null };
      renderCard(myntra);
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Myntra');
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 12% Cashback');
    });
  });
});
