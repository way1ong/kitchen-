import type { Product } from '../data/types';
import { trProduct } from '../i18n/data';
import { getLang, locale } from '../i18n';
import { T } from '../i18n/strings';

/**
 * Українські форми слова для числа.
 * forms: [1, 21…; 2–4, 22–24…; 5–20, 25…; дробові (½, 1,5)]
 */
export function plural(n: number, forms: readonly [string, string, string, string?]): string {
  if (!Number.isInteger(n)) return forms[3] ?? forms[1];
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
  return forms[2];
}

/** Число з комою: 1.5 → «1,5». */
export function num(n: number, maxFrac = 1): string {
  return n.toLocaleString(locale(), { maximumFractionDigits: maxFrac, useGrouping: false });
}

/** 0.5 → «½», 1.5 → «1½», 2 → «2», 0.25 → «¼», 0.75 → «¾». */
export function fraction(n: number): string {
  const whole = Math.floor(n + 1e-9);
  const rest = n - whole;
  let frac = '';
  if (Math.abs(rest - 0.25) < 0.01) frac = '¼';
  else if (Math.abs(rest - 0.5) < 0.01) frac = '½';
  else if (Math.abs(rest - 0.75) < 0.01) frac = '¾';
  else if (rest > 0.01) return num(n, 2);
  if (whole === 0) return frac || '0';
  return `${whole}${frac}`;
}

export function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

export function ceilTo(n: number, step: number): number {
  return Math.ceil(n / step - 1e-9) * step;
}

/** Штуки: українською — з відмінком («2 яйця»), угорською — одиниця без зміни («2 db»). */
function pieceWord(p: Product, count: number): string {
  if (getLang() === 'hu') return trProduct(p).unit ?? 'db';
  return p.piece ? plural(count, p.piece.forms) : '';
}

/** Грами для показу в рецепті. */
export function gramsText(g: number, liquid = false): string {
  const u = T().units;
  const unit = liquid ? u.ml : u.g;
  if (g >= 1000) {
    return `${num(roundTo(g, 50) / 1000, 2)} ${liquid ? u.l : u.kg}`;
  }
  let r: number;
  if (g < 10) r = Math.max(1, Math.round(g));
  else if (g < 100) r = roundTo(g, 5);
  else r = roundTo(g, 10);
  return `${r} ${unit}`;
}

/**
 * Кількість інгредієнта для рецепта: «2 яйця», «½ цибулини (≈50 г)»,
 * «1 ст. л.», «150 г», «за смаком» (угорською: «2 db», «½ fej», «1 ek.»).
 */
export function amountText(p: Product, g: number, opts: { withGrams?: boolean } = {}): string {
  const u = T().units;
  if (g <= 0) return u.toTaste;

  if (p.piece && p.piece.g > 0) {
    const count = g / p.piece.g;
    if (p.whole) {
      const c = Math.max(1, Math.round(count));
      return `${c} ${pieceWord(p, c)}`;
    }
    if (count >= 0.5 || p.piece.g < 10) {
      const c = Math.max(0.5, roundTo(count, 0.5));
      const grams = opts.withGrams && p.piece.g >= 50 ? ` (≈${gramsText(g, p.liquid)})` : '';
      return `${fraction(c)} ${pieceWord(p, c)}${grams}`;
    }
  }

  if (p.spoon && g <= p.spoon * 3) {
    const tbsp = g / p.spoon;
    if (tbsp < 0.67) {
      const tsp = Math.max(0.5, roundTo(g / (p.spoon / 3), 0.5));
      return `${fraction(tsp)} ${u.tsp}`;
    }
    return `${fraction(Math.max(0.5, roundTo(tbsp, 0.5)))} ${u.tbsp}`;
  }

  return gramsText(g, p.liquid);
}

/** Кількість для списку покупок (округлення вгору до зручної покупки). */
export function shoppingText(p: Product, g: number): { main: string; extra?: string } {
  const u = T().units;
  if (p.piece && p.piece.g >= 5 && (p.whole || p.piece.g >= 50)) {
    const c = Math.max(1, Math.ceil(g / p.piece.g - 0.15));
    const main = `${c} ${pieceWord(p, c)}`;
    if (p.whole) return { main };
    return { main, extra: `≈${gramsText(c * p.piece.g)}` };
  }
  if (p.piece && p.piece.g < 50 && p.id === 'garlic') {
    const cloves = Math.max(1, Math.ceil(g / p.piece.g));
    // голівка часнику ≈ 10 зубчиків
    const heads = Math.max(1, Math.ceil(cloves / 10));
    const head = getLang() === 'hu' ? u.garlicHead[0] : plural(heads, u.garlicHead);
    return { main: `${heads} ${head}`, extra: `${cloves} ${pieceWord(p, cloves)}` };
  }
  if (p.liquid) {
    const ml = g < 1000 ? ceilTo(g, 50) : ceilTo(g, 100);
    return { main: ml >= 1000 ? `${num(ml / 1000, 1)} ${u.l}` : `${ml} ${u.ml}` };
  }
  const grams = g < 100 ? ceilTo(g, 10) : g < 1000 ? ceilTo(g, 50) : ceilTo(g, 100);
  return { main: grams >= 1000 ? `${num(grams / 1000, 1)} ${u.kg}` : `${grams} ${u.g}` };
}

/** Хвилини → «1 год 15 хв» / «1 óra 15 perc». */
export function minutesText(min: number): string {
  const u = T().units;
  if (min < 60) return `${min} ${u.min}`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} ${u.hour} ${m} ${u.min}` : `${h} ${u.hour}`;
}

/** Секунди → «04:30» (для таймера). */
export function clock(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (x: number) => String(x).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(ss)}` : `${pad(m)}:${pad(ss)}`;
}

/** Секунди таймера для кнопки: 90 → «1,5 хв», 45 → «45 с». */
export function timerLabel(sec: number): string {
  const u = T().units;
  if (sec < 60) return `${sec} ${u.sec}`;
  const min = sec / 60;
  return Number.isInteger(min) ? `${min} ${u.min}` : `${num(min, 1)} ${u.min}`;
}

/** Хвилини від півночі → «07:30» (з урахуванням переходу через північ). */
export function hhmm(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** «07:30» → 450 */
export function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map((x) => parseInt(x, 10));
  return (h || 0) * 60 + (m || 0);
}
