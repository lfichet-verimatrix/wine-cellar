import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import styles from './FilterBar.module.css';

const WINE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'Red', label: 'Red' },
  { value: 'White', label: 'White' },
  { value: 'Rosé', label: 'Rosé' },
  { value: 'Sparkling', label: 'Sparkling' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Fortified', label: 'Fortified' },
];

const WINE_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'In Cellar', label: 'In Cellar' },
  { value: 'Consumed', label: 'Consumed' },
  { value: 'Wishlist', label: 'Wishlist' },
];

export default function FilterBar({ filters, onFilterChange }) {
  const hasActiveFilters = filters.type || filters.status || filters.search;

  function handleChange(e) {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  }

  function handleClear() {
    onFilterChange({ type: '', status: '', search: '' });
  }

  return (
    <nav className={styles.filterBar} aria-label="Wine filters">
      <div className={styles.filters}>
        <Select
          id="filter-type"
          name="type"
          options={WINE_TYPES}
          value={filters.type}
          onChange={handleChange}
          aria-label="Filter by type"
        />
        <Select
          id="filter-status"
          name="status"
          options={WINE_STATUSES}
          value={filters.status}
          onChange={handleChange}
          aria-label="Filter by status"
        />
        <Input
          id="filter-search"
          name="search"
          placeholder="Search by name or producer..."
          value={filters.search}
          onChange={handleChange}
          aria-label="Search wines"
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          ✕ Clear filters
        </Button>
      )}
    </nav>
  );
}
