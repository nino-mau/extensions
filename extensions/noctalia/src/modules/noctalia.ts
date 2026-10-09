import { execFile } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { promisify } from 'node:util';
import { parse } from 'smol-toml';

const execFileAsync = promisify(execFile);

const WALLPAPER_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
]);

export type Wallpaper = {
  path: string;
  name: string;
  section: string;
};

type Config = {
  wallpaper?: { directory?: string };
};

export async function execNoctalia(args: string[]) {
  const { stdout } = await execFileAsync('noctalia', args);
  return stdout.trim();
}

export async function getConfig() {
  return parse(await execNoctalia(['config', 'export', 'merged'])) as Config;
}

export async function getWallpaperDirectory() {
  const directory = (await getConfig()).wallpaper?.directory;
  if (!directory) throw new Error('wallpaper.directory is not set');
  return directory;
}

export function getCurrentWallpaper() {
  return execNoctalia(['msg', 'wallpaper-get']);
}

export async function setWallpaper(path: string) {
  await execNoctalia(['msg', 'wallpaper-set', path]);
}

export async function listWallpapers(): Promise<Wallpaper[]> {
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

export async function openSettingsWindow() {
  await execNoctalia(['msg', 'settings-open']);
}
