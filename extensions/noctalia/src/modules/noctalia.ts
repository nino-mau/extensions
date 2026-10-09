import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parse } from 'smol-toml';
import type { Config } from '../types';

const execFileAsync = promisify(execFile);

export async function execNoctalia(args: string[]) {
  const { stdout } = await execFileAsync('noctalia', args);
  return stdout.trim();
}

/**
 * Return raw noctalia config
 */
export async function getConfig() {
  return await execNoctalia(['config', 'export', 'merged']);
}

/**
 * Exports Noctalia's merged configuration and parses the TOML output.
 */
export async function getParsedConfig() {
  return parse(await getConfig()) as Config;
}

export async function openSettingsWindow() {
  await execNoctalia(['msg', 'settings-open']);
}

export async function toggleLockscreenEditor() {
  await execNoctalia(['msg', 'lockscreen-widgets-toggle-edit']);
}

export async function applyTemplates() {
  await execNoctalia(['msg', 'templates-apply']);
}

export async function toggleBar() {
  await execNoctalia(['msg', 'bar-toggle']);
}

export async function toggleDoNotDisturb() {
  await execNoctalia(['msg', 'notification-dnd-toggle']);
}

export async function toggleCaffeine() {
  await execNoctalia(['msg', 'caffeine-toggle']);
}
