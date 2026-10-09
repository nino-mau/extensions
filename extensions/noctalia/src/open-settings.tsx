import { closeMainWindow } from '@vicinae/api';
import { openSettingsWindow } from './modules/noctalia';

export default async function OpenSettings() {
  await openSettingsWindow();
  await closeMainWindow();
}
