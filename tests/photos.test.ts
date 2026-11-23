import { describe, expect, it } from 'vitest';
import { PHOTOS } from '../src/data/photos';
import { RECIPE_BY_ID } from '../src/data/recipes';

const FILES = Object.keys(import.meta.glob('../public/photos/*.webp')).map((f) => f.split('/').pop()!);
const FREE = /^(CC0|Public domain|CC BY(-SA)? [234]\.[05])$/;

describe('фото-приклади страв', () => {
  const entries = Object.entries(PHOTOS);

  it('кожне фото належить рецепту, а файл лежить у public/photos', () => {
    for (const [id, p] of entries) {
      expect(RECIPE_BY_ID[id], id).toBeTruthy();
      expect(p.file).toMatch(new RegExp(`^${id}\\.[0-9a-f]{8}\\.webp$`));
      expect(FILES, id).toContain(p.file);
    }
  });

  it('у public/photos немає зайвих файлів', () => {
    const used = new Set(entries.map(([, p]) => p.file));
    expect(FILES.filter((f) => !used.has(f))).toEqual([]);
  });

  it('вільна ліцензія, автор і посилання на джерело', () => {
    for (const [id, p] of entries) {
      expect(p.license, id).toMatch(FREE);
      expect(p.author.trim().length, id).toBeGreaterThan(0);
      expect(p.page, id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      if (p.license.startsWith('CC BY')) expect(p.licenseUrl, id).toMatch(/^https:\/\/creativecommons\.org\//);
    }
  });
});
