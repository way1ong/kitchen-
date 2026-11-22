import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_PROFILE, type Profile } from '../logic/profile';
import { generatePlan, swapEntry, type Plan } from '../logic/planner';
import { isoDate, parseIso, weekStart } from '../logic/dates';
import { newSeed } from '../logic/rng';
import { RECIPE_BY_ID } from '../data/recipes';

/**
 * Стан додатку. Усе зберігається лише на цьому пристрої (localStorage):
 * дані про вагу й здоров’я нікуди не надсилаються.
 */

export interface Settings {
  /** 0 — звичайний, 1 — великий, 2 — дуже великий шрифт */
  font: 0 | 1 | 2;
  theme: 'auto' | 'light' | 'dark';
}

export interface AppData {
  v: 1;
  profile: Profile;
  plan: Plan | null;
  /** id меню → id відмічених продуктів */
  checked: Record<string, string[]>;
  /** Дні меню (0–6), для яких складається список покупок */
  shopDays: number[];
  settings: Settings;
}

const KEY = 'gotuyu-sam:v1';
const EXAMPLE_SEED = 7;

function load(): unknown {
  try {
    const s = window.localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function save(d: AppData) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* приватний режим або заблоковане сховище — працюємо без збереження */
  }
}

function defaults(): AppData {
  return {
    v: 1,
    profile: { ...DEFAULT_PROFILE },
    plan: null,
    checked: {},
    shopDays: [0, 1, 2, 3, 4, 5, 6],
    settings: { font: 0, theme: 'auto' },
  };
}

function validPlan(x: unknown): x is Plan {
  const p = x as Plan;
  return (
    !!p &&
    typeof p.weekStart === 'string' &&
    Array.isArray(p.days) &&
    p.days.length === 7 &&
    p.days.every((d) => Array.isArray(d.entries) && d.entries.every((e) => !!RECIPE_BY_ID[e.recipe]))
  );
}

/** Перевіряє і доповнює збережені/імпортовані дані. */
export function sanitize(raw: unknown): AppData | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<AppData>;
  const base = defaults();
  const profile = { ...base.profile, ...(r.profile ?? {}) } as Profile;
  if (!Array.isArray(profile.equipment) || !Array.isArray(profile.workDays)) return null;
  return {
    v: 1,
    profile,
    plan: validPlan(r.plan) ? r.plan : null,
    checked: r.checked && typeof r.checked === 'object' ? r.checked : {},
    shopDays: Array.isArray(r.shopDays) ? r.shopDays.filter((n) => n >= 0 && n < 7) : base.shopDays,
    settings: { ...base.settings, ...(r.settings ?? {}) },
  };
}

function init(): AppData {
  const d = sanitize(load()) ?? defaults();
  const ws = weekStart(new Date());
  if (!d.plan || (d.profile.example && d.plan.weekStart !== isoDate(ws))) {
    d.plan = generatePlan(d.profile, ws, d.profile.example ? EXAMPLE_SEED : newSeed());
  }
  return d;
}

export interface RecipeContext {
  id: string;
  /** Скільки базових порцій готувати */
  servings: number;
  /** Ваша порція (для показу калорій) */
  mine: number;
  /** Пояснення: «ваша порція 1¼ + 1 на завтрашній обід» */
  note?: string;
  /** Це залишки — лише розігріти */
  leftover?: boolean;
}

interface Store {
  data: AppData;
  recipeCtx: RecipeContext | null;
  setRecipeCtx: (c: RecipeContext | null) => void;
  saveProfile: (p: Profile, regenerate: boolean) => void;
  newPlan: () => void;
  swap: (dayIndex: number, slot: string, recipeId: string) => void;
  toggleChecked: (productId: string) => void;
  clearChecked: () => void;
  setShopDays: (days: number[]) => void;
  setSettings: (s: Partial<Settings>) => void;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(init);
  const [recipeCtx, setRecipeCtx] = useState<RecipeContext | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      save(data);
      return;
    }
    const t = window.setTimeout(() => save(data), 200);
    return () => window.clearTimeout(t);
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.font = String(data.settings.font);
    if (data.settings.theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = data.settings.theme;
  }, [data.settings]);

  const saveProfile = useCallback((p: Profile, regenerate: boolean) => {
    setData((d) => {
      const profile = { ...p, example: false };
      const plan = regenerate || !d.plan ? generatePlan(profile, weekStart(new Date()), newSeed()) : d.plan;
      return { ...d, profile, plan };
    });
  }, []);

  const newPlan = useCallback(() => {
    setData((d) => ({ ...d, plan: generatePlan(d.profile, weekStart(new Date()), newSeed()) }));
  }, []);

  const swap = useCallback((dayIndex: number, slot: string, recipeId: string) => {
    setData((d) => (d.plan ? { ...d, plan: swapEntry(d.plan, dayIndex, slot, recipeId, d.profile) } : d));
  }, []);

  const toggleChecked = useCallback((productId: string) => {
    setData((d) => {
      if (!d.plan) return d;
      const cur = new Set(d.checked[d.plan.id] ?? []);
      if (cur.has(productId)) cur.delete(productId);
      else cur.add(productId);
      // зберігаємо позначки лише для поточного меню
      return { ...d, checked: { [d.plan.id]: [...cur] } };
    });
  }, []);

  const clearChecked = useCallback(() => {
    setData((d) => (d.plan ? { ...d, checked: { [d.plan.id]: [] } } : d));
  }, []);

  const setShopDays = useCallback((days: number[]) => setData((d) => ({ ...d, shopDays: days })), []);

  const setSettings = useCallback(
    (s: Partial<Settings>) => setData((d) => ({ ...d, settings: { ...d.settings, ...s } })),
    [],
  );

  const importData = useCallback((json: string) => {
    try {
      const d = sanitize(JSON.parse(json));
      if (!d) return false;
      if (!d.plan) d.plan = generatePlan(d.profile, weekStart(new Date()), newSeed());
      setData(d);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAll = useCallback(() => {
    const d = defaults();
    d.plan = generatePlan(d.profile, weekStart(new Date()), EXAMPLE_SEED);
    setData(d);
  }, []);

  const value = useMemo<Store>(
    () => ({
      data,
      recipeCtx,
      setRecipeCtx,
      saveProfile,
      newPlan,
      swap,
      toggleChecked,
      clearChecked,
      setShopDays,
      setSettings,
      importData,
      resetAll,
    }),
    [data, recipeCtx, saveProfile, newPlan, swap, toggleChecked, clearChecked, setShopDays, setSettings, importData, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider відсутній');
  return s;
}

export function planIsCurrentWeek(plan: Plan): boolean {
  return plan.weekStart === isoDate(weekStart(new Date()));
}

export function planDate(plan: Plan, i: number): Date {
  const d = parseIso(plan.weekStart);
  d.setDate(d.getDate() + i);
  return d;
}
