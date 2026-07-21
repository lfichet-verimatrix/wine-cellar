import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WineForm from './WineForm';

describe('WineForm', () => {
  it('renders all required form fields', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Producer')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Vintage')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Rating (1–5)')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('shows validation error when name is empty', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText('Add Wine'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows validation error when producer is empty', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    // Fill name but not producer
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Add Wine'));
    expect(screen.getByText('Producer is required')).toBeInTheDocument();
  });

  it('shows validation error when type is not selected', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Producer'), { target: { value: 'Producer' } });
    fireEvent.click(screen.getByText('Add Wine'));
    expect(screen.getByText('Type is required')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<WineForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('pre-populates fields in edit mode', () => {
    const wine = {
      name: 'Test Wine',
      producer: 'Test Producer',
      vintage: 2020,
      type: 'Red',
      grape: 'Merlot',
      region: 'Bordeaux',
      country: 'France',
      quantity: 3,
      price: 50,
      rating: 4,
      notes: 'Good wine',
      status: 'In Cellar',
    };
    render(<WineForm wine={wine} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveValue('Test Wine');
    expect(screen.getByLabelText('Producer')).toHaveValue('Test Producer');
    expect(screen.getByLabelText('Vintage')).toHaveValue(2020);
    expect(screen.getByLabelText('Type')).toHaveValue('Red');
    expect(screen.getByLabelText('Quantity')).toHaveValue(3);
    expect(screen.getByLabelText('Notes')).toHaveValue('Good wine');
  });

  it('shows "Update Wine" button text in edit mode', () => {
    const wine = { name: 'Test', producer: 'P', type: 'Red', quantity: 1, status: 'In Cellar' };
    render(<WineForm wine={wine} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText('Update Wine')).toBeInTheDocument();
  });

  it('shows "Add Wine" button text in create mode', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText('Add Wine')).toBeInTheDocument();
  });

  it('validates vintage range', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Producer'), { target: { value: 'Producer' } });
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'Red' } });
    fireEvent.change(screen.getByLabelText('Vintage'), { target: { value: '1800' } });
    fireEvent.click(screen.getByText('Add Wine'));

    expect(screen.getByText(/Vintage must be between/)).toBeInTheDocument();
  });

  it('validates rating range', () => {
    render(<WineForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Producer'), { target: { value: 'Producer' } });
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'Red' } });
    fireEvent.change(screen.getByLabelText('Rating (1–5)'), { target: { value: '10' } });
    fireEvent.click(screen.getByText('Add Wine'));

    expect(screen.getByText('Rating must be between 1 and 5')).toBeInTheDocument();
  });
});
