import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';

/** Спільні блоки розділу «Поради» для всіх мов. */

export function Section({ icon, title, children, open = false }: { icon: IconName; title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="card guide-section" open={open}>
      <summary>
        <Icon name={icon} />
        <span>{title}</span>
        <Icon name="chevronRight" className="summary-chevron" />
      </summary>
      <div className="guide-body">{children}</div>
    </details>
  );
}

export function Cue({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <li className="cue">
      <Icon name={icon} />
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
    </li>
  );
}

/** Як часто їсти: кружечки (заповнені/порожні) + текст — форма, а не колір. */
export function FoodGroup({ dots, title, children }: { dots: 1 | 2 | 3; title: string; children: ReactNode }) {
  return (
    <div className="food-group">
      <h3 className="food-group-title">
        <span className="freq-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.5" fill={i < dots ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
            </svg>
          ))}
        </span>
        {title}
      </h3>
      <ul className="bullets">{children}</ul>
    </div>
  );
}
