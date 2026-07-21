import { useState, useTransition } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import styles from './WineForm.module.css';

const WINE_TYPES = [
  { value: 'Red', label: 'Red' },
  { value: 'White', label: 'White' },
  { value: 'Rosé', label: 'Rosé' },
  { value: 'Sparkling', label: 'Sparkling' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Fortified', label: 'Fortified' },
];

const WINE_STATUSES = [
  { value: 'In Cellar', label: 'In Cellar' },
  { value: 'Consumed', label: 'Consumed' },
  { value: 'Wishlist', label: 'Wishlist' },
];

const currentYear = new Date().getFullYear();

/**
 * WineForm handles both create and edit.
 * - If `wine` prop is provided, it's in edit mode.
 * - `onSubmit` receives the form data object.
 * - `onCancel` closes the form/modal.
 */
export default function WineForm({ wine = null, onSubmit, onCancel }) {
  const isEditing = wine !== null;
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: wine?.name || '',
    producer: wine?.producer || '',
    vintage: wine?.vintage != null ? String(wine.vintage) : '',
    type: wine?.type || '',
    grape: wine?.grape || '',
    region: wine?.region || '',
    country: wine?.country || '',
    quantity: wine?.quantity != null ? String(wine.quantity) : '1',
    price: wine?.price != null ? String(wine.price) : '',
    rating: wine?.rating != null ? String(wine.rating) : '',
    notes: wine?.notes || '',
    status: wine?.status || 'In Cellar',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};

    // Name - required, max 200
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name cannot exceed 200 characters';
    }

    // Producer - required, max 200
    if (!formData.producer.trim()) {
      newErrors.producer = 'Producer is required';
    } else if (formData.producer.length > 200) {
      newErrors.producer = 'Producer cannot exceed 200 characters';
    }

    // Vintage - optional, integer 1900–currentYear+1
    if (formData.vintage) {
      const v = Number(formData.vintage);
      if (!Number.isInteger(v) || v < 1900 || v > currentYear + 1) {
        newErrors.vintage = `Vintage must be between 1900 and ${currentYear + 1}`;
      }
    }

    // Type - required
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    // Grape - optional, max 200
    if (formData.grape.length > 200) {
      newErrors.grape = 'Grape cannot exceed 200 characters';
    }

    // Region - optional, max 200
    if (formData.region.length > 200) {
      newErrors.region = 'Region cannot exceed 200 characters';
    }

    // Country - optional, max 100
    if (formData.country.length > 100) {
      newErrors.country = 'Country cannot exceed 100 characters';
    }

    // Quantity - integer >= 0
    if (formData.quantity !== '') {
      const q = Number(formData.quantity);
      if (!Number.isInteger(q) || q < 0) {
        newErrors.quantity = 'Quantity must be a non-negative integer';
      }
    }

    // Price - optional, number >= 0
    if (formData.price !== '') {
      const p = Number(formData.price);
      if (isNaN(p) || p < 0) {
        newErrors.price = 'Price must be a non-negative number';
      }
    }

    // Rating - optional, integer 1–5
    if (formData.rating !== '') {
      const r = Number(formData.rating);
      if (!Number.isInteger(r) || r < 1 || r > 5) {
        newErrors.rating = 'Rating must be between 1 and 5';
      }
    }

    // Notes - optional, max 2000
    if (formData.notes.length > 2000) {
      newErrors.notes = 'Notes cannot exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function buildPayload() {
    const payload = {
      name: formData.name.trim(),
      producer: formData.producer.trim(),
      type: formData.type,
      grape: formData.grape.trim(),
      region: formData.region.trim(),
      country: formData.country.trim(),
      quantity: formData.quantity !== '' ? Number(formData.quantity) : 1,
      notes: formData.notes.trim(),
      status: formData.status,
    };

    if (formData.vintage) {
      payload.vintage = Number(formData.vintage);
    }
    if (formData.price !== '') {
      payload.price = Number(formData.price);
    }
    if (formData.rating !== '') {
      payload.rating = Number(formData.rating);
    }

    return payload;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      try {
        await onSubmit(buildPayload());
      } catch (err) {
        setErrors({ form: err.message });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {errors.form && (
        <div className={styles.formError} role="alert">
          {errors.form}
        </div>
      )}

      <div className={styles.row}>
        <Input
          id="wine-name"
          name="name"
          label="Name"
          placeholder="e.g. Château Margaux 2015"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          autoFocus
        />
        <Input
          id="wine-producer"
          name="producer"
          label="Producer"
          placeholder="e.g. Château Margaux"
          value={formData.producer}
          onChange={handleChange}
          error={errors.producer}
          required
        />
      </div>

      <div className={styles.row}>
        <Select
          id="wine-type"
          name="type"
          label="Type"
          placeholder="Select type..."
          options={WINE_TYPES}
          value={formData.type}
          onChange={handleChange}
          error={errors.type}
          required
        />
        <Input
          id="wine-vintage"
          name="vintage"
          label="Vintage"
          type="number"
          placeholder="e.g. 2020"
          value={formData.vintage}
          onChange={handleChange}
          error={errors.vintage}
          min={1900}
          max={currentYear + 1}
        />
      </div>

      <div className={styles.row}>
        <Input
          id="wine-grape"
          name="grape"
          label="Grape Variety"
          placeholder="e.g. Cabernet Sauvignon"
          value={formData.grape}
          onChange={handleChange}
          error={errors.grape}
        />
        <Input
          id="wine-region"
          name="region"
          label="Region"
          placeholder="e.g. Bordeaux"
          value={formData.region}
          onChange={handleChange}
          error={errors.region}
        />
      </div>

      <div className={styles.row}>
        <Input
          id="wine-country"
          name="country"
          label="Country"
          placeholder="e.g. France"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
        />
        <Select
          id="wine-status"
          name="status"
          label="Status"
          options={WINE_STATUSES}
          value={formData.status}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row3}>
        <Input
          id="wine-quantity"
          name="quantity"
          label="Quantity"
          type="number"
          placeholder="1"
          value={formData.quantity}
          onChange={handleChange}
          error={errors.quantity}
          min={0}
        />
        <Input
          id="wine-price"
          name="price"
          label="Price"
          type="number"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          min={0}
          step="0.01"
        />
        <Input
          id="wine-rating"
          name="rating"
          label="Rating (1–5)"
          type="number"
          placeholder="—"
          value={formData.rating}
          onChange={handleChange}
          error={errors.rating}
          min={1}
          max={5}
        />
      </div>

      <Textarea
        id="wine-notes"
        name="notes"
        label="Notes"
        placeholder="Tasting notes, pairing suggestions..."
        value={formData.notes}
        onChange={handleChange}
        error={errors.notes}
        rows={3}
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isPending}>
          {isEditing ? 'Update Wine' : 'Add Wine'}
        </Button>
      </div>
    </form>
  );
}
