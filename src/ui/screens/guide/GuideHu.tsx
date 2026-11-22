import type { Level } from '../../../data/types';
import { LevelBars } from '../../components';
import { HungerHelper } from '../../HungerHelper';
import { Icon } from '../../icons';
import { Cue, FoodGroup, Section } from './parts';

/** A „Tanácsok” rész magyarul. Szerkezete megegyezik a GuideUk-éval. */

const TEMPS_HU: { what: string; t: string; note?: string }[] = [
  { what: 'Csirke, pulyka: filé, comb, darált hús, fasírt', t: '74 °C' },
  { what: 'Darált marha- vagy sertéshús, húsgombóc, fasírt', t: '71 °C' },
  { what: 'Marha- és sertéshús egész darabban', t: '63 °C', note: '+ 3 perc pihentetés' },
  { what: 'Hal', t: '63 °C', note: 'vagy villával lemezekre válik' },
  { what: 'Tojásételek: omlett, felfújt, túrós lepényke', t: '71 °C' },
  { what: 'Felmelegített maradék', t: '74 °C', note: 'mindenhol forró' },
];

/** Nehézségi szintek (a LEVEL_INFO magyar megfelelője). */
const LEVEL_INFO_HU: Record<Level, { title: string; short: string; text: string }> = {
  1: { title: 'Egyszerű', short: '1. szint', text: 'Mikró, airfryer, egy rántotta vagy egy hajdina kifőzése. Legfeljebb 45 perc.' },
  2: { title: 'Közepes', short: '2. szint', text: 'Serpenyő és lábas, 2–3 összetevő, párolás, fasírt. 20–60 perc.' },
  3: { title: 'Haladó', short: '3. szint', text: 'Sütő és tűzhely együtt, több lépés, töltés. Hétvégére, tanuláshoz.' },
};

const SOURCES_HU: { title: string; url: string }[] = [
  { title: 'WHO — Egészséges táplálkozás (tájékoztató)', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  { title: 'Ukrajna Egészségügyi Minisztériuma — Az egészséges táplálkozás tányérja', url: 'https://moz.gov.ua/uk/tarilka-zdorovogo-harchuvannja' },
  { title: 'MDOSZ — A megújult felnőtt OKOSTÁNYÉR® (Táplálkozási Akadémia hírlevél, 2022)', url: 'https://mdosz.hu/hun/wp-content/uploads/2022/08/mdosz-taplalkozasi-akademia-hirlevel-2022-8-a-megujult-felnott-okosttanyer.pdf' },
  { title: 'USDA FSIS — Biztonságos maghőmérsékletek', url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart' },
  { title: 'Safefood — Főzés színtévesztőknek', url: 'https://www.safefood.net/blog/july-2023/colour-blind-cooking' },
  { title: 'Az alapanyagcsere-képletek pontossága — összehasonlító vizsgálat (2013)', url: 'https://pubmed.ncbi.nlm.nih.gov/23631843/' },
  { title: 'Mennyi fehérje kell fogyás közben (áttekintés, 2015)', url: 'https://pubmed.ncbi.nlm.nih.gov/25014731/' },
  { title: 'NIOSH — Táplálkozás műszakos munka mellett', url: 'https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod9/08.html' },
  { title: 'British Dietetic Association — Táplálkozás és műszakos munka', url: 'https://www.bda.uk.com/resource/nutrition-shift-work.html' },
  { title: 'Academy of Nutrition and Dietetics — A kész étel biztonságos tárolása', url: 'https://eatright.org/homefoodsafety/four-steps/cook/cook-once-eat-safely-throughout-the-week' },
  { title: 'Smashing Magazine — Tervezés színtévesztőknek', url: 'https://www.smashingmagazine.com/2024/02/designing-for-colorblindness/' },
  { title: 'Harvard Gazette — Miért növeli a késői evés a hízás kockázatát (2022)', url: 'https://news.harvard.edu/gazette/story/2022/10/study-looks-at-why-late-night-eating-increases-obesity-risk' },
  { title: 'Késői evés, éhség és energiafelhasználás — Cell Metabolism, 2022', url: 'https://pubmed.ncbi.nlm.nih.gov/36198293/' },
  { title: 'A vacsora és a lefekvés közötti idő és a reflux (gyomorégés)', url: 'https://pubmed.ncbi.nlm.nih.gov/16393212/' },
  { title: 'CSPI — Segít-e, ha este nem eszel', url: 'https://cspinet.org/article/should-you-stop-eating-after-4-pm-if-you-want-lose-extra-pounds' },
  { title: 'Cleveland Clinic — Valódi éhség vagy sem', url: 'https://health.clevelandclinic.org/decoding-your-hunger-are-you-really-hungry-or-not/' },
  { title: 'IARC (WHO) — Vörös és feldolgozott hús: kérdések és válaszok', url: 'https://www.iarc.who.int/wp-content/uploads/2018/11/Monographs-QA_Vol114.pdf' },
  { title: 'WCRF — Korlátozd a vörös és a feldolgozott húst', url: 'https://www.wcrf.org/diet-activity-and-cancer/cancer-prevention-recommendations/limit-red-and-processed-meat/' },
  { title: 'BMJ — Ultrafeldolgozott élelmiszerek és 32 egészségügyi probléma (2024)', url: 'https://bmjgroup.com/consistent-evidence-links-ultra-processed-food-to-over-30-damaging-health-outcomes/' },
  { title: 'WHO — Cukros italok', url: 'https://www.who.int/en/news-room/detail/11-10-2016-who-urges-global-action-to-curtail-consumption-and-health-impacts-of-sugary-drinks' },
  { title: 'Élelmi rost és egészség — Lancet, 2019', url: 'https://pubmed.ncbi.nlm.nih.gov/30638909/' },
  { title: 'EUFIC — Az EFSA szakvéleménye a koffeinről', url: 'https://eufic.org/en/whats-in-food/article/efsa-opinion-on-the-safety-of-caffeine' },
  { title: 'Cleveland Clinic — Alkohol és alvás', url: 'https://health.clevelandclinic.org/why-you-should-limit-alcohol-before-bed-for-better-sleep' },
];

export function GuideHu() {
  return (
    <div className="screen guide">
      <header className="screen-head">
        <p className="eyebrow">Röviden és tömören</p>
        <h1>Tanácsok</h1>
        <p className="sub">Hogyan főzz biztonságosan a színekre hagyatkozás nélkül, és hogyan áll össze egy egészséges étrend.</p>
      </header>

      <Section icon="thermometer" title="Hogyan ellenőrizd, hogy kész-e" open>
        <p>
          Minden húsos, halas vagy tojásos lépésnél három támpontot találsz: <b>eszköz nélküli jeleket</b> (bevágás,
          állag, idő), a <b>hőmérőt</b> és a <b>színt</b>. Elsősorban az első kettőre hagyatkozz: a hús és a kifolyó lé
          színe még ép színlátással sem megbízható — függ a savasságtól, a zsírtartalomtól és a megvilágítástól. A színre
          vonatkozó tippeket a profilban ki is kapcsolhatod.
        </p>
        <h3>Amíg nincs hőmérőd</h3>
        <ul className="bullets">
          <li>
            <b>Hús és baromfi:</b> vágd be a legvastagabb darabot a közepén. Belül a hús egyenletes állagú és rostos, nincs
            nedves, kocsonyás közepe, a rostok villával könnyen szétválnak.
          </li>
          <li>
            <b>Darált hús, fasírt, töltött káposzta:</b> törd ketté a legvastagabbat — teljes vastagságában tömör, nyers közép
            nélkül.
          </li>
          <li>
            <b>Hal:</b> villával lemezekre válik, belül már nem áttetsző.
          </li>
          <li>
            <b>Rakott ételek, felfújtak:</b> szúrj egy kést a közepébe 10 mp-re — a pengének forrónak kell lennie (a csuklód
            hátsó oldalával érintsd meg óvatosan, csak egy pillanatra).
          </li>
          <li>
            <b>Felmelegített maradék:</b> a gőz a közepéből is jön, nem csak a széléről.
          </li>
          <li>Ha bizonytalan vagy, hagyd még 3–5 percig: a nem eléggé átsült hús veszélyesebb, mint a kicsit kiszáradt.</li>
        </ul>
        <h3>Milyen hőmérőt vegyél?</h3>
        <ul className="bullets">
          <li>Digitális beszúrós hőmérő vékony szondával és gyors kijelzéssel — 2–5 másodperc.</li>
          <li>Mérési tartomány legalább −10 és 200 °C között, pontosság ±1 °C, nagy számjegyek a kijelzőn.</li>
          <li>Jól jön, ha vízálló, magától kikapcsol, és van kalibrálógombja. Vannak „beszélő” modellek is, amelyek bemondják a hőmérsékletet.</li>
          <li>Ha megvetted, kapcsold be a profilban a „Van konyhai hőmérőm” opciót: a receptekben ez lesz az első ellenőrzési mód.</li>
        </ul>
        <h3>Biztonságos maghőmérséklet</h3>
        <div className="table-wrap">
          <table className="temps">
            <caption className="sr-only">Biztonságos hőmérséklet az étel belsejében</caption>
            <thead>
              <tr>
                <th scope="col">Mit készítesz</th>
                <th scope="col">Belül legalább</th>
              </tr>
            </thead>
            <tbody>
              {TEMPS_HU.map((r) => (
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
        <h3>Így mérj</h3>
        <ul className="bullets">
          <li>A szondát oldalról szúrd a legvastagabb részbe, egészen a közepéig. Ne érjen csonthoz, se a serpenyő aljához.</li>
          <li>Várj, amíg a számok már nem emelkednek tovább (5–10 másodperc).</li>
          <li>A pontosság ellenőrzése: jeges vízzel teli pohárban a hőmérőnek 0 °C-ot kell mutatnia.</li>
          <li>Nyers hús után mosd el a szondát forró, mosogatószeres vízzel.</li>
        </ul>
        <h3>Színtől független jelek</h3>
        <ul className="cue-list">
          <Cue icon="timer" title="Idő">
            A recept minden lépésében van időzítő. Minden airfryer és tűzhely kicsit másképp működik — az első alkalom után
            jegyezd fel a saját idődet.
          </Cue>
          <Cue icon="checkCircle" title="Állag">
            A villa ellenállás nélkül csúszik bele (krumpli, zöldség). A hal lemezekre válik. A hús megnyomva visszarugózik, nem
            süpped be. A szósz besűrűsödött, és a kanál csíkot hagy benne.
          </Cue>
          <Cue icon="bell" title="Hang">
            Élénk bugyogás = forr. Egy csepp víztől sistereg az olaj = forró a serpenyő. Elcsendesedett a sercegés = elpárolgott
            a víz.
          </Cue>
          <Cue icon="leaf" title="Illat">
            Diós illata lett a gabonának vagy a fokhagymának — jöhet a következő lépés. Égett szag — azonnal vedd le a tűzről.
          </Cue>
        </ul>
        <h3>Rendezd be a konyhát</h3>
        <ul className="bullets">
          <li>
            A hús- és a zöldségvágó deszkákat gyakran színnel különböztetik meg. Válassz eltérő formájú vagy anyagú deszkákat,
            vagy írd rájuk filccel: „HÚS”, „ZÖLDSÉG”.
          </li>
          <li>
            A fűszeres üvegekre írd fel nagy betűkkel, mi van bennük. A konzerveket befőttes gumival is megjelölheted: 1 gumi —
            paradicsom, 2 gumi — bab.
          </li>
          <li>Az erős fehér fény a munkalap fölött segít megkülönböztetni az árnyalatokat — így a „Kinézet” tippek is többet érnek.</li>
          <li>A frissességet a „fogyasztható” dátum, a szag és az állag (nyálkás, ragacsos) alapján ellenőrizd, ne a szín alapján.</li>
          <li>
            Érettség szín nélkül: az érett banán és paradicsom ujjal megnyomva enyhén puha, a banánnak erős illata van. A színt
            kimondó kamerás appok (Color Blind Pal, ColorDeBlind) segíthetnek a boltban, de függnek a megvilágítástól.
          </li>
        </ul>
      </Section>

      <Section icon="leaf" title="Az egészséges tányér">
        <div className="plate" aria-hidden="true">
          <div className="plate-half">
            <span>½</span>Zöldség és gyümölcs
          </div>
          <div className="plate-quarter">
            <span>¼</span>Teljes kiőrlésű gabona
          </div>
          <div className="plate-quarter q2">
            <span>¼</span>Fehérje
          </div>
        </div>
        <ul className="bullets">
          <li>
            <b>A tányér fele</b> zöldség és gyümölcs, minél változatosabban — a harvardi „egészséges tányér” modell szerint
            inkább több zöldség, mint gyümölcs. Naponta legalább 400 g (WHO); a magyarországi OKOSTÁNYÉR® ajánlás (MDOSZ)
            legalább 500 g-ot javasol, például 300 g zöldséget és 200 g gyümölcsöt. A burgonya nem számít zöldségnek.
          </li>
          <li>
            <b>Negyede</b> teljes kiőrlésű gabona: hajdina, bulgur, zabpehely, barna rizs, teljes kiőrlésű kenyér.
          </li>
          <li>
            <b>Negyede</b> fehérje: baromfi, hal, tojás, túró, hüvelyesek. Halat hetente 2-szer.
          </li>
          <li>
            Só — legfeljebb 5 g naponta (1 tk., beleértve azt is, ami már a kenyérben, a sajtban és a savanyúságban van).
            Cukor — minél kevesebb.
          </li>
          <li>Igyál vizet; cukros üdítőt és gyümölcslevet csak ritkán.</li>
        </ul>
      </Section>

      <Section icon="clock" title="Megéheztél két étkezés között?">
        <HungerHelper />
        <h3>Lehet enni 18:00 vagy 20:00 után?</h3>
        <ul className="bullets">
          <li>
            A szigorú „18:00 után ne egyél” szabálytól nem fogysz jobban, mint attól, ha egyszerűen kevesebb kalóriát eszel
            naponta: a vizsgálatokban az óra szerinti korlátozás és a sima kalóriacsökkentés ugyanazt az eredményt hozta.
          </li>
          <li>
            A késői evésnek viszont ára van. Ha a vacsora és a lefekvés között kevesebb mint 3 óra telik el, érezhetően
            nagyobb a gyomorégés (reflux) kockázata. Egy harvardi vizsgálatban (2022) pedig a késői étkezések fokozták az
            éhséget másnap.
          </li>
          <li>
            Ezért az alkalmazás az időt a <b>te</b> lefekvésedhez viszonyítja, nem az órához: a főétkezés 3–4 órával
            lefekvés előtt legyen, egy könnyű nasi legkésőbb 1–2 órával előtte. Ha 23:00-kor fekszel le, a „késő” 21:00 után
            kezdődik; éjszakai műszaknál más a napirend, és a tanács ahhoz igazodik.
          </li>
        </ul>
        <h3>Tényleg éhes vagy?</h3>
        <ul className="bullets">
          <li>
            <b>Az igazi éhség</b> fokozatosan erősödik, korog a gyomrod, bármilyen étel jólesik, és evés után jóllakottnak
            érzed magad.
          </li>
          <li>
            <b>Az érzelmi éhség</b> hirtelen jön, és kifejezetten édesre vagy zsírosra vágysz — gyakran fáradtság, unalom,
            stressz miatt, vagy csak „társaságnak” a képernyő előtt.
          </li>
          <li>A szomjúság néha éhségnek álcázza magát: egy pohár víz és 10–15 perc várakozás — egyszerű próba.</li>
          <li>Ha nemrég ettél egy rendes adagot, és mégis megint ennél, az valószínűleg nem éhség.</li>
        </ul>
        <h3>A jó nasi képlete</h3>
        <p>
          <b>Fehérje + rost, 150–200 kcal</b>: joghurt bogyós gyümölccsel, túró uborkával, alma egy marék diófélével,
          zöldség humusszal. Késő este még kevesebb, 100–150 kcal, és inkább savanyított tejtermék vagy zöldség.
        </p>
      </Section>

      <Section icon="leaf" title="Hogyan hat az étel a szervezetedre">
        <p>
          Nem egy-egy élelmiszer önmagában árt, hanem az, hogy milyen gyakran és mennyit eszel belőle. Ezért az élelmiszereket
          három csoportba soroltuk aszerint, hogy milyen gyakran érdemes enni őket.
        </p>
        <FoodGroup dots={3} title="Naponta — az étrend alapja">
          <li>
            <b>Zöldségek, gyümölcsök, bogyósok</b> — rost, vitaminok, kálium: tovább tartó jóllakottság, jobb emésztés,
            alacsonyabb vérnyomás. Naponta legalább 400 g.
          </li>
          <li>
            <b>Teljes kiőrlésű gabonák és hüvelyesek</b> — hajdina, zabpehely, bulgur, bab, lencse. A napi 25–29 g rost a
            szívbetegségek, a stroke, a 2-es típusú cukorbetegség és a vastagbélrák 15–30%-kal kisebb kockázatával jár együtt.
          </li>
          <li>
            <b>Fehérje</b> — baromfi, hal, tojás, túró, joghurt, hüvelyesek: jóllakottság és az izmok megőrzése fogyás közben.
          </li>
          <li>
            <b>Víz</b> — a fő italod.
          </li>
          <li>
            <b>Diófélék és magvak</b> — egy marék (20–30 g): hasznos zsírok, de nagyon kalóriadúsak.
          </li>
        </FoodGroup>
        <FoodGroup dots={2} title="Mértékkel — hetente néhányszor">
          <li>
            <b>Vörös hús</b> (marha, sertés) — hetente legfeljebb 350–500 g elkészítve (≈700–750 g nyersen). A WHO a
            „valószínűleg rákkeltő” kategóriába sorolja (2A csoport): minél több, annál nagyobb a vastagbélrák kockázata.
          </li>
          <li>
            <b>Kemény sajtok, vaj, tejföl</b> — sok bennük a telített zsír és a só, ezért csak kis adagokban.
          </li>
          <li>
            <b>Fehér kenyér, fehér rizs, sima tészta</b> — gyorsan megemésztődnek, és hamarabb visszatér az éhség, mint a
            teljes kiőrlésűek után.
          </li>
          <li>
            <b>Méz, aszalt gyümölcs, gyümölcslé</b> — sok cukor kis térfogatban; a gyümölcslé nem helyettesíti a gyümölcsöt.
          </li>
          <li>
            <b>Kávé</b> — napi legfeljebb 400 mg koffein (≈4 csésze) biztonságos az egészséges felnőtteknek. A koffein órákig
            hat, ezért késő este inkább hagyd ki.
          </li>
        </FoodGroup>
        <FoodGroup dots={1} title="Ritkán — kivételként">
          <li>
            <b>Kolbász, virsli, bacon, sonka</b> (feldolgozott hús) — a WHO a bizonyítottan rákkeltők közé sorolja
            (1. csoport): minden napi 50 g ≈ +18% vastagbélrák-kockázat. Ráadásul sok benne a só. Az abszolút kockázat kicsi,
            de a mennyiséggel nő.
          </li>
          <li>
            <b>Cukros üdítők</b> — egy doboz szénsavas üdítőben akár 40 g cukor is lehet (≈10 tk.). A WHO azt ajánlja, hogy a
            kalóriák kevesebb mint 10%-a származzon cukorból (≈50 g naponta), de jobb, ha legfeljebb 25 g. Következményei:
            túlsúly, fogszuvasodás, 2-es típusú cukorbetegség.
          </li>
          <li>
            <b>Ultrafeldolgozott élelmiszerek</b> — gyorskaja, chips, rágcsálnivalók, édes péksütemény, félkész ételek. Egy
            nagy áttekintés a BMJ-ben (2024) 32 egészségügyi problémával hozta összefüggésbe, köztük nagyjából 50%-kal
            nagyobb szív- és érrendszeri halálozási kockázattal, valamint a szorongás és a 2-es típusú cukorbetegség nagyobb
            kockázatával. Ezek megfigyeléses adatok, de egymással összhangban vannak.
          </li>
          <li>
            <b>Alkohol</b> — nincs biztonságos mennyiség. Grammonként 7 kcal, és rontja az alvást, még ha gyorsan el is alszol.
          </li>
          <li>
            <b>Transzzsírok</b> — olcsó margarin, bő olajban sült ételek, cukrászati zsiradékok: a legrosszabbak a szívnek, a
            WHO azt tanácsolja, hogy teljesen kerüld őket.
          </li>
        </FoodGroup>
        <h3>Só</h3>
        <p>
          A napi 5 g-nál több só emeli a vérnyomást, és vele a stroke és a szívinfarktus kockázatát is. A só nagy része
          „rejtve” van a kenyérben, a sajtban, a kolbászban, a savanyúságban, a szószokban és a félkész ételekben — ezért a
          receptekben a só „ízlés szerint” szerepel, és csak kevés.
        </p>
      </Section>

      <Section icon="feather" title="Félig diéta: így működik">
        <ul className="bullets">
          <li>
            A napi szükségletedet a Mifflin–St. Jeor-képlettel számoljuk (a legtöbb embernél ez a legpontosabb), a munkád
            típusát és az edzéseidet is figyelembe véve. A kíméletes fogyáshoz ebből levonunk 15%-ot — ez heti 0,3–0,5 kg,
            erős éhség nélkül.
          </li>
          <li>
            Fehérje: testsúlykilogrammonként 1,4–1,8 g, minden főétkezésben 20+ g — így megmaradnak az izmaid, és tovább tart
            a jóllakottság.
          </li>
          <li>Heti 2 erősítő edzés segít, hogy valóban a zsírból fogyj.</li>
          <li>
            Mérd magad hetente 2–3-szor reggel, és 2–3 hét trendjét nézd. Ha a súlyod nem változik — mínusz 100–150 kcal.
            Soha ne egyél kevesebbet az alapanyagcserédnél.
          </li>
          <li>Praktikus: olaj helyett airfryerben süss; a majonézt cseréld görög joghurtra; a szószok legyenek paradicsomosak.</li>
        </ul>
      </Section>

      <Section icon="book" title="Nehézségi szintek">
        <ul className="level-guide">
          {([1, 2, 3] as const).map((l) => (
            <li key={l} className={`lvl-${l}`}>
              <span className="level-line">
                <LevelBars level={l} size={20} />
                <b>
                  {LEVEL_INFO_HU[l].short} · {LEVEL_INFO_HU[l].title}
                </b>
              </span>
              <span>{LEVEL_INFO_HU[l].text}</span>
            </li>
          ))}
        </ul>
        <p>
          Tanulási terv: 1–2 hétig csak 1. szintű ételek, utána hétvégén egy 2. szintű étel. Ha a 2. szint már úgy megy, hogy
          nem kell a receptbe kukkantanod, próbáld ki a 3. szintet.
        </p>
      </Section>

      <Section icon="lunchbox" title="Tárolás és biztonság">
        <ul className="bullets">
          <li>A kész étel a hűtőben 3–4 napig áll el (a hal legfeljebb 2 napig). Ezért a menüben legfeljebb 1–2 napra előre főzöl.</li>
          <li>Gyorsan hűtsd le: oszd szét lapos dobozokba, és 2 órán belül tedd a hűtőbe.</li>
          <li>A fagyasztóban legfeljebb 3 hónapig áll el. Írd rá a fedőre az étel nevét és a dátumot.</li>
          <li>
            Csak egyszer melegítsd fel, 74 °C-ra — mindenhol forró legyen. Mikróban fedd le, és félidőben keverd meg.
          </li>
          <li>
            A húst és a halat a hűtőben olvaszd ki, ne a konyhapulton. A nyers csirkét ne mosd meg — a fröccsenő víz szétszórja
            a baktériumokat.
          </li>
          <li>Nyers hús után moss kezet, és mosd el a kést és a vágódeszkát.</li>
        </ul>
      </Section>

      <Section icon="moon" title="Műszakos és éjszakai munka">
        <ul className="bullets">
          <li>Tartsd a megszokott ritmust: napi 3 főétkezés, amennyire lehet, nappal.</li>
          <li>A fő étkezés az éjszakai műszak előtt legyen: fehérje és lassú szénhidrát.</li>
          <li>00:00 és 06:00 között inkább ne egyél kiadósan — csak könnyű nasit (joghurt, tojás, zöldség).</li>
          <li>Műszak közben igyál vizet; kávét legkésőbb 6 órával lefekvés előtt.</li>
          <li>Vigyél magaddal ételt — így kisebb a kísértés, hogy gyorskaját egyél.</li>
        </ul>
      </Section>

      <Section icon="stove" title="Alapfelszerelés a konyhába">
        <ul className="bullets">
          <li>Airfryer és mikró — az 1. szint alapja.</li>
          <li>Digitális beszúrós hőmérő — a leghasznosabb vásárlás.</li>
          <li>Konyhai mérleg: „szemre” a 150 g csirke könnyen összetéveszthető a 250 g-mal.</li>
          <li>Egy 20 cm-es szakácskés és egy kis kés; két feliratozott vágódeszka.</li>
          <li>24–26 cm-es tapadásmentes serpenyő fedővel, 2–3 l-es lábas, szűrő.</li>
          <li>Mikróba tehető, fedeles üveg ételdobozok — az elvitelre szánt ebédekhez.</li>
        </ul>
      </Section>

      <Section icon="external" title="Források">
        <ul className="sources">
          {SOURCES_HU.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.title}
                <Icon name="external" size={14} />
              </a>
            </li>
          ))}
        </ul>
        <p className="small muted">
          Az alkalmazás nem helyettesíti az orvosi vagy dietetikusi tanácsadást. Krónikus betegség esetén egyeztesd az
          étrendedet szakemberrel.
        </p>
      </Section>
    </div>
  );
}
