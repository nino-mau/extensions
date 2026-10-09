import { readFile } from 'node:fs/promises';

/**
 * Reads and parses a JSON file. The optional type does not validate its contents.
 */
export async function readJsonFile<T = unknown>(path: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not load JSON file "${path}": ${message}`);
  }
}
