export { ApplicationSettingsForm } from '@/modules/settings/components/ApplicationSettingsForm';
export { useApplicationSettings, useUpdateApplicationSettings } from '@/modules/settings/hooks/useSettings';
export { ApplicationSettingsPage } from '@/modules/settings/pages/ApplicationSettingsPage';
export type { SettingsResponse, UpdateSettingsRequest } from '@/modules/settings/types/Settings';

/** @deprecated Import from `@/modules/settings` — kept for sale invoice compatibility. */
export { useApplicationSettings as useSettings } from '@/modules/settings/hooks/useSettings';
