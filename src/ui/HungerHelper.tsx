import { useEffect, useMemo, useState } from 'react';
import { fraction, hhmm, minutesText, roundTo } from '../logic/format';
import { HUNGER_EVENING_TIP, HUNGER_FIRST_CHECK, hungerInfo, snackSuggestions, type HungerZone } from '../logic/hunger';
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
  const info = useMemo(() => hungerInfo(data.profile, now), [data.profile, now]);
  const list = useMemo(() => snackSuggestions(data.profile, info), [data.profile, info]);

  return (
    <div className="hunger">
      <div className="hunger-now">
        <span className="zone-badge">
          <Icon name={ZONE_ICON[info.zone]} size={18} />
          {info.title}
        </span>
        <span className="num">
          Зараз {hhmm(info.now)} ·{' '}
          {info.toSleep > 0 ? `до сну ≈${minutesText(Math.max(5, roundTo(info.toSleep, 5)))}` : `сон був запланований на ${hhmm(info.sleepAt)}`}
        </span>
      </div>

      <Callout kind="info" icon="drop" title="Спершу — вода">
        {HUNGER_FIRST_CHECK}
      </Callout>

      <p>{info.advice}</p>

      <h3 className="h-small">Що можна зараз</h3>
      {list.length ? (
        <ul className="alt-list">
          {list.map((s) => (
            <li key={s.recipe.id}>
              <a
                className="alt"
                href={`#recipe-${s.recipe.id}`}
                onClick={() =>
                  setRecipeCtx({ id: s.recipe.id, servings: s.mult, mine: s.mult, note: `перекус — ${fraction(s.mult)} порції` })
                }
              >
                <span className="alt-name">{s.recipe.name}</span>
                <span className="meal-meta">
                  <LevelBadge level={s.recipe.level} />
                  <span className="meta-item num">
                    {fraction(s.mult)} порц. · {Math.round(s.kcal)} ккал · Б {Math.round(s.protein)} г
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Підійде склянка води чи трав’яного чаю без цукру, огірок, морква або інші свіжі овочі.</p>
      )}

      <h3 className="h-small">Краще не зараз</h3>
      <ul className="avoid-list">
        {info.avoid.map((a) => (
          <li key={a}>
            <Icon name="close" size={18} />
            <span>{a}</span>
          </li>
        ))}
      </ul>

      <p className="small muted">{HUNGER_EVENING_TIP}</p>
    </div>
  );
}
