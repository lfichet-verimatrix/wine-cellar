import { useMemo } from 'react';
import FranceRegionsSVG from './FranceRegionsSVG';
import { getActiveRegions } from './regionData';
import styles from './WineMap.module.css';

/**
 * WineMap displays a map of France highlighting regions that have wines in the cellar.
 * Clicking a region triggers filtering.
 *
 * @param {Object} props
 * @param {Array} props.wines - All wines (unfiltered) to determine which regions are active
 * @param {string|null} props.selectedRegion - Currently selected region key (or null)
 * @param {function} props.onRegionSelect - Callback when a region is clicked
 */
export default function WineMap({ wines, selectedRegion, onRegionSelect }) {
  const activeRegions = useMemo(() => getActiveRegions(wines), [wines]);

  function handleRegionClick(regionKey) {
    // Toggle: click same region again to deselect
    if (selectedRegion === regionKey) {
      onRegionSelect(null);
    } else {
      onRegionSelect(regionKey);
    }
  }

  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapTitle}>Wine Regions</h3>
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
          aria-label="Clear region filter"
        >
          ✕ {selectedRegion}
        </button>
      )}
      <p className={styles.legend}>
        <span className={styles.legendActive} /> In cellar
        <span className={styles.legendInactive} /> No wines
      </p>
    </div>
  );
}
