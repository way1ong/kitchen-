import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Equipment, Level, Recipe } from '../data/types';
import { EQUIPMENT_SHORT, LEVEL_INFO } from '../logic/profile';
import { Icon, type IconName } from './icons';

export const EQUIP_ICON: Record<Equipment, IconName> = {
  microwave: 'microwave',
  airfryer: 'airfryer',
  stove: 'stove',
  oven: 'oven',
  blender: 'blender',
  kettle: 'kettle',
};

/** Три стовпчики різної висоти: кількість заповнених = рівень. Форма, а не колір. */
export function LevelBars({ level, size = 16 }: { level: Level; size?: number }) {
  return (
    <svg width={size * 1.15} height={size} viewBox="0 0 18 16" aria-hidden="true" className="level-bars">
      {[0, 1, 2].map((i) => {
        const h = 6 + i * 4;
        const filled = i < level;
        return (
          <rect
            key={i}
            x={1 + i * 6}
            y={15 - h}
            width={4}
            height={h}
            rx={1}
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}

export function LevelBadge({ level, long = false }: { level: Level; long?: boolean }) {
  const info = LEVEL_INFO[level];
  return (
    <span className={`level-badge lvl-${level}`}>
      <LevelBars level={level} />
      <span>
        {long ? `${info.short} · ${info.title}` : info.title}
      </span>
    </span>
  );
}

export function EquipList({ recipe, labels = false }: { recipe: Recipe; labels?: boolean }) {
  if (!recipe.equipment.length) {
    return (
      <span className="equip">
        <Icon name="bowl" size={18} />
        <span className={labels ? '' : 'sr-only'}>Без готування</span>
      </span>
    );
  }
  return (
    <span className="equip-list">
      {recipe.equipment.map((e) => (
        <span className="equip" key={e} title={EQUIPMENT_SHORT[e]}>
          <Icon name={EQUIP_ICON[e]} size={18} />
          <span className={labels ? '' : 'sr-only'}>{EQUIPMENT_SHORT[e]}</span>
        </span>
      ))}
    </span>
  );
}

/**
 * Шкала «факт / ціль». Риска — ціль; перевищення показується штрихуванням
 * і текстом «▲ на 120 більше», нестача — «▼ на 60 менше». Не лише кольором.
 */
export function Meter({
  label,
  value,
  target,
  unit,
  icon,
  tolerance = 0.07,
  minOnly = false,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  icon?: IconName;
  tolerance?: number;
  /** Мета «не менше» (овочі, клітковина): перевищення — це добре */
  minOnly?: boolean;
}) {
  const ratio = target > 0 ? value / target : 0;
  const scale = 1.25; // шкала до 125 % цілі
  const within = Math.abs(ratio - 1) <= tolerance || (minOnly && ratio >= 1);
  const over = !minOnly && ratio > 1 + tolerance;
  const base = (Math.min(ratio, 1) / scale) * 100;
  const extra = ratio > 1 ? ((Math.min(ratio, scale) - 1) / scale) * 100 : 0;
  const diff = Math.round(value - target);
  let status: string;
  if (within) status = minOnly && ratio >= 1 ? 'ціль досягнуто' : 'в межах норми';
  else if (over) status = `▲ на ${Math.abs(diff)} ${unit} більше`;
  else status = `▼ на ${Math.abs(diff)} ${unit} менше`;
  return (
    <div className="meter">
      <div className="meter-head">
        <span className="meter-label">
          {icon ? <Icon name={icon} size={18} /> : null}
          {label}
        </span>
        <span className="meter-value num">
          <b>{Math.round(value)}</b> / {Math.round(target)} {unit}
        </span>
      </div>
      <div
        className="meter-track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={Math.round(target * scale)}
        aria-valuenow={Math.round(value)}
        aria-label={`${label}: ${Math.round(value)} з ${Math.round(target)} ${unit}`}
      >
        <span className="meter-fill" style={{ width: `${base}%` }} />
        {extra > 0 ? (
          <span className={`meter-extra ${minOnly ? 'is-good' : ''}`} style={{ left: `${100 / scale}%`, width: `${extra}%` }} />
        ) : null}
        <span className="meter-target" style={{ left: `${100 / scale}%` }} aria-hidden="true" />
      </div>
      <span className={`meter-status ${within ? 'is-ok' : over ? 'is-over' : 'is-under'}`}>
        {within ? <Icon name="check" size={16} /> : null}
        {status}
      </span>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  id?: string;
}) {
  const auto = useId();
  const cid = id ?? auto;
  return (
    <label className={`check-row ${checked ? 'is-checked' : ''}`} htmlFor={cid}>
      <input id={cid} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check-box" aria-hidden="true">
        {checked ? <Icon name="check" size={20} strokeWidth={3} /> : null}
      </span>
      <span className="check-body">{children}</span>
    </label>
  );
}

export function Stepper({
  value,
  onChange,
  min,
  max,
  step,
  format,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  label: string;
}) {
  const fmt = format ?? String;
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        disabled={value <= min}
        aria-label="Менше"
      >
        <Icon name="minus" />
      </button>
      <output className="stepper-value num" aria-live="polite">
        {fmt(value)}
      </output>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onChange(Math.min(max, Math.round((value + step) * 100) / 100))}
        disabled={value >= max}
        aria-label="Більше"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}

/** Нижня шторка (модальне вікно). */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Закрити">
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

/** Кнопка з підтвердженням усередині сторінки (системні confirm() не завжди доступні). */
export function ConfirmButton({
  children,
  confirmText,
  onConfirm,
  className = 'btn',
  icon,
}: {
  children: ReactNode;
  confirmText: string;
  onConfirm: () => void;
  className?: string;
  icon?: IconName;
}) {
  const [ask, setAsk] = useState(false);
  if (!ask) {
    return (
      <button type="button" className={className} onClick={() => setAsk(true)}>
        {icon ? <Icon name={icon} /> : null}
        {children}
      </button>
    );
  }
  return (
    <div className="confirm" role="group" aria-label={confirmText}>
      <span className="confirm-text">
        <Icon name="alert" size={20} /> {confirmText}
      </span>
      <div className="confirm-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setAsk(false);
            onConfirm();
          }}
        >
          Так
        </button>
        <button type="button" className="btn" onClick={() => setAsk(false)}>
          Скасувати
        </button>
      </div>
    </div>
  );
}

export function Callout({
  kind,
  title,
  children,
  icon,
}: {
  kind: 'done' | 'temp' | 'warn' | 'tip' | 'info';
  title: string;
  children: ReactNode;
  icon?: IconName;
}) {
  const ic: IconName =
    icon ?? (kind === 'done' ? 'checkCircle' : kind === 'temp' ? 'thermometer' : kind === 'warn' ? 'alert' : 'bulb');
  return (
    <div className={`callout callout-${kind}`}>
      <Icon name={ic} size={22} />
      <div>
        <strong className="callout-title">{title}</strong>
        <div className="callout-text">{children}</div>
      </div>
    </div>
  );
}

export function Banner({ icon = 'bulb', children, action }: { icon?: IconName; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="banner" role="status">
      <Icon name={icon} size={22} />
      <div className="banner-text">{children}</div>
      {action ? <div className="banner-action">{action}</div> : null}
    </div>
  );
}
