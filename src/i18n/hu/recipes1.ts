import type { RecipeTr } from '../types';

/** Угорські переклади рецептів рівня 1 (ключ — id рецепта). */
export const HU_RECIPES_1: Record<string, RecipeTr> = {
  'vivsianka-mikrokhvylovka': {
    name: 'Mikrós zabkása banánnal és dióval',
    notes: { 6: 'egy csipet' },
    steps: [
      {
        text: 'Szórd a zabpelyhet egy nagy, mikrózható tálba (legalább 0,5 l-es legyen, mert a kása felhabzik). Öntsd fel a tejjel, adj hozzá egy csipet sót és fahéjat, és keverd össze.',
      },
      {
        text: 'Fedd le egy tányérral úgy, hogy egy kis rés maradjon. Főzd a mikróban 1,5 percig maximális teljesítményen (800–900 W).',
        warn: 'Ha a kása a tál pereméig felfut, állítsd le a mikrót, és keverd meg.',
      },
      {
        text: 'Keverd meg, és főzd még 1 percig.',
        done: 'Megkóstolva a zabpehely puha, a kása sűrű: a kanállal a tál alján húzott csík csak lassan záródik össze.',
      },
      {
        text: 'Hagyd állni 1–2 percig, közben a kása tovább sűrűsödik. Addig vágd karikákra a banánt, a diót pedig törd kisebb darabokra kézzel.',
        warn: 'A tál forró – edényfogóval fogd meg.',
      },
      { text: 'Tedd a tetejére a joghurtot, a banánt és a diót.' },
    ],
    tip: 'Az instant zabpehely 1,5–2 perc alatt elkészül, de kevésbé laktat. Jobb a hagyományos, nagy szemű zabpehely.',
  },
  'omlet-u-kruzhtsi': {
    name: 'Bögrés omlett spenóttal és sajttal',
    notes: { 2: 'kiolvasztás nélkül is mehet', 3: 'lereszelve', 5: 'a bögre kikenéséhez' },
    steps: [
      {
        text: 'Kenj ki egy nagy (legalább 350 ml-es) bögrét egy csepp olajjal. Üsd bele a tojásokat, add hozzá a tejet, a sót és a borsot, majd villával verd 30 mp-ig, amíg egynemű nem lesz.',
      },
      { text: 'Add hozzá a spenótot és a reszelt sajtot, és keverd össze.' },
      {
        text: 'Tedd a mikróba 1 percre maximális teljesítményen. Utána keverd át villával – a széle köt meg először.',
      },
      {
        text: 'Tedd vissza a mikróba még 40 mp-re.',
        done: 'Az omlett megemelkedett és rugalmas. A közepébe szúrt villán nem marad folyós tojás. Ha mégis van, tedd vissza még 15 mp-re, és szükség szerint ismételd.',
        look: 'Az omlett egyenletesen világossárga, a közepén nincsenek átlátszó, fényes foltok.',
        warn: 'Héjas tojást ne főzz mikróban – felrobbanhat.',
      },
      { text: 'Hagyd állni 1 percig, és tálald egy szelet kenyérrel.' },
    ],
  },
  'yaiechnia-z-pomidoramy': {
    name: 'Paradicsomos tükörtojás uborkasalátával',
    steps: [
      { text: 'Vágd a paradicsomot ~1 cm-es karikákra, az uborkát pedig karikákra a salátához.' },
      {
        text: 'Melegítsd fel a serpenyőt 1 tk. olajjal közepes lángon.',
        done: 'Egy csepp víz a serpenyőben azonnal sistereg és „szaladgál”.',
      },
      { text: 'Tedd bele a paradicsomkarikákat, és süsd 2 percig.', done: 'A paradicsom puhul, a serpenyő erősen serceg.' },
      {
        text: 'Üsd a tojásokat a paradicsom mellé, sózd és borsozd meg. Tedd rá a fedőt, és vedd lejjebb a lángot közepesnél kisebbre.',
      },
      {
        text: 'Süsd lefedve 4 percig.',
        done: 'A tojásfehérje megszilárdult és átlátszatlan, és nem remeg, ha kicsit megmozgatod a serpenyőt. A sárgája kanállal finoman megnyomva rugalmas, nem folyós.',
        look: 'A tojásfehérje teljesen fehér, a sárgája körül sincsenek átlátszó részek; a sárgája matt, nem fényes.',
      },
      { text: 'Tálald kenyérrel és az uborkával, a tetejét pedig szórd meg zöldfűszerrel.' },
    ],
    tip: 'Ha folyós sárgáját szeretnél, vedd le 1–2 perccel korábban – de biztonságosabb, ha a sárgája is megköt.',
  },
  'syr-z-yahodamy': {
    name: 'Túró bogyós gyümölccsel, mézzel és dióval',
    steps: [
      {
        text: 'Ha a gyümölcs fagyasztott, olvaszd ki egy tálban a mikróban 1 percig (vagy előző este tedd át a hűtőbe).',
        done: 'A gyümölcs puha, a kés könnyen átmegy rajta.',
      },
      { text: 'Villával törd össze a túrót a mézzel. Ha krémesebben szeretnéd, adj hozzá 2–3 kanál kefirt vagy joghurtot.' },
      { text: 'Tedd a tetejére a gyümölcsöt és az aprított diót.' },
    ],
    tip: 'Munkába: a túrót és a gyümölcsöt külön rétegekben tedd az ételdobozba, a diót pedig csomagold külön, hogy ropogós maradjon.',
  },
  'lynyva-vivsianka': {
    name: 'Lusta zabkása üvegben (előző este elkészítve)',
    steps: [
      { text: 'Szórd a zabpelyhet és a lenmagot egy ~0,5 l-es befőttesüvegbe vagy dobozba.' },
      { text: 'Add hozzá a joghurtot, a kefirt és a fahéjat. Keverd össze úgy, hogy minden zabpehely a folyadékba kerüljön.' },
      { text: 'Reszeld le durvára az alma felét, vagy vágd apróra, és tedd a tetejére. Zárd le a fedővel.' },
      {
        text: 'Tedd a hűtőbe legalább 6 órára – a legkényelmesebb egész éjszakára.',
        done: 'Reggelre a zabpehely megduzzadt és megpuhult, az egész sűrű, mint a joghurt. Ha túl sűrű, adj hozzá egy kanál kefirt.',
      },
    ],
    tip: 'Készíts egyszerre 2 üveggel – holnapra és holnaputánra. Így a reggeli 0 perc alatt kész.',
  },
  'tost-z-tuntsem': {
    name: 'Teljes kiőrlésű pirítós tonhallal és uborkával',
    notes: { 1: 'lecsepegtetve' },
    steps: [
      {
        text: 'Csepegtesd le a tonhalat. Villával törd össze a joghurttal, a mustárral és a borssal – ez a majonéz könnyű helyettesítője.',
      },
      { text: 'Vágd az uborkát vékony karikákra.' },
      {
        text: 'Ha szeretnéd, ropogósítsd meg a kenyeret kenyérpirítóban vagy száraz serpenyőben, oldalanként 1–2 percig.',
        done: 'A kenyér ropogós és kemény tapintású, megnyomva nem hajlik be.',
        look: 'A kenyér aranyszínűre pirult.',
      },
      { text: 'Tegyél a kenyérre salátalevelet, uborkát és tonhalkrémet.' },
    ],
    tip: 'A felbontott tonhalkonzervet tedd át egy dobozba – a hűtőben 2 napig eláll.',
  },
  'smuzi-kefir-banan': {
    name: 'Kefires-banános smoothie zabpehellyel',
    steps: [
      {
        text: 'Tedd a turmixgépbe ebben a sorrendben: először a kefirt, aztán a feldarabolt banánt, a túrót, a zabpelyhet és a mogyoróvajat.',
      },
      {
        text: 'Turmixold 40–60 mp-ig.',
        done: 'A turmixgép hangja egyenletessé vált, már nem kopognak benne darabok; a massza sima, nincsenek benne zabpehelycsomók.',
      },
      { text: 'Idd meg rögtön, vagy töltsd egy kupakos palackba – a hűtőben 12 óráig eláll.' },
    ],
  },

  'kurka-kartoplia-aerohryl': {
    name: 'Csirkemell krumplival és brokkolival airfryerben',
    steps: [
      {
        text: 'Vágd a krumplit ~2 cm-es cikkekre (alaposan megmosva héjastul is lehet). Egy tálban forgasd össze az olaj felével, sóval és fűszerpaprikával.',
      },
      { text: 'Tedd a krumplit egy rétegben az airfryer (forrólevegős sütő) kosarába, és süsd 200 °C-on 12 percig.' },
      {
        text: 'Amíg a krumpli sül, vágd a csirkemellet ~3 cm-es darabokra, és keverd össze a maradék olajjal, a szárított fokhagymával, sóval és borssal.',
        warn: 'A nyers húst külön vágódeszkán vágd; utána mosd meg a kezed és a kést.',
      },
      {
        text: 'Rázd meg a kosarat, és add hozzá a csirkét meg a fagyasztott brokkolit. Süsd még 12–14 percig 200 °C-on, félidőben rázd meg újra.',
      },
      {
        text: 'Ellenőrizd a legnagyobb csirkedarabot: vágd be a legvastagabb részénél, vagy szúrj bele konyhai hőmérőt, ha van.',
        done: 'A vágásfelületen a hús a teljes vastagságában egynemű és rostos, a közepe nem kocsonyás és nedves; a rostok villával könnyen szétválnak. A krumpliba a villa ellenállás nélkül csúszik bele.',
        look: 'Belül a hús fehér, nincsenek rózsaszín részei; a kifolyó lé átlátszó. A tetején aranyszínű kéreg, a krumpli megpirult.',
      },
    ],
    tip: 'Minden airfryer kicsit másképp süt: első alkalommal 2 perccel a vége előtt ellenőrizd a csirkét (bevágással vagy hőmérővel), és jegyezd meg a saját idődet.',
  },
  'hrechka-z-kurkoiu-aerohryl': {
    name: 'Hajdina airfryeres csirkével és salátával',
    notes: { 4: 'a saláta öntetéhez' },
    steps: [
      {
        text: 'Öblítsd át a hajdinát egy szűrőben. Tedd egy lábasba, öntsd fel 280 ml hideg vízzel (1 : 2), és sózd meg. Nagy lángon forrald fel.',
        done: 'A víz a teljes felületén bugyog.',
      },
      {
        text: 'Vedd a lángot a legkisebbre, tedd rá a fedőt, és főzd 15 percig keverés nélkül.',
        done: 'A víz felszívódott: ha megdöntöd a lábast, nincs folyadék az alján, a szemek puhák.',
      },
      {
        text: 'Közben forgasd össze a csirkét az olajjal, a fűszerpaprikával és sóval. Süsd airfryerben (forrólevegős sütőben) 200 °C-on 14–16 percig, félidőben fordítsd meg.',
        warn: 'A nyers csirke után mosd meg a kezed, a vágódeszkát és a kést.',
      },
      {
        text: 'Ellenőrizd a csirkét: vágd be a legvastagabb darabot a közepénél.',
        done: 'A felülete ropogós, a darab csipesszel megnyomva rugalmas; a vágásfelületen a hús egynemű és rostos, a közepe nem nedves és kocsonyás.',
        look: 'A vágásfelületen a hús világos, a közepe táján sincs rózsaszín; a lé átlátszó. A kéreg aranybarna.',
      },
      { text: 'Vágd fel az uborkát és a paradicsomot, keverd össze a joghurttal, és sózd meg.' },
    ],
    tip: 'Főzz 2 adagot: egyet vacsorára, a másikat ételdobozba ebédre. A salátát külön tedd el, hogy ne eresszen levet.',
  },
  'khek-z-ovochamy-aerohryl': {
    name: 'Hekk zöldségekkel és krumplival airfryerben',
    steps: [
      { text: 'Vágd a krumplit ~2 cm-es cikkekre, és forgasd össze 1 tk. olajjal és sóval.' },
      { text: 'Süsd a krumplit airfryerben (forrólevegős sütőben) 200 °C-on 10 percig.' },
      { text: 'Add hozzá a fagyasztott zöldségkeveréket 1 tk. olajjal, és rázd meg a kosarat. Süsd még 8 percig.' },
      {
        text: 'Itasd le a halat papírtörlővel, kend be a maradék olajjal, és szórd meg a szárított zöldfűszerekkel, sóval, borssal. Fektesd a zöldségek tetejére.',
      },
      {
        text: 'Süsd még 8–10 percig 200 °C-on.',
        done: 'A hal villával könnyen lemezekre válik, és belül már átlátszatlan.',
        look: 'A hal húsa a félig áttetsző, szürkés állapotból a teljes vastagságában matt fehérré vált.',
      },
      { text: 'Csepegtess citromlevet a halra.' },
    ],
    tip: 'A fagyasztott filét előző este tedd a hűtőbe kiolvadni, ne a konyhapulton olvaszd ki.',
  },
  'losos-z-rysom': {
    name: 'Airfryeres lazac rizzsel és uborkával',
    steps: [
      {
        text: 'Mosd át a rizst, öntsd fel 300 ml vízzel, és forrald fel. Tedd rá a fedőt, és a legkisebb lángon főzd 20 percig (a natúr rizst 30 percig).',
        done: 'A víz felszívódott, a rizsszemek puhák, de nem főttek szét.',
      },
      {
        text: 'Tedd a lazacot bőrös oldalával lefelé az airfryer (forrólevegős sütő) kosarába, és kend meg 1 ek. szójaszósszal. A brokkolit tedd mellé.',
      },
      {
        text: 'Süsd az airfryerben 200 °C-on 8–10 percig.',
        done: 'A hal villával lemezekre válik, belül átlátszatlan.',
        look: 'A hús a mély rózsaszín, fényes állapotból világos rózsaszínre és mattra változott; a lemezek között fehér fehérjecseppek jelenhetnek meg – ez normális.',
      },
      { text: 'Vágd fel az uborkát, és csepegtess citromlevet a halra. Rizzsel tálald.' },
    ],
    tip: 'A lazac omega-3 zsírsavakban gazdag, zsíros hal. A WHO és az egészségügyi ajánlások heti 2 alkalommal javasolnak halat.',
  },
  'lavash-rol-z-kurkoiu': {
    name: 'Lavastekercs csirkével és zöldségekkel',
    steps: [
      {
        text: 'Vágd a csirkemellet hosszában 2 vékony szeletre (így gyorsabban és egyenletesebben sül át). Szórd meg fűszerpaprikával és sóval.',
        warn: 'A nyers húshoz használj külön vágódeszkát; utána mosd meg a kezed.',
      },
      {
        text: 'Süsd airfryerben (forrólevegős sütőben) 200 °C-on 10–12 percig, félidőben fordítsd meg.',
        done: 'A szelet megnyomva rugalmasan visszaugrik; a legvastagabb részénél bevágva a hús egynemű és rostos, a közepe nem nedves.',
        look: 'A vágásfelületen a hús fehér, nincs rajta rózsaszín; a tetején vékony, aranyszínű kéreg.',
      },
      { text: 'Keverd össze a joghurtot a mustárral és egy csipet szárított fokhagymával – ez lesz a szósz.' },
      { text: 'Vágd a csirkét csíkokra, a zöldségeket vékony hasábokra.' },
      {
        text: 'Kend meg a lavast a szósszal, rakd rá a salátát, a zöldségeket és a csirkét. Hajtsd be az oldalait, és tekerd fel szorosan.',
        done: 'A tekercs megtartja a formáját, és nem nyílik szét; útra csomagold alufóliába vagy sütőpapírba.',
      },
    ],
    tip: 'Ha maradt csirke a tegnapi vacsorából, a tekercs 5 perc alatt összeáll, airfryer nélkül.',
  },
  'salat-tunets-kvasolia': {
    name: 'Tonhalas saláta tojással és babbal',
    notes: { 0: 'lecsepegtetve', 2: 'lecsepegtetve' },
    steps: [
      {
        text: 'Tedd a tojásokat egy lábasba, és önts rájuk annyi hideg vizet, hogy 2 cm-rel ellepje őket. Forrald fel.',
        done: 'A víz erősen bugyog, a tojások ugrálnak benne.',
      },
      {
        text: 'Vedd a lángot közepesre, és főzd 9 percig – így lesz keményre főtt.',
        done: '9 perc után a tojásfehérje és a sárgája is szilárd.',
      },
      { text: 'Tedd a tojásokat 3 percre hideg vízbe – így könnyebb meghámozni őket.' },
      { text: 'Csepegtesd le a tonhalat és a babot, a babot pedig öblítsd át vízzel egy szűrőben.' },
      { text: 'Vágd fel az uborkát, a paradicsomot és a tojásokat; a salátát tépd fel kézzel.' },
      { text: 'Keverj össze mindent, és ízesítsd olajjal, citromlével, sóval és borssal. Kenyérrel tálald.' },
    ],
    tip: 'Munkába: az öntetet vidd külön kis üvegben, és csak evés előtt öntsd rá.',
  },
  'kartoplia-mikrokhvylovka-z-syrom': {
    name: 'Mikrós krumpli túróval, fokhagymával és zöldfűszerrel',
    steps: [
      {
        text: 'Mosd meg alaposan, kefével 2 közepes krumplit. Villával szurkáld meg mindegyiket 5–6 helyen, minden oldalról, hogy a gőz távozni tudjon.',
        warn: 'Ha nem szurkálod meg, a krumpli szétrepedhet.',
      },
      {
        text: 'Fektesd egy tányérra, és takard le egy másik tányérral vagy nedves papírtörlővel. Tedd a mikróba 5 percre maximális teljesítményen.',
      },
      {
        text: 'Fordítsd meg, és tedd vissza még 3–4 percre.',
        done: 'A kés vagy a villa ellenállás nélkül csúszik bele a legnagyobb krumpli közepébe.',
        warn: 'A gőz forró – vágás közben villával tartsd a krumplit.',
      },
      { text: 'Keverd össze a túrót a joghurttal, az apróra vágott fokhagymával, a zöldfűszerrel és egy csipet sóval.' },
      {
        text: 'Vágd be a krumplit keresztben, villával kicsit nyomkodd szét a belsejét, és halmozd rá a túrós keveréket. Mellé tálald a felvágott uborkát és paradicsomot.',
      },
    ],
    tip: 'Van mikró a munkahelyeden? Vidd be a krumplit és a túrót dobozokban – 10 perc alatt kész az ebéd.',
  },
  'pitsa-na-lavashi': {
    name: 'Tonhalas lavaspizza airfryerben',
    notes: { 3: 'lecsepegtetve', 6: 'mellé tálalva' },
    steps: [
      {
        text: 'Hajtsd össze a lavast két-három rétegben úgy, hogy az airfryer (forrólevegős sütő) kosarába illő kört vagy négyzetet kapj.',
      },
      { text: 'Keverd simára a sűrített paradicsomot 1 ek. vízzel, és kend meg vele a lavast. Szórd meg oregánóval.' },
      { text: 'Rakd rá a vékonyra szeletelt paradicsomot és gombát, a tonhalat, a tetejére pedig a reszelt mozzarellát.' },
      {
        text: 'Süsd az airfryerben 180 °C-on 6–7 percig.',
        done: 'A sajt megolvadt és bugyog, a lavas széle ropogós – megnyomva eltörik, nem hajlik.',
        look: 'A sajt helyenként megpirult, a lavas széle aranyszínű.',
        warn: 'Spatulával vedd ki: a sajt nagyon forró.',
      },
      { text: 'Salátalevelekkel tálald.' },
    ],
    tip: 'Tonhal helyett jó a tegnapról maradt csirke vagy 2 főtt tojás is.',
  },
  'pasta-z-tuntsem': {
    name: 'Tonhalas-paradicsomos tészta spenóttal',
    notes: { 1: 'lecsepegtetve' },
    steps: [
      {
        text: 'Forralj fel 2 l vizet egy fazékban, sózd meg, és szórd bele a tésztát. Főzd a csomagoláson megadott időnél 1 perccel rövidebb ideig (általában 9 percig).',
        done: 'Ha beleharapsz egy darabba, a tészta ruganyos, és nincs kemény belseje.',
      },
      {
        text: 'Közben egy serpenyőben, közepes lángon melegítsd át az olajon a felvágott fokhagymát.',
        done: 'Sistereg, és erős fokhagymaillat érződik. Ne tovább 1 percnél – különben megkeseredik.',
      },
      {
        text: 'Add hozzá a paradicsomot, a fagyasztott spenótot és a szárított zöldfűszereket. Rotyogtasd 6–7 percig.',
        done: 'A szósz besűrűsödött: ha kanállal végighúzol a serpenyő alján, a csík nem záródik össze azonnal.',
      },
      { text: 'Add hozzá a tonhalat, keverd össze, és melegítsd 1 percig.' },
      {
        text: 'Szűrd le a tésztát (tegyél félre fél pohár főzővizet), és keverd össze a szósszal. Ha kicsit száraz, önts hozzá egy kevés főzővizet.',
      },
    ],
  },
  'stehna-z-ovochamy-bulgur': {
    name: 'Airfryeres csirkecomb zöldségekkel és bulgurral',
    steps: [
      {
        text: 'Szórd a bulgurt egy fedős tálba, sózd meg, és öntsd fel 220 ml forrásban lévő vízzel a vízforralóból. Fedd le, és hagyd állni 20 percig.',
        done: 'A víz felszívódott, a szemek puhák, de ruganyosak.',
        warn: 'Vigyázz, a víz forró – lassan öntsd.',
      },
      { text: 'Forgasd össze a csirkecombokat az olajjal, a fűszerpaprikával, a szárított fokhagymával és sóval.' },
      { text: 'Süsd a combokat airfryerben (forrólevegős sütőben) 200 °C-on 8 percig.' },
      {
        text: 'Fordítsd meg a combokat, add hozzá a fagyasztott zöldségeket, és rázd meg a kosarat. Süsd még 10–12 percig.',
        done: 'Serceg, a felülete ropogós. Vágd be a legvastagabb combot a közepén: a hús tömör, rostos, villával könnyen szétválik, nincsenek kocsonyás, nedves részei. A comb nem szárad ki könnyen – inkább hagyd bent 2 perccel tovább.',
        look: 'A vágásfelületen a hús világos, a közepén nincs rózsaszín; a lé átlátszó; a kéreg aranybarna.',
      },
    ],
    tip: 'A comb szaftosabb a mellnél, és szinte nem lehet kiszárítani – ideális kezdőknek.',
  },
  'bulgur-z-nutom': {
    name: 'Bulgursaláta csicseriborsóval és juhtúróval',
    notes: { 1: 'lecsepegtetve' },
    steps: [
      {
        text: 'Öntsd fel a bulgurt 180 ml forrásban lévő vízzel, sózd meg, és hagyd lefedve 20 percig.',
        done: 'A víz felszívódott, a bulgur puha. Lazítsd fel villával.',
      },
      { text: 'Csepegtesd le a csicseriborsót, és öblítsd át egy szűrőben.' },
      {
        text: 'Vágd az uborkát, a paradicsomot és a paprikát ~1 cm-es kockákra, a juhtúrót (vagy fetát) is kockázd fel, a zöldfűszert pedig vágd apróra.',
      },
      { text: 'Keverj össze mindent a bulgurral, és ízesítsd citromlével és olajjal. A sóval óvatosan: a juhtúró sós.' },
    ],
    tip: 'Hús nélkül is fehérjedús a csicseriborsónak és a juhtúrónak köszönhetően. A hűtőben 2 napig is jól eláll.',
  },
  'omlet-z-ovochamy': {
    name: 'Zöldséges omlett serpenyőben',
    steps: [
      {
        text: 'Melegítsd fel a serpenyőt 1 tk. olajjal közepes lángon, és szórd bele a fagyasztott zöldségeket.',
        done: '5 perc után a zöldségek forrók, már nem eresztenek vizet, és sercegnek.',
      },
      { text: 'Villával verd fel a tojásokat a tejjel, sóval és borssal 30 mp-ig.' },
      { text: 'Öntsd a tojást a zöldségekre, szórd meg a reszelt sajttal, és tedd rá a fedőt. A láng legyen közepesnél kisebb.' },
      {
        text: 'Süsd 5–6 percig, és az első 4 percben ne emeld le a fedőt.',
        done: 'A teteje megszilárdult, nem csillog rajta folyadék, és az omlett rugalmas, ha spatulával megnyomod.',
        look: 'A teteje matt, egyenletesen sárga, nincsenek rajta átlátszó, folyós foltok; a sajt megolvadt.',
      },
      { text: 'Tálald egy szelet kenyérrel.' },
    ],
  },

  'kefir-z-yablukom': {
    name: 'Kefir és alma',
    steps: [{ text: 'Tölts ki egy pohár kefirt.' }, { text: 'Mosd meg az almát. Munkába a kefirt vidd egy kis palackban.' }],
  },
  'yogurt-z-horikhamy': {
    name: 'Görög joghurt dióval és fahéjjal',
    steps: [
      { text: 'Tedd a joghurtot egy tálba vagy dobozba.' },
      { text: 'Szórd meg az aprított dióval és fahéjjal, majd csorgass rá ½ tk. mézet.' },
    ],
  },
  'khlibtsi-z-brynzoiu': {
    name: 'Ropogós kenyér juhtúróval és paradicsommal',
    steps: [
      { text: 'Vágd a paradicsomot karikákra, a juhtúrót (vagy fetát) vékony szeletekre.' },
      {
        text: 'Rakd a ropogós kenyérre, és szórd meg oregánóval. Munkába: a juhtúrót és a paradicsomot vidd dobozban, a ropogós kenyeret külön.',
      },
    ],
  },
  'ovochi-z-khumusom': {
    name: 'Sárgarépa és uborka hummusszal',
    steps: [
      { text: 'Hámozd meg a sárgarépát, majd vágd a répát és az uborkát ujjnyi vastag hasábokra.' },
      { text: 'Mártogasd a hummuszba. Dobozban a zöldség estig ropogós marad.' },
    ],
  },
  'banan-z-arakhisovoiu-pastoiu': {
    name: 'Banán mogyoróvajjal',
    steps: [
      { text: 'Hámozd meg a banánt, és vágd ketté hosszában.' },
      { text: 'Kend meg 1 ek. mogyoróvajjal. Edzés előtt különösen jó.' },
    ],
  },
  'vareni-yaitsia': {
    name: 'Főtt tojás uborkával',
    steps: [
      {
        text: 'Tedd a tojásokat egy lábasba, és önts rájuk annyi hideg vizet, hogy 2 cm-rel ellepje őket. Forrald fel.',
        done: 'A víz erősen bugyog.',
      },
      {
        text: 'Főzd 9 percig közepes lángon.',
        done: 'Az idő a legmegbízhatóbb jel: forrástól számítva 9 perc = szilárd sárgája.',
        look: 'Kettévágva a fehérje fehér, a sárgája világossárga és kissé száraz, nincs folyós, narancssárga közepe.',
      },
      { text: 'Tedd 3 percre hideg vízbe, majd hámozd meg. Uborkával tálald.' },
    ],
    tip: 'Főzz egyszerre 6–8 tojást: hámozatlanul a hűtőben akár 7 napig is elállnak.',
  },
  'syr-z-zelenniu': {
    name: 'Sós túrókrém kefirrel, zöldfűszerrel és uborkával',
    steps: [
      { text: 'Villával törd össze a túrót a kefirrel, a finomra vágott zöldfűszerrel és fokhagymával, valamint egy csipet sóval.' },
      { text: 'Hasábokra vágott uborkával edd – az uborka lesz a kanál.' },
    ],
  },
  'horikhy-i-hrusha': {
    name: 'Egy marék dió és egy körte',
    steps: [
      { text: 'Mérj ki 20 g diót – ez egy kis marék (a dió nagyon kalóriadús).' },
      { text: 'Mosd meg a körtét. Kényelmesen elvihető a táskádban.' },
    ],
  },
  'yogurt-z-yahodamy': {
    name: 'Joghurt bogyós gyümölccsel',
    steps: [
      {
        text: 'Olvaszd ki a gyümölcsöt a mikróban 40 mp alatt, vagy tedd előző este a hűtőbe.',
        done: 'A gyümölcs puha, de még hűvös.',
      },
      { text: 'Keverd össze a joghurttal.' },
    ],
  },
  'kefir-z-korytseiu': {
    name: 'Egy pohár kefir fahéjjal',
    steps: [
      { text: 'Tölts ki egy pohár kefirt (250 ml), és ha szeretnéd, szórj bele egy csipet fahéjat.' },
      { text: 'Lassan, kis kortyokban idd. Késő estére is jó választás: kevés benne a kalória, és van benne fehérje.' },
    ],
  },
  'ovochi-z-yohurtovym-sousom': {
    name: 'Uborka és sárgarépa joghurtos mártogatóssal',
    steps: [
      {
        text: 'Keverd össze a joghurtot az apróra vágott fokhagymával, a zöldfűszerrel és egy csipet sóval – ez lesz a mártogatós.',
      },
      { text: 'Hámozd meg a sárgarépát, vágd az uborkát és a répát ujjnyi vastag hasábokra, és mártogasd bele őket.' },
    ],
    tip: 'Könnyű esti nasi: a zöldség tömeget és rostot ad, a joghurt fehérjét.',
  },
};
