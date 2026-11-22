import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PRODUCTS } from '../../data/products';
import type { Equipment, Level } from '../../data/types';
import { dayShort } from '../../logic/dates';
import { hhmm } from '../../logic/format';
import type {
  Exclusion,
  Goal,
  MealsPerDay,
  Profile,
  Training,
  WorkType,
} from '../../logic/profile';
import { trProduct } from '../../i18n/data';
import { locale, type Lang } from '../../i18n';
import { HU, T, UK } from '../../i18n/strings';
import { daySchedule } from '../../logic/schedule';
import { computeTargets } from '../../logic/targets';
import { useStore, type Settings } from '../../state/store';
import { ConfirmButton, EQUIP_ICON, LevelBars } from '../components';
import { Icon } from '../icons';
import { go } from '../nav';

const EQUIP_ORDER: Equipment[] = ['microwave', 'airfryer', 'stove', 'oven', 'blender', 'kettle'];

export function ProfileScreen() {
  const { data, saveProfile } = useStore();
  const [draft, setDraft] = useState<Profile>(data.profile);
  const [saved, setSaved] = useState(false);
  const t = useMemo(() => computeTargets(draft), [draft]);
  // Після відновлення з копії або скидання — підтягуємо новий профіль у форму
  useEffect(() => setDraft(data.profile), [data.profile]);
  const dirty = JSON.stringify({ ...draft, example: false }) !== JSON.stringify({ ...data.profile, example: false }) || data.profile.example;

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [k]: v }));
  };
  const toggleIn = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const commit = (regenerate: boolean) => {
    saveProfile(draft, regenerate);
    setSaved(true);
    if (regenerate) go('menu');
  };

  const workSched = daySchedule(draft, draft.workDays[0] ?? 1);
  const L = T().profile;
  const u = T().units;
  const loc = locale();

  return (
    <div className="screen profile-screen">
      <header className="screen-head">
        <p className="eyebrow">{L.eyebrow}</p>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </header>

      <section className="card result" aria-label={L.resultAria}>
        <p className="result-kcal">
          <span className="num">{t.kcal.toLocaleString(loc)}</span> {L.perDay}
        </p>
        <p className="small muted result-basis">
          {L.basis(
            (draft.sex === 'm' ? L.male : L.female).toLowerCase(),
            draft.age,
            draft.height,
            draft.weight.toLocaleString(loc, { maximumFractionDigits: 1, useGrouping: false }),
            T().work[draft.work].title.toLowerCase(),
            T().training[draft.training].toLowerCase(),
          )}
        </p>
        <dl className="nutr-grid num">
          <div>
            <dt>{T().recipe.nutr.protein}</dt>
            <dd>
              {t.protein} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{T().recipe.nutr.fat}</dt>
            <dd>
              {t.fat} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{T().recipe.nutr.carbs}</dt>
            <dd>
              {t.carbs} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{T().recipe.nutr.fiber}</dt>
            <dd>
              ≥{t.fiber} <small>{u.g}</small>
            </dd>
          </div>
          <div>
            <dt>{T().recipe.nutr.water}</dt>
            <dd>
              ≈{(t.water / 1000).toLocaleString(loc)} <small>{u.l}</small>
            </dd>
          </div>
          <div>
            <dt>{T().recipe.nutr.fv}</dt>
            <dd>
              ≥{t.fv} <small>{u.g}</small>
            </dd>
          </div>
        </dl>
        <ul className="bullets small">
          <li>
            {L.bmrLine(t.bmr, t.pal.toLocaleString(loc), t.tdee.toLocaleString(loc))}
            {draft.goal !== 'maintain' ? L.goalLine(T().goals[draft.goal].title) : ''}
          </li>
          {t.weeklyChange !== 0 ? (
            <li>
              {L.expected(t.weeklyChange < 0 ? '−' : '+', Math.abs(t.weeklyChange).toLocaleString(loc))}
            </li>
          ) : null}
          {t.floorApplied ? <li>{L.floor}</li> : null}
          <li>
            {L.bmiLine(t.bmi.toLocaleString(loc), T().bmi[t.bmiCategory], t.healthyWeight[0], t.healthyWeight[1])}
          </li>
          <li>{L.saltFish}</li>
        </ul>
        <p className="small muted">
          {L.estimate}
        </p>
        <p className="small muted">{L.basisNote}</p>
      </section>

      <Fieldset title={L.about} icon="user">
        <div className="seg" role="radiogroup" aria-label={L.sex}>
          {(['m', 'f'] as const).map((s) => (
            <Radio key={s} name="sex" checked={draft.sex === s} onChange={() => set('sex', s)}>
              {s === 'm' ? L.male : L.female}
            </Radio>
          ))}
        </div>
        <div className="field-grid">
          <NumberField id="age" label={L.age} unit={u.years} value={draft.age} min={16} max={90} onChange={(v) => set('age', v)} />
          <NumberField id="height" label={L.height} unit={u.cm} value={draft.height} min={130} max={220} onChange={(v) => set('height', v)} />
          <NumberField id="weight" label={L.weight} unit={u.kg} value={draft.weight} min={40} max={250} step={0.5} onChange={(v) => set('weight', v)} />
        </div>
      </Fieldset>

      <Fieldset title={L.goal} icon="leaf">
        <div className="option-list">
          {(Object.keys(T().goals) as Goal[]).map((g) => (
            <Radio key={g} name="goal" checked={draft.goal === g} onChange={() => set('goal', g)} card>
              <b>{T().goals[g].title}</b>
              <small>{T().goals[g].text}</small>
            </Radio>
          ))}
        </div>
      </Fieldset>

      <Fieldset title={L.workTraining} icon="briefcase">
        <p className="field-label">{L.workType}</p>
        <div className="option-list two">
          {(Object.keys(T().work) as WorkType[]).map((w) => (
            <Radio key={w} name="work" checked={draft.work === w} onChange={() => set('work', w)} card>
              <b>{T().work[w].title}</b>
              <small>{T().work[w].text}</small>
            </Radio>
          ))}
        </div>
        <p className="field-label">{L.trainingLabel}</p>
        <div className="seg wrap" role="radiogroup" aria-label={L.trainingAria}>
          {([0, 1, 2, 3] as Training[]).map((x) => (
            <Radio key={x} name="training" checked={draft.training === x} onChange={() => set('training', x)}>
              {T().training[x]}
            </Radio>
          ))}
        </div>
      </Fieldset>

      <Fieldset title={L.schedule} icon="clock">
        <p className="field-label">{L.workDays}</p>
        <div className="day-toggles" role="group" aria-label={L.workDaysAria}>
          {[1, 2, 3, 4, 5, 6, 7].map((wd, i) => {
            const d = dayShort(wd);
            const on = draft.workDays.includes(i + 1);
            return (
              <button
                key={wd}
                type="button"
                className={`day-toggle ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => set('workDays', toggleIn(draft.workDays, i + 1).sort())}
              >
                <span>{d}</span>
                <span className="day-toggle-mark" aria-hidden="true">
                  {on ? <Icon name="check" size={14} strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="field-grid">
          <TimeField id="work-start" label={L.workStart} value={draft.workStart} onChange={(v) => set('workStart', v)} />
          <TimeField id="work-end" label={L.workEnd} value={draft.workEnd} onChange={(v) => set('workEnd', v)} />
          <NumberField id="commute" label={L.commute} unit={u.min} value={draft.commute} min={0} max={180} step={5} onChange={(v) => set('commute', v)} />
        </div>
        <Toggle id="remote" checked={draft.remote} onChange={(v) => set('remote', v)}>
          {L.remote}
        </Toggle>
        {!draft.remote ? (
          <Toggle id="mw-work" checked={draft.microwaveAtWork} onChange={(v) => set('microwaveAtWork', v)}>
            {L.microwaveAtWork}
          </Toggle>
        ) : null}
        <div className="field-grid">
          <TimeField id="wake" label={L.wake} value={draft.wake} onChange={(v) => set('wake', v)} />
          <TimeField id="sleep" label={L.sleep} value={draft.sleep} onChange={(v) => set('sleep', v)} />
          <TimeField id="wwake" label={L.weekendWake} value={draft.weekendWake} onChange={(v) => set('weekendWake', v)} />
          <TimeField id="wsleep" label={L.weekendSleep} value={draft.weekendSleep} onChange={(v) => set('weekendSleep', v)} />
        </div>
        <p className="field-label">{L.meals}</p>
        <div className="seg" role="radiogroup" aria-label={L.mealsAria}>
          {([3, 4, 5] as MealsPerDay[]).map((m) => (
            <Radio key={m} name="meals" checked={draft.meals === m} onChange={() => set('meals', m)}>
              {m}
            </Radio>
          ))}
        </div>
        {draft.workDays.length ? (
          <div className="schedule-preview">
            <p className="small">
              <b>{L.workdayLike}</b>{' '}
              {L.shiftKinds[workSched.kind === 'off' ? 'day' : workSched.kind]}
            </p>
            <ul className="mini-schedule num">
              {workSched.slots.map((s) => (
                <li key={s.key}>
                  <b>{hhmm(s.time)}</b> {T().slots[s.label]}
                  {s.atWork ? (
                    <span className="tag">
                      <Icon name="lunchbox" size={14} /> {T().common.takeAwayLower}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Fieldset>

      <Fieldset title={L.kitchen} icon="stove">
        <p className="field-label">{L.haveEquipment}</p>
        <div className="chip-row">
          {EQUIP_ORDER.map((e) => {
            const on = draft.equipment.includes(e);
            return (
              <button
                key={e}
                type="button"
                className={`chip chip-lg ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => set('equipment', toggleIn(draft.equipment, e))}
              >
                <Icon name={EQUIP_ICON[e]} size={20} />
                {T().equipment[e].label}
                {on ? <Icon name="check" size={16} /> : null}
              </button>
            );
          })}
        </div>
        <p className="field-label">{L.maxLevel}</p>
        <div className="option-list">
          {([1, 2, 3] as Level[]).map((l) => (
            <Radio key={l} name="level" checked={draft.maxLevel === l} onChange={() => set('maxLevel', l)} card>
              <span className={`level-line lvl-${l}`}>
                <LevelBars level={l} size={18} />
                <b>
                  {T().levels[l].short} · {T().levels[l].title}
                </b>
              </span>
              <small>{T().levels[l].text}</small>
            </Radio>
          ))}
        </div>
        <p className="small muted">{L.levelNote}</p>
        <p className="field-label">{L.cookTime}</p>
        <div className="field-grid">
          <SelectField
            id="cook-weekday"
            label={L.weekdays}
            value={draft.cookWeekday}
            options={[15, 20, 30, 45, 60]}
            onChange={(v) => set('cookWeekday', v)}
          />
          <SelectField
            id="cook-weekend"
            label={L.weekends}
            value={draft.cookWeekend}
            options={[30, 45, 60, 90, 120]}
            onChange={(v) => set('cookWeekend', v)}
          />
          <NumberField id="people" label={L.people} unit={L.peopleUnit} value={draft.people} min={1} max={8} onChange={(v) => set('people', v)} />
        </div>
        <Toggle id="batch" checked={draft.batch} onChange={(v) => set('batch', v)}>
          {L.batch}
        </Toggle>
      </Fieldset>

      <Fieldset title={L.restrictions} icon="alert">
        <div className="chip-row">
          {(Object.keys(T().exclusions) as Exclusion[]).map((x) => {
            const on = draft.exclude.includes(x);
            return (
              <button key={x} type="button" className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => set('exclude', toggleIn(draft.exclude, x))}>
                {on ? <Icon name="check" size={16} /> : null}
                {T().exclusions[x]}
              </button>
            );
          })}
        </div>
        <Dislikes value={draft.dislikes} onChange={(v) => set('dislikes', v)} />
      </Fieldset>

      <div className={`save-bar ${dirty ? 'is-visible' : ''}`}>
        {saved && !dirty ? (
          <span className="saved">
            <Icon name="check" /> {L.saved}
          </span>
        ) : (
          <>
            <button type="button" className="btn btn-primary" onClick={() => commit(true)}>
              <Icon name="refresh" />
              {L.saveRegen}
            </button>
            <button type="button" className="btn" onClick={() => commit(false)}>
              {L.saveOnly}
            </button>
          </>
        )}
      </div>

      <AppearanceAndData />
    </div>
  );
}

function Fieldset({ title, icon, children }: { title: string; icon: Parameters<typeof Icon>[0]['name']; children: ReactNode }) {
  return (
    <fieldset className="card fieldset">
      <legend>
        <Icon name={icon} size={20} />
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Radio({
  name,
  checked,
  onChange,
  children,
  card = false,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  card?: boolean;
}) {
  return (
    <label className={`radio ${card ? 'radio-card' : ''} ${checked ? 'is-on' : ''}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="radio-mark" aria-hidden="true">
        {checked ? <span className="radio-dot" /> : null}
      </span>
      <span className="radio-body">{children}</span>
    </label>
  );
}

function NumberField({
  id,
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const show = (v: number) => v.toLocaleString(locale(), { maximumFractionDigits: 1, useGrouping: false });
  const [text, setText] = useState(show(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(show(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  // Приймаємо і кому, і крапку: «78,5» = «78.5»
  const parsed = parseFloat(text.replace(',', '.'));
  const valid = !Number.isNaN(parsed) && parsed >= min && parsed <= max;
  const decimals = step < 1;
  return (
    <label className="field" htmlFor={id}>
      <span className="field-name">{label}</span>
      <span className={`field-input ${valid ? '' : 'is-invalid'}`}>
        <input
          id={id}
          type="text"
          inputMode={decimals ? 'decimal' : 'numeric'}
          autoComplete="off"
          value={text}
          aria-invalid={!valid}
          aria-describedby={valid ? undefined : `${id}-err`}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.,]/g, '');
            setText(raw);
            const v = parseFloat(raw.replace(',', '.'));
            if (!Number.isNaN(v) && v >= min && v <= max) onChange(Math.round(v * 10) / 10);
          }}
          onFocus={() => (focused.current = true)}
          onBlur={() => {
            focused.current = false;
            if (valid) setText(show(value));
          }}
        />
        <span className="unit">{unit}</span>
      </span>
      {valid ? null : (
        <span className="field-error" id={`${id}-err`}>
          <Icon name="alert" size={16} />
          {T().profile.range(min, max, show(value))}
        </span>
      )}
    </label>
  );
}

function TimeField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-name">{label}</span>
      <span className="field-input">
        <input id={id} type="time" value={value} onChange={(e) => e.target.value && onChange(e.target.value)} />
      </span>
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  options: number[];
  onChange: (v: number) => void;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-name">{label}</span>
      <span className="field-input">
        <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))}>
          {options.map((o) => (
            <option key={o} value={o}>
              {T().profile.upTo(o)}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function Toggle({ id, checked, onChange, children }: { id: string; checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-ui" aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}

function nameOf(id: string): string {
  const p = PRODUCTS.find((x) => x.id === id);
  return p ? trProduct(p).name : id;
}

function Dislikes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState('');
  const options = PRODUCTS.filter((p) => !p.pantry).map((p) => trProduct(p));
  const found = q.trim()
    ? options.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()) && !value.includes(p.id)).slice(0, 8)
    : [];
  return (
    <div className="dislikes">
      <label className="field" htmlFor="dislike-search">
        <span className="field-name">{T().profile.dislikes}</span>
        <span className="field-input">
          <input id="dislike-search" type="search" placeholder={T().profile.dislikesPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
        </span>
      </label>
      {found.length ? (
        <div className="chip-row">
          {found.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              onClick={() => {
                onChange([...value, p.id]);
                setQ('');
              }}
            >
              <Icon name="plus" size={16} />
              {p.name}
            </button>
          ))}
        </div>
      ) : null}
      {value.length ? (
        <div className="chip-row">
          {value.map((id) => (
            <button key={id} type="button" className="chip is-on" onClick={() => onChange(value.filter((x) => x !== id))} aria-label={T().profile.remove(nameOf(id))}>
              {nameOf(id)}
              <Icon name="close" size={16} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AppearanceAndData() {
  const { data, setSettings, importData, resetAll } = useStore();
  const [backup, setBackup] = useState<string | null>(null);
  const [restore, setRestore] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const exportData = async () => {
    const json = JSON.stringify(data);
    try {
      await navigator.clipboard.writeText(json);
      setMsg(T().profile.backupCopied);
      setBackup(null);
    } catch {
      setBackup(json);
      setMsg(T().profile.copyManually);
    }
  };

  const L = T().profile;
  const fonts: { v: Settings['font']; label: string }[] = [
    { v: 0, label: L.fonts[0] },
    { v: 1, label: L.fonts[1] },
    { v: 2, label: L.fonts[2] },
  ];
  const themes: { v: Settings['theme']; label: string }[] = [
    { v: 'auto', label: L.themes.auto },
    { v: 'light', label: L.themes.light },
    { v: 'dark', label: L.themes.dark },
  ];
  const langs: { v: Lang; label: string }[] = [
    { v: 'uk', label: UK.langName },
    { v: 'hu', label: HU.langName },
  ];

  return (
    <>
      <fieldset className="card fieldset">
        <legend>
          <Icon name="sun" size={20} />
          {L.settings}
        </legend>
        <p className="field-label">{L.language}</p>
        <div className="seg wrap" role="radiogroup" aria-label={L.language}>
          {langs.map((x) => (
            <Radio key={x.v} name="lang" checked={data.settings.lang === x.v} onChange={() => setSettings({ lang: x.v })}>
              {x.label}
            </Radio>
          ))}
        </div>
        <Toggle id="has-thermometer" checked={data.settings.thermometer} onChange={(v) => setSettings({ thermometer: v })}>
          {L.hasThermo}
        </Toggle>
        <Toggle id="color-hints" checked={data.settings.colorHints} onChange={(v) => setSettings({ colorHints: v })}>
          {L.colorHints}
        </Toggle>
        <p className="field-label">{L.fontSize}</p>
        <div className="seg wrap" role="radiogroup" aria-label={L.fontSize}>
          {fonts.map((f) => (
            <Radio key={f.v} name="font" checked={data.settings.font === f.v} onChange={() => setSettings({ font: f.v })}>
              {f.label}
            </Radio>
          ))}
        </div>
        <p className="field-label">{L.theme}</p>
        <div className="seg wrap" role="radiogroup" aria-label={L.theme}>
          {themes.map((th) => (
            <Radio key={th.v} name="theme" checked={data.settings.theme === th.v} onChange={() => setSettings({ theme: th.v })}>
              {th.label}
            </Radio>
          ))}
        </div>
      </fieldset>

      <fieldset className="card fieldset">
        <legend>
          <Icon name="copy" size={20} />
          {L.backup}
        </legend>
        <p className="small muted">
          {L.backupNote}
        </p>
        <div className="actions-row">
          <button type="button" className="btn" onClick={exportData}>
            <Icon name="copy" />
            {L.copyBackup}
          </button>
        </div>
        {msg ? <p className="small" role="status">{msg}</p> : null}
        {backup ? <textarea id="backup-out" className="copy-area" readOnly value={backup} onFocus={(e) => e.currentTarget.select()} /> : null}
        <label className="field" htmlFor="backup-in">
          <span className="field-name">{L.restore}</span>
          <textarea id="backup-in" className="copy-area" placeholder={L.restorePlaceholder} value={restore} onChange={(e) => setRestore(e.target.value)} />
        </label>
        <div className="actions-row">
          <button
            type="button"
            className="btn"
            disabled={!restore.trim()}
            onClick={() => {
              const ok = importData(restore);
              setMsg(ok ? L.restored : L.restoreFail);
              if (ok) setRestore('');
            }}
          >
            {L.restoreBtn}
          </button>
          <ConfirmButton className="btn btn-ghost" confirmText={L.resetConfirm} onConfirm={resetAll}>
            {L.reset}
          </ConfirmButton>
        </div>
      </fieldset>
    </>
  );
}
