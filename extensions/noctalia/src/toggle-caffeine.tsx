import { closeMainWindow } from '@vicinae/api';
import { toggleCaffeine } from './modules/noctalia';

export default async function ToggleCaffeine() {
  await toggleCaffeine();
  await closeMainWindow();
}
