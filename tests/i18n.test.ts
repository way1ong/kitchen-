import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../src/data/products';
import { LEVEL1 } from '../src/data/recipes/level1';
import { LEVEL2 } from '../src/data/recipes/level2';
import { LEVEL3 } from '../src/data/recipes/level3';
import type { Recipe } from '../src/data/types';
import { findColorCuesHu } from '../src/i18n/colorWordsHu';
import { HU_PRODUCTS } from '../src/i18n/hu/products';
import { HU_RECIPES_1 } from '../src/i18n/hu/recipes1';
import { HU_RECIPES_2 } from '../src/i18n/hu/recipes2';
import { HU_RECIPES_3 } from '../src/i18n/hu/recipes3';
import type { RecipeTr } from '../src/i18n/types';

const CYRILLIC = /[Ѐ-ӿ]/;

describe('угорський переклад: продукти', () => {
  it('немає зайвих ключів', () => {
    const ids = new Set(PRODUCTS.map((p) => p.id));
    for (const k of Object.keys(HU_PRODUCTS)) expect(ids.has(k), k).toBe(true);
  });
  for (const p of PRODUCTS) {
    it(`продукт ${p.id}`, () => {
      const t = HU_PRODUCTS[p.id];
      expect(t, 'немає перекладу').toBeDefined();
      expect(t.name.trim().length).toBeGreaterThan(1);
      expect(CYRILLIC.test(t.name + (t.unit ?? '') + (t.buyHint ?? ''))).toBe(false);
      if (p.piece) expect(t.unit, 'потрібна одиниця для штук (db, gerezd…)').toBeTruthy();
      expect(!!t.buyHint).toBe(!!p.buyHint);
    });
  }
});

function checkLevel(name: string, recipes: Recipe[], tr: Record<string, RecipeTr>) {
  describe(`угорський переклад: ${name}`, () => {
    it('немає зайвих ключів', () => {
      const ids = new Set(recipes.map((r) => r.id));
      for (const k of Object.keys(tr)) expect(ids.has(k), k).toBe(true);
    });
    for (const r of recipes) {
      it(`рецепт ${r.id}`, () => {
        const t = tr[r.id];
        expect(t, 'немає перекладу').toBeDefined();
        expect(CYRILLIC.test(t.name + (t.tip ?? '')), t.name).toBe(false);
        expect(!!t.tip, 'tip').toBe(!!r.tip);
        expect(findColorCuesHu(t.tip ?? ''), 'tip без кольору').toEqual([]);
        const noteIdx = r.ingredients.map((x, i) => (x.note ? i : -1)).filter((i) => i >= 0);
        expect(
          Object.keys(t.notes ?? {})
            .map(Number)
            .sort((a, b) => a - b),
          'notes: індекси інгредієнтів з приміткою',
        ).toEqual(noteIdx);
        for (const n of Object.values(t.notes ?? {})) expect(CYRILLIC.test(n), n).toBe(false);
        expect(t.steps.length, 'кількість кроків').toBe(r.steps.length);
        r.steps.forEach((s, i) => {
          const ts = t.steps[i];
          expect(!!ts.done, `крок ${i + 1}: done`).toBe(!!s.done);
          expect(!!ts.look, `крок ${i + 1}: look`).toBe(!!s.look);
          expect(!!ts.warn, `крок ${i + 1}: warn`).toBe(!!s.warn);
          const all = [ts.text, ts.done, ts.look, ts.warn].filter(Boolean).join(' ');
          expect(CYRILLIC.test(all), `кирилиця: ${all}`).toBe(false);
          expect(findColorCuesHu([ts.text, ts.done ?? '', ts.warn ?? ''].join(' ')), `колір у кроці ${i + 1}: ${ts.text}`).toEqual([]);
          if (s.temp) expect(/hőmérő/i.test(ts.done ?? ''), `крок ${i + 1}: done без термометра`).toBe(false);
        });
      });
    }
  });
}

checkLevel('рівень 1', LEVEL1, HU_RECIPES_1);
checkLevel('рівень 2', LEVEL2, HU_RECIPES_2);
checkLevel('рівень 3', LEVEL3, HU_RECIPES_3);
