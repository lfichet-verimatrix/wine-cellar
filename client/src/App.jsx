import { I18nProvider } from './i18n';
import WineDashboard from './pages/WineDashboard';

export default function App() {
  return (
    <I18nProvider>
      <WineDashboard />
    </I18nProvider>
  );
}
