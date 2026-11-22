import type { Equipment, Level } from '../data/types';

export type Sex = 'm' | 'f';
export type Goal = 'lose' | 'lose-more' | 'maintain' | 'gain';
export type WorkType = 'desk' | 'standing' | 'physical' | 'heavy';
/** 0 — немає, 1 — 1–2 рази/тиждень, 2 — 3–4, 3 — 5 і більше */
export type Training = 0 | 1 | 2 | 3;
export type MealsPerDay = 3 | 4 | 5;

export type Exclusion =
  | 'vegetarian'
  | 'no-fish'
  | 'no-pork'
  | 'no-beef'
  | 'no-dairy'
  | 'no-egg'
  | 'no-gluten'
  | 'no-nuts';

export interface Profile {
  /** true — це приклад, користувач ще не заповнив свій профіль */
  example: boolean;
  sex: Sex;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
  work: WorkType;
  training: Training;
  /** Робочі дні: 1 = Пн … 7 = Нд (день, коли починається зміна) */
  workDays: number[];
  workStart: string;
  workEnd: string;
  /** Дорога в один бік, хв */
  commute: number;
  /** Працюю з дому */
  remote: boolean;
  wake: string;
  sleep: string;
  weekendWake: string;
  weekendSleep: string;
  meals: MealsPerDay;
  microwaveAtWork: boolean;
  equipment: Equipment[];
  maxLevel: Level;
  /** Скільки хвилин готові готувати в будні / вихідні */
  cookWeekday: number;
  cookWeekend: number;
  /** Готувати вечерю із запасом на обід наступного дня */
  batch: boolean;
  /** Скільки людей їдять вечері (включно з вами) */
  people: number;
  exclude: Exclusion[];
  /** id продуктів, яких не їсте */
  dislikes: string[];
}

export const DEFAULT_PROFILE: Profile = {
  example: true,
  sex: 'm',
  age: 35,
  height: 180,
  weight: 88,
  goal: 'lose',
  work: 'desk',
  training: 1,
  workDays: [1, 2, 3, 4, 5],
  workStart: '09:00',
  workEnd: '18:00',
  commute: 40,
  remote: false,
  wake: '07:00',
  sleep: '23:00',
  weekendWake: '09:00',
  weekendSleep: '00:00',
  meals: 4,
  microwaveAtWork: true,
  equipment: ['microwave', 'airfryer', 'stove', 'oven', 'kettle'],
  maxLevel: 2,
  cookWeekday: 30,
  cookWeekend: 60,
  batch: true,
  people: 1,
  exclude: [],
  dislikes: [],
};

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  microwave: 'Мікрохвильовка',
  airfryer: 'Аерогриль',
  stove: 'Плита (сковорода, каструля)',
  oven: 'Духовка',
  blender: 'Блендер',
  kettle: 'Чайник',
};

export const EQUIPMENT_SHORT: Record<Equipment, string> = {
  microwave: 'Мікрохвильовка',
  airfryer: 'Аерогриль',
  stove: 'Плита',
  oven: 'Духовка',
  blender: 'Блендер',
  kettle: 'Чайник',
};

export const GOAL_LABEL: Record<Goal, { title: string; text: string }> = {
  lose: { title: 'Схуднути м’яко', text: 'Напівдієта: −15 % від норми, ≈0,3–0,5 кг на тиждень без голоду' },
  'lose-more': { title: 'Схуднути активніше', text: '−20 % від норми. Не нижче базового обміну' },
  maintain: { title: 'Тримати вагу', text: 'Здорове харчування без дефіциту калорій' },
  gain: { title: 'Набрати м’язи', text: '+10 % до норми і більше білка. Потрібні силові тренування' },
};

export const WORK_LABEL: Record<WorkType, { title: string; text: string }> = {
  desk: { title: 'Сидяча', text: 'Офіс, комп’ютер, водій, диспетчер' },
  standing: { title: 'На ногах', text: 'Продавець, вчитель, кухар, перукар, лікар' },
  physical: { title: 'Фізична', text: 'Склад, кур’єр пішки, монтажник, офіціант' },
  heavy: { title: 'Важка фізична', text: 'Вантажник, будівельник, різноробочий, аграрій' },
};

export const TRAINING_LABEL: Record<Training, string> = {
  0: 'Не тренуюсь',
  1: '1–2 рази на тиждень',
  2: '3–4 рази на тиждень',
  3: '5+ разів на тиждень',
};

export const EXCLUSION_LABEL: Record<Exclusion, string> = {
  vegetarian: 'Без м’яса і риби',
  'no-fish': 'Без риби',
  'no-pork': 'Без свинини',
  'no-beef': 'Без яловичини',
  'no-dairy': 'Без молочного',
  'no-egg': 'Без яєць',
  'no-gluten': 'Без глютену',
  'no-nuts': 'Без горіхів',
};

export const LEVEL_INFO: Record<Level, { title: string; short: string; text: string }> = {
  1: {
    title: 'Просто',
    short: 'Рівень 1',
    text: 'Мікрохвильовка, аерогриль, просто посмажити як яєчню або зварити гречку. До 45 хв.',
  },
  2: {
    title: 'Середньо',
    short: 'Рівень 2',
    text: 'Сковорода і каструля, 2–3 складники, тушкування, котлети. 20–60 хв.',
  },
  3: {
    title: 'Складно',
    short: 'Рівень 3',
    text: 'Духовка й плита разом, кілька етапів, фарширування. На вихідні, щоб навчитися.',
  },
};
