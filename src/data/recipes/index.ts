import type { Recipe } from '../types';
import { LEVEL1 } from './level1';
import { LEVEL2 } from './level2';
import { LEVEL3 } from './level3';

export const RECIPES: Recipe[] = [...LEVEL1, ...LEVEL2, ...LEVEL3];

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((r) => [r.id, r]),
);
