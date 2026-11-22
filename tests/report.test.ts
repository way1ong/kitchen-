import { it } from 'vitest';
import { RECIPES } from '../src/data/recipes';
import { perServing } from '../src/logic/recipeNutrition';

// Звіт: REPORT=1 npx vitest run tests/report.test.ts
it.runIf((globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.REPORT)('звіт про рецепти', () => {
  const rows = RECIPES.map((r) => {
    const n = perServing(r);
    return `${String(r.level)} ${r.id.padEnd(30)} ${r.meals.join(',').padEnd(24)} ${String(Math.round(n.kcal)).padStart(4)} ккал  Б${String(Math.round(n.protein)).padStart(3)} Ж${String(Math.round(n.fat)).padStart(3)} В${String(Math.round(n.carbs)).padStart(3)} Кл${String(Math.round(n.fiber)).padStart(3)}  О/Ф ${Math.round(n.fv)} г  ×${r.servings}`;
  });
  console.log(`\n${rows.join('\n')}\n Всього: ${RECIPES.length}`);
});
