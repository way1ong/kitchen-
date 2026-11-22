/** Мови інтерфейсу: українська (основна) і угорська. */
export type Lang = 'uk' | 'hu';

/** Переклад кроку рецепта. Поля — ті самі, що й в українському кроці. */
export interface StepTr {
  text: string;
  done?: string;
  look?: string;
  warn?: string;
}

/** Переклад рецепта: назва, порада, примітки до інгредієнтів (за індексом), кроки. */
export interface RecipeTr {
  name: string;
  tip?: string;
  /** Примітки до інгредієнтів: індекс інгредієнта в рецепті → текст */
  notes?: Record<number, string>;
  steps: StepTr[];
}

/** Переклад продукту. unit — одиниця для штук («db», «gerezd», «szelet», «csokor»). */
export interface ProductTr {
  name: string;
  unit?: string;
  buyHint?: string;
}
