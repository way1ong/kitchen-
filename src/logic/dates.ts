import { T } from '../i18n/strings';

/** Коротка назва дня: 1 = понеділок … 7 = неділя. */
export function dayShort(weekday: number): string {
  return T().days.short[weekday - 1];
}

export function dayFull(weekday: number): string {
  return T().days.full[weekday - 1];
}

/** 1 = понеділок … 7 = неділя */
export function weekday(d: Date): number {
  return ((d.getDay() + 6) % 7) + 1;
}

export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseIso(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Понеділок тижня, в якому лежить дата. */
export function weekStart(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return addDays(x, -(weekday(x) - 1));
}

/** «23 листопада» / «november 23.» */
export function dayMonth(d: Date): string {
  return T().dayMonth(d.getDate(), d.getMonth());
}
