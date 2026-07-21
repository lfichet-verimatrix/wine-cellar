import { useI18n } from '../../i18n';
import styles from './LanguageSwitcher.module.css';

const LOCALE_LABELS = {
  en: '🇬🇧 EN',
  fr: '🇫🇷 FR',
};

export default function LanguageSwitcher() {
  const { locale, setLocale, locales } = useI18n();

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {locales.map((loc) => (
        <button
          key={loc}
          className={`${styles.btn} ${loc === locale ? styles.active : ''}`}
          onClick={() => setLocale(loc)}
          aria-pressed={loc === locale}
          aria-label={LOCALE_LABELS[loc]}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
