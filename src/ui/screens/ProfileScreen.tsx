import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PRODUCTS } from '../../data/products';
import type { Equipment, Level } from '../../data/types';
import { DAY_SHORT } from '../../logic/dates';
import { hhmm } from '../../logic/format';
import {
  EQUIPMENT_LABEL,
  EXCLUSION_LABEL,
  GOAL_LABEL,
  LEVEL_INFO,
  TRAINING_LABEL,
  WORK_LABEL,
  type Exclusion,
  type Goal,
  type MealsPerDay,
  type Profile,
  type Training,
  type WorkType,
} from '../../logic/profile';
import { daySchedule } from '../../logic/schedule';
import { BMI_LABEL, computeTargets } from '../../logic/targets';
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

  return (
    <div className="screen profile-screen">
      <header className="screen-head">
        <p className="eyebrow">Дані лишаються лише на цьому пристрої</p>
        <h1>Профіль</h1>
        <p className="sub">Від цих даних залежать калорії, порції, час прийомів їжі і які страви потраплять у меню.</p>
      </header>

      <section className="card result" aria-label="Ваша норма">
        <p className="result-kcal">
          <span className="num">{t.kcal.toLocaleString('uk-UA')}</span> ккал на день
        </p>
        <dl className="nutr-grid num">
          <div>
            <dt>Білки</dt>
            <dd>
              {t.protein} <small>г</small>
            </dd>
          </div>
          <div>
            <dt>Жири</dt>
            <dd>
              {t.fat} <small>г</small>
            </dd>
          </div>
          <div>
            <dt>Вуглеводи</dt>
            <dd>
              {t.carbs} <small>г</small>
            </dd>
          </div>
          <div>
            <dt>Клітковина</dt>
            <dd>
              ≥{t.fiber} <small>г</small>
            </dd>
          </div>
          <div>
            <dt>Вода</dt>
            <dd>
              ≈{(t.water / 1000).toLocaleString('uk-UA')} <small>л</small>
            </dd>
          </div>
          <div>
            <dt>Овочі й фрукти</dt>
            <dd>
              ≥{t.fv} <small>г</small>
            </dd>
          </div>
        </dl>
        <ul className="bullets small">
          <li>
            Базовий обмін {t.bmr} ккал × активність {t.pal.toLocaleString('uk-UA')} = витрати ≈{t.tdee.toLocaleString('uk-UA')} ккал.
            {draft.goal !== 'maintain' ? ` Ціль: ${GOAL_LABEL[draft.goal].title.toLowerCase()}.` : ''}
          </li>
          {t.weeklyChange !== 0 ? (
            <li>
              Очікувано: {t.weeklyChange < 0 ? '−' : '+'}
              {Math.abs(t.weeklyChange).toLocaleString('uk-UA')} кг на тиждень.
            </li>
          ) : null}
          {t.floorApplied ? <li>Калорії не опускаємо нижче базового обміну — так безпечніше.</li> : null}
          <li>
            Індекс маси тіла {t.bmi.toLocaleString('uk-UA')} — {BMI_LABEL[t.bmiCategory]} (здоровий діапазон для вашого зросту:{' '}
            {t.healthyWeight[0]}–{t.healthyWeight[1]} кг). ІМТ не враховує м’язи.
          </li>
          <li>Сіль — до 5 г на день (1 ч. л. з усім, що в їжі). Риба — 2 рази на тиждень.</li>
        </ul>
        <p className="small muted">
          Це оцінка з похибкою ±10 %. Зважуйтесь 2–3 рази на тиждень зранку і дивіться на тренд за 2–3 тижні: якщо вага не
          змінюється — зменшіть ціль на 100–150 ккал. За хронічних хвороб (діабет, нирки, серце) узгодьте харчування з лікарем.
        </p>
      </section>

      <Fieldset title="Про вас" icon="user">
        <div className="seg" role="radiogroup" aria-label="Стать">
          {(['m', 'f'] as const).map((s) => (
            <Radio key={s} name="sex" checked={draft.sex === s} onChange={() => set('sex', s)}>
              {s === 'm' ? 'Чоловік' : 'Жінка'}
            </Radio>
          ))}
        </div>
        <div className="field-grid">
          <NumberField id="age" label="Вік" unit="років" value={draft.age} min={16} max={90} onChange={(v) => set('age', v)} />
          <NumberField id="height" label="Зріст" unit="см" value={draft.height} min={130} max={220} onChange={(v) => set('height', v)} />
          <NumberField id="weight" label="Вага" unit="кг" value={draft.weight} min={40} max={250} step={0.5} onChange={(v) => set('weight', v)} />
        </div>
      </Fieldset>

      <Fieldset title="Мета" icon="leaf">
        <div className="option-list">
          {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
            <Radio key={g} name="goal" checked={draft.goal === g} onChange={() => set('goal', g)} card>
              <b>{GOAL_LABEL[g].title}</b>
              <small>{GOAL_LABEL[g].text}</small>
            </Radio>
          ))}
        </div>
      </Fieldset>

      <Fieldset title="Робота і тренування" icon="briefcase">
        <p className="field-label">Тип роботи</p>
        <div className="option-list two">
          {(Object.keys(WORK_LABEL) as WorkType[]).map((w) => (
            <Radio key={w} name="work" checked={draft.work === w} onChange={() => set('work', w)} card>
              <b>{WORK_LABEL[w].title}</b>
              <small>{WORK_LABEL[w].text}</small>
            </Radio>
          ))}
        </div>
        <p className="field-label">Тренування (спорт, зал, біг)</p>
        <div className="seg wrap" role="radiogroup" aria-label="Тренування">
          {([0, 1, 2, 3] as Training[]).map((x) => (
            <Radio key={x} name="training" checked={draft.training === x} onChange={() => set('training', x)}>
              {TRAINING_LABEL[x]}
            </Radio>
          ))}
        </div>
      </Fieldset>

      <Fieldset title="Графік" icon="clock">
        <p className="field-label">Робочі дні (день, коли починається зміна)</p>
        <div className="day-toggles" role="group" aria-label="Робочі дні">
          {DAY_SHORT.map((d, i) => {
            const on = draft.workDays.includes(i + 1);
            return (
              <button
                key={d}
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
          <TimeField id="work-start" label="Початок роботи" value={draft.workStart} onChange={(v) => set('workStart', v)} />
          <TimeField id="work-end" label="Кінець роботи" value={draft.workEnd} onChange={(v) => set('workEnd', v)} />
          <NumberField id="commute" label="Дорога в один бік" unit="хв" value={draft.commute} min={0} max={180} step={5} onChange={(v) => set('commute', v)} />
        </div>
        <Toggle id="remote" checked={draft.remote} onChange={(v) => set('remote', v)}>
          Працюю з дому
        </Toggle>
        {!draft.remote ? (
          <Toggle id="mw-work" checked={draft.microwaveAtWork} onChange={(v) => set('microwaveAtWork', v)}>
            На роботі є мікрохвильовка (можна розігріти обід)
          </Toggle>
        ) : null}
        <div className="field-grid">
          <TimeField id="wake" label="Підйом у робочі дні" value={draft.wake} onChange={(v) => set('wake', v)} />
          <TimeField id="sleep" label="Сон у робочі дні" value={draft.sleep} onChange={(v) => set('sleep', v)} />
          <TimeField id="wwake" label="Підйом у вихідні" value={draft.weekendWake} onChange={(v) => set('weekendWake', v)} />
          <TimeField id="wsleep" label="Сон у вихідні" value={draft.weekendSleep} onChange={(v) => set('weekendSleep', v)} />
        </div>
        <p className="field-label">Прийомів їжі на день</p>
        <div className="seg" role="radiogroup" aria-label="Прийомів їжі">
          {([3, 4, 5] as MealsPerDay[]).map((m) => (
            <Radio key={m} name="meals" checked={draft.meals === m} onChange={() => set('meals', m)}>
              {m}
            </Radio>
          ))}
        </div>
        {draft.workDays.length ? (
          <div className="schedule-preview">
            <p className="small">
              <b>Робочий день так:</b>{' '}
              {workSched.kind === 'night' ? 'нічна зміна' : workSched.kind === 'evening' ? 'вечірня зміна' : 'денна зміна'}
            </p>
            <ul className="mini-schedule num">
              {workSched.slots.map((s) => (
                <li key={s.key}>
                  <b>{hhmm(s.time)}</b> {s.label}
                  {s.atWork ? (
                    <span className="tag">
                      <Icon name="lunchbox" size={14} /> з собою
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Fieldset>

      <Fieldset title="Кухня і вміння" icon="stove">
        <p className="field-label">Що є на кухні</p>
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
                {EQUIPMENT_LABEL[e]}
                {on ? <Icon name="check" size={16} /> : null}
              </button>
            );
          })}
        </div>
        <p className="field-label">Найскладніший рівень у меню</p>
        <div className="option-list">
          {([1, 2, 3] as Level[]).map((l) => (
            <Radio key={l} name="level" checked={draft.maxLevel === l} onChange={() => set('maxLevel', l)} card>
              <span className={`level-line lvl-${l}`}>
                <LevelBars level={l} size={18} />
                <b>
                  {LEVEL_INFO[l].short} · {LEVEL_INFO[l].title}
                </b>
              </span>
              <small>{LEVEL_INFO[l].text}</small>
            </Radio>
          ))}
        </div>
        <p className="small muted">У будні меню все одно віддає перевагу простішим стравам, складніші — на вихідні.</p>
        <p className="field-label">Скільки часу готові готувати</p>
        <div className="field-grid">
          <SelectField
            id="cook-weekday"
            label="У будні"
            value={draft.cookWeekday}
            options={[15, 20, 30, 45, 60]}
            onChange={(v) => set('cookWeekday', v)}
          />
          <SelectField
            id="cook-weekend"
            label="У вихідні"
            value={draft.cookWeekend}
            options={[30, 45, 60, 90, 120]}
            onChange={(v) => set('cookWeekend', v)}
          />
          <NumberField id="people" label="Людей на вечерях" unit="вкл. вас" value={draft.people} min={1} max={8} onChange={(v) => set('people', v)} />
        </div>
        <Toggle id="batch" checked={draft.batch} onChange={(v) => set('batch', v)}>
          Готувати вечерю із запасом на обід наступного дня (менше часу біля плити)
        </Toggle>
      </Fieldset>

      <Fieldset title="Обмеження" icon="alert">
        <div className="chip-row">
          {(Object.keys(EXCLUSION_LABEL) as Exclusion[]).map((x) => {
            const on = draft.exclude.includes(x);
            return (
              <button key={x} type="button" className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => set('exclude', toggleIn(draft.exclude, x))}>
                {on ? <Icon name="check" size={16} /> : null}
                {EXCLUSION_LABEL[x]}
              </button>
            );
          })}
        </div>
        <Dislikes value={draft.dislikes} onChange={(v) => set('dislikes', v)} />
      </Fieldset>

      <div className={`save-bar ${dirty ? 'is-visible' : ''}`}>
        {saved && !dirty ? (
          <span className="saved">
            <Icon name="check" /> Збережено
          </span>
        ) : (
          <>
            <button type="button" className="btn btn-primary" onClick={() => commit(true)}>
              <Icon name="refresh" />
              Зберегти і оновити меню
            </button>
            <button type="button" className="btn" onClick={() => commit(false)}>
              Лише зберегти
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
  const [text, setText] = useState(String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);
  return (
    <label className="field" htmlFor={id}>
      <span className="field-name">{label}</span>
      <span className="field-input">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const v = parseFloat(e.target.value.replace(',', '.'));
            if (!Number.isNaN(v) && v >= min && v <= max) onChange(v);
          }}
          onFocus={() => (focused.current = true)}
          onBlur={() => {
            focused.current = false;
            setText(String(value));
          }}
        />
        <span className="unit">{unit}</span>
      </span>
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
              до {o} хв
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

function Dislikes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState('');
  const options = PRODUCTS.filter((p) => !p.pantry);
  const found = q.trim()
    ? options.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()) && !value.includes(p.id)).slice(0, 8)
    : [];
  return (
    <div className="dislikes">
      <label className="field" htmlFor="dislike-search">
        <span className="field-name">Не їм або не люблю</span>
        <span className="field-input">
          <input id="dislike-search" type="search" placeholder="Почніть вводити: буряк, гриби…" value={q} onChange={(e) => setQ(e.target.value)} />
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
            <button key={id} type="button" className="chip is-on" onClick={() => onChange(value.filter((x) => x !== id))} aria-label={`Прибрати: ${PRODUCTS.find((p) => p.id === id)?.name}`}>
              {PRODUCTS.find((p) => p.id === id)?.name}
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
      setMsg('Резервну копію скопійовано. Збережіть її в нотатки або надішліть собі в месенджер.');
      setBackup(null);
    } catch {
      setBackup(json);
      setMsg('Скопіюйте текст нижче вручну.');
    }
  };

  const fonts: { v: Settings['font']; label: string }[] = [
    { v: 0, label: 'Звичайний' },
    { v: 1, label: 'Великий' },
    { v: 2, label: 'Дуже великий' },
  ];
  const themes: { v: Settings['theme']; label: string; icon: 'sun' | 'moon' | 'refresh' }[] = [
    { v: 'auto', label: 'Як у системі', icon: 'refresh' },
    { v: 'light', label: 'Світла', icon: 'sun' },
    { v: 'dark', label: 'Темна', icon: 'moon' },
  ];

  return (
    <>
      <fieldset className="card fieldset">
        <legend>
          <Icon name="sun" size={20} />
          Вигляд
        </legend>
        <p className="field-label">Розмір шрифту</p>
        <div className="seg wrap" role="radiogroup" aria-label="Розмір шрифту">
          {fonts.map((f) => (
            <Radio key={f.v} name="font" checked={data.settings.font === f.v} onChange={() => setSettings({ font: f.v })}>
              {f.label}
            </Radio>
          ))}
        </div>
        <p className="field-label">Тема</p>
        <div className="seg wrap" role="radiogroup" aria-label="Тема">
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
          Резервна копія
        </legend>
        <p className="small muted">
          Профіль і меню зберігаються лише в цьому браузері. Якщо очистити дані браузера — вони зникнуть. Зробіть копію, щоб
          перенести на інший телефон.
        </p>
        <div className="actions-row">
          <button type="button" className="btn" onClick={exportData}>
            <Icon name="copy" />
            Скопіювати копію
          </button>
        </div>
        {msg ? <p className="small" role="status">{msg}</p> : null}
        {backup ? <textarea id="backup-out" className="copy-area" readOnly value={backup} onFocus={(e) => e.currentTarget.select()} /> : null}
        <label className="field" htmlFor="backup-in">
          <span className="field-name">Відновити з копії</span>
          <textarea id="backup-in" className="copy-area" placeholder="Вставте сюди текст резервної копії" value={restore} onChange={(e) => setRestore(e.target.value)} />
        </label>
        <div className="actions-row">
          <button
            type="button"
            className="btn"
            disabled={!restore.trim()}
            onClick={() => {
              const ok = importData(restore);
              setMsg(ok ? 'Дані відновлено.' : 'Не вдалося прочитати копію — перевірте, що вставили текст повністю.');
              if (ok) setRestore('');
            }}
          >
            Відновити
          </button>
          <ConfirmButton className="btn btn-ghost" confirmText="Стерти профіль, меню і позначки на цьому пристрої?" onConfirm={resetAll}>
            Скинути все
          </ConfirmButton>
        </div>
      </fieldset>
    </>
  );
}
