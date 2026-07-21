import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsPanel from './StatsPanel';

const mockWines = [
  { _id: '1', status: 'In Cellar', quantity: 3, price: 50, type: 'Red' },
  { _id: '2', status: 'In Cellar', quantity: 6, price: 25, type: 'White' },
  { _id: '3', status: 'In Cellar', quantity: 1, price: 220, type: 'Red' },
  { _id: '4', status: 'Consumed', quantity: 0, price: 600, type: 'Red' },
  { _id: '5', status: 'Wishlist', quantity: 0, price: 250, type: 'Red' },
];

describe('StatsPanel', () => {
  it('computes total bottles in cellar correctly', () => {
    render(<StatsPanel wines={mockWines} />);

    // 3 + 6 + 1 = 10 (only "In Cellar" wines)
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Bottles in Cellar')).toBeInTheDocument();
  });

  it('computes estimated cellar value correctly', () => {
    render(<StatsPanel wines={mockWines} />);

    // (3×50) + (6×25) + (1×220) = 150 + 150 + 220 = 520
    expect(screen.getByText('€520')).toBeInTheDocument();
    expect(screen.getByText('Estimated Value')).toBeInTheDocument();
  });

  it('shows total entries count', () => {
    render(<StatsPanel wines={mockWines} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Total Entries')).toBeInTheDocument();
  });

  it('shows breakdown by type for in-cellar wines', () => {
    render(<StatsPanel wines={mockWines} />);

    // Red: 3 + 1 = 4, White: 6
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('handles empty wine list', () => {
    render(<StatsPanel wines={[]} />);

    expect(screen.getByText('€0')).toBeInTheDocument();
    expect(screen.getByText('Bottles in Cellar')).toBeInTheDocument();
    // Total bottles and total entries both show 0
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('excludes wines without price from value calculation', () => {
    const wines = [
      { _id: '1', status: 'In Cellar', quantity: 5, type: 'Red' }, // no price
      { _id: '2', status: 'In Cellar', quantity: 2, price: 100, type: 'White' },
    ];
    render(<StatsPanel wines={wines} />);

    // Only 2×100 = 200
    expect(screen.getByText('€200')).toBeInTheDocument();
    // Total bottles: 5 + 2 = 7
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
