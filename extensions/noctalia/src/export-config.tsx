import { Clipboard, showToast, Toast } from '@vicinae/api';
import { getConfig } from './modules/noctalia';

export default async function ExportConfig() {
  try {
    await Clipboard.copy(await getConfig());
    showToast(Toast.Style.Success, 'Noctalia config copied to clipbaord');
  } catch (err) {
    console.error(err);
    showToast(Toast.Style.Failure, "Couldn't export config");
  }
}
