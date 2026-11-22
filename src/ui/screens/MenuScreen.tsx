import { useMemo, useState } from 'react';
import { RECIPE_BY_ID } from '../../data/recipes';
import type { Level } from '../../data/types';
import { dayFull, dayMonth, dayShort } from '../../logic/dates';
import { trRecipe } from '../../i18n/data';
import { locale } from '../../i18n';
import { T } from '../../i18n/strings';
import { fraction, hhmm, minutesText } from '../../logic/format';
import {
  dayTotals,
  emptySlots,
  matchingDays,
  profileKey,
  slotOptions,
  todayIndex,
  type MealChoice,
  type OptionNote,
  type Plan,
  type PlanEntry,
  type SlotOption,
} from '../../logic/planner';
import type { Profile } from '../../logic/profile';
import { portion } from '../../logic/recipeNutrition';
import { daySchedule, type DaySchedule, type Slot } from '../../logic/schedule';
import { computeTargets } from '../../logic/targets';
import { planDate, planIsCurrentWeek, useStore, type RecipeContext } from '../../state/store';
import { Banner, Checkbox, ConfirmButton, EquipList, LevelBadge, LevelBars, Meter, Sheet } from '../components';
import { Icon, type IconName } from '../icons';
import { HungerHelper } from '../HungerHelper';
import { go } from '../nav';

/** Контекст для сторінки рецепта: скільки готувати і яка ваша порція. */
function entryContext(plan: Plan, dayIndex: number, entry: PlanEntry, slot: Slot, profile: Profile): RecipeContext {
  const lunchExtra =
    entry.extraFor !== undefined
      ? plan.days[entry.extraFor]?.entries.find((x) => x.leftoverFrom === dayIndex)?.mult ?? 0
      : 0;
  const family = Math.max(0, profile.people - 1);
  const familyHere = family > 0 && !slot.atWork && entry.leftoverFrom === undefined && (slot.type === 'dinner' || slot.type === 'lunch');
  if (entry.leftoverFrom !== undefined) {
    return { id: entry.recipe, servings: entry.mult, mine: entry.mult, leftover: true, note: T().menu.leftoverNote };
  }
  const parts = [T().menu.yourPortion(fraction(entry.mult))];
  if (lunchExtra) parts.push(T().menu.forLunch(fraction(lunchExtra)));
  if (familyHere) parts.push(T().menu.forFamily(family));
  return { id: entry.recipe, servings: entry.mult + lunchExtra + (familyHere ? family : 0), mine: entry.mult, note: parts.join(' + ') };
}

export function MenuScreen() {
  const { data, newPlan, fillEmpty } = useStore();
  const plan = data.plan;
  const p = data.profile;
  const t = useMemo(() => computeTargets(p), [p]);
  const empties = useMemo(() => (plan ? emptySlots(plan, p) : []), [plan, p]);
  const ti = plan ? todayIndex(plan) : -1;
  const [sel, setSel] = useState(ti >= 0 ? ti : 0);
  const [hungry, setHungry] = useState(false);

  const L = T().menu;
  if (!plan) {
    return (
      <div className="screen">
        <h1>{L.title}</h1>
        <button type="button" className="btn btn-primary" onClick={() => newPlan()}>
          {L.create}
        </button>
      </div>
    );
  }

  const start = planDate(plan, 0);
  const end = planDate(plan, 6);
  const outdated = plan.profileKey !== profileKey(p);
  const current = planIsCurrentWeek(plan);
  const day = plan.days[sel];
  const sched = daySchedule(p, day.weekday);

  return (
    <div className="screen">
      <header className="screen-head">
        <p className="eyebrow">
          {dayMonth(start)} — {dayMonth(end)}
        </p>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.goal} <b className="num">{t.kcal.toLocaleString(locale())} {T().units.kcal}</b> {L.and}{' '}
          <b className="num">{L.goalProtein(t.protein)}</b> {L.goalTail(p.meals)}
        </p>
      </header>

      {p.example ? (
        <Banner
          icon="user"
          action={
            <button type="button" className="btn btn-primary" onClick={() => go('profile')}>
              {L.fillProfile}
            </button>
          }
        >
          <b>{L.exampleBold}</b> {L.exampleText}
        </Banner>
      ) : null}

      {!current && !p.example ? (
        <Banner
          icon="calendar"
          action={
            <button type="button" className="btn btn-primary" onClick={() => newPlan()}>
              {L.thisWeek}
            </button>
          }
        >
          {L.lastWeek}
        </Banner>
      ) : null}

      {outdated && !p.example ? (
        <Banner
          icon="refresh"
          action={
            <button type="button" className="btn btn-primary" onClick={() => newPlan()}>
              {L.update}
            </button>
          }
        >
          {L.outdated}
        </Banner>
      ) : null}

      {empties.length ? (
        <Banner
          icon="list"
          action={
            <button type="button" className="btn btn-primary" onClick={() => fillEmpty()}>
              <Icon name="refresh" />
              {L.fillRest}
            </button>
          }
        >
          <b>{L.emptyCount(empties.length)}</b> {L.emptyText}
        </Banner>
      ) : null}

      <WeekStrip plan={plan} sel={sel} today={ti} onSelect={setSel} profile={p} />

      <section className="day-head" aria-live="polite">
        <h2>
          {dayFull(day.weekday)}, {dayMonth(planDate(plan, sel))}
          {sel === ti ? <span className="today-tag">{T().common.today}</span> : null}
        </h2>
        <DayKindLine sched={sched} />
      </section>

      <DaySummary plan={plan} sel={sel} kcal={t.kcal} protein={t.protein} fv={t.fv} />

      {sel === ti ? <NextMeal plan={plan} sel={sel} sched={sched} profile={p} /> : null}

      <button type="button" className="btn btn-block hungry-btn" onClick={() => setHungry(true)}>
        <Icon name="feather" />
        {T().hunger.button}
      </button>
      <Sheet open={hungry} onClose={() => setHungry(false)} title={T().hunger.sheetTitle}>
        <HungerHelper />
      </Sheet>

      <PrepNotes plan={plan} sel={sel} profile={p} />

      <ol className="meal-list">
        {sched.slots.map((slot) => {
          const e = day.entries.find((x) => x.slot === slot.key);
          return (
            <li key={slot.key}>
              <MealCard slot={slot} entry={e} plan={plan} dayIndex={sel} profile={p} />
            </li>
          );
        })}
      </ol>

      {sched.kind === 'night' || sched.kind === 'evening' ? <ShiftTips kind={sched.kind} /> : null}

      <div className="actions-row">
        <button type="button" className="btn btn-primary" onClick={() => go('shopping')}>
          <Icon name="basket" />
          {L.shoppingList}
        </button>
        <ConfirmButton icon="refresh" confirmText={L.regenConfirm} onConfirm={() => newPlan('auto')}>
          {L.regen}
        </ConfirmButton>
        <ConfirmButton icon="list" confirmText={L.manualConfirm} onConfirm={() => newPlan('empty')}>
          {L.manual}
        </ConfirmButton>
      </div>
    </div>
  );
}

function WeekStrip({
  plan,
  sel,
  today,
  onSelect,
  profile,
}: {
  plan: Plan;
  sel: number;
  today: number;
  onSelect: (i: number) => void;
  profile: Profile;
}) {
  return (
    <nav className="week-strip" aria-label={T().menu.weekNav}>
      {plan.days.map((d, i) => {
        const work = profile.workDays.includes(d.weekday);
        return (
          <button
            key={d.date}
            type="button"
            className={`day-btn ${i === sel ? 'is-selected' : ''} ${i === today ? 'is-today' : ''}`}
            aria-pressed={i === sel}
            aria-label={T().menu.dayAria(dayFull(d.weekday), i === today, work)}
            onClick={() => onSelect(i)}
          >
            <span className="day-name">{dayShort(d.weekday)}</span>
            <span className="day-num num">{planDate(plan, i).getDate()}</span>
            <span className="day-kind" aria-hidden="true">
              <Icon name={work ? 'briefcase' : 'home'} size={14} />
            </span>
            {i === today ? <span className="day-today-dot" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </nav>
  );
}

function DayKindLine({ sched }: { sched: DaySchedule }) {
  if (sched.kind === 'off') {
    return (
      <p className="day-kind-line">
        <Icon name="home" size={18} /> {T().menu.dayOff}
      </p>
    );
  }
  const names = T().menu.kinds;
  return (
    <p className="day-kind-line">
      <Icon name={sched.kind === 'night' ? 'moon' : 'briefcase'} size={18} /> {names[sched.kind]}{' '}
      <span className="num">
        {hhmm(sched.workStart ?? 0)}–{hhmm(sched.workEnd ?? 0)}
      </span>
    </p>
  );
}

function DaySummary({ plan, sel, kcal, protein, fv }: { plan: Plan; sel: number; kcal: number; protein: number; fv: number }) {
  const n = dayTotals(plan.days[sel]);
  return (
    <section className="card summary" aria-label={T().menu.summary}>
      <Meter label={T().menu.kcalLabel} value={n.kcal} target={kcal} unit={T().units.kcal} />
      <Meter label={T().menu.proteinLabel} value={n.protein} target={protein} unit={T().units.g} tolerance={0.12} />
      <Meter label={T().menu.fvLabel} value={n.fv} target={fv} unit={T().units.g} icon="leaf" minOnly />
    </section>
  );
}

function NextMeal({ plan, sel, sched, profile }: { plan: Plan; sel: number; sched: DaySchedule; profile: Profile }) {
  const { setRecipeCtx } = useStore();
  const now = new Date();
  let m = now.getHours() * 60 + now.getMinutes();
  if (m < sched.wake - 60) m += 1440;
  const slot = sched.slots.find((s) => s.time + 30 >= m);
  if (!slot) return null;
  const e = plan.days[sel].entries.find((x) => x.slot === slot.key);
  const r = e && !e.out ? RECIPE_BY_ID[e.recipe] : undefined;
  if (!e || (!r && !e.out)) return null;
  const soon = slot.time <= m + 30;
  return (
    <section className="next-meal" aria-label={T().menu.next}>
      <span className="next-when">
        <Icon name="clock" size={18} /> {soon ? T().menu.nowAt : T().menu.nextAt} <b className="num">{hhmm(slot.time)}</b> · {T().slots[slot.label]}
      </span>
      {r ? (
        <a className="next-name" href={`#recipe-${r.id}`} onClick={() => setRecipeCtx(entryContext(plan, sel, e, slot, profile))}>
          {trRecipe(r).name}
          <Icon name="chevronRight" size={18} />
        </a>
      ) : (
        <span className="next-name">
          <Icon name="bowl" size={18} />
          {slot.atWork ? T().menu.outTitleCanteen : T().menu.outTitleAway}
        </span>
      )}
    </section>
  );
}

function PrepNotes({ plan, sel, profile }: { plan: Plan; sel: number; profile: Profile }) {
  const notes: { icon: 'repeat' | 'feather' | 'lunchbox' | 'alert'; text: string }[] = [];
  const day = plan.days[sel];
  const sched = daySchedule(profile, day.weekday);

  for (const e of day.entries) {
    const r = RECIPE_BY_ID[e.recipe];
    if (!r) continue;
    if (e.extraFor !== undefined) {
      const lunch = plan.days[e.extraFor]?.entries.find((x) => x.leftoverFrom === sel);
      notes.push({
        icon: 'repeat',
        text: T().menu.prepExtra(trRecipe(r).name, fraction(lunch?.mult ?? 1)),
      });
    }
  }
  const away = day.entries.filter((e) => {
    const s = sched.slots.find((x) => x.key === e.slot);
    return s?.atWork && e.leftoverFrom === undefined && !e.out && !!RECIPE_BY_ID[e.recipe];
  });
  if (away.length) {
    notes.push({
      icon: 'lunchbox',
      text: T().menu.prepTakeAway(away.map((e) => trRecipe(RECIPE_BY_ID[e.recipe]).name).join('; ')),
    });
  }
  const next = plan.days[sel + 1];
  if (next) {
    for (const e of next.entries) {
      const r = RECIPE_BY_ID[e.recipe];
      if (r?.tags.includes('prep-ahead')) {
        notes.push({ icon: 'feather', text: T().menu.prepTonight(trRecipe(r).name, r.activeMin) });
      }
      if (r && e.leftoverFrom === undefined && r.ingredients.some((i) => ['hake', 'pollock', 'salmon'].includes(i.p))) {
        notes.push({
          icon: 'alert',
          text: T().menu.prepFish(trRecipe(r).name),
        });
      }
    }
  }
  if (!notes.length) return null;
  return (
    <section className="card prep" aria-label={T().menu.prepTitle}>
      <h3>{T().menu.prepTitle}</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>
            <Icon name={n.icon} size={20} />
            <span>{n.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MealCard({
  slot,
  entry,
  plan,
  dayIndex,
  profile,
}: {
  slot: Slot;
  entry?: PlanEntry;
  plan: Plan;
  dayIndex: number;
  profile: Profile;
}) {
  const { setRecipeCtx } = useStore();
  const [open, setOpen] = useState(false);
  const L = T().menu;
  const r = entry && !entry.out ? RECIPE_BY_ID[entry.recipe] : undefined;
  const picker = open ? (
    <PickSheet onClose={() => setOpen(false)} plan={plan} dayIndex={dayIndex} slot={slot} profile={profile} entry={entry} />
  ) : null;

  if (entry?.out) {
    return (
      <article className="meal is-out">
        <MealTime slot={slot} out />
        <div className="meal-out">
          <h3>
            <Icon name="bowl" size={22} />
            {slot.atWork ? L.outTitleCanteen : L.outTitleAway}
          </h3>
          <p className="num">{L.outKcal(entry.out.kcal)}</p>
          <details className="out-tips">
            <summary>
              <Icon name="bulb" size={18} />
              {slot.atWork ? L.outTipsCanteen : L.outTipsAway}
            </summary>
            <ul className="bullets">
              {L.outTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </details>
        </div>
        <div className="meal-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
            <Icon name="swap" size={18} /> {L.change}
          </button>
        </div>
        {picker}
      </article>
    );
  }

  if (!entry || !r) {
    return (
      <article className="meal is-empty">
        <MealTime slot={slot} />
        <p className="meal-empty-text">{L.notChosen}</p>
        <button type="button" className="btn btn-primary btn-block" onClick={() => setOpen(true)}>
          <Icon name="plus" />
          {L.choose}
        </button>
        {picker}
      </article>
    );
  }

  const n = portion(r, entry.mult);
  const lunchExtra =
    entry.extraFor !== undefined
      ? plan.days[entry.extraFor]?.entries.find((x) => x.leftoverFrom === dayIndex)?.mult ?? 0
      : 0;
  const family = Math.max(0, profile.people - 1);
  const familyHere = family > 0 && !slot.atWork && entry.leftoverFrom === undefined && (slot.type === 'dinner' || slot.type === 'lunch');

  const openRecipe = () => {
    setRecipeCtx(entryContext(plan, dayIndex, entry, slot, profile));
    window.location.hash = `recipe-${r.id}`;
  };

  return (
    <article className={`meal ${entry.leftoverFrom !== undefined ? 'is-leftover' : ''}`}>
      <MealTime slot={slot} />
      <button type="button" className="meal-main" onClick={openRecipe}>
        <h3>{trRecipe(r).name}</h3>
        <span className="meal-meta">
          <LevelBadge level={r.level} />
          <span className="meta-item">
            <Icon name="clock" size={16} />
            {entry.leftoverFrom !== undefined ? L.reheat : minutesText(r.totalMin)}
          </span>
          <EquipList recipe={r} />
        </span>
        <span className="meal-nums num">
          <span>
            <b>{Math.round(n.kcal)}</b> {T().units.kcal}
          </span>
          <span>
            {T().units.proteinShort} <b>{Math.round(n.protein)}</b> {T().units.g}
          </span>
          <span>
            {T().common.portion} <b>{fraction(entry.mult)}</b>
          </span>
        </span>
        {entry.leftoverFrom !== undefined ? (
          <span className="tag">
            <Icon name="repeat" size={16} /> {L.leftoverTag}
          </span>
        ) : null}
        {lunchExtra ? (
          <span className="tag">
            <Icon name="repeat" size={16} /> {L.extraTag(fraction(lunchExtra))}
          </span>
        ) : null}
        {familyHere ? (
          <span className="tag">
            <Icon name="user" size={16} /> {L.familyTag(family)}
          </span>
        ) : null}
        <span className="meal-open" aria-hidden="true">
          <Icon name="chevronRight" />
        </span>
      </button>
      <div className="meal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
          <Icon name="swap" size={18} /> {T().common.replace}
        </button>
      </div>
      {picker}
    </article>
  );
}

function MealTime({ slot, out = false }: { slot: Slot; out?: boolean }) {
  return (
    <div className="meal-time">
      <span className="time num">{hhmm(slot.time)}</span>
      <span className="slot-label">{T().slots[slot.label]}</span>
      {slot.atWork && !out ? (
        <span className="tag tag-strong">
          <Icon name="lunchbox" size={16} /> {T().common.takeAway}
        </span>
      ) : null}
      {slot.light ? (
        <span className="tag">
          <Icon name="feather" size={16} /> {T().common.light}
        </span>
      ) : null}
      {slot.hint ? <span className="slot-hint">{T().slotHints[slot.hint]}</span> : null}
    </div>
  );
}

const NOTE_ICON: Record<OptionNote, IconName> = { level: 'info', time: 'clock', portable: 'lunchbox' };

/**
 * Вибір страви на прийом їжі: «поза домом / у їдальні», фільтр за рівнем,
 * спершу страви, що підходять, далі — інші з поясненням чому.
 */
function PickSheet({
  onClose,
  plan,
  dayIndex,
  slot,
  profile,
  entry,
}: {
  onClose: () => void;
  plan: Plan;
  dayIndex: number;
  slot: Slot;
  profile: Profile;
  entry?: PlanEntry;
}) {
  const { pick } = useStore();
  const [level, setLevel] = useState<0 | Level>(0);
  const [more, setMore] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const options = useMemo(() => slotOptions(plan, dayIndex, slot.key, profile), [plan, dayIndex, slot.key, profile]);
  const others = useMemo(
    () => matchingDays(plan, dayIndex, slot.key, profile).filter((i) => i !== dayIndex),
    [plan, dayIndex, slot.key, profile],
  );
  const L = T().menu;
  const shown = level ? options.filter((o) => o.recipe.level === level) : options;
  const fits = shown.filter((o) => o.fits);
  const rest = shown.filter((o) => !o.fits);
  const showRest = more || !fits.length;
  const current = entry && !entry.out ? RECIPE_BY_ID[entry.recipe] : undefined;
  const outKcal = Math.round((computeTargets(profile).kcal * slot.share) / 10) * 10;
  const outName = slot.atWork ? L.outTitleCanteen : L.outTitleAway;

  const choose = (choice: MealChoice) => {
    pick(dayIndex, slot.key, choice, repeat ? others : []);
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={(entry ? L.swapTitle : L.chooseTitle)(T().slots[slot.label])}>
      {current || entry?.out ? (
        <p className="muted">
          {L.swapNow} <b>{current ? trRecipe(current).name : outName}</b>.
        </p>
      ) : null}
      <p className="small muted">{L.pickHint}</p>

      {others.length ? (
        <Checkbox checked={repeat} onChange={setRepeat}>
          {L.repeat(others.map((i) => dayShort(plan.days[i].weekday)).join(', '))}
        </Checkbox>
      ) : null}

      {slot.type !== 'snack' ? (
        <button
          type="button"
          className={`alt alt-out ${entry?.out ? 'is-current' : ''}`}
          aria-current={entry?.out ? 'true' : undefined}
          onClick={() => choose({ out: true })}
        >
          <span className="alt-name">
            <Icon name="bowl" size={20} />
            {slot.atWork ? L.outCanteen : L.outAway}
          </span>
          <span className="small">{L.outPick(outKcal)}</span>
          {entry?.out ? (
            <span className="tag">
              <Icon name="check" size={16} /> {L.currentTag}
            </span>
          ) : null}
        </button>
      ) : null}

      <div className="chip-row" role="group" aria-label={T().recipes.levelAria}>
        {([0, 1, 2, 3] as const).map((l) => (
          <button
            key={l}
            type="button"
            className={`chip ${level === l ? 'is-on' : ''}`}
            aria-pressed={level === l}
            onClick={() => setLevel(l)}
          >
            {level === l ? <Icon name="check" size={16} /> : null}
            {l ? (
              <>
                <LevelBars level={l} />
                {T().levels[l].title}
              </>
            ) : (
              L.levelAll
            )}
          </button>
        ))}
      </div>

      {fits.length ? (
        <>
          <h3 className="pick-head">{L.fitsTitle(fits.length)}</h3>
          <OptionList items={fits} onPick={(id) => choose({ recipe: id })} />
        </>
      ) : null}

      {rest.length ? (
        <>
          {fits.length ? (
            <button type="button" className="btn btn-ghost pick-more" aria-expanded={showRest} onClick={() => setMore(!more)}>
              <Icon name={showRest ? 'chevronUp' : 'chevronDown'} />
              {L.otherTitle(rest.length)}
            </button>
          ) : (
            <h3 className="pick-head">{L.otherTitle(rest.length)}</h3>
          )}
          {showRest ? (
            <>
              <p className="small muted">{L.otherHint}</p>
              <OptionList items={rest} onPick={(id) => choose({ recipe: id })} />
            </>
          ) : null}
        </>
      ) : null}

      {!shown.length ? <p>{L.swapNone}</p> : null}

      {entry ? (
        <button type="button" className="btn btn-ghost pick-remove" onClick={() => choose(null)}>
          <Icon name="close" />
          {L.remove}
        </button>
      ) : null}
    </Sheet>
  );
}

function OptionList({ items, onPick }: { items: SlotOption[]; onPick: (id: string) => void }) {
  const L = T().menu;
  const noteText: Record<OptionNote, string> = { level: L.noteLevel, time: L.noteTime, portable: L.notePortable };
  return (
    <ul className="alt-list">
      {items.map((a) => (
        <li key={a.recipe.id}>
          <button
            type="button"
            className={`alt ${a.current ? 'is-current' : ''}`}
            aria-current={a.current ? 'true' : undefined}
            onClick={() => onPick(a.recipe.id)}
          >
            <span className="alt-name">{trRecipe(a.recipe).name}</span>
            <span className="meal-meta">
              <LevelBadge level={a.recipe.level} />
              <span className="meta-item">
                <Icon name="clock" size={16} />
                {minutesText(a.recipe.totalMin)}
              </span>
              <span className="meta-item num">
                {Math.round(a.kcal)} {T().units.kcal} · {T().units.proteinShort} {Math.round(a.protein)} {T().units.g}
              </span>
            </span>
            {a.notes.length ? (
              <span className="alt-notes">
                {a.notes.map((n) => (
                  <span key={n} className="alt-note">
                    <Icon name={NOTE_ICON[n]} size={16} />
                    {noteText[n]}
                  </span>
                ))}
              </span>
            ) : null}
            {a.current ? (
              <span className="tag">
                <Icon name="check" size={16} /> {L.currentTag}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ShiftTips({ kind }: { kind: 'night' | 'evening' }) {
  return (
    <section className="card tips">
      <h3>
        <Icon name="moon" size={20} /> {kind === 'night' ? T().menu.shiftNight : T().menu.shiftEvening}
      </h3>
      <ul className="bullets">
        {(kind === 'night' ? T().menu.shiftNightTips : T().menu.shiftEveningTips).map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
