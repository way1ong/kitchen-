import type { Recipe } from '../data/types';
import { RECIPES } from '../data/recipes';
import { weekday } from './dates';
import { allowedRecipe } from './planner';
import type { Profile } from './profile';
import { perServing, portion } from './recipeNutrition';
import { daySchedule } from './schedule';

/**
 * «Зголоднів — що з’їсти зараз».
 *
 * Час рахуємо не від фіксованої години («не їсти після 18:00»), а від
 * ВАШОГО запланованого сну — так порада працює і для змінної роботи.
 * Дослідження: велика їжа менш ніж за 3 год до сну підвищує ризик печії
 * (рефлюксу), пізня їжа посилює голод наступного дня; але сама по собі
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

export const HUNGER_FIRST_CHECK =
  'Випийте склянку води і зачекайте 10–15 хвилин. Справжній голод наростає поступово, і «згодиться будь-яка їжа». Раптова тяга саме до солодкого чи жирного частіше буває від втоми, нудьги чи стресу.';

export const HUNGER_EVENING_TIP =
  'Часто голодні ввечері? Перевірте, чи вистачає білка й овочів удень і чи не пропускаєте обід — це найчастіші причини.';

const LATE_AVOID = [
  'Великі порції',
  'Солодке і випічка',
  'Жирне, смажене, гостре — печія вночі',
  'Кава, міцний чай, енергетики',
  'Алкоголь — сон стає гіршим',
];

const ZONES: Record<HungerZone, { title: string; advice: string; avoid: string[]; kcal: number }> = {
  day: {
    title: 'День',
    advice:
      'Нормальний час для перекусу. Найкраще — білок і клітковина разом, 150–250 ккал: ситість триває 2–3 години. Якщо до наступного прийому їжі менше години — краще дочекатися його або з’їсти фрукт.',
    avoid: [
      'Солодкі напої, булочки, батончики — швидкий цукор: за годину знову голод',
      'Чіпси, снеки, ковбаса — багато солі й жиру',
    ],
    kcal: 200,
  },
  evening: {
    title: 'Вечір',
    advice:
      'До сну 2–4 години: перекус має бути легким — білок і овочі, до 150–200 ккал. Велика чи жирна порція зараз означає гірший сон і ризик печії.',
    avoid: [
      'Смажене, жирне й гостре',
      'Солодощі та випічка',
      'Кава, міцний чай, енергетики — менш ніж за 6 год до сну краще вже ні',
      'Алкоголь',
    ],
    kcal: 170,
  },
  late: {
    title: 'Пізній вечір',
    advice:
      'До сну менше 2 годин. Якщо голод справжній — маленька порція білкового кисломолочного чи овочів, 100–150 ккал. Лягати голодним не треба, але й наїдатися перед сном теж.',
    avoid: LATE_AVOID,
    kcal: 120,
  },
  bedtime: {
    title: 'Час спати',
    advice:
      'Запланований час сну вже настав. Якщо голод не дає заснути — склянка кефіру чи кілька ложок йогурту, і спати.',
    avoid: LATE_AVOID,
    kcal: 100,
  },
  'night-shift': {
    title: 'Нічна зміна',
    advice:
      'Між 00:00 і 06:00 організм гірше перетравлює їжу. Легкий білковий перекус із собою і вода — щоб не хилило в сон і не тягнуло на солодке.',
    avoid: [
      'Фастфуд і солодке з автомата',
      'Енергетики й багато кави під кінець зміни — потім важко заснути',
      'Важка їжа між 00:00 і 06:00',
    ],
    kcal: 150,
  },
};

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

  const z = ZONES[zone];
  return { zone, now, toSleep, sleepAt: sched.sleep, title: z.title, advice: z.advice, avoid: z.avoid, targetKcal: z.kcal };
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
