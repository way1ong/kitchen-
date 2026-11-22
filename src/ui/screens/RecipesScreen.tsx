import { useMemo, useState } from 'react';
import { RECIPES } from '../../data/recipes';
import type { Equipment, Level, MealType, Recipe } from '../../data/types';
import { minutesText } from '../../logic/format';
import { allowedRecipe } from '../../logic/planner';
import { LEVEL_INFO } from '../../logic/profile';
import { perServing } from '../../logic/recipeNutrition';
import { useStore } from '../../state/store';
import { EquipList, LevelBadge, LevelBars } from '../components';
import { Icon } from '../icons';

type MealFilter = 'all' | 'breakfast' | 'main' | 'snack';
type ToolFilter = 'all' | Equipment | 'nocook';

const MEAL_FILTERS: { id: MealFilter; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'breakfast', label: 'Сніданки' },
  { id: 'main', label: 'Обіди й вечері' },
  { id: 'snack', label: 'Перекуси' },
];

const TOOL_FILTERS: { id: ToolFilter; label: string }[] = [
  { id: 'all', label: 'Будь-чим' },
  { id: 'microwave', label: 'Мікрохвильовка' },
  { id: 'airfryer', label: 'Аерогриль' },
  { id: 'stove', label: 'Плита' },
  { id: 'oven', label: 'Духовка' },
  { id: 'nocook', label: 'Без плити й духовки' },
];

function matchesMeal(r: Recipe, f: MealFilter) {
  if (f === 'all') return true;
  if (f === 'main') return r.meals.includes('lunch') || r.meals.includes('dinner');
  return r.meals.includes(f as MealType);
}

function matchesTool(r: Recipe, f: ToolFilter) {
  if (f === 'all') return true;
  if (f === 'nocook') return !r.equipment.includes('stove') && !r.equipment.includes('oven');
  return r.equipment.includes(f);
}

export function RecipesScreen() {
  const { data, setRecipeCtx } = useStore();
  const [level, setLevel] = useState<Level | 0>(0);
  const [meal, setMeal] = useState<MealFilter>('all');
  const [tool, setTool] = useState<ToolFilter>('all');
  const [mine, setMine] = useState(true);
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter(
      (r) =>
        (level === 0 || r.level === level) &&
        matchesMeal(r, meal) &&
        matchesTool(r, tool) &&
        (!mine || allowedRecipe(r, { ...data.profile, maxLevel: 3 })) &&
        (!q || r.name.toLowerCase().includes(q)),
    );
  }, [level, meal, tool, mine, query, data.profile]);

  const counts = useMemo(() => [1, 2, 3].map((l) => RECIPES.filter((r) => r.level === l).length), []);

  return (
    <div className="screen">
      <header className="screen-head">
        <p className="eyebrow">{RECIPES.length} рецептів · 3 рівні</p>
        <h1>Рецепти</h1>
        <p className="sub">Почніть з рівня 1 — а коли стане легко, переходьте вище.</p>
      </header>

      <div className="level-tabs" role="tablist" aria-label="Рівень складності">
        <button
          type="button"
          role="tab"
          aria-selected={level === 0}
          className={`level-tab ${level === 0 ? 'is-active' : ''}`}
          onClick={() => setLevel(0)}
        >
          <span className="level-tab-title">Усі</span>
          <span className="level-tab-count num">{RECIPES.length}</span>
        </button>
        {([1, 2, 3] as Level[]).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={level === l}
            className={`level-tab lvl-${l} ${level === l ? 'is-active' : ''}`}
            onClick={() => setLevel(l)}
          >
            <LevelBars level={l} size={18} />
            <span className="level-tab-title">{LEVEL_INFO[l].title}</span>
            <span className="level-tab-count num">{counts[l - 1]}</span>
          </button>
        ))}
      </div>
      {level ? <p className="level-desc">{LEVEL_INFO[level].text}</p> : null}

      <div className="filters">
        <label className="search">
          <Icon name="search" size={20} />
          <input
            id="recipe-search"
            type="search"
            placeholder="Пошук: гречка, курка, сирники…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="chip-row" role="group" aria-label="Прийом їжі">
          {MEAL_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${meal === f.id ? 'is-on' : ''}`}
              aria-pressed={meal === f.id}
              onClick={() => setMeal(f.id)}
            >
              {meal === f.id ? <Icon name="check" size={16} /> : null}
              {f.label}
            </button>
          ))}
        </div>
        <div className="chip-row" role="group" aria-label="Чим готувати">
          {TOOL_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${tool === f.id ? 'is-on' : ''}`}
              aria-pressed={tool === f.id}
              onClick={() => setTool(f.id)}
            >
              {tool === f.id ? <Icon name="check" size={16} /> : null}
              {f.label}
            </button>
          ))}
        </div>
        <label className="switch">
          <input id="only-mine" type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
          <span className="switch-ui" aria-hidden="true" />
          <span>Лише те, що можу приготувати (моє обладнання й обмеження)</span>
        </label>
      </div>

      {list.length ? (
        <ul className="recipe-grid">
          {list.map((r) => (
            <li key={r.id}>
              <RecipeCard
                r={r}
                onOpen={() => {
                  setRecipeCtx({ id: r.id, servings: r.servings, mine: 1 });
                  window.location.hash = `recipe-${r.id}`;
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Нічого не знайдено. Змініть фільтри або вимкніть «Лише те, що можу приготувати».</p>
      )}
    </div>
  );
}

function RecipeCard({ r, onOpen }: { r: Recipe; onOpen: () => void }) {
  const n = perServing(r);
  return (
    <button type="button" className={`recipe-card lvl-${r.level}`} onClick={onOpen}>
      <span className="recipe-card-top">
        <LevelBadge level={r.level} />
        <EquipList recipe={r} />
      </span>
      <span className="recipe-card-name">{r.name}</span>
      <span className="meal-meta">
        <span className="meta-item">
          <Icon name="clock" size={16} />
          {minutesText(r.totalMin)}
          {r.activeMin < r.totalMin ? <span className="muted"> (руками {r.activeMin})</span> : null}
        </span>
      </span>
      <span className="meal-nums num">
        <span>
          <b>{Math.round(n.kcal)}</b> ккал
        </span>
        <span>
          Б <b>{Math.round(n.protein)}</b> г
        </span>
        <span>
          на <b>1</b> порцію
        </span>
      </span>
      <span className="tag-row">
        {r.tags.includes('lunchbox') ? (
          <span className="tag">
            <Icon name="lunchbox" size={16} /> З собою
          </span>
        ) : null}
        {r.tags.includes('prep-ahead') ? (
          <span className="tag">
            <Icon name="feather" size={16} /> З вечора
          </span>
        ) : null}
        {r.tags.includes('batch') ? (
          <span className="tag">
            <Icon name="repeat" size={16} /> На 2–3 дні
          </span>
        ) : null}
      </span>
    </button>
  );
}
