import { afterEach, describe, expect, it } from 'vitest';
import { getProduct } from '../src/data/products';
import { RECIPE_BY_ID } from '../src/data/recipes';
import { setLang } from '../src/i18n';
import { trProduct, trRecipe } from '../src/i18n/data';
import { HU, T, UK } from '../src/i18n/strings';
import { dayMonth, dayShort } from '../src/logic/dates';
import { amountText, minutesText, shoppingText, timerLabel } from '../src/logic/format';
import { hungerInfo } from '../src/logic/hunger';
import { DEFAULT_PROFILE } from '../src/logic/profile';

afterEach(() => setLang('uk'));

describe('угорська мова інтерфейсу', () => {
  it('словник HU має ті самі розділи, що й UK', () => {
    const keys = (o: object) => Object.keys(o).sort();
    expect(keys(HU)).toEqual(keys(UK));
    for (const k of Object.keys(UK) as (keyof typeof UK)[]) {
      const a = UK[k];
      const b = HU[k];
      if (a && typeof a === 'object' && !Array.isArray(a)) expect(keys(b as object), String(k)).toEqual(keys(a as object));
    }
  });

  it('у словнику HU немає кирилиці (крім назви перемикача мови)', () => {
    const walk = (v: unknown, path: string): string[] => {
      if (typeof v === 'string') return /[Ѐ-ӿ]/.test(v) && path !== 'profile.language' ? [path] : [];
      if (typeof v === 'function') {
        const f = v as (...a: unknown[]) => unknown;
        const outs: string[] = [];
        for (const args of [[1, 1, 1, 1], ['x', 'x', 'x', 'x'], [1, 'x', 1, 'x'], ['x', 1, 1, 'x']]) {
          try {
            outs.push(String(f(...args)));
          } catch {
            /* неправильні типи аргументів — пропускаємо */
          }
        }
        return outs.some((o) => /[Ѐ-ӿ]/.test(o)) ? [path] : [];
      }
      if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => walk(x, path ? `${path}.${k}` : k));
      return [];
    };
    expect(walk(HU, '')).toEqual([]);
  });

  it('кількості й одиниці угорською', () => {
    setLang('hu');
    expect(T()).toBe(HU);
    expect(amountText(getProduct('egg'), 165)).toBe('3 db');
    expect(amountText(getProduct('onion'), 50)).toBe('½ fej');
    expect(amountText(getProduct('garlic'), 10)).toBe('2 gerezd');
    expect(amountText(getProduct('oil'), 13)).toBe('1 ek.');
    expect(amountText(getProduct('oil'), 4.5)).toBe('1 tk.');
    expect(amountText(getProduct('salt'), 0)).toBe('ízlés szerint');
    expect(amountText(getProduct('chicken-breast'), 187)).toBe('190 g');
    expect(shoppingText(getProduct('egg'), 7 * 55).main).toBe('7 db');
    expect(shoppingText(getProduct('garlic'), 60).main).toBe('2 fej');
    expect(minutesText(75)).toBe('1 óra 15 perc');
    expect(timerLabel(90)).toBe('1,5 perc');
    expect(dayMonth(new Date(2026, 10, 23))).toBe('november 23.');
    expect(dayShort(1)).toBe('H');
  });

  it('рецепти й продукти перекладаються, українською — без змін', () => {
    const r = RECIPE_BY_ID['kurka-kartoplia-aerohryl'];
    expect(trRecipe(r)).toBe(r);
    expect(trProduct(getProduct('egg')).name).toBe('Яйця курячі');
    setLang('hu');
    const hu = trRecipe(r);
    expect(hu.name).not.toBe(r.name);
    expect(hu.steps).toHaveLength(r.steps.length);
    expect(hu.steps[0].timer).toBe(r.steps[0].timer);
    expect(trProduct(getProduct('egg')).name).not.toBe('Яйця курячі');
  });

  it('порада «Зголоднів?» угорською', () => {
    setLang('hu');
    const info = hungerInfo({ ...DEFAULT_PROFILE, example: false }, new Date(2026, 10, 23, 21, 45));
    expect(info.zone).toBe('late');
    expect(info.title).toBe('Késő este');
  });
});
