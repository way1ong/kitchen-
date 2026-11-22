import { useMemo, useState } from 'react';
import { dayMonth, dayShort } from '../../logic/dates';
import { T } from '../../i18n/strings';
import { buildShoppingList, CAT_ORDER, catLabel, shoppingAsText } from '../../logic/shopping';
import { planDate, useStore } from '../../state/store';
import { Checkbox, ConfirmButton } from '../components';
import { Icon } from '../icons';

export function ShoppingScreen() {
  const { data, toggleChecked, clearChecked, setShopDays } = useStore();
  const plan = data.plan;
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  const days = data.shopDays.length ? data.shopDays : [0, 1, 2, 3, 4, 5, 6];
  const items = useMemo(() => (plan ? buildShoppingList(plan, data.profile, days) : []), [plan, data.profile, days, data.settings.lang]);
  const checked = useMemo(() => new Set(plan ? (data.checked[plan.id] ?? []) : []), [plan, data.checked]);

  const L = T().shopping;
  if (!plan) return <div className="screen">{L.noPlan}</div>;

  const toBuy = items.filter((i) => !i.pantry);
  const done = toBuy.filter((i) => checked.has(i.id)).length;
  const sorted = [...days].sort((a, b) => a - b);
  const range =
    sorted.length === 7
      ? `${dayMonth(planDate(plan, 0))} — ${dayMonth(planDate(plan, 6))}`
      : sorted.map((i) => dayShort(plan.days[i].weekday)).join(', ');
  const title = L.listTitle(range);

  const setDays = (d: number[]) => setShopDays([...new Set(d)].sort((a, b) => a - b));
  const toggleDay = (i: number) => {
    const s = new Set(days);
    if (s.has(i)) s.delete(i);
    else s.add(i);
    if (s.size) setDays([...s]);
  };

  const copy = async () => {
    const text = shoppingAsText(items, title, checked);
    try {
      await navigator.clipboard.writeText(text);
      setCopied('ok');
      setFallbackText(null);
    } catch {
      setCopied('fail');
      setFallbackText(text);
    }
    window.setTimeout(() => setCopied('idle'), 2500);
  };

  // У вбудованому перегляді (артефакт) системне «Поділитися» недоступне
  const canShare = import.meta.env.MODE !== 'artifact' && typeof navigator !== 'undefined' && 'share' in navigator;
  const share = async () => {
    try {
      await navigator.share({ title, text: shoppingAsText(items, title, checked) });
    } catch {
      /* скасовано або не підтримується */
    }
  };

  const presets: { label: string; days: number[] }[] = [
    { label: L.presets.week, days: [0, 1, 2, 3, 4, 5, 6] },
    { label: L.presets.first, days: [0, 1, 2] },
    { label: L.presets.second, days: [3, 4, 5, 6] },
  ];

  return (
    <div className="screen">
      <header className="screen-head">
        <p className="eyebrow">{range}</p>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub(data.profile.people)}
        </p>
      </header>

      <section className="card" aria-label={L.daysAria}>
        <div className="chip-row">
          {presets.map((p) => {
            const on = p.days.length === sorted.length && p.days.every((d, i) => d === sorted[i]);
            return (
              <button key={p.label} type="button" className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setDays(p.days)}>
                {on ? <Icon name="check" size={16} /> : null}
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="day-toggles" role="group" aria-label={L.days}>
          {plan.days.map((d, i) => {
            const on = days.includes(i);
            return (
              <button key={d.date} type="button" className={`day-toggle ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggleDay(i)}>
                <span>{dayShort(d.weekday)}</span>
                <span className="day-toggle-mark" aria-hidden="true">
                  {on ? <Icon name="check" size={14} strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="progress-line" role="status">
        <span>
          <b className="num">{L.bought(done, toBuy.length)}</b>
        </span>
        <span className="progress-bar" aria-hidden="true">
          <span style={{ width: `${toBuy.length ? (done / toBuy.length) * 100 : 0}%` }} />
        </span>
      </div>

      <div className="actions-row">
        <button type="button" className="btn btn-primary" onClick={copy}>
          <Icon name={copied === 'ok' ? 'check' : 'copy'} />
          {copied === 'ok' ? L.copied : L.copy}
        </button>
        {canShare ? (
          <button type="button" className="btn" onClick={share}>
            <Icon name="share" />
            {L.send}
          </button>
        ) : null}
        <ConfirmButton className="btn btn-ghost" confirmText={L.clearConfirm} onConfirm={clearChecked}>
          {L.clear}
        </ConfirmButton>
      </div>
      {copied === 'fail' && fallbackText ? (
        <div className="card">
          <p className="small">{L.copyFail}</p>
          <textarea id="shopping-text" className="copy-area" readOnly value={fallbackText} onFocus={(e) => e.currentTarget.select()} />
        </div>
      ) : null}

      {CAT_ORDER.map((cat) => {
        const list = items.filter((i) => i.cat === cat);
        if (!list.length) return null;
        const pantry = cat === 'pantry';
        return (
          <section key={cat} className="shop-group" aria-label={catLabel(cat)}>
            <h2 className="shop-cat">
              {catLabel(cat)} <span className="count num">{list.length}</span>
            </h2>
            {pantry ? (
              <p className="small muted">{L.pantryNote}</p>
            ) : null}
            <ul className="shop-list">
              {list.map((it) => (
                <li key={it.id}>
                  <Checkbox checked={checked.has(it.id)} onChange={() => toggleChecked(it.id)} id={`shop-${it.id}`}>
                    <span className="ing-name">
                      {it.name}
                      {it.hint ? <small> · {it.hint}</small> : null}
                    </span>
                    {it.amount ? (
                      <span className="ing-amount num">
                        {it.amount}
                        {it.extra ? <small> {it.extra}</small> : null}
                      </span>
                    ) : null}
                  </Checkbox>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
