import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WineCard from './WineCard';

const mockWine = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Château Margaux 2015',
  producer: 'Château Margaux',
  vintage: 2015,
  type: 'Red',
  grape: 'Cabernet Sauvignon',
  region: 'Bordeaux',
  country: 'France',
  quantity: 2,
  price: 450,
  rating: 5,
  notes: 'Exceptional vintage',
  status: 'In Cellar',
};

describe('WineCard', () => {
  it('renders wine name and producer', () => {
    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Château Margaux 2015')).toBeInTheDocument();
    expect(screen.getByText('Château Margaux')).toBeInTheDocument();
  });

  it('renders vintage', () => {
    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('2015')).toBeInTheDocument();
  });

  it('renders type and status badges', () => {
    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('In Cellar')).toBeInTheDocument();
  });

  it('renders quantity and price', () => {
    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('2 bottles')).toBeInTheDocument();
    expect(screen.getByText('€450.00')).toBeInTheDocument();
  });

  it('renders rating stars', () => {
    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByLabelText('5 out of 5 stars')).toBeInTheDocument();
  });

  it('renders region and country', () => {
    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/Bordeaux.*France/)).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<WineCard wine={mockWine} onEdit={onEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByText(/Edit/));
    expect(onEdit).toHaveBeenCalledWith(mockWine);
  });

  it('calls onDelete when Delete is confirmed', () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByText(/Delete/));
    expect(window.confirm).toHaveBeenCalledWith('Delete "Château Margaux 2015"?');
    expect(onDelete).toHaveBeenCalledWith(mockWine._id);

    vi.restoreAllMocks();
  });

  it('does not call onDelete when Delete is cancelled', () => {
    const onDelete = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<WineCard wine={mockWine} onEdit={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByText(/Delete/));
    expect(onDelete).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('shows singular "bottle" when quantity is 1', () => {
    const singleWine = { ...mockWine, quantity: 1 };
    render(<WineCard wine={singleWine} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('1 bottle')).toBeInTheDocument();
  });
});
