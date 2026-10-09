import { closeMainWindow } from '@vicinae/api';
import { toggleDoNotDisturb } from './modules/noctalia';

export default async function ToggleDoNotDisturb() {
  // await toggleDoNotDisturb();
  await closeMainWindow();
}
