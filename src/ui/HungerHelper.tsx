import { useEffect, useMemo, useState } from 'react';
import { fraction, hhmm, minutesText, roundTo } from '../logic/format';
import { hungerInfo, snackSuggestions, type HungerZone } from '../logic/hunger';
import { trRecipe } from '../i18n/data';
import { T } from '../i18n/strings';
import { useStore } from '../state/store';
import { Callout, LevelBadge } from './components';
import { Icon, type IconName } from './icons';

const ZONE_ICON: Record<HungerZone, IconName> = {
  day: 'sun',
  evening: 'clock',
  late: 'moon',
  bedtime: 'moon',
  'night-shift': 'briefcase',
};

/** Поточний час, оновлюється раз на хвилину. */
function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** «Зголоднів — що з’їсти зараз»: порада залежить від того, скільки лишилося до вашого сну. */
export function HungerHelper() {
  const { data, setRecipeCtx } = useStore();
  const now = useNow();
  const info = useMemo(() => hungerInfo(data.profile, now), [data.profile, now, data.settings.lang]);
  const list = useMemo(() => snackSuggestions(data.profile, info), [data.profile, info]);
  const h = T().hunger;
  const u = T().units;

  return (
    <div className="hunger">
      <div className="hunger-now">
        <span className="zone-badge">
          <Icon name={ZONE_ICON[info.zone]} size={18} />
          {info.title}
        </span>
        <span className="num">
          {h.now(hhmm(info.now))} ·{' '}
          {info.toSleep > 0 ? h.toSleep(minutesText(Math.max(5, roundTo(info.toSleep, 5)))) : h.sleepWas(hhmm(info.sleepAt))}
        </span>
      </div>

      <Callout kind="info" icon="drop" title={h.waterTitle}>
        {h.firstCheck}
      </Callout>

      <p>{info.advice}</p>

      <h3 className="h-small">{h.canNow}</h3>
      {list.length ? (
        <ul className="alt-list">
          {list.map((s) => (
            <li key={s.recipe.id}>
              <a
                className="alt"
                href={`#recipe-${s.recipe.id}`}
                onClick={() =>
                  setRecipeCtx({ id: s.recipe.id, servings: s.mult, mine: s.mult, note: h.portionNote(fraction(s.mult)) })
                }
              >
                <span className="alt-name">{trRecipe(s.recipe).name}</span>
                <span className="meal-meta">
                  <LevelBadge level={s.recipe.level} />
                  <span className="meta-item num">
                    {fraction(s.mult)} {u.portionShort} · {Math.round(s.kcal)} {u.kcal} · {u.proteinShort} {Math.round(s.protein)} {u.g}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>{h.fallback}</p>
      )}

      <h3 className="h-small">{h.notNow}</h3>
      <ul className="avoid-list">
        {info.avoid.map((a) => (
          <li key={a}>
            <Icon name="close" size={18} />
            <span>{a}</span>
          </li>
        ))}
      </ul>

      <p className="small muted">{h.eveningTip}</p>
    </div>
  );
}
