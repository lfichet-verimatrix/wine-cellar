import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useI18n } from '../../i18n';
import styles from './FilterBar.module.css';

export default function FilterBar({ filters, onFilterChange }) {
  const { t } = useI18n();

  const WINE_TYPES = [
    { value: '', label: t('allTypes') },
    { value: 'Red', label: t('type.Red') },
    { value: 'White', label: t('type.White') },
    { value: 'Rosé', label: t('type.Rosé') },
    { value: 'Sparkling', label: t('type.Sparkling') },
    { value: 'Dessert', label: t('type.Dessert') },
    { value: 'Fortified', label: t('type.Fortified') },
  ];

  const WINE_STATUSES = [
    { value: '', label: t('allStatuses') },
    { value: 'In Cellar', label: t('status.In Cellar') },
    { value: 'Consumed', label: t('status.Consumed') },
    { value: 'Wishlist', label: t('status.Wishlist') },
  ];

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
          aria-label={t('field.type')}
        />
        <Select
          id="filter-status"
          name="status"
          options={WINE_STATUSES}
          value={filters.status}
          onChange={handleChange}
          aria-label={t('field.status')}
        />
        <Input
          id="filter-search"
          name="search"
          placeholder={t('searchPlaceholder')}
          value={filters.search}
          onChange={handleChange}
          aria-label={t('searchPlaceholder')}
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          {t('clearFilters')}
        </Button>
      )}
    </nav>
  );
}
