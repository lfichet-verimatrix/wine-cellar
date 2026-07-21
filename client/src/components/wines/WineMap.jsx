import { useMemo } from 'react';
import FranceRegionsSVG from './FranceRegionsSVG';
import { getActiveRegions } from './regionData';
import { useI18n } from '../../i18n';
import styles from './WineMap.module.css';

/**
 * WineMap displays a map of France highlighting regions that have wines in the cellar.
 * Clicking a region triggers filtering.
 */
export default function WineMap({ wines, selectedRegion, onRegionSelect }) {
  const { t } = useI18n();
  const activeRegions = useMemo(() => getActiveRegions(wines), [wines]);

  function handleRegionClick(regionKey) {
    if (selectedRegion === regionKey) {
      onRegionSelect(null);
    } else {
      onRegionSelect(regionKey);
    }
  }

  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapTitle}>{t('wineRegions')}</h3>
      <div className={styles.mapWrapper}>
        <FranceRegionsSVG
          activeRegions={activeRegions}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />
      </div>
      {selectedRegion && (
        <button
          className={styles.clearBtn}
          onClick={() => onRegionSelect(null)}
          aria-label={t('clearRegionFilter')}
        >
          ✕ {selectedRegion}
        </button>
      )}
      <p className={styles.legend}>
        <span className={styles.legendActive} /> {t('inCellar')}
        <span className={styles.legendInactive} /> {t('noWines')}
      </p>
    </div>
  );
}
