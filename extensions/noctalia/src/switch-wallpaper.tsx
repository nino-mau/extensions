import {
  Action,
  ActionPanel,
  Clipboard,
  Grid,
  Icon,
  Keyboard,
  showToast,
  Toast,
} from '@vicinae/api';
import { useEffect, useState } from 'react';
import {
  getCurrentWallpaper,
  getWallpapers,
  setWallpaper,
  type Wallpaper,
} from './modules/wallpapers';

export default function SwitchWallpaper() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [currentWallpaperPath, setCurrentWallpaperPath] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  // Handle fetching the noctalia wallpapers and active wallpaper
  useEffect(() => {
    (async () => {
      try {
        const [wallpapers, active] = await Promise.all([
          getWallpapers(),
          getCurrentWallpaper(),
        ]);
        setCurrentWallpaperPath(active);
        setWallpapers(wallpapers);
      } catch (error) {
        showToast(
          Toast.Style.Failure,
          'Failed to load wallpapers',
          String(error)
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /**
   * Handle making the given wallpaper the current noctalia wallpaper
   */
  async function applyWallpaper(wallpaper: Wallpaper) {
    try {
      await setWallpaper(wallpaper.path);
      setCurrentWallpaperPath(wallpaper.path);
      showToast(Toast.Style.Success, 'Wallpaper set', wallpaper.name);
    } catch (error) {
      showToast(Toast.Style.Failure, 'Failed to set wallpaper', String(error));
    }
  }

  // Group wallpapers by their directory relative to the wallpaper root
  const sections = new Map<string, Wallpaper[]>();
  for (const wallpaper of wallpapers) {
    sections.set(wallpaper.section, [
      ...(sections.get(wallpaper.section) ?? []),
      wallpaper,
    ]);
  }

  const wallpaperItem = (wallpaper: Wallpaper) => (
    <Grid.Item
      key={wallpaper.path}
      title={wallpaper.path === currentWallpaperPath ? 'Current' : undefined}
      subtitle={wallpaper.name}
      content={{
        source: wallpaper.path,
      }}
      keywords={[wallpaper.section]}
      actions={
        <ActionPanel>
          <Action
            title="Set as wallpaper"
            icon={Icon.Image}
            onAction={() => applyWallpaper(wallpaper)}
          />
          <Action.Open
            title="Open Image"
            icon={Icon.Image}
            target={wallpaper.path}
          />
          <ActionPanel.Section>
            <Action
              title="Copy Image"
              icon={Icon.CopyClipboard}
              onAction={() => {
                Clipboard.copy({ file: wallpaper.path });
              }}
              shortcut={Keyboard.Shortcut.Common.Copy}
            />
            <Action.CopyToClipboard
              title="Copy Path"
              content={wallpaper.path}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );

  const currentWallpaper = wallpapers.find(
    (w) => w.path === currentWallpaperPath
  );

  return (
    <Grid
      isLoading={isLoading}
      columns={4}
      aspectRatio="16/9"
      fit={Grid.Fit.Fill}
      searchBarPlaceholder="Search wallpapers..."
    >
      {currentWallpaper && (
        <Grid.Section title="Current">
          {wallpaperItem(currentWallpaper)}
        </Grid.Section>
      )}
      {[...sections].map(([section, items]) => (
        <Grid.Section key={section} title={section || 'Wallpapers'}>
          {items.map(wallpaperItem)}
        </Grid.Section>
      ))}
    </Grid>
  );
}
