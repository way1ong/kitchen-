import type { Goal, Profile, Training, WorkType } from './profile';

/**
 * Розрахунок добової норми.
 *
 * Базовий обмін — рівняння Міффліна — Сан Жеора (Mifflin–St Jeor, 1990):
 * найточніше для більшості дорослих (≈80 % людей у межах ±10 % від
 * виміряного). Коефіцієнт активності (PAL) = тип роботи + тренування.
 * Результат — оцінка: через 2–3 тижні звірте з реальною динамікою ваги.
 */

export const WORK_PAL: Record<WorkType, number> = {
  desk: 1.2,
  standing: 1.375,
  physical: 1.55,
  heavy: 1.725,
};

export const TRAINING_PAL: Record<Training, number> = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.3 };

export const GOAL_FACTOR: Record<Goal, number> = {
  lose: -0.15,
  'lose-more': -0.2,
  maintain: 0,
  gain: 0.1,
};

/** Білок, г на кг «розрахункової» ваги. */
const PROTEIN_PER_KG: Record<Goal, number> = {
  lose: 1.5,
  'lose-more': 1.6,
  maintain: 1.2,
  gain: 1.6,
};

export type BmiCategory = 'under' | 'normal' | 'over' | 'obese';

export interface Targets {
  bmr: number;
  pal: number;
  tdee: number;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  /** Рідина на день, мл */
  water: number;
  /** Овочі й фрукти, г (ВООЗ ≥ 400 г) */
  fv: number;
  /** Сіль, г (ВООЗ < 5 г) */
  salt: number;
  bmi: number;
  bmiCategory: BmiCategory;
  healthyWeight: [number, number];
  /** Очікувана зміна ваги, кг/тиждень (від’ємне — схуднення) */
  weeklyChange: number;
  /** Спрацювало обмеження «не нижче базового обміну» */
  floorApplied: boolean;
}

export function bmr(sex: 'm' | 'f', weight: number, height: number, age: number): number {
  return 10 * weight + 6.25 * height - 5 * age + (sex === 'm' ? 5 : -161);
}

export function activityFactor(work: WorkType, training: Training): number {
  return Math.min(2.0, WORK_PAL[work] + TRAINING_PAL[training]);
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'under';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'over';
  return 'obese';
}

const round = (n: number, step = 1) => Math.round(n / step) * step;

export function computeTargets(p: Profile): Targets {
  const b = bmr(p.sex, p.weight, p.height, p.age);
  const pal = activityFactor(p.work, p.training);
  const tdee = b * pal;

  let kcal = tdee * (1 + GOAL_FACTOR[p.goal]);
  let floorApplied = false;
  if (p.goal === 'lose' || p.goal === 'lose-more') {
    const floor = Math.max(b, p.sex === 'm' ? 1500 : 1200);
    if (kcal < floor) {
      kcal = floor;
      floorApplied = true;
    }
  }
  kcal = round(kcal, 10);

  const h = p.height / 100;
  const bmi = p.weight / (h * h);
  // Для білка при високому ІМТ беремо «скориговану» вагу:
  // ідеальна (ІМТ 24) + 40 % надлишку — стандартний клінічний підхід.
  const ideal = 24 * h * h;
  const refWeight = bmi > 27 ? ideal + 0.4 * (p.weight - ideal) : p.weight;

  const perKg = Math.min(
    2.0,
    PROTEIN_PER_KG[p.goal] + [0, 0.1, 0.2, 0.3][p.training],
  );
  let protein = refWeight * perKg;
  // При великих калоріях (важка праця) — не менше 20 % енергії з білка,
  // але й не більше 35 % (межі ВООЗ/IOM для дорослих: 10–35 %).
  protein = Math.max(protein, (0.2 * kcal) / 4);
  protein = Math.min(protein, (0.35 * kcal) / 4);
  protein = round(protein, 5);

  let fat = Math.max((0.28 * kcal) / 9, 0.7 * refWeight);
  fat = round(fat, 5);

  const carbs = round(Math.max(0, (kcal - protein * 4 - fat * 9) / 4), 5);
  const fiber = Math.max(25, round((14 * kcal) / 1000));
  const water = Math.min(3500, Math.max(1500, round(30 * p.weight, 100)));

  return {
    bmr: round(b),
    pal: Math.round(pal * 1000) / 1000,
    tdee: round(tdee, 10),
    kcal,
    protein,
    fat,
    carbs,
    fiber,
    water,
    fv: 400,
    salt: 5,
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: bmiCategory(bmi),
    healthyWeight: [Math.round(18.5 * h * h), Math.round(24.9 * h * h)],
    weeklyChange: Math.round((((kcal - tdee) * 7) / 7700) * 100) / 100,
    floorApplied,
  };
}
