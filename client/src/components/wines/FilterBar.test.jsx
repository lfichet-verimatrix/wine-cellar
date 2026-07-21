import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterBar from './FilterBar';

describe('FilterBar', () => {
  const defaultFilters = { type: '', status: '', search: '' };

  it('renders type, status, and search controls', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={vi.fn()} />);

    expect(screen.getByLabelText('Filter by type')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    expect(screen.getByLabelText('Search wines')).toBeInTheDocument();
  });

  it('calls onFilterChange when type is changed', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText('Filter by type'), { target: { value: 'Red' } });
    expect(onFilterChange).toHaveBeenCalledWith({ type: 'Red', status: '', search: '' });
  });

  it('calls onFilterChange when status is changed', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'In Cellar' } });
    expect(onFilterChange).toHaveBeenCalledWith({ type: '', status: 'In Cellar', search: '' });
  });

  it('calls onFilterChange when search text is entered', () => {
    const onFilterChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByLabelText('Search wines'), { target: { value: 'margaux' } });
    expect(onFilterChange).toHaveBeenCalledWith({ type: '', status: '', search: 'margaux' });
  });

  it('does not show Clear button when no filters are active', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={vi.fn()} />);

    expect(screen.queryByText(/Clear filters/)).not.toBeInTheDocument();
  });

  it('shows Clear button when filters are active', () => {
    const activeFilters = { type: 'Red', status: '', search: '' };
    render(<FilterBar filters={activeFilters} onFilterChange={vi.fn()} />);

    expect(screen.getByText(/Clear filters/)).toBeInTheDocument();
  });

  it('clears all filters when Clear button is clicked', () => {
    const onFilterChange = vi.fn();
    const activeFilters = { type: 'Red', status: 'In Cellar', search: 'test' };
    render(<FilterBar filters={activeFilters} onFilterChange={onFilterChange} />);

    fireEvent.click(screen.getByText(/Clear filters/));
    expect(onFilterChange).toHaveBeenCalledWith({ type: '', status: '', search: '' });
  });
});
