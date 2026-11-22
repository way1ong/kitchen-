import type { Allergen, AnimalKind, Nutrition, Recipe } from '../data/types';
import { getProduct } from '../data/products';

export const ZERO: Nutrition = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, fv: 0 };

export function addN(a: Nutrition, b: Nutrition): Nutrition {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    fat: a.fat + b.fat,
    carbs: a.carbs + b.carbs,
    fiber: a.fiber + b.fiber,
    fv: a.fv + b.fv,
  };
}

export function scaleN(a: Nutrition, k: number): Nutrition {
  return {
    kcal: a.kcal * k,
    protein: a.protein * k,
    fat: a.fat * k,
    carbs: a.carbs * k,
    fiber: a.fiber * k,
    fv: a.fv * k,
  };
}

const totalsCache = new Map<string, Nutrition>();

/** Поживність усього рецепта (без необов'язкових інгредієнтів). */
export function recipeTotals(r: Recipe): Nutrition {
  const cached = totalsCache.get(r.id);
  if (cached) return cached;
  let t = { ...ZERO };
  for (const ing of r.ingredients) {
    if (ing.opt || ing.g <= 0) continue;
    const p = getProduct(ing.p);
    const k = ing.g / 100;
    t = addN(t, {
      kcal: p.n[0] * k,
      protein: p.n[1] * k,
      fat: p.n[2] * k,
      carbs: p.n[3] * k,
      fiber: p.n[4] * k,
      fv: p.fv ? ing.g : 0,
    });
  }
  totalsCache.set(r.id, t);
  return t;
}

/** Поживність однієї базової порції. */
export function perServing(r: Recipe): Nutrition {
  return scaleN(recipeTotals(r), 1 / r.servings);
}

/** Поживність порції з множником (1 = базова порція). */
export function portion(r: Recipe, mult: number): Nutrition {
  return scaleN(perServing(r), mult);
}

/** Алергени рецепта (з обов'язкових інгредієнтів). */
export function recipeAllergens(r: Recipe): Set<Allergen> {
  const s = new Set<Allergen>();
  for (const ing of r.ingredients) {
    if (ing.opt) continue;
    for (const a of getProduct(ing.p).allergens ?? []) s.add(a);
  }
  return s;
}

export function recipeAnimals(r: Recipe): Set<AnimalKind> {
  const s = new Set<AnimalKind>();
  for (const ing of r.ingredients) {
    if (ing.opt) continue;
    const a = getProduct(ing.p).animal;
    if (a) s.add(a);
  }
  return s;
}

export function isVegetarian(r: Recipe): boolean {
  return recipeAnimals(r).size === 0;
}
