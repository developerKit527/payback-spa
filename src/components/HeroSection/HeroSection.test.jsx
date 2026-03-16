import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders the headline', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('hero-headline')).toBeInTheDocument();
    expect(screen.getByText(/Shop Smart/i)).toBeInTheDocument();
    expect(screen.getByText(/Earn Real Cashback/i)).toBeInTheDocument();
  });

  it('renders all three floating badges', () => {
    render(<HeroSection />);
    const badges = screen.getAllByTestId('floating-badge');
    expect(badges).toHaveLength(3);
    expect(screen.getByText('₹127')).toBeInTheDocument();
    expect(screen.getByText('₹250')).toBeInTheDocument();
    expect(screen.getByText('₹89')).toBeInTheDocument();
  });

  it('renders the stats bar with all three stats', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('stats-bar')).toBeInTheDocument();
    expect(screen.getByText('500+ Stores')).toBeInTheDocument();
    expect(screen.getByText('₹2Cr+ Cashback Paid')).toBeInTheDocument();
    expect(screen.getByText('1L+ Happy Users')).toBeInTheDocument();
  });

  it('renders both CTA buttons', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('cta-explore')).toBeInTheDocument();
    expect(screen.getByTestId('cta-how-it-works')).toBeInTheDocument();
  });

  it('Explore Stores CTA scrolls to merchant-grid', () => {
    const mockScrollIntoView = vi.fn();
    const mockEl = { scrollIntoView: mockScrollIntoView };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockEl);

    render(<HeroSection />);
    fireEvent.click(screen.getByTestId('cta-explore'));

    expect(document.getElementById).toHaveBeenCalledWith('merchant-grid');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('How It Works CTA scrolls to how-it-works', () => {
    const mockScrollIntoView = vi.fn();
    const mockEl = { scrollIntoView: mockScrollIntoView };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockEl);

    render(<HeroSection />);
    fireEvent.click(screen.getByTestId('cta-how-it-works'));

    expect(document.getElementById).toHaveBeenCalledWith('how-it-works');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
