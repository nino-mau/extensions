/**
 * The source of a color scheme
 */
export type ColorSchemeSource =
  | 'custom'
  | 'builtin'
  | 'wallpaper'
  | 'community';

/**
 * A noctalia color scheme
 */
export type ColorScheme = {
  name: string;
  source: ColorSchemeSource;
};

/**
 * The subset of Noctalia's configuration used by this extension.
 */
export type Config = {
  wallpaper?: { directory?: string };
};

/**
 * A wallpaper image grouped by it's folder.
 */
export type Wallpaper = {
  path: string;
  name: string;
  section: string;
};
