import { useMemo, useState } from 'react';
import { RECIPES } from '../../data/recipes';
import type { Equipment, Level, MealType, Recipe } from '../../data/types';
import { minutesText } from '../../logic/format';
import { allowedRecipe } from '../../logic/planner';
import { trRecipe } from '../../i18n/data';
import { T } from '../../i18n/strings';
import { perServing } from '../../logic/recipeNutrition';
import { useStore } from '../../state/store';
import { EquipList, LevelBadge, LevelBars } from '../components';
import { Icon } from '../icons';

type MealFilter = 'all' | 'breakfast' | 'main' | 'snack';
type ToolFilter = 'all' | Equipment | 'nocook';

const MEAL_FILTERS: MealFilter[] = ['all', 'breakfast', 'main', 'snack'];

const TOOL_FILTERS: ToolFilter[] = ['all', 'microwave', 'airfryer', 'stove', 'oven', 'nocook'];

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
        (!q || trRecipe(r).name.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)),
    );
  }, [level, meal, tool, mine, query, data.profile, data.settings.lang]);

  const counts = useMemo(() => [1, 2, 3].map((l) => RECIPES.filter((r) => r.level === l).length), []);

  const L = T().recipes;
  return (
    <div className="screen">
      <header className="screen-head">
        <p className="eyebrow">{L.eyebrow(RECIPES.length)}</p>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </header>

      <div className="level-tabs" role="tablist" aria-label={L.levelAria}>
        <button
          type="button"
          role="tab"
          aria-selected={level === 0}
          className={`level-tab ${level === 0 ? 'is-active' : ''}`}
          onClick={() => setLevel(0)}
        >
          <span className="level-tab-title">{L.all}</span>
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
            <span className="level-tab-title">{T().levels[l].title}</span>
            <span className="level-tab-count num">{counts[l - 1]}</span>
          </button>
        ))}
      </div>
      {level ? <p className="level-desc">{T().levels[level].text}</p> : null}

      <div className="filters">
        <label className="search">
          <Icon name="search" size={20} />
          <input
            id="recipe-search"
            type="search"
            placeholder={L.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="chip-row" role="group" aria-label={L.mealAria}>
          {MEAL_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip ${meal === f ? 'is-on' : ''}`}
              aria-pressed={meal === f}
              onClick={() => setMeal(f)}
            >
              {meal === f ? <Icon name="check" size={16} /> : null}
              {L.meals[f]}
            </button>
          ))}
        </div>
        <div className="chip-row" role="group" aria-label={L.toolAria}>
          {TOOL_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip ${tool === f ? 'is-on' : ''}`}
              aria-pressed={tool === f}
              onClick={() => setTool(f)}
            >
              {tool === f ? <Icon name="check" size={16} /> : null}
              {L.tools[f]}
            </button>
          ))}
        </div>
        <label className="switch">
          <input id="only-mine" type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
          <span className="switch-ui" aria-hidden="true" />
          <span>{L.onlyMine}</span>
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
        <p className="empty">{L.empty}</p>
      )}
    </div>
  );
}

function RecipeCard({ r: base, onOpen }: { r: Recipe; onOpen: () => void }) {
  const r = trRecipe(base);
  const n = perServing(r);
  const L = T().recipes;
  const u = T().units;
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
          {r.activeMin < r.totalMin ? <span className="muted">{L.handsOn(minutesText(r.activeMin))}</span> : null}
        </span>
      </span>
      <span className="meal-nums num">
        <span>
          <b>{Math.round(n.kcal)}</b> {u.kcal}
        </span>
        <span>
          {u.proteinShort} <b>{Math.round(n.protein)}</b> {u.g}
        </span>
        <span>
          {L.perPortion}
        </span>
      </span>
      <span className="tag-row">
        {r.tags.includes('lunchbox') ? (
          <span className="tag">
            <Icon name="lunchbox" size={16} /> {L.tagTakeAway}
          </span>
        ) : null}
        {r.tags.includes('prep-ahead') ? (
          <span className="tag">
            <Icon name="feather" size={16} /> {L.tagPrepAhead}
          </span>
        ) : null}
        {r.tags.includes('batch') ? (
          <span className="tag">
            <Icon name="repeat" size={16} /> {L.tagBatch}
          </span>
        ) : null}
      </span>
    </button>
  );
}
