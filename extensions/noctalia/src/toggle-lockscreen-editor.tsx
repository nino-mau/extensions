import { closeMainWindow } from '@vicinae/api';
import { toggleLockscreenEditor } from './modules/noctalia';

export default async function ToggleLockscreenEditor() {
  // await toggleLockscreenEditor();
  await closeMainWindow();
}
