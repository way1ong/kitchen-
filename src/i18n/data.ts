import type { Product, Recipe } from '../data/types';
import { HU_PRODUCTS } from './hu/products';
import { HU_RECIPES_1 } from './hu/recipes1';
import { HU_RECIPES_2 } from './hu/recipes2';
import { HU_RECIPES_3 } from './hu/recipes3';
import { getLang } from './index';
import type { RecipeTr } from './types';

/**
 * Переклад даних: рецепти й продукти зберігаються українською, а для
 * угорської накладаємо переклад за id. Якщо перекладу немає — показуємо
 * українською (тест tests/i18n.test.ts стежить, щоб переклад був повний).
 */

const HU_RECIPES: Record<string, RecipeTr> = { ...HU_RECIPES_1, ...HU_RECIPES_2, ...HU_RECIPES_3 };
const recipeCache = new Map<string, Recipe>();

export function trRecipe(r: Recipe): Recipe {
  if (getLang() !== 'hu') return r;
  const t = HU_RECIPES[r.id];
  if (!t) return r;
  const hit = recipeCache.get(r.id);
  if (hit) return hit;
  const out: Recipe = {
    ...r,
    name: t.name,
    tip: t.tip ?? r.tip,
    ingredients: r.ingredients.map((ing, i) => (ing.note && t.notes?.[i] ? { ...ing, note: t.notes[i] } : ing)),
    steps: r.steps.map((s, i) => {
      const ts = t.steps[i];
      if (!ts) return s;
      return { ...s, text: ts.text, done: ts.done ?? s.done, look: ts.look ?? s.look, warn: ts.warn ?? s.warn };
    }),
  };
  recipeCache.set(r.id, out);
  return out;
}

export interface LocalProduct extends Product {
  /** Одиниця для штук у мовах без відмінювання після числа (угорська: db, gerezd…) */
  unit?: string;
}

const productCache = new Map<string, LocalProduct>();

export function trProduct(p: Product): LocalProduct {
  if (getLang() !== 'hu') return p;
  const t = HU_PRODUCTS[p.id];
  if (!t) return p;
  const hit = productCache.get(p.id);
  if (hit) return hit;
  const out: LocalProduct = { ...p, name: t.name, buyHint: t.buyHint ?? p.buyHint, unit: t.unit ?? (p.piece ? 'db' : undefined) };
  productCache.set(p.id, out);
  return out;
}
