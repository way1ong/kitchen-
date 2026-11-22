import type { ReactNode } from 'react';
import { LEVEL_INFO } from '../../logic/profile';
import { LevelBars } from '../components';
import { Icon, type IconName } from '../icons';

const TEMPS: { what: string; t: string; note?: string }[] = [
  { what: 'Курка, індичка: філе, стегна, фарш, котлети', t: '74 °C' },
  { what: 'Фарш яловичий чи свинячий, тефтелі, котлети', t: '71 °C' },
  { what: 'Яловичина, свинина цілим шматком', t: '63 °C', note: '+ 3 хв відпочинку' },
  { what: 'Риба', t: '63 °C', note: 'або розшаровується виделкою' },
  { what: 'Страви з яєць: омлет, запіканка, сирники', t: '71 °C' },
  { what: 'Розігріті залишки', t: '74 °C', note: 'гаряче по всьому об’єму' },
];

const SOURCES: { title: string; url: string }[] = [
  { title: 'ВООЗ — Здорове харчування (інформаційний бюлетень)', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  { title: 'МОЗ України — Тарілка здорового харчування', url: 'https://moz.gov.ua/uk/tarilka-zdorovogo-harchuvannja' },
  { title: 'USDA FSIS — Безпечні температури приготування', url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart' },
  { title: 'Safefood — Кулінарія для людей з дальтонізмом', url: 'https://www.safefood.net/blog/july-2023/colour-blind-cooking' },
  { title: 'Точність формул базового обміну — порівняльне дослідження (2013)', url: 'https://pubmed.ncbi.nlm.nih.gov/23631843/' },
  { title: 'Скільки білка потрібно під час схуднення (огляд, 2015)', url: 'https://pubmed.ncbi.nlm.nih.gov/25014731/' },
  { title: 'NIOSH — Харчування при змінній роботі', url: 'https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod9/08.html' },
  { title: 'British Dietetic Association — Nutrition and shift work', url: 'https://www.bda.uk.com/resource/nutrition-shift-work.html' },
  { title: 'Academy of Nutrition and Dietetics — Безпечне зберігання готової їжі', url: 'https://eatright.org/homefoodsafety/four-steps/cook/cook-once-eat-safely-throughout-the-week' },
  { title: 'Smashing Magazine — Дизайн для людей з дальтонізмом', url: 'https://www.smashingmagazine.com/2024/02/designing-for-colorblindness/' },
];

export function GuideScreen() {
  return (
    <div className="screen guide">
      <header className="screen-head">
        <p className="eyebrow">Коротко і по суті</p>
        <h1>Поради</h1>
        <p className="sub">Як готувати безпечно, не покладаючись на колір, і як влаштоване здорове меню.</p>
      </header>

      <Section icon="thermometer" title="Готуємо без орієнтиру на колір" open>
        <p>
          Колір м’яса і соку ненадійний навіть для людей зі звичайним зором: він залежить від кислотності, жирності й освітлення.
          Тому шеф-кухарі з дальтонізмом користуються <b>щуповим термометром</b> — це найточніший спосіб. Коштує як дві-три
          піци, а служить роками.
        </p>
        <div className="table-wrap">
          <table className="temps">
            <caption className="sr-only">Безпечна температура всередині продукту</caption>
            <thead>
              <tr>
                <th scope="col">Що готуєте</th>
                <th scope="col">Всередині не менше</th>
              </tr>
            </thead>
            <tbody>
              {TEMPS.map((r) => (
                <tr key={r.what}>
                  <td>{r.what}</td>
                  <td className="num">
                    <b>{r.t}</b>
                    {r.note ? <small> {r.note}</small> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>Як міряти</h3>
        <ul className="bullets">
          <li>Встроміть щуп у найтовщу частину збоку, до центру. Не торкайтеся кістки й дна сковороди.</li>
          <li>Зачекайте, доки цифри перестануть рости (5–10 секунд).</li>
          <li>Перевірка точності: у склянці з льодом і водою термометр має показати 0 °C.</li>
          <li>Після сирого м’яса помийте щуп гарячою водою з милом.</li>
        </ul>
        <h3>Інші ознаки, крім кольору</h3>
        <ul className="cue-list">
          <Cue icon="timer" title="Час">
            Таймер у кожному кроці рецепта. Аерогрилі й плити різні — запишіть свій час після першого разу.
          </Cue>
          <Cue icon="checkCircle" title="Текстура">
            Виделка входить без опору (картопля, овочі). Риба розшаровується на пластинки. М’ясо пружинить, а не продавлюється.
            Соус загус і ложка лишає доріжку.
          </Cue>
          <Cue icon="bell" title="Звук">
            Активне булькання = кипіння. Олія шипить від краплі води = сковорода розігріта. Шкварчання стихло = вода випарувалась.
          </Cue>
          <Cue icon="leaf" title="Запах">
            Горіховий запах крупи чи часнику — час рухатися далі. Запах гару — одразу зніміть з вогню.
          </Cue>
        </ul>
        <h3>Організуйте кухню</h3>
        <ul className="bullets">
          <li>
            Дошки для м’яса й овочів часто розрізняють кольором. Візьміть дошки різної форми або матеріалу чи підпишіть маркером:
            «М’ЯСО», «ОВОЧІ».
          </li>
          <li>Підпишіть банки зі спеціями великими літерами. Консерви можна мітити гумками: 1 — томати, 2 — квасоля.</li>
          <li>Яскраве біле світло над робочою поверхнею допомагає розрізняти відтінки.</li>
          <li>Свіжість перевіряйте за датою «вжити до», запахом і текстурою (слиз, липкість), а не за кольором.</li>
          <li>
            Стиглість без кольору: банан і помідор злегка м’які під пальцем, у банана сильний аромат. Камера-застосунки, що
            називають колір (Color Blind Pal, ColorDeBlind), допоможуть у магазині, але залежать від освітлення.
          </li>
        </ul>
      </Section>

      <Section icon="leaf" title="Тарілка здорового харчування">
        <div className="plate" aria-hidden="true">
          <div className="plate-half">
            <span>½</span>Овочі й фрукти
          </div>
          <div className="plate-quarter">
            <span>¼</span>Цільнозернові
          </div>
          <div className="plate-quarter q2">
            <span>¼</span>Білок
          </div>
        </div>
        <ul className="bullets">
          <li>
            <b>Половина тарілки</b> — овочі й фрукти, різні. Мінімум 400 г на день (ВООЗ); МОЗ радить 300 г овочів і 200 г
            фруктів. Картопля до овочів не зараховується.
          </li>
          <li>
            <b>Чверть</b> — цільнозернові: гречка, булгур, вівсянка, бурий рис, цільнозерновий хліб.
          </li>
          <li>
            <b>Чверть</b> — білок: птиця, риба, яйця, кисломолочний сир, бобові. Рибу — 2 рази на тиждень.
          </li>
          <li>Сіль — до 5 г на день (1 ч. л. з усім, що вже є в хлібі, сирі, соліннях). Цукор — якомога менше.</li>
          <li>Пийте воду; солодкі напої і соки — рідко.</li>
        </ul>
      </Section>

      <Section icon="feather" title="Напівдієта: як це працює">
        <ul className="bullets">
          <li>
            Норма рахується за формулою Міффліна — Сан Жеора (найточніша для більшості людей) з урахуванням типу роботи і
            тренувань. Для м’якого схуднення від неї віднімаємо 15 % — це 0,3–0,5 кг на тиждень без сильного голоду.
          </li>
          <li>
            Білка — 1,4–1,8 г на кг ваги, по 20+ г у кожен основний прийом їжі: так зберігаються м’язи, а ситість довша.
          </li>
          <li>Силові вправи 2 рази на тиждень допомагають худнути саме за рахунок жиру.</li>
          <li>
            Зважуйтесь 2–3 рази на тиждень зранку і дивіться на тренд за 2–3 тижні. Стоїть — мінус 100–150 ккал. Ніколи не їжте
            менше базового обміну.
          </li>
          <li>Зручно: смажте в аерогрилі, а не в олії; майонез заміняйте грецьким йогуртом; соуси — томатні.</li>
        </ul>
      </Section>

      <Section icon="book" title="Рівні складності">
        <ul className="level-guide">
          {([1, 2, 3] as const).map((l) => (
            <li key={l} className={`lvl-${l}`}>
              <span className="level-line">
                <LevelBars level={l} size={20} />
                <b>
                  {LEVEL_INFO[l].short} · {LEVEL_INFO[l].title}
                </b>
              </span>
              <span>{LEVEL_INFO[l].text}</span>
            </li>
          ))}
        </ul>
        <p>
          План навчання: 1–2 тижні лише рівень 1, далі одна страва рівня 2 на вихідних. Коли рівень 2 виходить без
          підглядання — пробуйте рівень 3.
        </p>
      </Section>

      <Section icon="lunchbox" title="Зберігання і безпека">
        <ul className="bullets">
          <li>Готова їжа — у холодильнику до 3–4 днів (рибу — до 2). Тому меню готує запас максимум на 1–2 дні вперед.</li>
          <li>Охолоджуйте швидко: розкладіть у неглибокі контейнери й поставте в холодильник протягом 2 годин.</li>
          <li>Морозилка — до 3 місяців. Підпишіть на кришці назву й дату.</li>
          <li>
            Розігрівайте один раз, до 74 °C — гаряче по всьому об’єму. У мікрохвильовці накривайте кришкою і перемішайте на
            половині часу.
          </li>
          <li>М’ясо і рибу розморожуйте в холодильнику, а не на столі. Сиру курку не мийте — бризки розносять бактерії.</li>
          <li>Після сирого м’яса — помийте руки, ніж і дошку.</li>
        </ul>
      </Section>

      <Section icon="moon" title="Змінна і нічна робота">
        <ul className="bullets">
          <li>Тримайтеся звичного ритму: 3 основні прийоми їжі на добу, наскільки можливо — у денний час.</li>
          <li>Основна їжа — перед нічною зміною: білок і повільні вуглеводи.</li>
          <li>З 00:00 до 06:00 краще не їсти щільно — лише легкий перекус (йогурт, яйця, овочі).</li>
          <li>Вода протягом зміни; кава — не пізніше ніж за 6 годин до сну.</li>
          <li>Беріть їжу з собою — так менше спокуси перекусити фастфудом.</li>
        </ul>
      </Section>

      <Section icon="stove" title="Мінімальний набір для кухні">
        <ul className="bullets">
          <li>Аерогриль і мікрохвильовка — основа рівня 1.</li>
          <li>Цифровий щуповий термометр — найкорисніша покупка.</li>
          <li>Кухонні ваги: 150 г курки «на око» легко сплутати з 250 г.</li>
          <li>Ніж кухарський 20 см і маленький ніж; дві підписані дошки.</li>
          <li>Антипригарна сковорода 24–26 см з кришкою, каструля 2–3 л, сито.</li>
          <li>Скляні контейнери з кришками для мікрохвильовки — для обідів із собою.</li>
        </ul>
      </Section>

      <Section icon="external" title="Джерела">
        <ul className="sources">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.title}
                <Icon name="external" size={14} />
              </a>
            </li>
          ))}
        </ul>
        <p className="small muted">
          Додаток не замінює консультацію лікаря чи дієтолога. При хронічних захворюваннях узгодьте раціон зі спеціалістом.
        </p>
      </Section>
    </div>
  );
}

function Section({ icon, title, children, open = false }: { icon: IconName; title: string; children: ReactNode; open?: boolean }) {
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

function Cue({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
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
