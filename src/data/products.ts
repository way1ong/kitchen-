import type { Product } from './types';

/**
 * База продуктів. Харчова цінність — на 100 г сирого продукту (як купуєте),
 * середні значення за таблицями USDA FoodData Central та етикетками
 * українських виробників. Похибка ±10 % — нормально для планування раціону.
 *
 * n: [ккал, білки, жири, вуглеводи, клітковина]
 */
export const PRODUCTS: Product[] = [
  // ── М'ясо та птиця ────────────────────────────────────────────────
  { id: 'chicken-breast', name: 'Куряче філе', cat: 'meat', n: [120, 22.5, 2.6, 0, 0], animal: 'poultry' },
  { id: 'chicken-thigh', name: 'Філе курячого стегна (без шкіри)', cat: 'meat', n: [140, 19, 7, 0, 0], animal: 'poultry' },
  { id: 'chicken-mince', name: 'Фарш курячий', cat: 'meat', n: [143, 17.4, 8.1, 0, 0], animal: 'poultry' },
  { id: 'turkey-breast', name: 'Філе індички', cat: 'meat', n: [114, 23.7, 1.5, 0, 0], animal: 'poultry' },
  { id: 'turkey-mince', name: 'Фарш з індички', cat: 'meat', n: [150, 18.7, 8.3, 0, 0], animal: 'poultry' },
  { id: 'beef-lean', name: 'Яловичина пісна (вирізка, стегно)', cat: 'meat', n: [140, 21, 6, 0, 0], animal: 'beef' },
  { id: 'beef-mince', name: 'Фарш яловичий', cat: 'meat', n: [190, 19, 12.5, 0, 0], animal: 'beef' },
  { id: 'pork-loin', name: 'Свиняча вирізка', cat: 'meat', n: [110, 21, 2.5, 0, 0], animal: 'pork' },

  // ── Риба ──────────────────────────────────────────────────────────
  { id: 'hake', name: 'Хек (філе)', cat: 'fish', n: [86, 16.6, 2.2, 0, 0], animal: 'fish', allergens: ['fish'] },
  { id: 'pollock', name: 'Минтай (філе)', cat: 'fish', n: [72, 15.9, 0.9, 0, 0], animal: 'fish', allergens: ['fish'] },
  { id: 'salmon', name: 'Лосось / сьомга (філе)', cat: 'fish', n: [208, 20.4, 13.4, 0, 0], animal: 'fish', allergens: ['fish'] },
  {
    id: 'tuna-can', name: 'Тунець у власному соку (консерва)', cat: 'canned', n: [110, 24, 1, 0, 0],
    animal: 'fish', allergens: ['fish'], buyHint: '1 банка ≈ 120–130 г без рідини',
  },

  // ── Молочне, яйця, охолоджене ─────────────────────────────────────
  {
    id: 'egg', name: 'Яйця курячі', cat: 'dairy', n: [143, 12.6, 9.5, 0.7, 0], whole: true,
    piece: { g: 55, forms: ['яйце', 'яйця', 'яєць', 'яйця'] }, allergens: ['egg'],
  },
  { id: 'cottage-5', name: 'Кисломолочний сир 5 %', cat: 'dairy', n: [121, 17.2, 5, 1.8, 0], allergens: ['dairy'] },
  { id: 'greek-yogurt', name: 'Йогурт грецький 2 % (без цукру)', cat: 'dairy', n: [73, 10, 2, 3.9, 0], allergens: ['dairy'] },
  { id: 'kefir', name: 'Кефір 1 %', cat: 'dairy', n: [40, 2.8, 1, 4, 0], liquid: true, allergens: ['dairy'] },
  { id: 'milk', name: 'Молоко 2,5 %', cat: 'dairy', n: [52, 2.8, 2.5, 4.7, 0], liquid: true, allergens: ['dairy'] },
  { id: 'cheese-hard', name: 'Сир твердий (типу гауда)', cat: 'dairy', n: [356, 25, 27, 2.2, 0], allergens: ['dairy'] },
  { id: 'brynza', name: 'Бринза або фета', cat: 'dairy', n: [260, 17.9, 20.1, 1, 0], allergens: ['dairy'] },
  { id: 'mozzarella', name: 'Моцарела', cat: 'dairy', n: [254, 24, 16, 2.8, 0], allergens: ['dairy'] },
  { id: 'sour-cream', name: 'Сметана 15 %', cat: 'dairy', n: [158, 2.6, 15, 3, 0], allergens: ['dairy'], spoon: 20 },
  { id: 'hummus', name: 'Хумус', cat: 'dairy', n: [166, 7.9, 9.6, 14.3, 6] },

  // ── Крупи, макарони, хліб ─────────────────────────────────────────
  { id: 'buckwheat', name: 'Гречка', cat: 'grain', n: [343, 12.6, 3.3, 72, 10] },
  { id: 'oats', name: 'Вівсяні пластівці (не швидкого приготування)', cat: 'grain', n: [370, 13, 6.5, 66, 10], allergens: ['gluten'] },
  { id: 'rice', name: 'Рис (бурий або пропарений)', cat: 'grain', n: [362, 7.5, 2, 77, 3] },
  { id: 'bulgur', name: 'Булгур', cat: 'grain', n: [342, 12.3, 1.3, 76, 18], allergens: ['gluten'] },
  { id: 'pasta', name: 'Макарони з твердих сортів пшениці', cat: 'grain', n: [350, 12.5, 1.5, 71, 3.5], allergens: ['gluten'] },
  { id: 'lentils-red', name: 'Сочевиця червона', cat: 'grain', n: [352, 24.6, 1.1, 63, 10.7] },
  { id: 'flour', name: 'Борошно (цільнозернове або пшеничне)', cat: 'grain', n: [340, 13, 2.5, 72, 10], allergens: ['gluten'], spoon: 10 },
  {
    id: 'bread', name: 'Хліб цільнозерновий', cat: 'grain', n: [247, 13, 3.4, 41, 7], allergens: ['gluten'],
    piece: { g: 30, forms: ['скибка', 'скибки', 'скибок', 'скибки'] },
  },
  { id: 'lavash', name: 'Лаваш тонкий', cat: 'grain', n: [275, 9, 1.2, 56, 2.2], allergens: ['gluten'], buyHint: '1 лист ≈ 70–120 г' },
  {
    id: 'crispbread', name: 'Хлібці цільнозернові', cat: 'grain', n: [340, 10, 2, 65, 15], allergens: ['gluten'],
    piece: { g: 10, forms: ['хлібець', 'хлібці', 'хлібців', 'хлібця'] },
  },

  // ── Овочі та зелень (свіжі) ───────────────────────────────────────
  {
    id: 'potato', name: 'Картопля', cat: 'veg', n: [77, 2, 0.1, 17, 2.2],
    piece: { g: 150, forms: ['картоплина', 'картоплини', 'картоплин', 'картоплини'] },
  },
  {
    id: 'sweet-potato', name: 'Батат', cat: 'veg', n: [86, 1.6, 0.1, 20, 3],
    piece: { g: 250, forms: ['батат', 'батати', 'бататів', 'батата'] },
  },
  { id: 'cabbage', name: 'Капуста білокачанна', cat: 'veg', n: [25, 1.3, 0.1, 5.8, 2.5], fv: true },
  {
    id: 'carrot', name: 'Морква', cat: 'veg', n: [41, 0.9, 0.2, 9.6, 2.8], fv: true,
    piece: { g: 80, forms: ['морквина', 'морквини', 'морквин', 'морквини'] },
  },
  {
    id: 'onion', name: 'Цибуля ріпчаста', cat: 'veg', n: [40, 1.1, 0.1, 9.3, 1.7], fv: true,
    piece: { g: 100, forms: ['цибулина', 'цибулини', 'цибулин', 'цибулини'] },
  },
  {
    id: 'garlic', name: 'Часник', cat: 'veg', n: [149, 6.4, 0.5, 33, 2.1],
    piece: { g: 5, forms: ['зубчик', 'зубчики', 'зубчиків', 'зубчика'] },
  },
  {
    id: 'tomato', name: 'Помідори', cat: 'veg', n: [18, 0.9, 0.2, 3.9, 1.2], fv: true,
    piece: { g: 120, forms: ['помідор', 'помідори', 'помідорів', 'помідора'] },
  },
  {
    id: 'cucumber', name: 'Огірки', cat: 'veg', n: [15, 0.7, 0.1, 3.6, 0.5], fv: true,
    piece: { g: 100, forms: ['огірок', 'огірки', 'огірків', 'огірка'] },
  },
  {
    id: 'bell-pepper', name: 'Перець болгарський', cat: 'veg', n: [26, 1, 0.3, 6, 2.1], fv: true,
    piece: { g: 150, forms: ['перець', 'перці', 'перців', 'перцю'] },
  },
  {
    id: 'zucchini', name: 'Кабачок', cat: 'veg', n: [17, 1.2, 0.3, 3.1, 1], fv: true,
    piece: { g: 300, forms: ['кабачок', 'кабачки', 'кабачків', 'кабачка'] },
  },
  {
    id: 'eggplant', name: 'Баклажан', cat: 'veg', n: [25, 1, 0.2, 5.9, 3], fv: true,
    piece: { g: 300, forms: ['баклажан', 'баклажани', 'баклажанів', 'баклажана'] },
  },
  {
    id: 'beet', name: 'Буряк', cat: 'veg', n: [43, 1.6, 0.2, 9.6, 2.8], fv: true,
    piece: { g: 200, forms: ['буряк', 'буряки', 'буряків', 'буряка'] },
  },
  { id: 'beet-cooked', name: 'Буряк варений (у вакуумі)', cat: 'veg', n: [44, 1.7, 0.2, 10, 2], fv: true },
  { id: 'mushrooms', name: 'Печериці', cat: 'veg', n: [22, 3.1, 0.3, 3.3, 1], fv: true },
  {
    id: 'greens', name: 'Зелень (кріп, петрушка)', cat: 'veg', n: [36, 3, 0.8, 6, 3], fv: true,
    piece: { g: 30, forms: ['пучок', 'пучки', 'пучків', 'пучка'] },
  },
  { id: 'lettuce', name: 'Салат листовий або мікс', cat: 'veg', n: [15, 1.4, 0.2, 2.9, 1.3], fv: true },
  { id: 'sauerkraut', name: 'Квашена капуста', cat: 'veg', n: [19, 0.9, 0.1, 4.3, 2.9], fv: true },

  // ── Фрукти та ягоди ───────────────────────────────────────────────
  {
    id: 'banana', name: 'Банани', cat: 'fruit', n: [89, 1.1, 0.3, 22.8, 2.6], fv: true,
    piece: { g: 120, forms: ['банан', 'банани', 'бананів', 'банана'] },
  },
  {
    id: 'apple', name: 'Яблука', cat: 'fruit', n: [52, 0.3, 0.2, 13.8, 2.4], fv: true,
    piece: { g: 180, forms: ['яблуко', 'яблука', 'яблук', 'яблука'] },
  },
  {
    id: 'pear', name: 'Груші', cat: 'fruit', n: [57, 0.4, 0.1, 15, 3.1], fv: true,
    piece: { g: 170, forms: ['груша', 'груші', 'груш', 'груші'] },
  },
  {
    id: 'orange', name: 'Апельсини або мандарини', cat: 'fruit', n: [47, 0.9, 0.1, 11.8, 2.4], fv: true,
    piece: { g: 150, forms: ['апельсин', 'апельсини', 'апельсинів', 'апельсина'] },
  },
  {
    id: 'lemon', name: 'Лимон', cat: 'fruit', n: [29, 1.1, 0.3, 9.3, 2.8],
    piece: { g: 100, forms: ['лимон', 'лимони', 'лимонів', 'лимона'] },
  },

  // ── Заморожене ────────────────────────────────────────────────────
  { id: 'broccoli', name: 'Броколі заморожена', cat: 'frozen', n: [34, 2.8, 0.4, 6.6, 2.6], fv: true },
  { id: 'cauliflower', name: 'Цвітна капуста заморожена', cat: 'frozen', n: [25, 1.9, 0.3, 5, 2], fv: true },
  { id: 'veg-mix', name: 'Овочева суміш заморожена', cat: 'frozen', n: [45, 2.5, 0.4, 8, 2.5], fv: true },
  { id: 'green-beans', name: 'Стручкова квасоля заморожена', cat: 'frozen', n: [31, 1.8, 0.2, 7, 2.7], fv: true },
  { id: 'peas', name: 'Зелений горошок заморожений', cat: 'frozen', n: [77, 5.2, 0.4, 13.6, 5], fv: true },
  { id: 'spinach', name: 'Шпинат заморожений', cat: 'frozen', n: [23, 2.9, 0.4, 3.6, 2.2], fv: true },
  { id: 'berries', name: 'Ягоди заморожені (мікс)', cat: 'frozen', n: [45, 0.8, 0.3, 10, 3], fv: true },

  // ── Консерви, соління, соуси ──────────────────────────────────────
  { id: 'beans-can', name: 'Квасоля консервована', cat: 'canned', n: [115, 7.5, 0.5, 20, 6], buyHint: '1 банка ≈ 240 г без рідини' },
  { id: 'chickpeas-can', name: 'Нут консервований', cat: 'canned', n: [139, 7, 2.6, 22.5, 7.6], buyHint: '1 банка ≈ 240 г без рідини' },
  { id: 'corn-can', name: 'Кукурудза консервована', cat: 'canned', n: [70, 2.3, 1.2, 13, 2], fv: true, buyHint: '1 банка ≈ 280 г без рідини' },
  { id: 'tomato-can', name: 'Томати у власному соку або пасата', cat: 'canned', n: [24, 1.1, 0.2, 4, 1], fv: true, buyHint: '1 банка ≈ 400 г' },
  { id: 'tomato-paste', name: 'Томатна паста', cat: 'canned', n: [82, 4.3, 0.5, 18.9, 4], spoon: 17 },
  { id: 'pickles', name: 'Огірки квашені або мариновані', cat: 'canned', n: [12, 0.5, 0.1, 2.3, 1] },

  // ── Горіхи та насіння ─────────────────────────────────────────────
  { id: 'walnuts', name: 'Горіхи волоські', cat: 'nuts', n: [654, 15.2, 65.2, 13.7, 6.7], allergens: ['nuts'] },
  { id: 'flax', name: 'Насіння льону', cat: 'nuts', n: [534, 18.3, 42.2, 28.9, 27.3], spoon: 10 },
  { id: 'peanut-butter', name: 'Арахісова паста без цукру', cat: 'nuts', n: [588, 25, 50, 20, 6], allergens: ['peanut'], spoon: 16 },
  { id: 'sunflower-seeds', name: 'Насіння соняшнику очищене', cat: 'nuts', n: [584, 20.8, 51.5, 20, 8.6], spoon: 9 },

  // ── Базовий запас (перевірте вдома) ───────────────────────────────
  { id: 'oil', name: 'Олія (оливкова або соняшникова)', cat: 'pantry', n: [884, 0, 100, 0, 0], liquid: true, spoon: 13, pantry: true },
  { id: 'honey', name: 'Мед', cat: 'pantry', n: [304, 0.3, 0, 82, 0], spoon: 21, pantry: true },
  { id: 'soy-sauce', name: 'Соєвий соус', cat: 'pantry', n: [53, 8, 0.6, 4.9, 0.8], liquid: true, spoon: 16, pantry: true, allergens: ['soy', 'gluten'] },
  { id: 'mustard', name: 'Гірчиця', cat: 'pantry', n: [66, 4.4, 4, 5.8, 3], spoon: 15, pantry: true },
  { id: 'vinegar', name: 'Оцет яблучний', cat: 'pantry', n: [21, 0, 0, 0.9, 0], liquid: true, spoon: 15, pantry: true },
  { id: 'salt', name: 'Сіль йодована', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 18, pantry: true },
  { id: 'black-pepper', name: 'Перець чорний мелений', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 7, pantry: true },
  { id: 'paprika', name: 'Паприка мелена', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 7, pantry: true },
  { id: 'herbs-dry', name: 'Сушені трави (орегано, італійські)', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 3, pantry: true },
  { id: 'cinnamon', name: 'Кориця мелена', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 8, pantry: true },
  { id: 'cumin', name: 'Зіра (кмин) мелена', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 6, pantry: true },
  { id: 'curry', name: 'Каррі або куркума', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 6, pantry: true },
  { id: 'garlic-dry', name: 'Часник сушений', cat: 'pantry', n: [0, 0, 0, 0, 0], spoon: 9, pantry: true },
  {
    id: 'bay-leaf', name: 'Лавровий лист', cat: 'pantry', n: [0, 0, 0, 0, 0], pantry: true,
    piece: { g: 0.2, forms: ['листок', 'листки', 'листків', 'листка'] },
  },
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export function getProduct(id: string): Product {
  const p = PRODUCT_BY_ID[id];
  if (!p) throw new Error(`Невідомий продукт: ${id}`);
  return p;
}
