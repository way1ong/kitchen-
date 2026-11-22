import { getLang } from '../../i18n';
import { GuideHu } from './guide/GuideHu';
import { GuideUk } from './guide/GuideUk';

export function GuideScreen() {
  return getLang() === 'hu' ? <GuideHu /> : <GuideUk />;
}
