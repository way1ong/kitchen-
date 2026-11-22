import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { clock, timerLabel } from '../logic/format';
import { T } from '../i18n/strings';
import { Icon } from './icons';

/**
 * Кухонні таймери: кілька одночасно, сигнал звуком + вібрацією + великим
 * написом «Готово!» (не лише кольором). Відлік прив’язаний до годинника,
 * тож працює навіть якщо телефон «пригальмовує» фонову вкладку.
 */

export interface KitchenTimer {
  id: string;
  label: string;
  total: number;
  /** Мітка часу завершення (мс) або null, якщо на паузі */
  endAt: number | null;
  /** Залишок, коли на паузі (с) */
  left: number;
  done: boolean;
}

interface TimerApi {
  timers: KitchenTimer[];
  now: number;
  start: (label: string, seconds: number) => void;
  toggle: (id: string) => void;
  addMinute: (id: string) => void;
  remove: (id: string) => void;
}

const Ctx = createContext<TimerApi | null>(null);

let audio: AudioContext | null = null;
function ensureAudio() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!audio) audio = new AC();
    if (audio.state === 'suspended') void audio.resume();
  } catch {
    audio = null;
  }
}

function beep() {
  if (!audio) return;
  try {
    const t0 = audio.currentTime;
    for (let i = 0; i < 3; i++) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'square';
      o.frequency.value = i === 2 ? 1046 : 880;
      g.gain.setValueAtTime(0.0001, t0 + i * 0.32);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + i * 0.32 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.32 + 0.24);
      o.connect(g).connect(audio.destination);
      o.start(t0 + i * 0.32);
      o.stop(t0 + i * 0.32 + 0.26);
    }
  } catch {
    /* без звуку */
  }
}

function vibrate() {
  try {
    navigator.vibrate?.([400, 150, 400, 150, 600]);
  } catch {
    /* немає вібрації */
  }
}

export function remaining(t: KitchenTimer, now: number): number {
  if (t.done) return 0;
  if (t.endAt === null) return t.left;
  return Math.max(0, (t.endAt - now) / 1000);
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useState<KitchenTimer[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const ringing = useRef<Map<string, number>>(new Map());

  const active = timers.some((t) => !t.done);
  const anyDone = timers.some((t) => t.done);

  // Поки є таймери, панель займає низ екрана — даємо сторінці більше місця знизу
  useEffect(() => {
    document.body.classList.toggle('has-timers', timers.length > 0);
  }, [timers.length]);

  useEffect(() => {
    if (!active && !anyDone) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [active, anyDone]);

  // Завершення таймерів
  useEffect(() => {
    const finished = timers.filter((t) => !t.done && t.endAt !== null && t.endAt <= now);
    if (!finished.length) return;
    setTimers((ts) => ts.map((t) => (finished.some((f) => f.id === t.id) ? { ...t, done: true, left: 0 } : t)));
    for (const f of finished) {
      beep();
      vibrate();
      ringing.current.set(f.id, Date.now());
    }
  }, [now, timers]);

  // Повторюємо сигнал кожні 4 с протягом хвилини, доки не вимкнуть
  useEffect(() => {
    for (const [id, since] of ringing.current) {
      if (!timers.some((t) => t.id === id && t.done)) {
        ringing.current.delete(id);
        continue;
      }
      const elapsed = now - since;
      if (elapsed > 60000) continue;
      const slot = Math.floor(elapsed / 4000);
      const key = `${id}:${slot}`;
      if (slot > 0 && !beeped.has(key)) {
        beeped.add(key);
        beep();
      }
    }
  }, [now, timers]);

  const start = useCallback((label: string, seconds: number) => {
    ensureAudio();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setTimers((ts) => [...ts, { id, label, total: seconds, endAt: Date.now() + seconds * 1000, left: seconds, done: false }]);
    setNow(Date.now());
  }, []);

  const toggle = useCallback((id: string) => {
    ensureAudio();
    setTimers((ts) =>
      ts.map((t) => {
        if (t.id !== id || t.done) return t;
        if (t.endAt === null) return { ...t, endAt: Date.now() + t.left * 1000 };
        return { ...t, left: Math.max(0, (t.endAt - Date.now()) / 1000), endAt: null };
      }),
    );
  }, []);

  const addMinute = useCallback((id: string) => {
    setTimers((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t;
        if (t.done) return { ...t, done: false, endAt: Date.now() + 60000, left: 60, total: t.total + 60 };
        if (t.endAt === null) return { ...t, left: t.left + 60, total: t.total + 60 };
        return { ...t, endAt: t.endAt + 60000, total: t.total + 60 };
      }),
    );
  }, []);

  const remove = useCallback((id: string) => setTimers((ts) => ts.filter((t) => t.id !== id)), []);

  const api = useMemo(() => ({ timers, now, start, toggle, addMinute, remove }), [timers, now, start, toggle, addMinute, remove]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

const beeped = new Set<string>();

export function useTimers(): TimerApi {
  const c = useContext(Ctx);
  if (!c) throw new Error('TimerProvider відсутній');
  return c;
}

/**
 * Кнопка таймера в кроці рецепта. Один таймер на крок: якщо він уже йде,
 * кнопка показує відлік і ставить на паузу, а не запускає ще один.
 */
export function TimerButton({ seconds, label, big = false }: { seconds: number; label: string; big?: boolean }) {
  const { start, timers, now, toggle, remove } = useTimers();
  const t = timers.find((x) => x.label === label);
  const size = big ? 'btn-lg' : '';
  if (!t) {
    return (
      <button
        type="button"
        className={`btn btn-timer ${size}`}
        onClick={() => start(label, seconds)}
        aria-label={T().timers.start(timerLabel(seconds), label)}
      >
        <Icon name="timer" />
        {T().timers.one(timerLabel(seconds))}
      </button>
    );
  }
  if (t.done) {
    return (
      <button type="button" className={`btn btn-timer is-done ${size}`} onClick={() => remove(t.id)}>
        <Icon name="bell" />
        {T().timers.doneOff}
      </button>
    );
  }
  const paused = t.endAt === null;
  return (
    <button
      type="button"
      className={`btn btn-timer is-running ${size}`}
      onClick={() => toggle(t.id)}
      aria-label={paused ? T().timers.resumeAria : T().timers.pauseAria}
    >
      <Icon name={paused ? 'play' : 'pause'} />
      {paused ? T().timers.pause : T().timers.running} · <span className="num">{clock(remaining(t, now))}</span>
    </button>
  );
}

function TimerChip({ t, now }: { t: KitchenTimer; now: number }) {
  const { toggle, addMinute, remove } = useTimers();
  const left = remaining(t, now);
  const paused = t.endAt === null && !t.done;
  return (
    <div className={`timer-chip ${t.done ? 'is-done' : ''}`} role={t.done ? 'alert' : undefined}>
      <span className="timer-icon">
        <Icon name={t.done ? 'bell' : 'timer'} />
      </span>
      <span className="timer-text">
        <span className="timer-label">{t.label}</span>
        <span className="timer-time num">
          {t.done ? T().timers.done : paused ? T().timers.paused(clock(left)) : clock(left)}
        </span>
      </span>
      <span className="timer-actions">
        {!t.done ? (
          <button type="button" className="icon-btn" onClick={() => toggle(t.id)} aria-label={paused ? T().timers.resume : T().timers.pause}>
            <Icon name={paused ? 'play' : 'pause'} />
          </button>
        ) : null}
        <button type="button" className="chip-btn" onClick={() => addMinute(t.id)} aria-label={T().timers.addMinute}>
          {T().timers.plusMinute}
        </button>
        <button
          type="button"
          className={t.done ? 'btn btn-primary btn-sm' : 'icon-btn'}
          onClick={() => remove(t.id)}
          aria-label={t.done ? T().timers.stopAlarm : T().timers.cancel}
        >
          {t.done ? T().timers.off : <Icon name="close" />}
        </button>
      </span>
    </div>
  );
}

/**
 * Панель таймерів над нижнім меню. Показує найтерміновіший таймер
 * (той, що задзвонив, — завжди першим), решта — під кнопкою «Ще N».
 */
export function TimerDock() {
  const { timers, now, remove } = useTimers();
  const [open, setOpen] = useState(false);
  if (!timers.length) return null;
  const sorted = [...timers].sort((a, b) =>
    a.done !== b.done ? (a.done ? -1 : 1) : remaining(a, now) - remaining(b, now),
  );
  const rest = sorted.length - 1;
  const shown = open ? sorted : sorted.slice(0, 1);
  return (
    <section className="timer-dock" aria-label={T().timers.dock}>
      <div className={`timer-list ${open ? 'is-open' : ''}`}>
        {shown.map((t) => (
          <TimerChip key={t.id} t={t} now={now} />
        ))}
      </div>
      {rest > 0 ? (
        <div className="timer-more">
          {open ? (
            <button type="button" className="chip-btn" onClick={() => sorted.forEach((t) => remove(t.id))}>
              {T().timers.cancelAll}
            </button>
          ) : null}
          <button type="button" className="chip-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'chevronDown' : 'chevronUp'} size={18} />
            {open ? T().timers.collapse : T().timers.more(rest)}
          </button>
        </div>
      ) : null}
    </section>
  );
}
