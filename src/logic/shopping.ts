import type { ShopCat } from '../data/types';
import { getProduct } from '../data/products';
import { RECIPE_BY_ID } from '../data/recipes';
import type { Plan } from './planner';
import type { Profile } from './profile';
import { daySchedule } from './schedule';
import { shoppingText } from './format';

export const CAT_ORDER: ShopCat[] = ['veg', 'fruit', 'meat', 'fish', 'dairy', 'grain', 'canned', 'frozen', 'nuts', 'pantry'];

export const CAT_LABEL: Record<ShopCat, string> = {
  veg: 'Овочі та зелень',
  fruit: 'Фрукти',
  meat: 'М’ясо і птиця',
  fish: 'Риба',
  dairy: 'Молочне, яйця, охолоджене',
  grain: 'Крупи, макарони, хліб',
  canned: 'Консерви, соління, соуси',
  frozen: 'Заморожене',
  nuts: 'Горіхи й насіння',
  pantry: 'Базовий запас — перевірте вдома',
};

export interface ShopItem {
  id: string;
  name: string;
  cat: ShopCat;
  grams: number;
  amount: string;
  extra?: string;
  hint?: string;
  pantry: boolean;
  /** Індекси днів, у які продукт потрібен */
  days: number[];
}

/**
 * Збирає список покупок для вибраних днів меню.
 * Вечері (і обіди у вихідні) множаться на кількість людей у родині:
 * ваша порція + по 1 базовій порції для кожного іншого.
 */
export function buildShoppingList(plan: Plan, p: Profile, dayIdx: number[]): ShopItem[] {
  const map = new Map<string, ShopItem>();
  const others = Math.max(0, (p.people || 1) - 1);

  for (const i of dayIdx) {
    const day = plan.days[i];
    if (!day) continue;
    const sched = daySchedule(p, day.weekday);
    for (const e of day.entries) {
      const r = RECIPE_BY_ID[e.recipe];
      if (!r) continue;
      const slot = sched.slots.find((s) => s.key === e.slot);
      const family =
        e.leftoverFrom === undefined &&
        slot &&
        !slot.atWork &&
        (slot.type === 'dinner' || (slot.type === 'lunch' && sched.kind === 'off'));
      const servings = e.mult + (family ? others : 0);
      const k = servings / r.servings;
      for (const ing of r.ingredients) {
        if (ing.opt) continue;
        const prod = getProduct(ing.p);
        const item =
          map.get(prod.id) ??
          ({
            id: prod.id,
            name: prod.name,
            cat: prod.cat,
            grams: 0,
            amount: '',
            pantry: !!prod.pantry,
            hint: prod.buyHint,
            days: [],
          } as ShopItem);
        item.grams += ing.g * k;
        if (!item.days.includes(i)) item.days.push(i);
        map.set(prod.id, item);
      }
    }
  }

  const items = [...map.values()];
  for (const it of items) {
    if (it.pantry || it.grams <= 0) {
      it.amount = it.pantry ? '' : 'трохи';
      continue;
    }
    const t = shoppingText(getProduct(it.id), it.grams);
    it.amount = t.main;
    it.extra = t.extra;
  }
  items.sort(
    (a, b) => CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat) || a.name.localeCompare(b.name, 'uk'),
  );
  return items;
}

/** Текст для месенджера / нотаток. */
export function shoppingAsText(items: ShopItem[], title: string, checked: Set<string>): string {
  const lines: string[] = [title, ''];
  for (const cat of CAT_ORDER) {
    const list = items.filter((i) => i.cat === cat && !checked.has(i.id));
    if (!list.length) continue;
    lines.push(`${CAT_LABEL[cat]}:`);
    for (const i of list) {
      lines.push(`– ${i.name}${i.amount ? ` — ${i.amount}` : ''}${i.extra ? ` (${i.extra})` : ''}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}
