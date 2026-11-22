import { useMemo, useState } from 'react';
import { RECIPE_BY_ID } from '../../data/recipes';
import type { Recipe } from '../../data/types';
import { DAY_FULL, DAY_SHORT, dayMonth } from '../../logic/dates';
import { fraction, hhmm, minutesText } from '../../logic/format';
import { alternatives, dayTotals, profileKey, todayIndex, type Plan, type PlanEntry } from '../../logic/planner';
import type { Profile } from '../../logic/profile';
import { portion } from '../../logic/recipeNutrition';
import { daySchedule, type DaySchedule, type Slot } from '../../logic/schedule';
import { computeTargets } from '../../logic/targets';
import { planDate, planIsCurrentWeek, useStore, type RecipeContext } from '../../state/store';
import { Banner, ConfirmButton, EquipList, LevelBadge, Meter, Sheet } from '../components';
import { Icon } from '../icons';
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
    return { id: entry.recipe, servings: entry.mult, mine: entry.mult, leftover: true, note: 'це залишки вчорашньої вечері — лише розігріти' };
  }
  const parts = [`ваша порція ${fraction(entry.mult)}`];
  if (lunchExtra) parts.push(`${fraction(lunchExtra)} на завтрашній обід`);
  if (familyHere) parts.push(`${family} для родини`);
  return { id: entry.recipe, servings: entry.mult + lunchExtra + (familyHere ? family : 0), mine: entry.mult, note: parts.join(' + ') };
}

export function MenuScreen() {
  const { data, newPlan } = useStore();
  const plan = data.plan;
  const p = data.profile;
  const t = useMemo(() => computeTargets(p), [p]);
  const ti = plan ? todayIndex(plan) : -1;
  const [sel, setSel] = useState(ti >= 0 ? ti : 0);
  const [hungry, setHungry] = useState(false);

  if (!plan) {
    return (
      <div className="screen">
        <h1>Меню на тиждень</h1>
        <button type="button" className="btn btn-primary" onClick={newPlan}>
          Створити меню
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
        <h1>Меню на тиждень</h1>
        <p className="sub">
          Ціль: <b className="num">{t.kcal.toLocaleString('uk-UA')} ккал</b> і{' '}
          <b className="num">{t.protein} г білка</b> на день · {p.meals} прийоми їжі
        </p>
      </header>

      {p.example ? (
        <Banner
          icon="user"
          action={
            <button type="button" className="btn btn-primary" onClick={() => go('profile')}>
              Заповнити профіль
            </button>
          }
        >
          <b>Це приклад</b> для чоловіка 35 років, 180 см, 88 кг з офісною роботою 9:00–18:00. Заповніть свій профіль — і
          калорії, порції та час прийомів їжі підлаштуються під вас.
        </Banner>
      ) : null}

      {!current && !p.example ? (
        <Banner
          icon="calendar"
          action={
            <button type="button" className="btn btn-primary" onClick={newPlan}>
              Меню на цей тиждень
            </button>
          }
        >
          Це меню на минулий тиждень.
        </Banner>
      ) : null}

      {outdated && !p.example ? (
        <Banner
          icon="refresh"
          action={
            <button type="button" className="btn btn-primary" onClick={newPlan}>
              Оновити меню
            </button>
          }
        >
          Профіль змінився після створення меню — порції можуть не відповідати новій нормі.
        </Banner>
      ) : null}

      <WeekStrip plan={plan} sel={sel} today={ti} onSelect={setSel} profile={p} />

      <section className="day-head" aria-live="polite">
        <h2>
          {DAY_FULL[day.weekday - 1]}, {dayMonth(planDate(plan, sel))}
          {sel === ti ? <span className="today-tag">Сьогодні</span> : null}
        </h2>
        <DayKindLine sched={sched} />
      </section>

      <DaySummary plan={plan} sel={sel} kcal={t.kcal} protein={t.protein} fv={t.fv} />

      {sel === ti ? <NextMeal plan={plan} sel={sel} sched={sched} profile={p} /> : null}

      <button type="button" className="btn btn-block hungry-btn" onClick={() => setHungry(true)}>
        <Icon name="feather" />
        Зголоднів? Що з’їсти зараз
      </button>
      <Sheet open={hungry} onClose={() => setHungry(false)} title="Зголоднів — що з’їсти зараз">
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
          Список покупок
        </button>
        <ConfirmButton
          icon="refresh"
          confirmText="Створити нове меню? Поточне і позначки в списку покупок зникнуть."
          onConfirm={newPlan}
        >
          Інше меню на тиждень
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
    <nav className="week-strip" aria-label="Дні тижня">
      {plan.days.map((d, i) => {
        const work = profile.workDays.includes(d.weekday);
        return (
          <button
            key={d.date}
            type="button"
            className={`day-btn ${i === sel ? 'is-selected' : ''} ${i === today ? 'is-today' : ''}`}
            aria-pressed={i === sel}
            aria-label={`${DAY_FULL[d.weekday - 1]}${i === today ? ', сьогодні' : ''}${work ? ', робочий день' : ', вихідний'}`}
            onClick={() => onSelect(i)}
          >
            <span className="day-name">{DAY_SHORT[d.weekday - 1]}</span>
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
        <Icon name="home" size={18} /> Вихідний: є час на рецепти складніші
      </p>
    );
  }
  const names = { day: 'Робочий день', evening: 'Вечірня зміна', night: 'Нічна зміна' } as const;
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
    <section className="card summary" aria-label="Підсумок дня">
      <Meter label="Калорії" value={n.kcal} target={kcal} unit="ккал" />
      <Meter label="Білок" value={n.protein} target={protein} unit="г" tolerance={0.12} />
      <Meter label="Овочі й фрукти" value={n.fv} target={fv} unit="г" icon="leaf" minOnly />
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
  const r = e && RECIPE_BY_ID[e.recipe];
  if (!r) return null;
  const soon = slot.time <= m + 30;
  return (
    <section className="next-meal" aria-label="Наступний прийом їжі">
      <span className="next-when">
        <Icon name="clock" size={18} /> {soon ? 'Зараз' : 'Далі'} о <b className="num">{hhmm(slot.time)}</b> · {slot.label}
      </span>
      <a className="next-name" href={`#recipe-${r.id}`} onClick={() => e && setRecipeCtx(entryContext(plan, sel, e, slot, profile))}>
        {r.name}
        <Icon name="chevronRight" size={18} />
      </a>
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
        text: `Вечеря «${r.name}»: приготуйте із запасом — ще ${fraction(lunch?.mult ?? 1)} порції на завтрашній обід. Охолодіть до 2 годин і поставте контейнер у холодильник.`,
      });
    }
  }
  const away = day.entries.filter((e) => {
    const s = sched.slots.find((x) => x.key === e.slot);
    return s?.atWork && e.leftoverFrom === undefined;
  });
  if (away.length) {
    notes.push({
      icon: 'lunchbox',
      text: `Візьміть із собою: ${away.map((e) => RECIPE_BY_ID[e.recipe]?.name).join('; ')}.`,
    });
  }
  const next = plan.days[sel + 1];
  if (next) {
    for (const e of next.entries) {
      const r = RECIPE_BY_ID[e.recipe];
      if (r?.tags.includes('prep-ahead')) {
        notes.push({ icon: 'feather', text: `Сьогодні ввечері: «${r.name}» на завтра — ${r.activeMin} хв.` });
      }
      if (r && e.leftoverFrom === undefined && r.ingredients.some((i) => ['hake', 'pollock', 'salmon'].includes(i.p))) {
        notes.push({
          icon: 'alert',
          text: `Завтра риба («${r.name}»): якщо вона заморожена — перекладіть із морозилки в холодильник сьогодні ввечері.`,
        });
      }
    }
  }
  if (!notes.length) return null;
  return (
    <section className="card prep" aria-label="Що підготувати">
      <h3>Що підготувати</h3>
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
  const { setRecipeCtx, swap } = useStore();
  const [open, setOpen] = useState(false);
  const r = entry ? RECIPE_BY_ID[entry.recipe] : undefined;

  if (!entry || !r) {
    return (
      <article className="meal">
        <MealTime slot={slot} />
        <p className="muted">Немає рецепта, що підходить під ваші умови. Спробуйте розширити обладнання або рівень у профілі.</p>
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
        <h3>{r.name}</h3>
        <span className="meal-meta">
          <LevelBadge level={r.level} />
          <span className="meta-item">
            <Icon name="clock" size={16} />
            {entry.leftoverFrom !== undefined ? '3 хв розігріти' : minutesText(r.totalMin)}
          </span>
          <EquipList recipe={r} />
        </span>
        <span className="meal-nums num">
          <span>
            <b>{Math.round(n.kcal)}</b> ккал
          </span>
          <span>
            Б <b>{Math.round(n.protein)}</b> г
          </span>
          <span>
            Порція <b>{fraction(entry.mult)}</b>
          </span>
        </span>
        {entry.leftoverFrom !== undefined ? (
          <span className="tag">
            <Icon name="repeat" size={16} /> Залишки вчорашньої вечері
          </span>
        ) : null}
        {lunchExtra ? (
          <span className="tag">
            <Icon name="repeat" size={16} /> Готуйте із запасом: +{fraction(lunchExtra)} на завтрашній обід
          </span>
        ) : null}
        {familyHere ? (
          <span className="tag">
            <Icon name="user" size={16} /> + {family} {family === 1 ? 'порція' : 'порції'} для родини
          </span>
        ) : null}
        <span className="meal-open" aria-hidden="true">
          <Icon name="chevronRight" />
        </span>
      </button>
      <div className="meal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
          <Icon name="swap" size={18} /> Замінити
        </button>
      </div>
      <SwapSheet
        open={open}
        onClose={() => setOpen(false)}
        plan={plan}
        dayIndex={dayIndex}
        slot={slot}
        profile={profile}
        current={r}
        onPick={(id) => {
          swap(dayIndex, slot.key, id);
          setOpen(false);
        }}
      />
    </article>
  );
}

function MealTime({ slot }: { slot: Slot }) {
  return (
    <div className="meal-time">
      <span className="time num">{hhmm(slot.time)}</span>
      <span className="slot-label">{slot.label}</span>
      {slot.atWork ? (
        <span className="tag tag-strong">
          <Icon name="lunchbox" size={16} /> З собою
        </span>
      ) : null}
      {slot.light ? (
        <span className="tag">
          <Icon name="feather" size={16} /> Легко
        </span>
      ) : null}
      {slot.hint ? <span className="slot-hint">{slot.hint}</span> : null}
    </div>
  );
}

function SwapSheet({
  open,
  onClose,
  plan,
  dayIndex,
  slot,
  profile,
  current,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  plan: Plan;
  dayIndex: number;
  slot: Slot;
  profile: Profile;
  current: Recipe;
  onPick: (id: string) => void;
}) {
  const alts = useMemo(
    () => (open ? alternatives(plan, dayIndex, slot.key, profile, 10) : []),
    [open, plan, dayIndex, slot.key, profile],
  );
  return (
    <Sheet open={open} onClose={onClose} title={`Замінити: ${slot.label.toLowerCase()}`}>
      <p className="muted">
        Зараз: <b>{current.name}</b>. Варіанти підібрані під ваш рівень, обладнання і час
        {slot.atWork ? ' та підходять, щоб узяти з собою' : ''}.
      </p>
      {alts.length ? (
        <ul className="alt-list">
          {alts.map((a) => (
            <li key={a.recipe.id}>
              <button type="button" className="alt" onClick={() => onPick(a.recipe.id)}>
                <span className="alt-name">{a.recipe.name}</span>
                <span className="meal-meta">
                  <LevelBadge level={a.recipe.level} />
                  <span className="meta-item">
                    <Icon name="clock" size={16} />
                    {minutesText(a.recipe.totalMin)}
                  </span>
                  <span className="meta-item num">
                    {Math.round(a.kcal)} ккал · Б {Math.round(a.protein)} г
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Інших варіантів немає. Розширте обладнання, рівень або час на готування в профілі.</p>
      )}
    </Sheet>
  );
}

function ShiftTips({ kind }: { kind: 'night' | 'evening' }) {
  return (
    <section className="card tips">
      <h3>
        <Icon name="moon" size={20} /> {kind === 'night' ? 'Нічна зміна: як їсти' : 'Вечірня зміна: як їсти'}
      </h3>
      <ul className="bullets">
        {kind === 'night' ? (
          <>
            <li>Основна їжа — за 1–1,5 год до зміни: білок + повільні вуглеводи (гречка, булгур, цільнозерновий хліб).</li>
            <li>З 00:00 до 06:00 організм гірше перетравлює їжу — на зміні легкий перекус, без важкого і солодкого.</li>
            <li>Пийте воду; каву — не пізніше ніж за 6 год до сну.</li>
            <li>Після зміни — невелика порція, щоб не лягати голодним, але й не переїдати перед сном.</li>
          </>
        ) : (
          <>
            <li>Головний прийом їжі — обід перед роботою.</li>
            <li>Вечерю візьміть у контейнері, щоб не перекушувати фастфудом.</li>
            <li>Після роботи — лише легкий перекус, якщо голодні.</li>
          </>
        )}
      </ul>
    </section>
  );
}
