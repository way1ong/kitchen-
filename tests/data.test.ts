import { describe, expect, it } from 'vitest';
import { PRODUCTS, PRODUCT_BY_ID } from '../src/data/products';
import { RECIPES } from '../src/data/recipes';
import { findColorCues } from '../src/logic/colorWords';
import { perServing } from '../src/logic/recipeNutrition';

describe('база продуктів', () => {
  it('унікальні id та коректні поживні значення', () => {
    const ids = new Set<string>();
    for (const p of PRODUCTS) {
      expect(ids.has(p.id), `дубль ${p.id}`).toBe(false);
      ids.add(p.id);
      expect(p.n).toHaveLength(5);
      const [kcal, pr, fat, carb] = p.n;
      // Енергія з макросів не повинна сильно перевищувати заявлену
      if (kcal > 0) expect(pr * 4 + fat * 9 + carb * 4).toBeLessThan(kcal * 1.3 + 15);
    }
  });
});

describe('база рецептів', () => {
  it('є рецепти всіх трьох рівнів', () => {
    for (const lvl of [1, 2, 3] as const) {
      expect(RECIPES.filter((r) => r.level === lvl).length, `рівень ${lvl}`).toBeGreaterThan(0);
    }
  });

  it('унікальні ASCII id', () => {
    const ids = new Set<string>();
    for (const r of RECIPES) {
      expect(r.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(ids.has(r.id), `дубль ${r.id}`).toBe(false);
      ids.add(r.id);
    }
  });

  for (const r of RECIPES) {
    describe(`${r.id} — ${r.name}`, () => {
      it('структура коректна', () => {
        expect(r.name.length).toBeGreaterThan(3);
        expect(r.meals.length).toBeGreaterThan(0);
        expect(r.equipment.length + (r.tags.includes('no-cook') ? 1 : 0)).toBeGreaterThan(0);
        expect(r.servings).toBeGreaterThanOrEqual(1);
        expect(r.activeMin).toBeGreaterThan(0);
        expect(r.activeMin).toBeLessThanOrEqual(r.totalMin);
        expect(r.steps.length).toBeGreaterThanOrEqual(2);
        if (r.tags.includes('batch')) expect(r.fridgeDays ?? 0).toBeGreaterThanOrEqual(2);
      });

      it('усі продукти існують', () => {
        for (const ing of r.ingredients) {
          expect(PRODUCT_BY_ID[ing.p], `продукт ${ing.p}`).toBeDefined();
          expect(ing.g).toBeGreaterThanOrEqual(0);
        }
      });

      it('рівень відповідає складності', () => {
        if (r.level === 1) {
          expect(r.equipment).not.toContain('oven');
          expect(r.totalMin).toBeLessThanOrEqual(45);
          expect(r.steps.length).toBeLessThanOrEqual(7);
        }
      });

      it('немає підказок готовності через колір', () => {
        for (const s of r.steps) {
          const text = [s.text, s.done ?? '', s.warn ?? ''].join(' ');
          expect(findColorCues(text), `крок: «${s.text}»`).toEqual([]);
        }
        expect(findColorCues(r.tip ?? '')).toEqual([]);
      });

      it('сире м’ясо і риба — перевірка термометром', () => {
        const raw = r.ingredients.some((i) => {
          const p = PRODUCT_BY_ID[i.p];
          return !i.opt && p && (p.cat === 'meat' || p.cat === 'fish');
        });
        if (raw) expect(r.steps.some((s) => (s.temp ?? 0) >= 60), 'потрібен крок з temp').toBe(true);
      });

      it('таймери в розумних межах', () => {
        for (const s of r.steps) {
          if (s.timer !== undefined) {
            expect(s.timer).toBeGreaterThan(0);
            expect(s.timer).toBeLessThanOrEqual(3 * 3600);
          }
        }
      });

      it('калорійність порції правдоподібна', () => {
        const n = perServing(r);
        expect(n.kcal).toBeGreaterThan(80);
        expect(n.kcal).toBeLessThan(900);
        if (r.meals.includes('lunch') || r.meals.includes('dinner')) {
          expect(n.protein, 'білок на порцію обіду/вечері').toBeGreaterThanOrEqual(15);
        }
      });
    });
  }
});
