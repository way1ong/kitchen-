import type { Nutrition, Recipe } from '../data/types';
import { RECIPES, RECIPE_BY_ID } from '../data/recipes';
import type { Profile } from './profile';
import { computeTargets, type Targets } from './targets';
import { daySchedule, type DaySchedule, type Slot } from './schedule';
import { addN, perServing, portion, recipeAllergens, recipeAnimals, ZERO } from './recipeNutrition';
import { mulberry32 } from './rng';
import { addDays, isoDate, parseIso, weekday } from './dates';

/**
 * Генератор меню на тиждень.
 * Для кожного прийому їжі обирає рецепт, що підходить за рівнем,
 * обладнанням, часом, обмеженнями і тим, чи ви на роботі; підганяє
 * порцію під калорії прийому; стежить за різноманітністю, рибою
 * 2 рази на тиждень і (за бажанням) готує вечерю із запасом на обід.
 */

export interface PlanEntry {
  /** Ключ слота з розкладу (b, s1, l, s2, d, p) */
  slot: string;
  recipe: string;
  /** Ваша порція (у базових порціях рецепта) */
  mult: number;
  /** Це залишки вечері з дня з цим індексом */
  leftoverFrom?: number;
  /** Цю вечерю готуємо із запасом на обід дня з цим індексом */
  extraFor?: number;
}

export interface PlanDay {
  date: string;
  weekday: number;
  entries: PlanEntry[];
}

export interface Plan {
  id: string;
  created: number;
  weekStart: string;
  seed: number;
  profileKey: string;
  days: PlanDay[];
}

const MIN_MULT = 0.5;
const MAX_MULT = 3;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const q = (x: number) => Math.round(x * 4) / 4;

/** Ключ профілю — щоб помітити, що меню вже не відповідає профілю. */
export function profileKey(p: Profile): string {
  const { example: _example, ...rest } = p;
  void _example;
  return JSON.stringify(rest);
}

// ── Фільтри ─────────────────────────────────────────────────────────

export function allowedRecipe(r: Recipe, p: Profile): boolean {
  if (r.level > p.maxLevel) return false;
  if (!r.equipment.every((e) => p.equipment.includes(e))) return false;
  const animals = recipeAnimals(r);
  const allergens = recipeAllergens(r);
  for (const ex of p.exclude) {
    if (ex === 'vegetarian' && animals.size > 0) return false;
    if (ex === 'no-fish' && animals.has('fish')) return false;
    if (ex === 'no-pork' && animals.has('pork')) return false;
    if (ex === 'no-beef' && animals.has('beef')) return false;
    if (ex === 'no-dairy' && allergens.has('dairy')) return false;
    if (ex === 'no-egg' && allergens.has('egg')) return false;
    if (ex === 'no-gluten' && allergens.has('gluten')) return false;
    if (ex === 'no-nuts' && (allergens.has('nuts') || allergens.has('peanut'))) return false;
  }
  if (p.dislikes.length && r.ingredients.some((i) => !i.opt && p.dislikes.includes(i.p))) return false;
  return true;
}

/** Можна взяти з собою: контейнер, розігріти або холодне; без риби в офісній мікрохвильовці. */
export function portable(r: Recipe, p: Profile): boolean {
  if (!r.tags.includes('lunchbox')) return false;
  const cold = r.tags.includes('cold');
  if (!p.microwaveAtWork && !cold) return false;
  if (r.main === 'fish' && !cold) return false;
  return true;
}

/** «Ефективний» час: пасивне очікування (духовка, варіння) рахуємо на 40 %. */
export function effortMinutes(r: Recipe): number {
  return r.activeMin + 0.4 * (r.totalMin - r.activeMin);
}

export function fitsSlot(r: Recipe, p: Profile, sched: DaySchedule, slot: Slot, leftover = false): boolean {
  if (!r.meals.includes(slot.type)) return false;
  const workday = sched.kind !== 'off';
  if (slot.atWork) {
    if (!portable(r, p)) return false;
    // На роботі не готують: страву збирають зранку/з вечора
    if (!leftover && r.activeMin > 15 && !r.tags.includes('prep-ahead') && !r.tags.includes('no-cook')) return false;
  }
  if (leftover) return true;
  if (slot.type === 'snack') return r.totalMin <= 15;
  if (slot.type === 'breakfast') {
    if (workday) return r.totalMin <= 15 || r.tags.includes('prep-ahead');
    return effortMinutes(r) <= Math.max(25, p.cookWeekend / 2);
  }
  const limit = workday ? p.cookWeekday : p.cookWeekend;
  return effortMinutes(r) <= limit;
}

// ── Оцінювання ──────────────────────────────────────────────────────

interface PlanState {
  useCount: Map<string, number>;
  lastDay: Map<string, number>;
  lastMain: string | null;
  fishCount: number;
}

function newState(): PlanState {
  return { useCount: new Map(), lastDay: new Map(), lastMain: null, fishCount: 0 };
}

export function portionFor(r: Recipe, kcal: number): number {
  const per = perServing(r).kcal;
  return clamp(q(kcal / per), MIN_MULT, MAX_MULT);
}

interface ScoreCtx {
  p: Profile;
  slot: Slot;
  slotKcal: number;
  dayIndex: number;
  workday: boolean;
  wantBatch: boolean;
  /** Скільки грамів білка на 1 ккал ще потрібно до кінця дня */
  needDensity: number;
}

/** Потрібна «щільність» білка на решту дня (г/ккал). */
function proteinNeed(day: PlanDay, t: Targets, skipSlot?: string): number {
  let kcal = 0;
  let protein = 0;
  for (const e of day.entries) {
    if (e.slot === skipSlot) continue;
    const r = RECIPE_BY_ID[e.recipe];
    if (!r) continue;
    const n = portion(r, e.mult);
    kcal += n.kcal;
    protein += n.protein;
  }
  return Math.max(0, t.protein - protein) / Math.max(250, t.kcal - kcal);
}

function score(r: Recipe, c: ScoreCtx, st: PlanState, jitter: number): number {
  const n = perServing(r);
  const ideal = c.slotKcal / n.kcal;
  const mult = clamp(q(ideal), MIN_MULT, MAX_MULT);
  let s = 0;
  s -= Math.abs(Math.log(ideal / mult)) * 60; // порція не досягає потрібних калорій
  // Білок: тягнемося до добової норми — нестача гірша за невеликий надлишок
  const density = n.protein / n.kcal;
  const gap = density - c.needDensity;
  s -= gap < 0 ? -gap * 450 : gap * 160;
  s += Math.min(n.fv / 50, 6); // овочі
  const routine = c.slot.type === 'breakfast' || c.slot.type === 'snack';
  const uses = st.useCount.get(r.id) ?? 0;
  s -= uses * (routine ? 12 : 30);
  const last = st.lastDay.get(r.id);
  if (last !== undefined && c.dayIndex - last <= 1) s -= routine ? 25 : 70;
  const main = c.slot.type === 'lunch' || c.slot.type === 'dinner';
  if (main && st.lastMain === r.main) s -= 15;
  if (main && r.main === 'fish' && st.fishCount < 2) s += 30;
  if (c.workday) s += r.level === 1 ? 10 : r.level === 2 ? 2 : -25;
  else if (r.level === c.p.maxLevel) s += 12;
  if (c.slot.light && n.kcal > c.slotKcal * 1.2) s -= 10;
  if (c.wantBatch && r.tags.includes('batch') && portable(r, c.p) && (r.fridgeDays ?? 0) >= 2) s += 30;
  return s + jitter * 22;
}

// ── Генерація ───────────────────────────────────────────────────────

export function generatePlan(
  p: Profile,
  start: Date,
  seed: number,
  recipes: Recipe[] = RECIPES,
): Plan {
  const rng = mulberry32(seed);
  const t = computeTargets(p);
  const pool = recipes.filter((r) => allowedRecipe(r, p));
  const st = newState();
  const days: PlanDay[] = [];
  const scheds: DaySchedule[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const wd = weekday(date);
    scheds.push(daySchedule(p, wd));
    days.push({ date: isoDate(date), weekday: wd, entries: [] });
  }

  for (let i = 0; i < 7; i++) {
    const sched = scheds[i];
    const workday = sched.kind !== 'off';
    for (const slot of sched.slots) {
      if (days[i].entries.some((e) => e.slot === slot.key)) continue; // вже є залишки
      const slotKcal = t.kcal * slot.share;

      // Чи варто готувати цю вечерю із запасом на завтрашній обід?
      const nextLunch = i < 6 ? lunchSlotForLeftovers(scheds[i + 1]) : null;
      const wantBatch = p.batch && slot.type === 'dinner' && !!nextLunch && !slot.atWork;

      const ctx: ScoreCtx = { p, slot, slotKcal, dayIndex: i, workday, wantBatch, needDensity: proteinNeed(days[i], t) };
      const candidates = pool.filter((r) => fitsSlot(r, p, sched, slot));
      if (!candidates.length) continue;
      let best = candidates[0];
      let bestScore = -Infinity;
      for (const r of candidates) {
        const sc = score(r, ctx, st, rng());
        if (sc > bestScore) {
          bestScore = sc;
          best = r;
        }
      }

      const entry: PlanEntry = { slot: slot.key, recipe: best.id, mult: portionFor(best, slotKcal) };
      days[i].entries.push(entry);
      remember(st, best, i, slot);

      if (
        wantBatch &&
        nextLunch &&
        best.tags.includes('batch') &&
        (best.fridgeDays ?? 0) >= 2 &&
        fitsSlot(best, p, scheds[i + 1], nextLunch, true) &&
        (!nextLunch.atWork || portable(best, p))
      ) {
        entry.extraFor = i + 1;
        days[i + 1].entries.push({
          slot: nextLunch.key,
          recipe: best.id,
          mult: portionFor(best, t.kcal * nextLunch.share),
          leftoverFrom: i,
        });
        st.useCount.set(best.id, (st.useCount.get(best.id) ?? 0) + 0.5);
      }
    }
  }

  // Порядок записів = порядок слотів; добове коригування калорій
  for (let i = 0; i < 7; i++) {
    const order = scheds[i].slots.map((s) => s.key);
    days[i].entries.sort((a, b) => order.indexOf(a.slot) - order.indexOf(b.slot));
    balanceDay(days[i], t.kcal);
  }

  return {
    id: `${isoDate(start)}-${seed}`,
    created: Date.now(),
    weekStart: isoDate(start),
    seed,
    profileKey: profileKey(p),
    days,
  };
}

function lunchSlotForLeftovers(s: DaySchedule): Slot | null {
  if (s.kind === 'off') return null;
  const lunch = s.slots.find((x) => x.type === 'lunch');
  if (!lunch) return null;
  // Залишки мають сенс, коли обід на роботі або в робочий день вдома (часу мало)
  return lunch;
}

function remember(st: PlanState, r: Recipe, dayIndex: number, slot: Slot) {
  st.useCount.set(r.id, (st.useCount.get(r.id) ?? 0) + 1);
  st.lastDay.set(r.id, dayIndex);
  if (slot.type === 'lunch' || slot.type === 'dinner') {
    st.lastMain = r.main;
    if (r.main === 'fish') st.fishCount++;
  }
}

/** Підганяє порції головних страв, щоб день був у межах ±5 % від норми. */
export function balanceDay(day: PlanDay, kcalTarget: number) {
  for (let pass = 0; pass < 3; pass++) {
    const total = dayTotals(day).kcal;
    const diff = kcalTarget - total;
    if (Math.abs(diff) <= kcalTarget * 0.05) return;
    const adjustable = day.entries
      .filter((e) => e.leftoverFrom === undefined)
      .map((e) => ({ e, r: RECIPE_BY_ID[e.recipe] }))
      .filter((x) => x.r && !x.r.meals.every((m) => m === 'snack'))
      .sort((a, b) => portion(b.r, b.e.mult).kcal - portion(a.r, a.e.mult).kcal);
    let changed = false;
    for (const { e, r } of adjustable) {
      const now = dayTotals(day).kcal;
      const d = kcalTarget - now;
      if (Math.abs(d) <= kcalTarget * 0.05) return;
      const next = clamp(q(e.mult + d / perServing(r).kcal), MIN_MULT, MAX_MULT);
      if (next !== e.mult) {
        e.mult = next;
        changed = true;
      }
    }
    if (!changed) return;
  }
}

export function dayTotals(day: PlanDay): Nutrition {
  let n = { ...ZERO };
  for (const e of day.entries) {
    const r = RECIPE_BY_ID[e.recipe];
    if (r) n = addN(n, portion(r, e.mult));
  }
  return n;
}

// ── Заміна страви ───────────────────────────────────────────────────

export interface Alternative {
  recipe: Recipe;
  mult: number;
  kcal: number;
  protein: number;
}

/** Варіанти заміни для прийому їжі (найкращі зверху). */
export function alternatives(
  plan: Plan,
  dayIndex: number,
  slotKey: string,
  p: Profile,
  limit = 8,
): Alternative[] {
  const t = computeTargets(p);
  const sched = daySchedule(p, plan.days[dayIndex].weekday);
  const slot = sched.slots.find((s) => s.key === slotKey);
  if (!slot) return [];
  const current = plan.days[dayIndex].entries.find((e) => e.slot === slotKey);
  const st = newState();
  plan.days.forEach((d, i) => {
    const slots = daySchedule(p, d.weekday).slots;
    d.entries.forEach((e) => {
      if (i === dayIndex && e.slot === slotKey) return;
      const r = RECIPE_BY_ID[e.recipe];
      const s = slots.find((x) => x.key === e.slot);
      if (r && s) remember(st, r, i, s);
    });
  });
  const slotKcal = t.kcal * slot.share;
  const ctx: ScoreCtx = {
    p,
    slot,
    slotKcal,
    dayIndex,
    workday: sched.kind !== 'off',
    wantBatch: false,
    needDensity: proteinNeed(plan.days[dayIndex], t, slotKey),
  };
  return RECIPES.filter((r) => r.id !== current?.recipe && allowedRecipe(r, p) && fitsSlot(r, p, sched, slot))
    .map((r) => ({ r, s: score(r, ctx, st, 0.5) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ r }) => {
      const mult = portionFor(r, slotKcal);
      const n = portion(r, mult);
      return { recipe: r, mult, kcal: n.kcal, protein: n.protein };
    });
}

/** Замінює страву; акуратно розв’язує зв’язок «вечеря → залишки на обід». */
export function swapEntry(plan: Plan, dayIndex: number, slotKey: string, recipeId: string, p: Profile): Plan {
  const next: Plan = structuredCloneSafe(plan);
  const t = computeTargets(p);
  const day = next.days[dayIndex];
  const sched = daySchedule(p, day.weekday);
  const slot = sched.slots.find((s) => s.key === slotKey);
  const entry = day.entries.find((e) => e.slot === slotKey);
  const r = RECIPE_BY_ID[recipeId];
  if (!slot || !entry || !r) return plan;

  // Якщо це були залишки — відв’язуємо від вечері
  if (entry.leftoverFrom !== undefined) {
    const src = next.days[entry.leftoverFrom]?.entries.find((e) => e.extraFor === dayIndex);
    if (src) delete src.extraFor;
    delete entry.leftoverFrom;
  }
  entry.recipe = recipeId;
  entry.mult = portionFor(r, t.kcal * slot.share);

  // Якщо це вечеря із запасом — оновлюємо залишки або відв’язуємо їх
  if (entry.extraFor !== undefined) {
    const lunchDay = next.days[entry.extraFor];
    const lunchSched = daySchedule(p, lunchDay.weekday);
    const lunch = lunchDay.entries.find((e) => e.leftoverFrom === dayIndex);
    const lunchSlot = lunch && lunchSched.slots.find((s) => s.key === lunch.slot);
    if (lunch && lunchSlot) {
      const ok =
        r.tags.includes('batch') &&
        (r.fridgeDays ?? 0) >= 2 &&
        fitsSlot(r, p, lunchSched, lunchSlot, true) &&
        (!lunchSlot.atWork || portable(r, p));
      if (ok) {
        lunch.recipe = recipeId;
        lunch.mult = portionFor(r, t.kcal * lunchSlot.share);
      } else {
        delete lunch.leftoverFrom;
        delete entry.extraFor;
        const alt = alternatives(next, next.days.indexOf(lunchDay), lunch.slot, p, 1)[0];
        if (alt) {
          lunch.recipe = alt.recipe.id;
          lunch.mult = alt.mult;
        }
      }
    }
  }
  balanceDay(day, t.kcal);
  return next;
}

function structuredCloneSafe<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

/** Індекс сьогоднішнього дня в меню або -1. */
export function todayIndex(plan: Plan, now = new Date()): number {
  const start = parseIso(plan.weekStart);
  const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - start.getTime()) / 86400000);
  return diff >= 0 && diff < 7 ? diff : -1;
}

export type { Targets };
