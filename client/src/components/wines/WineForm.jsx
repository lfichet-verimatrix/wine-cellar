import { useState, useTransition } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useI18n } from '../../i18n';
import styles from './WineForm.module.css';

const currentYear = new Date().getFullYear();

/**
 * WineForm handles both create and edit.
 * - If `wine` prop is provided, it's in edit mode.
 * - `onSubmit` receives the form data object.
 * - `onCancel` closes the form/modal.
 */
export default function WineForm({ wine = null, onSubmit, onCancel }) {
  const { t } = useI18n();
  const isEditing = wine !== null;
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});

  const WINE_TYPES = [
    { value: 'Red', label: t('type.Red') },
    { value: 'White', label: t('type.White') },
    { value: 'Rosé', label: t('type.Rosé') },
    { value: 'Sparkling', label: t('type.Sparkling') },
    { value: 'Dessert', label: t('type.Dessert') },
    { value: 'Fortified', label: t('type.Fortified') },
  ];

  const WINE_STATUSES = [
    { value: 'In Cellar', label: t('status.In Cellar') },
    { value: 'Consumed', label: t('status.Consumed') },
    { value: 'Wishlist', label: t('status.Wishlist') },
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = t('error.nameRequired');
    } else if (formData.name.length > 200) {
      newErrors.name = t('error.nameMax');
    }

    if (!formData.producer.trim()) {
      newErrors.producer = t('error.producerRequired');
    } else if (formData.producer.length > 200) {
      newErrors.producer = t('error.producerMax');
    }

    if (formData.vintage) {
      const v = Number(formData.vintage);
      if (!Number.isInteger(v) || v < 1900 || v > currentYear + 1) {
        newErrors.vintage = t('error.vintageRange', { max: currentYear + 1 });
      }
    }

    if (!formData.type) {
      newErrors.type = t('error.typeRequired');
    }

    if (formData.grape.length > 200) {
      newErrors.grape = t('error.grapeMax');
    }

    if (formData.region.length > 200) {
      newErrors.region = t('error.regionMax');
    }

    if (formData.country.length > 100) {
      newErrors.country = t('error.countryMax');
    }

    if (formData.quantity !== '') {
      const q = Number(formData.quantity);
      if (!Number.isInteger(q) || q < 0) {
        newErrors.quantity = t('error.quantityInvalid');
      }
    }

    if (formData.price !== '') {
      const p = Number(formData.price);
      if (isNaN(p) || p < 0) {
        newErrors.price = t('error.priceInvalid');
      }
    }

    if (formData.rating !== '') {
      const r = Number(formData.rating);
      if (!Number.isInteger(r) || r < 1 || r > 5) {
        newErrors.rating = t('error.ratingInvalid');
      }
    }

    if (formData.notes.length > 2000) {
      newErrors.notes = t('error.notesMax');
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
          label={t('field.name')}
          placeholder={t('placeholder.name')}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          autoFocus
        />
        <Input
          id="wine-producer"
          name="producer"
          label={t('field.producer')}
          placeholder={t('placeholder.producer')}
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
          label={t('field.type')}
          placeholder={t('placeholder.type')}
          options={WINE_TYPES}
          value={formData.type}
          onChange={handleChange}
          error={errors.type}
          required
        />
        <Input
          id="wine-vintage"
          name="vintage"
          label={t('field.vintage')}
          type="number"
          placeholder={t('placeholder.vintage')}
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
          label={t('field.grape')}
          placeholder={t('placeholder.grape')}
          value={formData.grape}
          onChange={handleChange}
          error={errors.grape}
        />
        <Input
          id="wine-region"
          name="region"
          label={t('field.region')}
          placeholder={t('placeholder.region')}
          value={formData.region}
          onChange={handleChange}
          error={errors.region}
        />
      </div>

      <div className={styles.row}>
        <Input
          id="wine-country"
          name="country"
          label={t('field.country')}
          placeholder={t('placeholder.country')}
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
        />
        <Select
          id="wine-status"
          name="status"
          label={t('field.status')}
          options={WINE_STATUSES}
          value={formData.status}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row3}>
        <Input
          id="wine-quantity"
          name="quantity"
          label={t('field.quantity')}
          type="number"
          placeholder={t('placeholder.quantity')}
          value={formData.quantity}
          onChange={handleChange}
          error={errors.quantity}
          min={0}
        />
        <Input
          id="wine-price"
          name="price"
          label={t('field.price')}
          type="number"
          placeholder={t('placeholder.price')}
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          min={0}
          step="0.01"
        />
        <Input
          id="wine-rating"
          name="rating"
          label={t('field.rating')}
          type="number"
          placeholder={t('placeholder.rating')}
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
        label={t('field.notes')}
        placeholder={t('placeholder.notes')}
        value={formData.notes}
        onChange={handleChange}
        error={errors.notes}
        rows={3}
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} type="button">
          {t('cancel')}
        </Button>
        <Button variant="primary" type="submit" loading={isPending}>
          {isEditing ? t('updateWine') : t('addWineSubmit')}
        </Button>
      </div>
    </form>
  );
}
