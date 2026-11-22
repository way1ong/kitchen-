import type { MealType } from '../data/types';
import type { MealsPerDay, Profile } from './profile';
import { parseHHMM } from './format';

/**
 * Розклад прийомів їжі на день під графік роботи.
 *
 * Принципи (NIOSH, Британська асоціація дієтологів, BMJ):
 * • сніданок — протягом ~30 хв після підйому, до виходу з дому;
 * • 3–5 прийомів, проміжки 3–4 год, вечеря за 2–4 год до сну;
 * • нічна зміна: основна їжа ПЕРЕД зміною, на зміні — легкий перекус,
 *   з 00:00 до 06:00 краще не їсти щільно; після зміни — легко, щоб заснути.
 */

export type DayKind = 'day' | 'evening' | 'night' | 'off';

export interface Slot {
  key: string;
  type: MealType;
  label: string;
  /** Хвилини від півночі дня, коли прокинулись (може бути > 1440). */
  time: number;
  /** Частка добових калорій. */
  share: number;
  /** Не вдома (на роботі або в дорозі) — потрібен контейнер. */
  atWork: boolean;
  light?: boolean;
  hint?: string;
}

export interface DaySchedule {
  kind: DayKind;
  wake: number;
  sleep: number;
  workStart?: number;
  workEnd?: number;
  slots: Slot[];
}

const r15 = (m: number) => Math.round(m / 15) * 15;
const r30 = (m: number) => Math.round(m / 30) * 30;

export function isWorkday(p: Profile, weekday: number): boolean {
  return p.workDays.includes(weekday);
}

export function daySchedule(p: Profile, weekday: number): DaySchedule {
  const work = isWorkday(p, weekday);
  const W = parseHHMM(work ? p.wake : p.weekendWake);
  let S = parseHHMM(work ? p.sleep : p.weekendSleep);
  if (S <= W) S += 1440;

  if (!work) {
    return { kind: 'off', wake: W, sleep: S, slots: dayShiftSlots(W, S, p.meals, null) };
  }

  let A = parseHHMM(p.workStart);
  let B = parseHHMM(p.workEnd);
  if (A < W - 60) A += 1440; // зміна починається вже після півночі
  if (B <= A) B += 1440;
  const commute = p.remote ? 0 : Math.max(0, p.commute);
  const work_ = { A, B, commute, remote: p.remote };

  let kind: DayKind = 'day';
  if (B > 1440 + 60) kind = 'night';
  else if (A >= 13 * 60) kind = 'evening';

  const slots =
    kind === 'night'
      ? nightShiftSlots(W, S, p.meals, work_)
      : kind === 'evening'
        ? eveningShiftSlots(W, S, p.meals, work_)
        : dayShiftSlots(W, S, p.meals, work_);

  return { kind, wake: W, sleep: S, workStart: A, workEnd: B, slots };
}

interface WorkWindow {
  A: number;
  B: number;
  commute: number;
  remote: boolean;
}

function away(t: number, w: WorkWindow | null): boolean {
  if (!w || w.remote) return false;
  return t >= w.A - w.commute && t <= w.B + w.commute;
}

function dayShiftSlots(W: number, S: number, n: MealsPerDay, w: WorkWindow | null): Slot[] {
  const leave = w ? w.A - w.commute : Infinity;
  const back = w ? w.B + w.commute : -Infinity;

  // Сніданок
  let bT = W + 30;
  let bHint: string | undefined;
  if (w && !w.remote && bT > leave - 10) {
    if (W + 15 <= leave - 5) {
      bT = W + 15;
      bHint = 'Часу мало — швидкий сніданок або підготовлений з вечора';
    } else {
      bT = w.A + 30;
      bHint = 'Вдома не встигнете — візьміть сніданок із собою';
    }
  }

  // Вечеря: після повернення, але за 2–4 год до сну
  let dT = Math.max(w ? back + 30 : 0, S - 240);
  let dLight = false;
  if (dT > S - 120) {
    dLight = true;
    dT = Math.max(w ? back + 15 : 0, S - 120);
  }
  dT = r15(dT);

  // Обід — ближче до 13:00, але щонайменше через 3 год після сніданку і за 3 год до вечері
  const lo = bT + 180;
  const hi = dT - 180;
  const lT = lo <= hi ? r30(Math.min(Math.max(13 * 60, lo), hi)) : r30((bT + dT) / 2);

  const B: Slot = {
    key: 'b',
    type: 'breakfast',
    label: 'Сніданок',
    time: r15(bT),
    share: 0,
    atWork: away(bT, w),
    hint: bHint,
  };
  const L: Slot = { key: 'l', type: 'lunch', label: 'Обід', time: lT, share: 0, atWork: away(lT, w) };
  const D: Slot = {
    key: 'd',
    type: 'dinner',
    label: 'Вечеря',
    time: dT,
    share: 0,
    atWork: false,
    light: dLight,
    hint: dLight ? 'Пізно повертаєтесь — вечеря легша, більше калорій удень' : undefined,
  };

  const slots: Slot[] = [B];
  if (n === 5) {
    const t = r15((B.time + L.time) / 2);
    slots.push({ key: 's1', type: 'snack', label: 'Перекус', time: t, share: 0, atWork: away(t, w) });
  }
  slots.push(L);
  if (n >= 4) {
    const t = r15((L.time + D.time) / 2);
    slots.push({ key: 's2', type: 'snack', label: 'Перекус', time: t, share: 0, atWork: away(t, w) });
  }
  slots.push(D);

  const shares: Record<MealsPerDay, number[]> = {
    3: [0.3, 0.4, 0.3],
    4: [0.25, 0.35, 0.1, 0.3],
    5: [0.2, 0.1, 0.35, 0.1, 0.25],
  };
  const sh = [...shares[n]];
  if (dLight) {
    // переносимо 10 % калорій з вечері на обід
    sh[sh.length - 1] -= 0.1;
    sh[slots.indexOf(L)] += 0.1;
  }
  slots.forEach((s, i) => (s.share = sh[i]));
  return slots;
}

function eveningShiftSlots(W: number, S: number, n: MealsPerDay, w: WorkWindow): Slot[] {
  const leave = w.A - w.commute;
  const back = w.B + w.commute;
  const bT = r15(W + 30);
  const lT = r15(Math.max(bT + 180, leave - 60));
  const dT = r30((w.A + w.B) / 2);

  const slots: Slot[] = [{ key: 'b', type: 'breakfast', label: 'Сніданок', time: bT, share: 0, atWork: false }];
  if (n === 5 || (n === 4 && lT - bT >= 240)) {
    const t = r15((bT + lT) / 2);
    slots.push({ key: 's1', type: 'snack', label: 'Перекус', time: t, share: 0, atWork: away(t, w) });
  }
  slots.push({
    key: 'l',
    type: 'lunch',
    label: 'Обід перед роботою',
    time: lT,
    share: 0,
    atWork: away(lT, w),
    hint: 'Основний прийом їжі дня',
  });
  slots.push({
    key: 'd',
    type: 'dinner',
    label: 'Вечеря на роботі',
    time: dT,
    share: 0,
    atWork: !w.remote,
  });
  const hasS1 = slots.some((s) => s.key === 's1');
  if ((n === 4 && !hasS1) || n === 5) {
    const t = r15(Math.min(back + 15, S - 30));
    slots.push({
      key: 's2',
      type: 'snack',
      label: 'Легкий перекус',
      time: t,
      share: 0,
      atWork: away(t, w),
      light: true,
      hint: 'Невелика порція перед сном',
    });
  }

  // Частки за ключем слота (порядок слотів може відрізнятися)
  const byKey: Record<MealsPerDay, Record<string, number>> = {
    3: { b: 0.25, l: 0.4, d: 0.35 },
    4: { b: 0.25, s1: 0.1, s2: 0.1, l: 0.35, d: 0.3 },
    5: { b: 0.2, s1: 0.1, l: 0.3, d: 0.3, s2: 0.1 },
  };
  slots.forEach((s) => (s.share = byKey[n][s.key]));
  return slots;
}

function nightShiftSlots(W: number, S: number, n: MealsPerDay, w: WorkWindow): Slot[] {
  const leave = w.A - w.commute;
  const back = w.B + w.commute;
  const bT = r15(W + 30);
  const mainT = r15(Math.max(bT + 150, leave - 60));
  // Перекус на зміні — ближче до початку, щоб не їсти щільно в 00:00–06:00
  const snackT = r15(Math.min(w.A + 150, Math.max(w.A + 60, 1440 + 60)));
  const postT = r15(Math.min(back + 15, S - 30));

  const slots: Slot[] = [
    { key: 'b', type: 'breakfast', label: 'Сніданок після сну', time: bT, share: 0, atWork: false },
  ];
  if (n === 5) {
    const t = r15((bT + mainT) / 2);
    slots.push({ key: 's1', type: 'snack', label: 'Перекус', time: t, share: 0, atWork: false });
  }
  slots.push({
    key: 'd',
    type: 'dinner',
    label: 'Основна їжа перед зміною',
    time: mainT,
    share: 0,
    atWork: away(mainT, w),
    hint: 'Білок і повільні вуглеводи — енергія на всю зміну',
  });
  if (n === 3) {
    slots.push({
      key: 'l',
      type: 'lunch',
      label: 'Їжа на зміні',
      time: snackT,
      share: 0,
      atWork: !w.remote,
      hint: 'Краще до 01:00; з 00:00 до 06:00 організм гірше перетравлює їжу',
    });
  } else {
    slots.push({
      key: 's2',
      type: 'snack',
      label: 'Перекус на зміні',
      time: snackT,
      share: 0,
      atWork: !w.remote,
      light: true,
      hint: 'Легко: з 00:00 до 06:00 організм гірше перетравлює їжу',
    });
    slots.push({
      key: 'p',
      type: 'breakfast',
      label: 'Легкий сніданок після зміни',
      time: postT,
      share: 0,
      atWork: false,
      light: true,
      hint: 'Невелика порція, щоб добре заснути',
    });
  }

  const byCount: Record<MealsPerDay, number[]> = {
    3: [0.3, 0.45, 0.25],
    4: [0.25, 0.4, 0.2, 0.15],
    5: [0.2, 0.1, 0.35, 0.15, 0.2],
  };
  const sh = byCount[n];
  slots.forEach((s, i) => (s.share = sh[i]));
  return slots;
}
