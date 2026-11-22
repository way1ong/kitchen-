import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE, type Profile } from '../src/logic/profile';
import { computeTargets } from '../src/logic/targets';
import { daySchedule } from '../src/logic/schedule';
import {
  allowedRecipe,
  dayTotals,
  emptySlots,
  fillEmpty,
  generatePlan,
  matchingDays,
  profileKey,
  setEntry,
  slotOptions,
  type Plan,
} from '../src/logic/planner';
import { buildShoppingList } from '../src/logic/shopping';
import { sanitize } from '../src/state/store';

const MONDAY = new Date(2026, 10, 23); // 23.11.2026 — понеділок
const P = (o: Partial<Profile> = {}): Profile => ({ ...DEFAULT_PROFILE, example: false, ...o });
const ALL = [0, 1, 2, 3, 4, 5, 6];

/** Жодних «висячих» зв’язків «вечеря із запасом → залишки на обід». */
function noDanglingLinks(plan: Plan) {
  plan.days.forEach((d, i) =>
    d.entries.forEach((x) => {
      if (x.leftoverFrom !== undefined) {
        const src = plan.days[x.leftoverFrom].entries.find((y) => y.extraFor === i);
        expect(src?.recipe).toBe(x.recipe);
      }
      if (x.extraFor !== undefined) {
        expect(plan.days[x.extraFor].entries.some((y) => y.leftoverFrom === i && y.recipe === x.recipe)).toBe(true);
      }
    }),
  );
}

function withoutOut(plan: Plan): Plan {
  return { ...plan, days: plan.days.map((d) => ({ ...d, entries: d.entries.filter((e) => !e.out) })) };
}

describe('своє меню: вибір страви на прийом їжі', () => {
  it('у списку лише страви цього прийому; спершу ті, що підходять; поточна позначена', () => {
    const p = P();
    const plan = generatePlan(p, MONDAY, 3);
    for (const slot of daySchedule(p, plan.days[0].weekday).slots) {
      const opts = slotOptions(plan, 0, slot.key, p);
      expect(opts.length).toBeGreaterThan(0);
      expect(opts.every((o) => o.recipe.meals.includes(slot.type))).toBe(true);
      const firstOther = opts.findIndex((o) => !o.fits);
      if (firstOther >= 0) expect(opts.slice(firstOther).every((o) => !o.fits && o.notes.length > 0)).toBe(true);
      const cur = plan.days[0].entries.find((e) => e.slot === slot.key)!;
      expect(opts.filter((o) => o.current).map((o) => o.recipe.id)).toEqual([cur.recipe]);
    }
  });

  it('обмеження й обладнання враховані завжди, а складніші страви — з поясненням', () => {
    const p = P({ exclude: ['vegetarian'], maxLevel: 1 });
    const plan = generatePlan(p, MONDAY, 3);
    const opts = slotOptions(plan, 5, 'd', p); // субота, вечеря
    expect(opts.every((o) => allowedRecipe(o.recipe, { ...p, maxLevel: 3 }))).toBe(true);
    const harder = opts.filter((o) => o.recipe.level > 1);
    expect(harder.length).toBeGreaterThan(0);
    expect(harder.every((o) => !o.fits && o.notes.includes('level'))).toBe(true);
    expect(opts.filter((o) => o.fits).every((o) => allowedRecipe(o.recipe, p))).toBe(true);
  });

  it('обід на роботі без мікрохвильовки: підходять лише холодні страви з собою', () => {
    const p = P({ microwaveAtWork: false });
    const plan = generatePlan(p, MONDAY, 3);
    expect(daySchedule(p, plan.days[0].weekday).slots.find((s) => s.key === 'l')!.atWork).toBe(true);
    const opts = slotOptions(plan, 0, 'l', p);
    expect(opts.some((o) => o.notes.includes('portable'))).toBe(true);
    expect(opts.filter((o) => o.fits).every((o) => o.recipe.tags.includes('cold'))).toBe(true);
  });

  it('обрана страва стає в меню з порцією під калорії прийому; інші дні не змінюються', () => {
    const p = P();
    const plan = generatePlan(p, MONDAY, 3);
    const opt = slotOptions(plan, 1, 'b', p).find((o) => !o.current)!;
    const next = setEntry(plan, 1, 'b', { recipe: opt.recipe.id }, p);
    const e = next.days[1].entries.find((x) => x.slot === 'b')!;
    expect(e.recipe).toBe(opt.recipe.id);
    expect(e.mult).toBeGreaterThanOrEqual(0.5);
    expect(next.days[3]).toEqual(plan.days[3]);
    expect(plan.days[1].entries.find((x) => x.slot === 'b')!.recipe).not.toBe(opt.recipe.id); // оригінал не змінено
  });

  it('«те саме в інші дні»: лише такі самі прийоми (вдома або на роботі)', () => {
    const p = P();
    const plan = generatePlan(p, MONDAY, 1);
    const b = matchingDays(plan, 0, 'b', p);
    expect(b).toEqual(ALL); // сніданок — щодня вдома
    expect(matchingDays(plan, 0, 'l', p)).toEqual([0, 1, 2, 3, 4]); // обід на роботі — лише будні
    expect(matchingDays(plan, 6, 'l', p)).toEqual([5, 6]); // обід удома у вихідні
    const opt = slotOptions(plan, 0, 'b', p).find((o) => o.fits && !o.current)!;
    let next = plan;
    for (const i of b) next = setEntry(next, i, 'b', { recipe: opt.recipe.id }, p);
    expect(next.days.every((d) => d.entries.find((e) => e.slot === 'b')!.recipe === opt.recipe.id)).toBe(true);
  });
});

describe('обід у їдальні та «поза домом»', () => {
  it('профіль «обідаю в їдальні»: у робочі дні обід не готуємо, не беремо й не купуємо', () => {
    const p = P({ canteen: true });
    const plan = generatePlan(p, MONDAY, 5);
    const t = computeTargets(p);
    plan.days.forEach((d) => {
      const sched = daySchedule(p, d.weekday);
      const lunch = d.entries.find((e) => e.slot === 'l')!;
      if (sched.kind === 'day') {
        const share = sched.slots.find((s) => s.key === 'l')!.share;
        expect(lunch.out).toBeTruthy();
        expect(lunch.recipe).toBe('');
        expect(Math.abs(lunch.out!.kcal - t.kcal * share)).toBeLessThanOrEqual(5);
        expect(lunch.leftoverFrom).toBeUndefined();
      } else {
        expect(lunch.out).toBeUndefined();
      }
      expect(d.entries.length).toBe(sched.slots.length);
    });
    noDanglingLinks(plan);
    expect(buildShoppingList(plan, p, ALL)).toEqual(buildShoppingList(withoutOut(plan), p, ALL));
  });

  it('калорії дня враховують «поза домом» орієнтовно', () => {
    const p = P();
    const t = computeTargets(p);
    const plan = generatePlan(p, MONDAY, 5);
    const next = setEntry(plan, 5, 'd', { out: true }, p); // субота, вечеря в гостях
    const d = next.days[5].entries.find((e) => e.slot === 'd')!;
    expect(d.out).toBeTruthy();
    expect(d.recipe).toBe('');
    const n = dayTotals(next.days[5]);
    expect(n.kcal).toBeGreaterThan(t.kcal * 0.9);
    expect(n.kcal).toBeLessThan(t.kcal * 1.1);
    expect(n.protein).toBeGreaterThan(0);
  });

  it('вечеря із запасом → «поза домом» або прибрати: залишки на обід відв’язуються', () => {
    const p = P({ batch: true });
    const plan = generatePlan(p, MONDAY, 5);
    const i = plan.days.findIndex((d) => d.entries.some((e) => e.extraFor !== undefined));
    expect(i).toBeGreaterThanOrEqual(0);
    const dinner = plan.days[i].entries.find((e) => e.extraFor !== undefined)!;
    for (const choice of [{ out: true } as const, null]) {
      const next = setEntry(plan, i, dinner.slot, choice, p);
      noDanglingLinks(next);
      expect(next.days[dinner.extraFor!].entries.some((e) => e.leftoverFrom === i)).toBe(false);
      // обід наступного дня не лишився порожнім
      expect(next.days[dinner.extraFor!].entries.some((e) => e.slot === 'l')).toBe(true);
    }
    const removed = setEntry(plan, i, dinner.slot, null, p);
    expect(removed.days[i].entries.some((e) => e.slot === dinner.slot)).toBe(false);
    expect(emptySlots(removed, p)).toEqual([{ day: i, slot: dinner.slot }]);
  });

  it('збережене меню з «поза домом» не губиться після перезапуску', () => {
    const p = P({ canteen: true });
    const plan = generatePlan(p, MONDAY, 5);
    const loaded = sanitize(JSON.parse(JSON.stringify({ v: 1, profile: p, plan, checked: {}, shopDays: ALL })));
    expect(loaded?.plan).toEqual(plan);
    expect(loaded?.profile.canteen).toBe(true);
  });

  it('старі меню не стають «застарілими» через нове налаштування', () => {
    const p = P();
    const { canteen: _canteen, ...old } = p;
    void _canteen;
    expect(profileKey(old as Profile)).toBe(profileKey(p));
    expect(profileKey(P({ canteen: true }))).not.toBe(profileKey(p));
  });
});

describe('скласти меню самому', () => {
  it('порожнє меню: жодної страви, лише обід у їдальні з профілю', () => {
    const p = P({ canteen: true });
    const plan = generatePlan(p, MONDAY, 1, undefined, { empty: true });
    const entries = plan.days.flatMap((d) => d.entries);
    expect(entries.length).toBe(5); // обід у їдальні в 5 робочих днів
    expect(entries.every((e) => !!e.out)).toBe(true);
    const slots = plan.days.reduce((n, d) => n + daySchedule(p, d.weekday).slots.length, 0);
    expect(emptySlots(plan, p).length).toBe(slots - 5);
    expect(buildShoppingList(plan, p, ALL)).toEqual([]);
  });

  it('перша обрана страва не «роздувається» під усю добову норму', () => {
    const p = P();
    const empty = generatePlan(p, MONDAY, 1, undefined, { empty: true });
    const opt = slotOptions(empty, 0, 'b', p).find((o) => o.fits)!;
    const next = setEntry(empty, 0, 'b', { recipe: opt.recipe.id }, p);
    const e = next.days[0].entries[0];
    const share = daySchedule(p, next.days[0].weekday).slots.find((s) => s.key === 'b')!.share;
    expect(Math.abs(e.mult - opt.mult)).toBeLessThanOrEqual(0.25);
    expect(dayTotals(next.days[0]).kcal).toBeLessThan(computeTargets(p).kcal * share * 1.3);
  });

  it('«Заповнити решту» не чіпає обране і заповнює все інше в межах норми', () => {
    const p = P();
    const t = computeTargets(p);
    let plan = generatePlan(p, MONDAY, 1, undefined, { empty: true });
    const picks = [
      [0, 'b'],
      [2, 'd'],
      [5, 'l'],
    ] as const;
    for (const [i, slot] of picks) {
      const opt = slotOptions(plan, i, slot, p).find((o) => o.fits)!;
      plan = setEntry(plan, i, slot, { recipe: opt.recipe.id }, p);
    }
    plan = setEntry(plan, 3, 'l', { out: true }, p);
    const chosen = picks.map(([i, slot]) => plan.days[i].entries.find((e) => e.slot === slot)!.recipe);
    const full = fillEmpty(plan, p, 9);
    picks.forEach(([i, slot], k) => expect(full.days[i].entries.find((e) => e.slot === slot)!.recipe).toBe(chosen[k]));
    expect(full.days[3].entries.find((e) => e.slot === 'l')!.out).toBeTruthy();
    expect(emptySlots(full, p)).toEqual([]);
    full.days.forEach((d) => {
      expect(d.entries.length).toBe(daySchedule(p, d.weekday).slots.length);
      const kcal = dayTotals(d).kcal;
      expect(kcal).toBeGreaterThan(t.kcal * 0.9);
      expect(kcal).toBeLessThan(t.kcal * 1.1);
    });
    noDanglingLinks(full);
  });
});
