import { useSettings } from './useSettings';
import { useSystemTheme } from './useSystemTheme';
/**
 * Returns the actual theme being displayed (eg "light" or "dark")
 * regardless of whether that's by system theme or direct setting.
 */
const useTheme = () => {
  const settings = useSettings();
  const systemTheme = useSystemTheme();
  const userTheme = settings.get('themeMode');
  const darkMode = userTheme === 'dark' || userTheme === 'system' && systemTheme === 'dark';
  return darkMode ? 'dark' : 'light';
};
export { useTheme };