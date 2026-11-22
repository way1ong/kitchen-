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
  /** Обідаю в їдальні на роботі (у денну зміну обід не готуємо й не беремо з собою) */
  canteen: boolean;
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
  canteen: false,
  equipment: ['microwave', 'airfryer', 'stove', 'oven', 'kettle'],
  maxLevel: 2,
  cookWeekday: 30,
  cookWeekend: 60,
  batch: true,
  people: 1,
  exclude: [],
  dislikes: [],
};
