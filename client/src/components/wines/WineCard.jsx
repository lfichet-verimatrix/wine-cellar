import { useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import styles from './WineCard.module.css';

const TYPE_VARIANTS = {
  Red: 'danger',
  White: 'warning',
  Rosé: 'pink',
  Sparkling: 'info',
  Dessert: 'success',
  Fortified: 'default',
};

const STATUS_VARIANTS = {
  'In Cellar': 'success',
  Consumed: 'default',
  Wishlist: 'warning',
};

function RatingStars({ rating }) {
  if (!rating) return <span className={styles.noRating}>—</span>;
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function WineCard({ wine, onEdit, onDelete }) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${wine.name}"?`)) return;
    setIsPending(true);
    try {
      await onDelete(wine._id);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article
      className={`${styles.card} ${isPending ? styles.pending : ''}`}
      aria-label={`Wine: ${wine.name}`}
    >
      <div className={styles.header}>
        <div className={styles.badges}>
          <Badge variant={TYPE_VARIANTS[wine.type] || 'default'}>{wine.type}</Badge>
          <Badge variant={STATUS_VARIANTS[wine.status] || 'default'}>{wine.status}</Badge>
        </div>
        {wine.vintage && <span className={styles.vintage}>{wine.vintage}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{wine.name}</h3>
        <p className={styles.producer}>{wine.producer}</p>

        <div className={styles.details}>
          {wine.region && (
            <span className={styles.detail}>
              📍 {wine.region}{wine.country ? `, ${wine.country}` : ''}
            </span>
          )}
          {wine.grape && (
            <span className={styles.detail}>🍇 {wine.grape}</span>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.quantity}>
            {wine.quantity} {wine.quantity === 1 ? 'bottle' : 'bottles'}
          </span>
          {wine.price != null && (
            <span className={styles.price}>€{wine.price.toFixed(2)}</span>
          )}
          <RatingStars rating={wine.rating} />
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={() => onEdit(wine)}>
          ✏️ Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          🗑️ Delete
        </Button>
      </div>
    </article>
  );
}
