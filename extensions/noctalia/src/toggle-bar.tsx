import { closeMainWindow } from '@vicinae/api';
import { toggleBar } from './modules/noctalia';

export default async function ToggleBar() {
  // await toggleBar();
  await closeMainWindow();
}
