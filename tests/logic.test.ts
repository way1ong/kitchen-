import { describe, expect, it } from 'vitest';
import { amountText, plural, shoppingText } from '../src/logic/format';
import { getProduct } from '../src/data/products';
import { DEFAULT_PROFILE, type Profile } from '../src/logic/profile';
import { bmr, computeTargets } from '../src/logic/targets';
import { daySchedule } from '../src/logic/schedule';
import { allowedRecipe, alternatives, dayTotals, generatePlan, portable, swapEntry } from '../src/logic/planner';
import { buildShoppingList } from '../src/logic/shopping';
import { RECIPE_BY_ID } from '../src/data/recipes';
import { recipeAllergens, recipeAnimals } from '../src/logic/recipeNutrition';
import { hhmm } from '../src/logic/format';

const MONDAY = new Date(2026, 10, 23); // 23.11.2026 — понеділок
const P = (o: Partial<Profile> = {}): Profile => ({ ...DEFAULT_PROFILE, example: false, ...o });

describe('українські форми слів', () => {
  it('plural', () => {
    const f = ['яйце', 'яйця', 'яєць', 'яйця'] as const;
    expect(plural(1, f)).toBe('яйце');
    expect(plural(2, f)).toBe('яйця');
    expect(plural(5, f)).toBe('яєць');
    expect(plural(11, f)).toBe('яєць');
    expect(plural(21, f)).toBe('яйце');
    expect(plural(22, f)).toBe('яйця');
    expect(plural(1.5, f)).toBe('яйця');
  });
  it('кількості інгредієнтів', () => {
    expect(amountText(getProduct('egg'), 165)).toBe('3 яйця');
    expect(amountText(getProduct('onion'), 50)).toBe('½ цибулини');
    expect(amountText(getProduct('onion'), 150)).toBe('1½ цибулини');
    expect(amountText(getProduct('oil'), 13)).toBe('1 ст. л.');
    expect(amountText(getProduct('oil'), 4.5)).toBe('1 ч. л.');
    expect(amountText(getProduct('chicken-breast'), 187)).toBe('190 г');
    expect(amountText(getProduct('milk'), 200)).toBe('200 мл');
    expect(amountText(getProduct('salt'), 0)).toBe('за смаком');
    expect(amountText(getProduct('garlic'), 10)).toBe('2 зубчики');
  });
  it('кількості для покупок округлюються вгору', () => {
    expect(shoppingText(getProduct('egg'), 7 * 55).main).toBe('7 яєць');
    expect(shoppingText(getProduct('egg'), 7 * 55 + 20).main).toBe('8 яєць');
    expect(shoppingText(getProduct('chicken-breast'), 1210).main).toBe('1,3 кг');
    expect(shoppingText(getProduct('kefir'), 620).main).toBe('650 мл');
    expect(shoppingText(getProduct('garlic'), 60).main).toBe('2 голівки');
  });
});

describe('норма калорій (Міффлін — Сан Жеор)', () => {
  it('формула', () => {
    // чоловік 35 р., 180 см, 88 кг: 880 + 1125 − 175 + 5 = 1835
    expect(bmr('m', 88, 180, 35)).toBe(1835);
    expect(bmr('f', 60, 165, 30)).toBeCloseTo(600 + 1031.25 - 150 - 161);
  });
  it('напівдієта = −15 % від витрат, не нижче базового обміну', () => {
    const t = computeTargets(P());
    // PAL 1.2 (сидяча) + 0.1 (1–2 тренування) = 1.3 → 2385,5 × 0.85 ≈ 2030
    expect(t.pal).toBeCloseTo(1.3);
    expect(t.kcal).toBe(2030);
    expect(t.kcal).toBeGreaterThanOrEqual(t.bmr);
    expect(t.weeklyChange).toBeLessThan(0);
    expect(t.protein).toBeGreaterThanOrEqual(110);
    expect(t.protein * 4 + t.fat * 9 + t.carbs * 4).toBeCloseTo(t.kcal, -2);
  });
  it('фізична робота підвищує норму', () => {
    expect(computeTargets(P({ work: 'heavy' })).kcal).toBeGreaterThan(computeTargets(P({ work: 'desk' })).kcal + 500);
  });
  it('обмеження знизу для активного схуднення', () => {
    const t = computeTargets(P({ goal: 'lose-more', weight: 60, height: 165, age: 60, training: 0 }));
    expect(t.kcal).toBeGreaterThanOrEqual(1500);
  });
});

describe('розклад під графік роботи', () => {
  it('денна зміна 9–18: сніданок до виходу, обід на роботі, вечеря вдома', () => {
    const s = daySchedule(P(), 1);
    expect(s.kind).toBe('day');
    const b = s.slots.find((x) => x.key === 'b')!;
    const l = s.slots.find((x) => x.key === 'l')!;
    const d = s.slots.find((x) => x.key === 'd')!;
    expect(hhmm(b.time)).toBe('07:30');
    expect(b.atWork).toBe(false);
    expect(l.atWork).toBe(true);
    expect(d.atWork).toBe(false);
    expect(d.time).toBeGreaterThanOrEqual(18 * 60 + 40 + 30);
    expect(s.slots.reduce((a, x) => a + x.share, 0)).toBeCloseTo(1);
  });
  it('вихідний: усе вдома', () => {
    const s = daySchedule(P(), 6);
    expect(s.kind).toBe('off');
    expect(s.slots.every((x) => !x.atWork)).toBe(true);
  });
  it('нічна зміна 22–06: основна їжа перед зміною, легкий перекус на роботі', () => {
    const s = daySchedule(P({ workStart: '22:00', workEnd: '06:00', wake: '14:00', sleep: '08:00' }), 1);
    expect(s.kind).toBe('night');
    const main = s.slots.find((x) => x.label === 'mainBeforeShift')!;
    expect(main.time).toBeLessThan(22 * 60);
    const atWork = s.slots.filter((x) => x.atWork);
    expect(atWork.length).toBe(1);
    expect(atWork[0].light).toBe(true);
    // перекус на зміні не пізніше 01:00
    expect(atWork[0].time).toBeLessThanOrEqual(1440 + 60);
    expect(s.slots.reduce((a, x) => a + x.share, 0)).toBeCloseTo(1);
  });
  it('вечірня зміна 14–23: обід перед роботою, вечеря на роботі', () => {
    for (const meals of [3, 4, 5] as const) {
      const s = daySchedule(P({ workStart: '14:00', workEnd: '23:00', wake: '09:00', sleep: '01:00', meals }), 2);
      expect(s.kind).toBe('evening');
      expect(s.slots.find((x) => x.key === 'd')!.atWork).toBe(true);
      expect(s.slots.find((x) => x.key === 'l')!.atWork).toBe(false);
      expect(s.slots.reduce((a, x) => a + x.share, 0)).toBeCloseTo(1);
    }
  });
  it('3, 4, 5 прийомів', () => {
    for (const meals of [3, 4, 5] as const) {
      expect(daySchedule(P({ meals }), 1).slots).toHaveLength(meals);
    }
  });
});

describe('меню на тиждень', () => {
  it('детерміноване: однаковий seed — однакове меню', () => {
    const a = generatePlan(P(), MONDAY, 42);
    const b = generatePlan(P(), MONDAY, 42);
    expect(a.days).toEqual(b.days);
  });

  it('заповнює всі прийоми їжі і тримає калорії в межах ±10 %', () => {
    const p = P();
    const t = computeTargets(p);
    for (const seed of [1, 2, 3, 4, 5]) {
      const plan = generatePlan(p, MONDAY, seed);
      plan.days.forEach((d) => {
        expect(d.entries.length).toBe(daySchedule(p, d.weekday).slots.length);
        const kcal = dayTotals(d).kcal;
        expect(kcal).toBeGreaterThan(t.kcal * 0.9);
        expect(kcal).toBeLessThan(t.kcal * 1.1);
      });
    }
  });

  it('білок близько до норми (не менше 85 % і не більше 140 %)', () => {
    const p = P();
    const t = computeTargets(p);
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      generatePlan(p, MONDAY, seed).days.forEach((d) => {
        const pr = dayTotals(d).protein;
        expect(pr).toBeGreaterThan(t.protein * 0.85);
        expect(pr).toBeLessThan(t.protein * 1.4);
      });
    }
  });

  it('дотримується рівня, обладнання і того, що на роботі — з собою', () => {
    const p = P({ maxLevel: 1, equipment: ['microwave', 'airfryer', 'kettle'] });
    const plan = generatePlan(p, MONDAY, 7);
    plan.days.forEach((d) => {
      const sched = daySchedule(p, d.weekday);
      d.entries.forEach((e) => {
        const r = RECIPE_BY_ID[e.recipe];
        expect(r.level).toBe(1);
        expect(r.equipment.every((x) => p.equipment.includes(x))).toBe(true);
        const slot = sched.slots.find((s) => s.key === e.slot)!;
        if (slot.atWork) expect(portable(r, p)).toBe(true);
      });
    });
  });

  it('без мікрохвильовки на роботі — лише холодні страви з собою', () => {
    const p = P({ microwaveAtWork: false });
    const plan = generatePlan(p, MONDAY, 11);
    plan.days.forEach((d) => {
      const sched = daySchedule(p, d.weekday);
      d.entries.forEach((e) => {
        const slot = sched.slots.find((s) => s.key === e.slot)!;
        if (slot.atWork) expect(RECIPE_BY_ID[e.recipe].tags).toContain('cold');
      });
    });
  });

  it('обмеження: вегетаріанське і без молочного', () => {
    const p = P({ exclude: ['vegetarian'] });
    generatePlan(p, MONDAY, 3).days.forEach((d) =>
      d.entries.forEach((e) => expect(recipeAnimals(RECIPE_BY_ID[e.recipe]).size).toBe(0)),
    );
    const p2 = P({ exclude: ['no-dairy'] });
    generatePlan(p2, MONDAY, 3).days.forEach((d) =>
      d.entries.forEach((e) => expect(recipeAllergens(RECIPE_BY_ID[e.recipe]).has('dairy')).toBe(false)),
    );
  });

  it('риба хоча б 1–2 рази на тиждень (коли не виключена)', () => {
    let total = 0;
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const plan = generatePlan(P(), MONDAY, seed);
      const fish = plan.days.flatMap((d) => d.entries).filter((e) => {
        const r = RECIPE_BY_ID[e.recipe];
        return e.leftoverFrom === undefined && r.main === 'fish' && (r.meals.includes('lunch') || r.meals.includes('dinner'));
      });
      total += fish.length;
      expect(fish.length).toBeGreaterThanOrEqual(1);
    }
    expect(total / 6).toBeGreaterThanOrEqual(1.5);
  });

  it('вечеря із запасом стає обідом наступного робочого дня', () => {
    const plan = generatePlan(P({ batch: true }), MONDAY, 5);
    const links = plan.days.flatMap((d, i) => d.entries.filter((e) => e.extraFor !== undefined).map((e) => ({ i, e })));
    expect(links.length).toBeGreaterThan(0);
    for (const { i, e } of links) {
      const lunch = plan.days[e.extraFor!].entries.find((x) => x.leftoverFrom === i)!;
      expect(lunch.recipe).toBe(e.recipe);
    }
    const none = generatePlan(P({ batch: false }), MONDAY, 5);
    expect(none.days.flatMap((d) => d.entries).some((e) => e.extraFor !== undefined)).toBe(false);
  });

  it('нічна зміна: усі прийоми заповнені', () => {
    const p = P({ workStart: '22:00', workEnd: '06:00', wake: '14:00', sleep: '08:00', workDays: [1, 2, 3, 4] });
    const plan = generatePlan(p, MONDAY, 9);
    plan.days.forEach((d) => expect(d.entries.length).toBe(daySchedule(p, d.weekday).slots.length));
  });

  it('заміна страви і варіанти', () => {
    const p = P();
    const plan = generatePlan(p, MONDAY, 21);
    const e = plan.days[2].entries.find((x) => x.slot === 'd')!;
    const alts = alternatives(plan, 2, 'd', p);
    expect(alts.length).toBeGreaterThan(2);
    expect(alts.every((a) => a.recipe.id !== e.recipe && allowedRecipe(a.recipe, p))).toBe(true);
    const swapped = swapEntry(plan, 2, 'd', alts[0].recipe.id, p);
    expect(swapped.days[2].entries.find((x) => x.slot === 'd')!.recipe).toBe(alts[0].recipe.id);
    // залишки або оновились, або відв’язались — «висячих» посилань немає
    swapped.days.forEach((d, i) =>
      d.entries.forEach((x) => {
        if (x.leftoverFrom !== undefined) {
          const src = swapped.days[x.leftoverFrom].entries.find((y) => y.extraFor === i);
          expect(src?.recipe).toBe(x.recipe);
        }
      }),
    );
  });
});

describe('список покупок', () => {
  it('сумує інгредієнти і групує за відділами', () => {
    const p = P();
    const plan = generatePlan(p, MONDAY, 4);
    const items = buildShoppingList(plan, p, [0, 1, 2, 3, 4, 5, 6]);
    expect(items.length).toBeGreaterThan(15);
    const ids = new Set(items.map((i) => i.id));
    expect(ids.size).toBe(items.length);
    items.filter((i) => !i.pantry).forEach((i) => expect(i.amount).not.toBe(''));
    // частина тижня — менше продуктів
    const part = buildShoppingList(plan, p, [0, 1, 2]);
    expect(part.length).toBeLessThanOrEqual(items.length);
  });
  it('родина з 3 людей — більше продуктів на вечері', () => {
    const plan = generatePlan(P(), MONDAY, 4);
    const one = buildShoppingList(plan, P({ people: 1 }), [5]);
    const three = buildShoppingList(plan, P({ people: 3 }), [5]);
    const sum = (xs: typeof one) => xs.reduce((a, x) => a + x.grams, 0);
    expect(sum(three)).toBeGreaterThan(sum(one));
  });
});
