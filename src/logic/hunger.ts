import type { Recipe } from '../data/types';
import { RECIPES } from '../data/recipes';
import { weekday } from './dates';
import { allowedRecipe } from './planner';
import type { Profile } from './profile';
import { perServing, portion } from './recipeNutrition';
import { daySchedule } from './schedule';
import { T } from '../i18n/strings';

/**
 * «Зголоднів — що з’їсти зараз».
 *
 * Час рахуємо не від фіксованої години («не їсти після 18:00»), а від
 * ВАШОГО запланованого сну — так порада працює і для змінної роботи.
 * Дослідження: велика їжа менш ніж за 3 год до сну підвищує ризик печії
 * (рефлюксу), пізня їжа посилює голод і змінює гормони апетиту; але сама по собі
 * година прийому їжі важить менше, ніж загальні калорії за день.
 */

export type HungerZone = 'day' | 'evening' | 'late' | 'bedtime' | 'night-shift';

export interface HungerInfo {
  zone: HungerZone;
  /** Хвилини від півночі логічного дня (після півночі може бути > 1440) */
  now: number;
  /** Хвилин до запланованого сну (від’ємне — уже пізніше) */
  toSleep: number;
  /** Час сну, хвилини від півночі логічного дня */
  sleepAt: number;
  title: string;
  advice: string;
  avoid: string[];
  /** Рекомендований розмір перекусу, ккал */
  targetKcal: number;
}

export interface SnackSuggestion {
  recipe: Recipe;
  mult: number;
  kcal: number;
  protein: number;
}

/** Рекомендований розмір перекусу, ккал */
const ZONE_KCAL: Record<HungerZone, number> = { day: 200, evening: 170, late: 120, bedtime: 100, 'night-shift': 150 };

export function hungerInfo(p: Profile, date: Date): HungerInfo {
  let wd = weekday(date);
  let sched = daySchedule(p, wd);
  let now = date.getHours() * 60 + date.getMinutes();
  // Після півночі, але задовго до підйому — це ще «вчорашній» день
  if (now < sched.wake - 60) {
    wd = wd === 1 ? 7 : wd - 1;
    sched = daySchedule(p, wd);
    now += 1440;
  }
  const toSleep = sched.sleep - now;
  const atNightWork =
    sched.kind === 'night' &&
    !p.remote &&
    sched.workStart !== undefined &&
    sched.workEnd !== undefined &&
    now >= sched.workStart &&
    now <= sched.workEnd;

  let zone: HungerZone;
  if (atNightWork) zone = 'night-shift';
  else if (toSleep <= 0) zone = 'bedtime';
  else if (toSleep <= 120) zone = 'late';
  else if (toSleep <= 240) zone = 'evening';
  else zone = 'day';

  const z = T().hunger.zones[zone];
  return { zone, now, toSleep, sleepAt: sched.sleep, title: z.title, advice: z.advice, avoid: z.avoid, targetKcal: ZONE_KCAL[zone] };
}

/** Найдовше готування, хв: пізно ввечері — лише те, що без плити. */
const MAX_MIN: Record<HungerZone, number> = { day: 15, evening: 15, late: 5, bedtime: 5, 'night-shift': 5 };
/** Мінімальна частка калорій з білка: ввечері білок ситить і не «розганяє» цукор. */
const MIN_PROTEIN: Record<HungerZone, number> = { day: 0, evening: 0.2, late: 0.25, bedtime: 0.25, 'night-shift': 0.2 };

const q = (x: number) => Math.round(x * 4) / 4;

export function snackSuggestions(p: Profile, info: HungerInfo, limit = 5): SnackSuggestion[] {
  const anyLevel: Profile = { ...p, maxLevel: 3 };
  return RECIPES.filter(
    (r) =>
      r.meals.includes('snack') &&
      allowedRecipe(r, anyLevel) &&
      r.totalMin <= MAX_MIN[info.zone] &&
      (info.zone !== 'night-shift' || r.tags.includes('lunchbox')),
  )
    .map((r) => {
      const n = perServing(r);
      const share = (n.protein * 4) / n.kcal;
      const mult = Math.min(1.5, Math.max(0.5, q(info.targetKcal / n.kcal)));
      const pn = portion(r, mult);
      const score = share * 100 + Math.min(n.fiber, 6) * 2 + (r.tags.includes('no-cook') ? 5 : 0);
      return { recipe: r, mult, kcal: pn.kcal, protein: pn.protein, share, score };
    })
    .filter((x) => x.share >= MIN_PROTEIN[info.zone] && x.kcal <= info.targetKcal * 1.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ recipe, mult, kcal, protein }) => ({ recipe, mult, kcal, protein }));
}
