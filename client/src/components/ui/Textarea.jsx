import styles from './Input.module.css';

export default function Textarea({
  label,
  error,
  id,
  className = '',
  rows = 3,
  ...props
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{ resize: 'vertical' }}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
