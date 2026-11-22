import { describe, expect, it } from 'vitest';
import { hungerInfo, snackSuggestions } from '../src/logic/hunger';
import { portable } from '../src/logic/planner';
import { DEFAULT_PROFILE, type Profile } from '../src/logic/profile';
import { recipeAllergens } from '../src/logic/recipeNutrition';

const P = (o: Partial<Profile> = {}): Profile => ({ ...DEFAULT_PROFILE, example: false, ...o });
// 23.11.2026 — понеділок; робочий день, сон о 23:00
const at = (day: number, h: number, m = 0) => new Date(2026, 10, day, h, m);

describe('зголоднів: час відносно сну', () => {
  it('зони дня для звичайного графіка (сон о 23:00)', () => {
    expect(hungerInfo(P(), at(23, 15)).zone).toBe('day');
    expect(hungerInfo(P(), at(23, 20)).zone).toBe('evening');
    expect(hungerInfo(P(), at(23, 21, 45)).zone).toBe('late');
    expect(hungerInfo(P(), at(23, 23, 30)).zone).toBe('bedtime');
    // 00:30 вівторка — ще «понеділковий» вечір, уже після часу сну
    expect(hungerInfo(P(), at(24, 0, 30)).zone).toBe('bedtime');
  });

  it('о 20:00 до сну рахуються години, а не «після 18:00»', () => {
    const owl = P({ sleep: '01:00' });
    expect(hungerInfo(owl, at(23, 20)).zone).toBe('day');
    expect(hungerInfo(owl, at(23, 20)).toSleep).toBe(300);
  });

  it('нічна зміна: на роботі — окрема порада, після зміни — легко', () => {
    const p = P({ workStart: '22:00', workEnd: '06:00', wake: '14:00', sleep: '08:00' });
    expect(hungerInfo(p, at(24, 3)).zone).toBe('night-shift');
    expect(hungerInfo(p, at(24, 7, 30)).zone).toBe('late');
  });

  it('пропозиції є в кожній зоні й відповідають їй', () => {
    const p = P();
    const cases: [number, number][] = [
      [15, 0],
      [20, 0],
      [21, 45],
      [23, 30],
    ];
    for (const [h, m] of cases) {
      const info = hungerInfo(p, at(23, h, m));
      const list = snackSuggestions(p, info);
      expect(list.length, info.zone).toBeGreaterThan(0);
      for (const s of list) {
        expect(s.recipe.meals).toContain('snack');
        expect(s.kcal).toBeLessThanOrEqual(info.targetKcal * 1.35);
        if (info.zone === 'late' || info.zone === 'bedtime') {
          expect(s.recipe.totalMin).toBeLessThanOrEqual(5);
          expect((s.protein * 4) / s.kcal).toBeGreaterThanOrEqual(0.25);
        }
      }
    }
  });

  it('на нічній зміні — лише те, що можна взяти з собою', () => {
    const p = P({ workStart: '22:00', workEnd: '06:00', wake: '14:00', sleep: '08:00' });
    const list = snackSuggestions(p, hungerInfo(p, at(24, 2)));
    expect(list.length).toBeGreaterThan(0);
    list.forEach((s) => expect(portable(s.recipe, p)).toBe(true));
  });

  it('враховує обмеження (без молочного)', () => {
    const p = P({ exclude: ['no-dairy'] });
    const list = snackSuggestions(p, hungerInfo(p, at(23, 15)));
    expect(list.length).toBeGreaterThan(0);
    list.forEach((s) => expect(recipeAllergens(s.recipe).has('dairy')).toBe(false));
  });
});
