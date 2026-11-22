import { useEffect, useState } from 'react';

export type TabName = 'menu' | 'recipes' | 'shopping' | 'guide' | 'profile';
export type Route = { name: TabName } | { name: 'recipe'; id: string };

const TABS: TabName[] = ['menu', 'recipes', 'shopping', 'guide', 'profile'];

export function parseRoute(hash: string): Route {
  const h = hash.replace(/^#/, '');
  if (h.startsWith('recipe-')) return { name: 'recipe', id: h.slice('recipe-'.length) };
  if ((TABS as string[]).includes(h)) return { name: h as TabName };
  return { name: 'menu' };
}

/** Стек переходів усередині додатку — щоб «Назад» не вивів за межі додатку. */
const stack: string[] = [typeof window !== 'undefined' ? window.location.hash : ''];

function track(hash: string) {
  if (stack.length > 1 && stack[stack.length - 2] === hash) stack.pop();
  else stack.push(hash);
}

export function canGoBack(): boolean {
  return stack.length > 1;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  useEffect(() => {
    const on = () => {
      track(window.location.hash);
      setRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

let lastTab: TabName = 'menu';
export function rememberTab(t: TabName) {
  lastTab = t;
}
export function lastTabName(): TabName {
  return lastTab;
}

export function go(hash: string) {
  if (window.location.hash === `#${hash}`) return;
  window.location.hash = hash;
}
