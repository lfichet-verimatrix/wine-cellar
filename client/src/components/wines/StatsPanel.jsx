import styles from './StatsPanel.module.css';

const TYPE_EMOJI = {
  Red: '🍷',
  White: '🥂',
  Rosé: '🌸',
  Sparkling: '🍾',
  Dessert: '🍯',
  Fortified: '🏺',
};

export default function StatsPanel({ wines }) {
  const inCellar = wines.filter((w) => w.status === 'In Cellar');

  // Total bottles in cellar
  const totalBottles = inCellar.reduce((sum, w) => sum + (w.quantity || 0), 0);

  // Estimated cellar value (quantity × price where price is set)
  const cellarValue = inCellar.reduce((sum, w) => {
    if (w.price != null && w.quantity > 0) {
      return sum + w.quantity * w.price;
    }
    return sum;
  }, 0);

  // Breakdown by type (bottles per type for "In Cellar" wines)
  const byType = inCellar.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + (w.quantity || 0);
    return acc;
  }, {});

  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  return (
    <section className={styles.panel} aria-label="Cellar statistics">
      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalBottles}</span>
          <span className={styles.statLabel}>Bottles in Cellar</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            €{cellarValue.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className={styles.statLabel}>Estimated Value</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{wines.length}</span>
          <span className={styles.statLabel}>Total Entries</span>
        </div>
      </div>

      {typeEntries.length > 0 && (
        <div className={styles.breakdown}>
          <h3 className={styles.breakdownTitle}>By Type</h3>
          <div className={styles.typeList}>
            {typeEntries.map(([type, count]) => (
              <div key={type} className={styles.typeItem}>
                <span className={styles.typeEmoji}>{TYPE_EMOJI[type] || '🍷'}</span>
                <span className={styles.typeName}>{type}</span>
                <span className={styles.typeCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
