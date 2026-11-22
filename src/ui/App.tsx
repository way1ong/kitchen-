import { useEffect } from 'react';
import { StoreProvider, useStore } from '../state/store';
import { T } from '../i18n/strings';
import { Icon, type IconName } from './icons';
import { lastTabName, rememberTab, useRoute, type TabName } from './nav';
import { GuideScreen } from './screens/GuideScreen';
import { MenuScreen } from './screens/MenuScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RecipeScreen } from './screens/RecipeScreen';
import { RecipesScreen } from './screens/RecipesScreen';
import { ShoppingScreen } from './screens/ShoppingScreen';
import { TimerDock, TimerProvider } from './timers';

const TABS: { id: TabName; icon: IconName }[] = [
  { id: 'menu', icon: 'calendar' },
  { id: 'recipes', icon: 'book' },
  { id: 'shopping', icon: 'basket' },
  { id: 'guide', icon: 'bulb' },
  { id: 'profile', icon: 'user' },
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
  useStore(); // підписка на зміну мови й налаштувань
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
      <nav className="tabbar" aria-label={T().tabs.nav}>
        {TABS.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={`tab ${active === t.id ? 'is-active' : ''}`} aria-current={active === t.id ? 'page' : undefined}>
            <Icon name={t.icon} size={24} />
            <span>{T().tabs[t.id]}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
