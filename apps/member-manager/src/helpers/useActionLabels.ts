import { useStore } from 'react-admin';

/**
 * User preference: show text labels next to the icon buttons in page heading
 * bars. Defaults to icon-only (tooltips still describe every action). Stored
 * in RaStore, so it syncs to the server user_preferences bag and follows the
 * user across devices. Toggled from the Profile page.
 */
export const ACTION_LABELS_STORE_KEY = 'ui.showActionLabels';

export const useActionLabels = (): [boolean, (value: boolean) => void] => {
  const [showLabels, setShowLabels] = useStore<boolean>(
    ACTION_LABELS_STORE_KEY,
    false
  );
  return [showLabels, setShowLabels];
};

export default useActionLabels;
