/**
 * Типи даних додатку.
 *
 * Важливо для людей з порушенням кольоросприйняття: у рецептах НІКОЛИ не
 * використовуємо колір як ознаку готовності («до золотистої скоринки»,
 * «доки м'ясо не перестане бути рожевим»). Замість цього — час, температура
 * всередині продукту (термометр), текстура, звук і запах.
 */

export type Level = 1 | 2 | 3;

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** Обладнання. stove = плита (сковорода або каструля). */
export type Equipment = 'microwave' | 'airfryer' | 'stove' | 'oven' | 'blender' | 'kettle';

/**
 * lunchbox    — зручно взяти з собою на роботу в контейнері
 * cold        — смачно і безпечно їсти холодним (якщо на роботі немає мікрохвильовки)
 * batch       — добре готувати із запасом: розігрівається без втрати смаку
 * prep-ahead  — готується заздалегідь (з вечора)
 * quick       — до 10 хвилин
 * no-cook     — без термічної обробки
 */
export type Tag = 'lunchbox' | 'cold' | 'batch' | 'prep-ahead' | 'quick' | 'no-cook';

/** Основне джерело білка — для різноманітності меню. */
export type MainProtein =
  | 'chicken'
  | 'turkey'
  | 'beef'
  | 'pork'
  | 'fish'
  | 'egg'
  | 'dairy'
  | 'legumes';

/** Відділи магазину — для групування списку покупок. */
export type ShopCat =
  | 'veg'
  | 'fruit'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'grain'
  | 'canned'
  | 'frozen'
  | 'nuts'
  | 'pantry';

export type Allergen = 'gluten' | 'dairy' | 'egg' | 'fish' | 'nuts' | 'peanut' | 'soy';

export type AnimalKind = 'poultry' | 'beef' | 'pork' | 'fish';

/** [ккал, білки, жири, вуглеводи, клітковина] на 100 г (або 100 мл). */
export type Nutr100 = [kcal: number, protein: number, fat: number, carbs: number, fiber: number];

export interface Product {
  id: string;
  /** Назва для списку покупок, називний відмінок: «Куряче філе». */
  name: string;
  cat: ShopCat;
  n: Nutr100;
  /**
   * Вага однієї штуки (г) і форми слова для чисел:
   * [1 / 21 …, 2–4 …, 5+ …, дробові (½, 1,5)] — напр. ['яйце','яйця','яєць','яйця'].
   */
  piece?: { g: number; forms: [string, string, string, string] };
  /** Округлювати штуки до цілих (яйця). */
  whole?: boolean;
  /** Рідина — показуємо в мл. */
  liquid?: boolean;
  /** Грамів в 1 столовій ложці — малі кількості показуємо ложками. */
  spoon?: number;
  /** Базовий запас (сіль, спеції, олія) — у списку покупок «перевірте вдома». */
  pantry?: boolean;
  /** Зараховується до овочів/фруктів (ВООЗ: ≥ 400 г на день; картопля не рахується). */
  fv?: boolean;
  allergens?: Allergen[];
  animal?: AnimalKind;
  /** Підказка для покупки: «1 банка ≈ 240 г без рідини». */
  buyHint?: string;
}

export interface Ingredient {
  /** id продукту з products.ts */
  p: string;
  /** Кількість на ВЕСЬ рецепт (усі порції), г або мл. 0 = «за смаком». */
  g: number;
  /** Уточнення: «кубиками 2 см», «без рідини». */
  note?: string;
  /** Необов'язковий: не входить у калорії та список покупок. */
  opt?: boolean;
}

export interface Step {
  /** Що зробити. */
  text: string;
  /** Таймер у секундах — у кроці з'явиться кнопка «Запустити таймер». */
  timer?: number;
  /** Як зрозуміти, що готово, БЕЗ орієнтиру на колір. */
  done?: string;
  /** Цільова температура всередині продукту, °C (перевірка термометром). */
  temp?: number;
  /** Попередження з безпеки. */
  warn?: string;
}

export interface Recipe {
  /** ASCII-slug, унікальний (використовується в посиланнях #recipe-…). */
  id: string;
  name: string;
  level: Level;
  meals: MealType[];
  /** Усе обладнання, яке потрібне. */
  equipment: Equipment[];
  /** Активний час (руками), хв. */
  activeMin: number;
  /** Загальний час, хв. */
  totalMin: number;
  /** Скільки базових порцій дає рецепт. */
  servings: number;
  main: MainProtein;
  tags: Tag[];
  /** Скільки днів зберігається готова страва в холодильнику (0 — їсти одразу). */
  fridgeDays?: number;
  freezer?: boolean;
  ingredients: Ingredient[];
  steps: Step[];
  /** Порада або заміна. */
  tip?: string;
}

/** Розраховані поживні речовини. */
export interface Nutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  /** Овочі та фрукти, г (для мети ВООЗ ≥ 400 г/день). */
  fv: number;
}
