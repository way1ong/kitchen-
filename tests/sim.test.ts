import { it } from 'vitest';
import { DEFAULT_PROFILE, type Profile } from '../src/logic/profile';
import { computeTargets } from '../src/logic/targets';
import { dayTotals, generatePlan } from '../src/logic/planner';
import { daySchedule } from '../src/logic/schedule';

// Симуляція різних профілів: SIM=1 npx vitest run tests/sim.test.ts
it.runIf((globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.SIM)('симуляція профілів', () => {
  const MONDAY = new Date(2026, 10, 23);
  const cases: [string, Partial<Profile>][] = [
    ['офіс 9–18', {}],
    ['важка робота, 5 трен.', { work: 'heavy', training: 3, weight: 95, meals: 3, goal: 'maintain' }],
    ['нічна зміна', { workStart: '22:00', workEnd: '06:00', wake: '14:00', sleep: '08:00', workDays: [1, 2, 3, 4] }],
    ['вечірня зміна', { workStart: '14:00', workEnd: '23:00', wake: '09:00', sleep: '01:00', meals: 5 }],
    ['вегетаріанець, рівень 1', { exclude: ['vegetarian'], maxLevel: 1 }],
    ['без молочного', { exclude: ['no-dairy'] }],
    ['лише мікрохвильовка+чайник', { equipment: ['microwave', 'kettle'], maxLevel: 1 }],
    ['жінка 60 кг', { sex: 'f', weight: 60, height: 165, age: 30 }],
    ['без мікрохв. на роботі', { microwaveAtWork: false, meals: 5 }],
  ];
  for (const [name, o] of cases) {
    const p: Profile = { ...DEFAULT_PROFILE, example: false, ...o };
    const t = computeTargets(p);
    const plan = generatePlan(p, MONDAY, 3);
    const rows = plan.days.map((d) => {
      const n = dayTotals(d);
      const empty = daySchedule(p, d.weekday).slots.length - d.entries.length;
      return `${Math.round((n.kcal / t.kcal) * 100)}%/${Math.round((n.protein / t.protein) * 100)}%${empty ? ` (порожніх ${empty})` : ''}`;
    });
    console.log(`${name.padEnd(28)} ${t.kcal} ккал ${t.protein} г: ${rows.join(' ')}`);
  }
});
