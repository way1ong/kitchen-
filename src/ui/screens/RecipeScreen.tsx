import { useEffect, useMemo, useRef, useState } from 'react';
import { getProduct } from '../../data/products';
import { RECIPE_BY_ID } from '../../data/recipes';
import type { Recipe, Step } from '../../data/types';
import { amountText, fraction, minutesText } from '../../logic/format';
import { trProduct, trRecipe } from '../../i18n/data';
import { T } from '../../i18n/strings';
import { perServing, portion } from '../../logic/recipeNutrition';
import { useStore } from '../../state/store';
import { Callout, Checkbox, EQUIP_ICON, LevelBadge, Stepper } from '../components';
import { Icon, type IconName } from '../icons';
import { canGoBack, lastTabName } from '../nav';
import { TimerButton } from '../timers';

export function RecipeScreen({ id }: { id: string }) {
  const { recipeCtx, data } = useStore();
  const base = RECIPE_BY_ID[id];
  const r = base ? trRecipe(base) : undefined;
  const ctx = recipeCtx && recipeCtx.id === id ? recipeCtx : null;
  const [servings, setServings] = useState<number>(ctx?.servings ?? r?.servings ?? 1);
  const [cooking, setCooking] = useState(false);
  const [have, setHave] = useState<Set<number>>(new Set());

  useEffect(() => {
    setServings(ctx?.servings ?? r?.servings ?? 1);
    setHave(new Set());
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!r) {
    return (
      <div className="screen">
        <BackBar title={T().recipe.notFound} />
        <p>{T().recipe.notFoundText}</p>
      </div>
    );
  }

  const mine = ctx?.mine ?? 1;
  const L = T().recipe;
  const u = T().units;
  const n1 = perServing(r);
  const nm = portion(r, mine);

  return (
    <div className="screen recipe-screen">
      <BackBar title={r.name} />
      <header className="screen-head">
        <LevelBadge level={r.level} long />
        <h1>{r.name}</h1>
        <p className="sub">{T().levels[r.level].text}</p>
      </header>

      {ctx?.leftover ? (
        <Callout kind="temp" title={L.leftoverTitle}>
          {L.leftoverText}
        </Callout>
      ) : null}

      {r.steps.some((s) => s.temp) && !data.settings.thermometer ? (
        <Callout kind="info" title={L.noThermoTitle} icon="thermometer">
          {L.noThermoText}
        </Callout>
      ) : null}

      <section className="facts" aria-label={L.factsAria}>
        <div className="fact">
          <Icon name="clock" />
          <span>
            <b>{minutesText(r.totalMin)}</b>
            <small>{L.handsOn(minutesText(r.activeMin))}</small>
          </span>
        </div>
        {r.equipment.length ? (
          r.equipment.map((e) => (
            <div className="fact" key={e}>
              <Icon name={EQUIP_ICON[e]} />
              <span>
                <b>{T().equipment[e].short}</b>
              </span>
            </div>
          ))
        ) : (
          <div className="fact">
            <Icon name="bowl" />
            <span>
              <b>{T().common.noCook}</b>
            </span>
          </div>
        )}
        {r.fridgeDays ? (
          <div className="fact">
            <Icon name="lunchbox" />
            <span>
              <b>{L.fridge(r.fridgeDays)}</b>
              {r.freezer ? <small>{L.freezer}</small> : null}
            </span>
          </div>
        ) : null}
      </section>

      <section className="card nutrition" aria-label={L.nutritionAria}>
        <h2 className="h-small">{ctx ? L.yourPortion(fraction(mine)) : L.onePortion}</h2>
        <dl className="nutr-grid num">
          <div>
            <dt>{L.nutr.kcal}</dt>
            <dd>
              {Math.round(ctx ? nm.kcal : n1.kcal)} <small>{u.kcal}</small>
            </dd>
          </div>
          <div>
            <dt>{L.nutr.protein}</dt>
            <dd>
              {Math.round(ctx ? nm.protein : n1.protein)} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{L.nutr.fat}</dt>
            <dd>
              {Math.round(ctx ? nm.fat : n1.fat)} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{L.nutr.carbs}</dt>
            <dd>
              {Math.round(ctx ? nm.carbs : n1.carbs)} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{L.nutr.fiber}</dt>
            <dd>
              {Math.round(ctx ? nm.fiber : n1.fiber)} <small>{u.g}</small>
            </dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="ingr-h">
        <div className="card-head">
          <h2 id="ingr-h">{L.ingredients}</h2>
          <Stepper
            label={L.servingsAria}
            value={servings}
            onChange={setServings}
            min={0.5}
            max={12}
            step={0.5}
            format={(v) => L.servingsFmt(fraction(v))}
          />
        </div>
        {ctx?.note ? (
          <p className="muted small">
            <Icon name="info" size={16} />
            {L.cooking(ctx.note)}
          </p>
        ) : null}
        <Ingredients r={r} servings={servings} have={have} setHave={setHave} />
      </section>

      <section aria-labelledby="steps-h">
        <h2 id="steps-h">{L.howTo}</h2>
        <ol className="steps">
          {r.steps.map((s, i) => (
            <li key={i} className="step">
              <span className="step-num num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="step-body">
                <StepContent step={s} recipe={r} index={i} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {r.tip ? (
        <Callout kind="tip" title={T().common.tip}>
          {r.tip}
        </Callout>
      ) : null}

      <div className="sticky-cta">
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => setCooking(true)}>
          <Icon name="play" />
          {L.startCook}
        </button>
      </div>

      {cooking ? <CookMode r={r} servings={servings} onClose={() => setCooking(false)} /> : null}
    </div>
  );
}

function BackBar({ title }: { title: string }) {
  const back = () => {
    if (canGoBack()) window.history.back();
    else window.location.hash = lastTabName();
  };
  return (
    <div className="back-bar">
      <button type="button" className="btn btn-ghost" onClick={back}>
        <Icon name="chevronLeft" />
        {T().common.back}
      </button>
      <span className="back-title">{title}</span>
    </div>
  );
}

function Ingredients({
  r,
  servings,
  have,
  setHave,
}: {
  r: Recipe;
  servings: number;
  have: Set<number>;
  setHave: (s: Set<number>) => void;
}) {
  const k = servings / r.servings;
  const rows = r.ingredients.map((ing, i) => ({ ing, i, p: trProduct(getProduct(ing.p)) }));
  const main = rows.filter((x) => !x.ing.opt && x.ing.g > 0);
  const toTaste = rows.filter((x) => !x.ing.opt && x.ing.g === 0);
  const optional = rows.filter((x) => x.ing.opt);
  const toggle = (i: number, v: boolean) => {
    const s = new Set(have);
    if (v) s.add(i);
    else s.delete(i);
    setHave(s);
  };
  return (
    <>
      <ul className="ingredients">
        {main.map(({ ing, i, p }) => (
          <li key={i}>
            <Checkbox checked={have.has(i)} onChange={(v) => toggle(i, v)} id={`ing-${r.id}-${i}`}>
              <span className="ing-name">
                {p.name}
                {ing.note ? <small> — {ing.note}</small> : null}
              </span>
              <span className="ing-amount num">{amountText(p, ing.g * k, { withGrams: true })}</span>
            </Checkbox>
          </li>
        ))}
      </ul>
      {toTaste.length ? (
        <p className="to-taste">
          <b>{T().recipe.toTaste}</b> {toTaste.map((x) => x.p.name.toLowerCase() + (x.ing.note ? ` (${x.ing.note})` : '')).join(', ')}.
          {toTaste.some((x) => x.p.id === 'salt') ? T().recipe.saltNote : ''}
        </p>
      ) : null}
      {optional.length ? (
        <p className="to-taste">
          <b>{T().recipe.optional}</b>{' '}
          {optional
            .map((x) => `${x.p.name.toLowerCase()} — ${amountText(x.p, x.ing.g * k)}`)
            .join(', ')}
          .
        </p>
      ) : null}
    </>
  );
}

function StepContent({ step, recipe, index, big = false }: { step: Step; recipe: Recipe; index: number; big?: boolean }) {
  return (
    <>
      <p className={big ? 'step-text-big' : 'step-text'}>{step.text}</p>
      {step.timer ? <TimerButton seconds={step.timer} label={T().timers.stepLabel(index + 1, recipe.name)} big={big} /> : null}
      <DoneCheck step={step} />
      {step.warn ? (
        <Callout kind="warn" title={T().common.careful}>
          {step.warn}
        </Callout>
      ) : null}
    </>
  );
}

/**
 * Перевірка готовності трьома способами: ознаки без інструментів (основні, не
 * залежать від кольору), термометр і колір. Якщо термометр є — він перший.
 */
function DoneCheck({ step }: { step: Step }) {
  const { data } = useStore();
  const { thermometer, colorHints } = data.settings;
  const look = colorHints ? step.look : undefined;
  if (!step.temp && !look) {
    return step.done ? (
      <Callout kind="done" title={T().recipe.doneTitle}>
        {step.done}
      </Callout>
    ) : null;
  }
  type Row = { key: string; icon: IconName; title: string; text: string };
  const done: Row | null = step.done
    ? { key: 'done', icon: 'checkCircle', title: step.temp ? T().recipe.noThermo : T().recipe.signs, text: step.done }
    : null;
  const temp: Row | null = step.temp
    ? {
        key: 'temp',
        icon: 'thermometer',
        title: T().recipe.thermoTitle(step.temp),
        text: thermometer
          ? T().recipe.thermoHave
          : T().recipe.thermoNotYet,
      }
    : null;
  const color: Row | null = look ? { key: 'look', icon: 'eye', title: T().recipe.lookTitle, text: look } : null;
  const rows = (thermometer ? [temp, done, color] : [done, color, temp]).filter((r): r is Row => r !== null);
  return (
    <div className="check" role="group" aria-label={T().recipe.checkTitle}>
      <p className="check-title">{T().recipe.checkTitle}</p>
      <ul className="check-list">
        {rows.map((r) => (
          <li key={r.key} className={`check-item check-${r.key}`}>
            <Icon name={r.icon} size={22} />
            <div>
              <strong>{r.title}</strong>
              <span>{r.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Повноекранний режим «крок за кроком»: великий шрифт, екран не гасне. */
function CookMode({ r, servings, onClose }: { r: Recipe; servings: number; onClose: () => void }) {
  const [i, setI] = useState(0);
  const [showIng, setShowIng] = useState(false);
  const [have, setHave] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const total = r.steps.length;
  const step = r.steps[i];

  useWakeLock();

  useEffect(() => {
    ref.current?.focus();
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((x) => Math.min(total - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose, total]);

  const progress = useMemo(() => Array.from({ length: total }, (_, k) => k), [total]);

  return (
    <div className="cook" role="dialog" aria-modal="true" aria-label={T().cook.aria(r.name)} tabIndex={-1} ref={ref}>
      <div className="cook-head">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          <Icon name="close" />
          {T().common.close}
        </button>
        <span className="cook-count num">
          {T().cook.step(i + 1, total)}
        </span>
        <button type="button" className={`btn btn-ghost ${showIng ? 'is-on' : ''}`} aria-pressed={showIng} onClick={() => setShowIng((v) => !v)}>
          <Icon name="list" />
          {T().cook.ingredients}
        </button>
      </div>
      <div className="cook-progress" aria-hidden="true">
        {progress.map((k) => (
          <span key={k} className={k < i ? 'is-past' : k === i ? 'is-now' : ''} />
        ))}
      </div>
      <div className="cook-body">
        {showIng ? (
          <div className="cook-ing">
            <Ingredients r={r} servings={servings} have={have} setHave={setHave} />
          </div>
        ) : (
          <>
            <p className="cook-recipe">{r.name}</p>
            <StepContent step={step} recipe={r} index={i} big />
          </>
        )}
      </div>
      <div className="cook-nav">
        <button type="button" className="btn btn-lg" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>
          <Icon name="chevronLeft" />
          {T().common.back}
        </button>
        {i < total - 1 ? (
          <button type="button" className="btn btn-primary btn-lg" onClick={() => setI((x) => x + 1)}>
            {T().cook.next}
            <Icon name="chevronRight" />
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-lg" onClick={onClose}>
            <Icon name="check" />
            {T().cook.done}
          </button>
        )}
      </div>
    </div>
  );
}

/** Не даємо екрану згаснути, поки відкритий режим готування. */
function useWakeLock() {
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    let cancelled = false;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    const request = async () => {
      try {
        const l = await nav.wakeLock?.request('screen');
        if (cancelled) void l?.release();
        else lock = l ?? null;
      } catch {
        /* не підтримується або відхилено — не критично */
      }
    };
    void request();
    const onVis = () => {
      if (document.visibilityState === 'visible') void request();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVis);
      void lock?.release().catch(() => undefined);
    };
  }, []);
}
