import { readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import type { Wallpaper } from '../types';
import { execNoctalia, getParsedConfig } from './noctalia';

const WALLPAPER_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
]);

export function getCurrentWallpaper() {
  return execNoctalia(['msg', 'wallpaper-get']);
}

export async function setWallpaper(path: string) {
  await execNoctalia(['msg', 'wallpaper-set', path]);
}

/**
 * Extract wallpaper directory from noctalia's config
 */
export async function getWallpaperDirectory() {
  const noctaliaConfig = await getParsedConfig();
  const directory = noctaliaConfig.wallpaper?.directory;
  if (!directory) throw new Error('wallpaper.directory is not set');
  return directory;
}

/**
 * Build wallpapers entries from images in given directory .
 */
export async function getWallpapers(): Promise<Wallpaper[]> {
  const directory = await getWallpaperDirectory();
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        WALLPAPER_EXTENSIONS.has(extname(entry.name).toLowerCase())
    )
    .map((entry) => ({
      path: join(entry.parentPath, entry.name),
      name: entry.name,
      section: relative(directory, entry.parentPath),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
