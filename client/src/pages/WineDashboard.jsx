import { useState, useEffect, useCallback, useMemo } from 'react';
import WineCard from '../components/wines/WineCard';
import WineForm from '../components/wines/WineForm';
import FilterBar from '../components/wines/FilterBar';
import StatsPanel from '../components/wines/StatsPanel';
import WineMap from '../components/wines/WineMap';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { getRegionFilterValues } from '../components/wines/regionData';
import { useI18n } from '../i18n';
import * as api from '../services/winesApi';
import styles from './WineDashboard.module.css';

export default function WineDashboard() {
  const { t } = useI18n();
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWine, setEditingWine] = useState(null);

  const loadWines = useCallback(async () => {
    try {
      setError(null);
      const activeFilters = {};
      if (filters.type) activeFilters.type = filters.type;
      if (filters.status) activeFilters.status = filters.status;
      if (filters.search) activeFilters.search = filters.search;
      const data = await api.fetchWines(activeFilters);
      setWines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    loadWines();
  }, [loadWines]);

  // Apply region filter client-side on top of the API-filtered wines
  const displayedWines = useMemo(() => {
    if (!selectedRegion) return wines;
    const regionValues = getRegionFilterValues(selectedRegion).map((v) => v.toLowerCase());
    return wines.filter((wine) => {
      if (!wine.region) return false;
      return regionValues.includes(wine.region.trim().toLowerCase());
    });
  }, [wines, selectedRegion]);

  async function handleCreate(data) {
    await api.createWine(data);
    setShowCreateModal(false);
    await loadWines();
  }

  async function handleUpdate(data) {
    await api.updateWine(editingWine._id, data);
    setEditingWine(null);
    await loadWines();
  }

  async function handleDelete(id) {
    await api.deleteWine(id);
    await loadWines();
  }

  const hasActiveFilters = filters.type || filters.status || filters.search || selectedRegion;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🍷 {t('appTitle')}</h1>
          <p className={styles.subtitle}>{t('appSubtitle')}</p>
        </div>
        <div className={styles.headerActions}>
          <LanguageSwitcher />
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            {t('addWine')}
          </Button>
        </div>
      </header>

      {/* Stats */}
      <StatsPanel wines={wines} />

      {/* Map */}
      <WineMap
        wines={wines}
        selectedRegion={selectedRegion}
        onRegionSelect={setSelectedRegion}
      />

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Wine list */}
      <section className={styles.wineList} aria-label="Wine list">
        {loading && (
          <div className={styles.emptyState}>
            <div className={styles.loader} />
            <p>{t('loadingWines')}</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState} role="alert">
            <p>⚠️ {error}</p>
            <Button variant="secondary" onClick={loadWines}>
              {t('retry')}
            </Button>
          </div>
        )}

        {!loading && !error && displayedWines.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🍷</span>
            <p className={styles.emptyTitle}>
              {hasActiveFilters ? t('noWinesMatch') : t('cellarEmpty')}
            </p>
            <p className={styles.emptySubtitle}>
              {hasActiveFilters
                ? t('tryAdjustingFilters')
                : t('addFirstWinePrompt')}
            </p>
            {!hasActiveFilters && (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                {t('addFirstWine')}
              </Button>
            )}
          </div>
        )}

        {!loading && !error && displayedWines.length > 0 && (
          <div className={styles.wineGrid}>
            {displayedWines.map((wine) => (
              <WineCard
                key={wine._id}
                wine={wine}
                onEdit={setEditingWine}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t('addNewWine')}
      >
        <WineForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingWine !== null}
        onClose={() => setEditingWine(null)}
        title={t('editWine')}
      >
        {editingWine && (
          <WineForm
            wine={editingWine}
            onSubmit={handleUpdate}
            onCancel={() => setEditingWine(null)}
          />
        )}
      </Modal>
    </div>
  );
}
