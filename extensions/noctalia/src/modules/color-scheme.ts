import { homedir } from 'node:os';
import { join } from 'node:path';
import type { ColorScheme } from '../types';
import { execNoctalia } from './noctalia';

export const BUILTIN_COLOR_SCHEMES = [
  'Ayu',
  'Catppuccin',
  'Dracula',
  'Eldritch',
  'Gruvbox',
  'Kanagawa',
  'Noctalia',
  'Nord',
  'Rosé Pine',
  'Tokyo-Night',
] as const;

async function getActiveColorScheme() {
  const scheme = await execNoctalia(['msg', 'color-scheme-get']);
  const [source, name] = scheme.split(' ');
  return { source, name } as ColorScheme;
}

export async function getActiveColorSchemeColors(): Promise<string> {
  // Get source/name of active noctalia color schema
  const colorScheme = await getActiveColorScheme();

  switch (colorScheme.source) {
    case 'custom': {
      // Get noctalia config directory
      const configHome =
        process.env.NOCTALIA_CONFIG_HOME ||
        process.env.XDG_CONFIG_HOME ||
        join(homedir(), '.config');

      // Build path to color scheme
      return join(
        configHome,
        'noctalia',
        'palettes',
        `${colorScheme.name}.json`
      );
    }
    case 'builtin':
      break;
    case 'community':
      break;
    case 'wallpaper':
      break;
    default:
      break;
  }
  if (!colorScheme.source) {
    throw new Error('The active color scheme is not a custom color scheme');
  }

  const name = scheme.slice('custom '.length).trim();
  if (!name) throw new Error('No active custom color scheme name');

  const configHome =
    process.env.NOCTALIA_CONFIG_HOME ||
    process.env.XDG_CONFIG_HOME ||
    join(homedir(), '.config');

  return join(configHome, 'noctalia', 'palettes', `${name}.json`);
}
