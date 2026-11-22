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
 *
 * Меню можна скласти й самому: почати з порожнього тижня, обрати страву
 * на будь-який прийом зі списку (або «їм у їдальні / поза домом»)
 * і заповнити решту автоматично.
 */

export interface PlanEntry {
  /** Ключ слота з розкладу (b, s1, l, s2, d, p) */
  slot: string;
  /** id рецепта; порожній рядок — їмо поза домом (див. out) */
  recipe: string;
  /** Ваша порція (у базових порціях рецепта) */
  mult: number;
  /** Це залишки вечері з дня з цим індексом */
  leftoverFrom?: number;
  /** Цю вечерю готуємо із запасом на обід дня з цим індексом */
  extraFor?: number;
  /**
   * Їмо поза домом (їдальня на роботі, кафе, у гостях): нічого не готуємо
   * й не купуємо, а на цей прийом залишаємо орієнтовні калорії.
   */
  out?: { kcal: number };
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
const round10 = (x: number) => Math.round(x / 10) * 10;

/** Ключ профілю — щоб помітити, що меню вже не відповідає профілю. */
export function profileKey(p: Profile): string {
  const { example: _example, canteen, ...rest } = p;
  void _example;
  // Нове поле враховуємо лише коли воно увімкнене — старі меню не стають «застарілими»
  return JSON.stringify(canteen ? { ...rest, canteen } : rest);
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

/** Обід у їдальні на роботі (налаштування профілю): у денну зміну цей прийом не готуємо. */
export function canteenSlot(p: Profile, sched: DaySchedule, slot: Slot): boolean {
  return !!p.canteen && sched.kind === 'day' && slot.type === 'lunch' && slot.atWork;
}

// ── Калорії записів ─────────────────────────────────────────────────

/**
 * Орієнтовний склад прийому поза домом, якщо обирати за правилом тарілки:
 * половина — овочі або суп, чверть — м’ясо, риба чи яйця, чверть — гарнір.
 */
export function outNutrition(kcal: number): Nutrition {
  return {
    kcal,
    protein: (kcal * 0.2) / 4,
    fat: (kcal * 0.33) / 9,
    carbs: (kcal * 0.47) / 4,
    fiber: kcal / 100,
    fv: 150,
  };
}

/** Калорії й БЖВ запису меню (null — рецепт не знайдено). */
export function entryNutrition(e: PlanEntry): Nutrition | null {
  if (e.out) return outNutrition(e.out.kcal);
  const r = RECIPE_BY_ID[e.recipe];
  return r ? portion(r, e.mult) : null;
}

function outEntry(slot: string, kcal: number): PlanEntry {
  return { slot, recipe: '', mult: 0, out: { kcal: round10(kcal) } };
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

/** Стан різноманітності з усього меню, крім одного прийому. */
function stateExcept(plan: Plan, p: Profile, dayIndex: number, slotKey: string): PlanState {
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
  return st;
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
    const n = entryNutrition(e);
    if (!n) continue;
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

export interface PlanOptions {
  /** Порожнє меню: страви обираєте самі (обід у їдальні з профілю вже на місці). */
  empty?: boolean;
}

export function generatePlan(
  p: Profile,
  start: Date,
  seed: number,
  recipes: Recipe[] = RECIPES,
  opts: PlanOptions = {},
): Plan {
  const t = computeTargets(p);
  const days: PlanDay[] = [];
  const scheds: DaySchedule[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const wd = weekday(date);
    scheds.push(daySchedule(p, wd));
    days.push({ date: isoDate(date), weekday: wd, entries: [] });
  }

  if (opts.empty) {
    days.forEach((d, i) =>
      scheds[i].slots.forEach((s) => {
        if (canteenSlot(p, scheds[i], s)) d.entries.push(outEntry(s.key, t.kcal * s.share));
      }),
    );
  } else {
    fillSlots(days, scheds, p, t, recipes.filter((r) => allowedRecipe(r, p)), mulberry32(seed), newState());
  }
  finishDays(days, scheds, t);

  return {
    id: `${isoDate(start)}-${seed}`,
    created: Date.now(),
    weekStart: isoDate(start),
    seed,
    profileKey: profileKey(p),
    days,
  };
}

/** Заповнює порожні прийоми їжі; те, що вже є (обране вами), лишається. */
function fillSlots(
  days: PlanDay[],
  scheds: DaySchedule[],
  p: Profile,
  t: Targets,
  pool: Recipe[],
  rng: () => number,
  st: PlanState,
) {
  for (let i = 0; i < days.length; i++) {
    const sched = scheds[i];
    const workday = sched.kind !== 'off';
    for (const slot of sched.slots) {
      if (days[i].entries.some((e) => e.slot === slot.key)) continue; // уже обрано або є залишки
      const slotKcal = t.kcal * slot.share;
      if (canteenSlot(p, sched, slot)) {
        days[i].entries.push(outEntry(slot.key, slotKcal));
        continue;
      }

      // Чи варто готувати цю вечерю із запасом на завтрашній обід?
      const nextLunch = i < days.length - 1 ? lunchSlotForLeftovers(p, scheds[i + 1]) : null;
      const nextFree = !!nextLunch && !days[i + 1].entries.some((e) => e.slot === nextLunch.key);
      const wantBatch = p.batch && slot.type === 'dinner' && nextFree && !slot.atWork;

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
}

/** Порядок записів = порядок слотів; добове коригування калорій. */
function finishDays(days: PlanDay[], scheds: DaySchedule[], t: Targets) {
  for (let i = 0; i < days.length; i++) {
    sortEntries(days[i], scheds[i]);
    balanceDay(days[i], filledTarget(days[i], scheds[i], t.kcal));
  }
}

function sortEntries(day: PlanDay, sched: DaySchedule) {
  const order = sched.slots.map((s) => s.key);
  day.entries.sort((a, b) => order.indexOf(a.slot) - order.indexOf(b.slot));
}

/**
 * Норма калорій для вже заповнених прийомів дня. Поки день заповнений
 * не повністю, порції не «роздуваємо» під усю добову норму.
 */
function filledTarget(day: PlanDay, sched: DaySchedule, kcal: number): number {
  const keys = new Set(day.entries.map((e) => e.slot));
  if (sched.slots.every((s) => keys.has(s.key))) return kcal;
  const total = sched.slots.reduce((sum, s) => sum + s.share, 0) || 1;
  const filled = sched.slots.reduce((sum, s) => sum + (keys.has(s.key) ? s.share : 0), 0);
  return (kcal * filled) / total;
}

function lunchSlotForLeftovers(p: Profile, s: DaySchedule): Slot | null {
  if (s.kind === 'off') return null;
  const lunch = s.slots.find((x) => x.type === 'lunch');
  // Залишки мають сенс, коли обід на роботі або в робочий день вдома (часу мало);
  // якщо обідаєте в їдальні — брати нічого не треба
  if (!lunch || canteenSlot(p, s, lunch)) return null;
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
      .filter((e) => e.leftoverFrom === undefined && !e.out)
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
    const x = entryNutrition(e);
    if (x) n = addN(n, x);
  }
  return n;
}

// ── Вибір і заміна страви ───────────────────────────────────────────

export interface Alternative {
  recipe: Recipe;
  mult: number;
  kcal: number;
  protein: number;
}

function scoreCtx(plan: Plan, dayIndex: number, slot: Slot, sched: DaySchedule, p: Profile, t: Targets): ScoreCtx {
  return {
    p,
    slot,
    slotKcal: t.kcal * slot.share,
    dayIndex,
    workday: sched.kind !== 'off',
    wantBatch: false,
    needDensity: proteinNeed(plan.days[dayIndex], t, slot.key),
  };
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
  const st = stateExcept(plan, p, dayIndex, slotKey);
  const ctx = scoreCtx(plan, dayIndex, slot, sched, p, t);
  return RECIPES.filter((r) => r.id !== current?.recipe && allowedRecipe(r, p) && fitsSlot(r, p, sched, slot))
    .map((r) => ({ r, s: score(r, ctx, st, 0.5) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ r }) => {
      const mult = portionFor(r, ctx.slotKcal);
      const n = portion(r, mult);
      return { recipe: r, mult, kcal: n.kcal, protein: n.protein };
    });
}

/** Чому страва не зовсім підходить: складніша за ваш рівень, довша за ваш час, не взяти з собою. */
export type OptionNote = 'level' | 'time' | 'portable';

export interface SlotOption extends Alternative {
  /** Підходить за рівнем, часом і (на роботі) — можна взяти з собою */
  fits: boolean;
  notes: OptionNote[];
  /** Ця страва вже стоїть на цьому прийомі */
  current: boolean;
}

/**
 * Усі страви, які можна обрати на прийом їжі: спершу ті, що підходять
 * найкраще (за калоріями, білком, різноманітністю і вашим часом), далі —
 * інші страви цього типу з поясненням, чим вони не підходять.
 * Обмеження (вегетаріанство, алергени, «не їм») і обладнання — завжди враховані.
 */
export function slotOptions(plan: Plan, dayIndex: number, slotKey: string, p: Profile): SlotOption[] {
  const day = plan.days[dayIndex];
  if (!day) return [];
  const t = computeTargets(p);
  const sched = daySchedule(p, day.weekday);
  const slot = sched.slots.find((s) => s.key === slotKey);
  if (!slot) return [];
  const current = day.entries.find((e) => e.slot === slotKey);
  const st = stateExcept(plan, p, dayIndex, slotKey);
  const ctx = scoreCtx(plan, dayIndex, slot, sched, p, t);
  const anyLevel: Profile = { ...p, maxLevel: 3 };
  return RECIPES.filter((r) => r.meals.includes(slot.type) && allowedRecipe(r, anyLevel))
    .map((r) => {
      const notes: OptionNote[] = [];
      if (r.level > p.maxLevel) notes.push('level');
      if (slot.atWork && !portable(r, p)) notes.push('portable');
      else if (!fitsSlot(r, p, sched, slot)) notes.push('time');
      const mult = portionFor(r, ctx.slotKcal);
      const n = portion(r, mult);
      return {
        recipe: r,
        mult,
        kcal: n.kcal,
        protein: n.protein,
        fits: notes.length === 0,
        notes,
        current: !!current && !current.out && current.recipe === r.id,
        s: score(r, ctx, st, 0.5),
      };
    })
    .sort((a, b) => Number(b.fits) - Number(a.fits) || b.s - a.s)
    .map(({ s: _s, ...o }) => o);
}

/**
 * Дні тижня з таким самим прийомом їжі, як у цьому дні: той самий слот і тип,
 * і так само вдома або на роботі (сам день — теж у списку).
 */
export function matchingDays(plan: Plan, dayIndex: number, slotKey: string, p: Profile): number[] {
  const day = plan.days[dayIndex];
  if (!day) return [];
  const base = daySchedule(p, day.weekday).slots.find((s) => s.key === slotKey);
  if (!base) return [];
  return plan.days.flatMap((d, i) => {
    const s = daySchedule(p, d.weekday).slots.find((x) => x.key === slotKey);
    return s && s.type === base.type && s.atWork === base.atWork ? [i] : [];
  });
}

/** Вибір на прийом їжі: рецепт, «їм поза домом» або прибрати з меню (null). */
export type MealChoice = { recipe: string } | { out: true } | null;

/** Ставить страву (або «поза домом») на прийом їжі; акуратно розв’язує зв’язок «вечеря → залишки на обід». */
export function setEntry(plan: Plan, dayIndex: number, slotKey: string, choice: MealChoice, p: Profile): Plan {
  const next: Plan = structuredCloneSafe(plan);
  const t = computeTargets(p);
  const day = next.days[dayIndex];
  if (!day) return plan;
  const sched = daySchedule(p, day.weekday);
  const slot = sched.slots.find((s) => s.key === slotKey);
  if (!slot) return plan;
  const r = choice && 'recipe' in choice ? RECIPE_BY_ID[choice.recipe] : undefined;
  if (choice && 'recipe' in choice && !r) return plan;

  let entry = day.entries.find((e) => e.slot === slotKey);
  if (!entry) {
    if (!choice) return plan;
    entry = { slot: slotKey, recipe: '', mult: 0 };
    day.entries.push(entry);
    sortEntries(day, sched);
  }

  // Якщо це були залишки — відв’язуємо від вечері
  if (entry.leftoverFrom !== undefined) {
    const src = next.days[entry.leftoverFrom]?.entries.find((e) => e.extraFor === dayIndex);
    if (src) delete src.extraFor;
    delete entry.leftoverFrom;
  }

  const slotKcal = t.kcal * slot.share;
  if (!choice) {
    day.entries.splice(day.entries.indexOf(entry), 1);
  } else if (r) {
    delete entry.out;
    entry.recipe = r.id;
    entry.mult = portionFor(r, slotKcal);
  } else {
    entry.recipe = '';
    entry.mult = 0;
    entry.out = { kcal: round10(slotKcal) };
  }

  // Якщо це вечеря із запасом — оновлюємо залишки або відв’язуємо їх
  if (entry.extraFor !== undefined) relinkLeftovers(next, dayIndex, entry, r, p, t);
  balanceDay(day, filledTarget(day, sched, t.kcal));
  return next;
}

/** Замінює страву (див. setEntry). */
export function swapEntry(plan: Plan, dayIndex: number, slotKey: string, recipeId: string, p: Profile): Plan {
  return setEntry(plan, dayIndex, slotKey, { recipe: recipeId }, p);
}

function relinkLeftovers(next: Plan, dayIndex: number, dinner: PlanEntry, r: Recipe | undefined, p: Profile, t: Targets) {
  const lunchIndex = dinner.extraFor!;
  const lunchDay = next.days[lunchIndex];
  const lunch = lunchDay?.entries.find((e) => e.leftoverFrom === dayIndex);
  const lunchSched = lunchDay ? daySchedule(p, lunchDay.weekday) : undefined;
  const lunchSlot = lunch && lunchSched?.slots.find((s) => s.key === lunch.slot);
  if (!lunchDay || !lunch || !lunchSched || !lunchSlot) {
    delete dinner.extraFor;
    return;
  }
  const ok =
    !!r &&
    r.tags.includes('batch') &&
    (r.fridgeDays ?? 0) >= 2 &&
    fitsSlot(r, p, lunchSched, lunchSlot, true) &&
    (!lunchSlot.atWork || portable(r, p));
  if (ok && r) {
    lunch.recipe = r.id;
    lunch.mult = portionFor(r, t.kcal * lunchSlot.share);
  } else {
    delete lunch.leftoverFrom;
    delete dinner.extraFor;
    const alt = alternatives(next, lunchIndex, lunch.slot, p, 1)[0];
    if (alt) {
      lunch.recipe = alt.recipe.id;
      lunch.mult = alt.mult;
    }
  }
  balanceDay(lunchDay, filledTarget(lunchDay, lunchSched, t.kcal));
}

/** Порожні прийоми їжі, які можна заповнити автоматично. */
export function emptySlots(plan: Plan, p: Profile): { day: number; slot: string }[] {
  const pool = RECIPES.filter((r) => allowedRecipe(r, p));
  const res: { day: number; slot: string }[] = [];
  plan.days.forEach((d, i) => {
    const sched = daySchedule(p, d.weekday);
    for (const s of sched.slots) {
      if (d.entries.some((e) => e.slot === s.key)) continue;
      if (canteenSlot(p, sched, s) || pool.some((r) => fitsSlot(r, p, sched, s))) res.push({ day: i, slot: s.key });
    }
  });
  return res;
}

/** Заповнює порожні прийоми автоматично. Обране вами лишається (порції можуть підлаштуватися). */
export function fillEmpty(plan: Plan, p: Profile, seed: number): Plan {
  const next: Plan = structuredCloneSafe(plan);
  const t = computeTargets(p);
  const scheds = next.days.map((d) => daySchedule(p, d.weekday));
  const st = newState();
  next.days.forEach((d, i) =>
    d.entries.forEach((e) => {
      const r = RECIPE_BY_ID[e.recipe];
      const s = scheds[i].slots.find((x) => x.key === e.slot);
      if (r && s) remember(st, r, i, s);
    }),
  );
  fillSlots(next.days, scheds, p, t, RECIPES.filter((r) => allowedRecipe(r, p)), mulberry32(seed), st);
  finishDays(next.days, scheds, t);
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
