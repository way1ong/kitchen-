import { useEffect } from 'react';
import { StoreProvider } from '../state/store';
import { Icon, type IconName } from './icons';
import { lastTabName, rememberTab, useRoute, type TabName } from './nav';
import { GuideScreen } from './screens/GuideScreen';
import { MenuScreen } from './screens/MenuScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RecipeScreen } from './screens/RecipeScreen';
import { RecipesScreen } from './screens/RecipesScreen';
import { ShoppingScreen } from './screens/ShoppingScreen';
import { TimerDock, TimerProvider } from './timers';

const TABS: { id: TabName; label: string; icon: IconName }[] = [
  { id: 'menu', label: 'Меню', icon: 'calendar' },
  { id: 'recipes', label: 'Рецепти', icon: 'book' },
  { id: 'shopping', label: 'Покупки', icon: 'basket' },
  { id: 'guide', label: 'Поради', icon: 'bulb' },
  { id: 'profile', label: 'Профіль', icon: 'user' },
];

export function App() {
  return (
    <StoreProvider>
      <TimerProvider>
        <Shell />
      </TimerProvider>
    </StoreProvider>
  );
}

function Shell() {
  const route = useRoute();
  useEffect(() => {
    if (route.name !== 'recipe') rememberTab(route.name);
  }, [route]);
  const active: TabName = route.name === 'recipe' ? lastTabName() : route.name;

  let screen;
  switch (route.name) {
    case 'recipe':
      screen = <RecipeScreen id={route.id} />;
      break;
    case 'recipes':
      screen = <RecipesScreen />;
      break;
    case 'shopping':
      screen = <ShoppingScreen />;
      break;
    case 'guide':
      screen = <GuideScreen />;
      break;
    case 'profile':
      screen = <ProfileScreen />;
      break;
    default:
      screen = <MenuScreen />;
  }

  return (
    <div className="app">
      <main id="main" className="main">
        {screen}
      </main>
      <TimerDock />
      <nav className="tabbar" aria-label="Розділи">
        {TABS.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={`tab ${active === t.id ? 'is-active' : ''}`} aria-current={active === t.id ? 'page' : undefined}>
            <Icon name={t.icon} size={24} />
            <span>{t.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
