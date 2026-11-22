import type { RecipeTr } from '../types';

/** Угорські переклади рецептів рівня 2 (ключ — id рецепта). */
export const HU_RECIPES_2: Record<string, RecipeTr> = {
  // ── Сніданки ──────────────────────────────────────────────────────
  'syrnyky-aerogryl': {
    name: 'Túrótallér (szirniki) airfryerben, joghurttal és bogyós gyümölccsel',
    tip: 'Előre is elkészítheted: a megformázott tallérokat fagyaszd le egy sütőpapírral bélelt deszkán, aztán tedd át őket egy zacskóba — 2 hónapig elállnak. Kiolvasztás nélkül süsd őket 14–15 percig 180 °C-on, a 8. percben megfordítva.',
    notes: {
      0: 'morzsalékos',
      2: '3 ek. a tésztába + 1 ek. a forgatáshoz',
      4: 'egy csipet',
      5: 'a kosár és a tallérok kenéséhez',
      6: 'tálaláshoz',
      7: 'tálaláshoz',
    },
    steps: [
      { text: 'Tedd a bogyós gyümölcsöt egy kis tálba — mire elkészülsz a főzéssel, kiolvad.' },
      {
        text: 'Egy tálban villával törd szét a túrót apró morzsákra. Ha a túró nedves, előbb tedd szűrőbe, és nyomkodd ki belőle a levet.',
        done: 'Nem maradtak nagy csomók, a massza nedves homokra hasonlít.',
      },
      {
        text: 'Add hozzá a tojást, a mézet, egy csipet sót és 3 ek. lisztet. Kanállal dolgozd össze puha tésztává.',
        done: 'A tészta megtartja a formáját, és csak kicsit ragad a kezedhez. Ha szétfolyik, adj hozzá még 1 ek. lisztet.',
      },
      { text: 'Kapcsold be az airfryert 180 °C-ra, hogy előmelegedjen.' },
      { text: 'Vizes kézzel formázz 8 kerek, ~2 cm vastag tallért. Mindegyiket forgasd meg a maradék lisztben.' },
      {
        text: 'Ecsettel kend ki olajjal a kosarat. Rakd bele a tallérokat egy rétegben, egymástól ~1 cm-re, és a tetejüket is kend meg vékonyan.',
        warn: 'A kosár forró — edényfogóval fogd meg.',
      },
      {
        text: 'Süsd a tallérokat 6 percig 180 °C-on.',
        done: 'Az aljukon száraz kéreg képződött: a spatula könnyen becsúszik alájuk.',
        look: 'Az aljukon aranyszínű kéreg.',
      },
      {
        text: 'Spatulával fordítsd meg a tallérokat, és süsd őket még 5 percig.',
        done: 'A tallérok megtartják a formájukat, megnyomva rugalmasak, a kéreg száraz és ropogós.',
        look: 'Mindkét oldalukon aranybarna kéreg.',
      },
      { text: 'Tálald joghurttal és bogyós gyümölccsel.' },
    ],
  },
  shakshuka: {
    name: 'Shakshuka brindzával',
    tip: 'A tojás nélküli paradicsomszósz 3 napig eláll a hűtőben. Melegíts fel egy adagot egy kis serpenyőben, és üss bele friss tojásokat — 10 perc alatt kész a vacsora.',
    notes: {
      2: '~1 cm széles csíkokra vágva',
      3: '~1 cm-es kockákra vágva',
      9: 'elmorzsolva',
      10: 'tálaláshoz',
    },
    steps: [
      { text: 'Vágd a hagymát ~1 cm-es kockákra, a kaliforniai paprikát ~1 cm széles csíkokra. A fokhagymát vágd apróra.' },
      {
        text: 'Melegítsd fel az olajat egy 24–26 cm átmérőjű serpenyőben közepes lángon.',
        done: 'Ha egy darabka hagymát beledobsz az olajba, azonnal sistereg.',
      },
      {
        text: 'Tedd bele a hagymát és a kaliforniai paprikát, és süsd 7 percig, kevergetve.',
        done: 'A zöldségek puhák, a spatulával könnyen szétnyomhatók, és édeskés illatuk van.',
        look: 'A hagyma üvegessé vált, a paprika kicsit sötétebb lett.',
        warn: 'Az olaj forró — a zöldségeket magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a fokhagymát, az őrölt paprikát és a római köményt. Kevergesd 30 mp-ig.',
        done: 'Erős fűszerillat érezhető. Ennél tovább ne süsd — a fokhagyma megkeseredik.',
      },
      {
        text: 'Öntsd hozzá a paradicsomot, sózd meg, és fedő nélkül, közepes lángon főzd 10 percig, időnként megkeverve.',
        done: 'A szósz besűrűsödött: ha a spatulát végighúzod a serpenyő alján, szabad csík marad utána, ami nem folyik össze azonnal.',
        warn: 'A szósz fröcsköl — hosszú nyelű kanállal keverd.',
      },
      { text: 'Egy kanállal csinálj 4 mélyedést a szószba, és mindegyikbe üss bele egy tojást. A tojásokat enyhén sózd meg.' },
      {
        text: 'Tedd rá a fedőt, vedd kis lángra, és főzd 7 percig.',
        done: 'A fehérje teljesen átlátszatlan és megszilárdult, nem remeg, ha megmozdítod a serpenyőt. A sárgája besűrűsödött, és a kanál alatt rugalmasan enged.',
        look: 'A fehérje teljesen fehér, áttetsző részek nélkül; a sárgája matt, nem fényes.',
      },
      { text: 'Szórd meg a brindzával, és tálald egyenesen a serpenyőből, kenyérrel.' },
    ],
  },
  'syrna-zapikanka': {
    name: 'Almás túrófelfújt',
    tip: 'Alma helyett jó a körte vagy 100 g fagyasztott bogyós gyümölcs is (ne olvaszd ki). A kihűlt felfújt dobozba csomagolva kész uzsonna, 3 napig eláll.',
    notes: {
      4: '~1 cm-es kockákra vágva',
      6: 'tálaláshoz',
    },
    steps: [
      {
        text: 'Melegítsd elő a sütőt 180 °C-ra, és bélelj ki sütőpapírral egy ~20×20 cm-es sütőformát.',
        done: 'A sütő jelzett, vagy kialudt a fűtésjelző lámpa.',
      },
      { text: 'Egy tálban villával törd szét a túrót apró morzsákra.' },
      {
        text: 'Add hozzá a tojásokat, a mézet, a zabpelyhet és a fahéjat, és alaposan keverd össze. Hagyd állni 10 percig.',
        done: 'A zabpehely megszívta magát, a massza besűrűsödött.',
      },
      { text: 'Közben vágd az almát ~1 cm-es kockákra, és keverd a túrós masszába.' },
      { text: 'Tedd a masszát a formába, és kanállal simítsd el.' },
      {
        text: 'Tedd a formát a sütő középső szintjére, és süsd 35 percig.',
        done: 'A közepe megnyomva rugalmas, és nem remeg, ha finoman megrázod a formát; a beleszúrt hurkapálca szárazon jön ki.',
        look: 'A teteje és a széle aranybarnára sült.',
        warn: 'A forma forró — edényfogóval fogd meg.',
      },
      {
        text: 'Hagyd a felfújtat a formában hűlni 15 percig, majd vágd 4 adagra.',
        done: 'A felfújt egyenesen szeletelhető, és nem esik szét.',
      },
      { text: 'Tálald görög joghurttal — melegen vagy hidegen.' },
    ],
  },
  'linyvi-vareniki': {
    name: 'Lusta túrógombóc (linivi vareniki) joghurttal',
    tip: 'A felvágott nyers gombócokat fagyaszd le egy lisztezett deszkán, aztán szórd át őket egy zacskóba — 2 hónapig elállnak. Egyenesen a fagyasztóból főzd őket, kiolvasztás nélkül: miután feljöttek a víz tetejére, még 4 percig.',
    notes: {
      2: '6 ek. a tésztába + 2 ek. a lisztezéshez',
      3: 'egy csipet',
      4: 'tálaláshoz',
      5: 'tálaláshoz',
      6: 'ízlés szerint',
    },
    steps: [
      {
        text: 'Önts egy lábasba 2 l vizet, és tedd fel nagy lángon. A bogyós gyümölcsöt tedd egy kis tálba — 20 perc alatt kiolvad.',
      },
      { text: 'Villával törd össze a túrót, add hozzá a tojást és egy csipet sót. Keverd simára.' },
      {
        text: 'Szórj hozzá 6 ek. lisztet, és gyúrj belőle puha tésztát.',
        done: 'A tészta puha, kicsit ragad, de megtartja a formáját. Ha szétfolyik, adj hozzá még 1 ek. lisztet.',
      },
      {
        text: 'Lisztezd meg a munkalapot, oszd a tésztát 3 részre, és mindegyiket sodord kézzel ~2 cm vastag rúddá.',
      },
      { text: 'Késsel vágd a rudakat ~2 cm-es darabokra.' },
      {
        text: 'Sózd meg a forrásban lévő vizet, tedd bele a gombócokat, és rögtön óvatosan keverd meg őket szűrőkanállal.',
        warn: 'A gombócokat közvetlenül a víz fölött engedd bele — a forró víz fröcsköl.',
      },
      {
        text: 'Amikor a gombócok feljönnek a víz tetejére, főzd őket még 2 percig közepes lángon.',
        done: 'A gombócok a víz tetején úsznak, megnőttek, és rugalmasak, ha megnyomod őket a szűrőkanállal.',
      },
      { text: 'Szedd ki a gombócokat szűrőkanállal, és tálald joghurttal és bogyós gyümölccsel.' },
    ],
  },

  // ── Супи ──────────────────────────────────────────────────────────
  'sochevychnyi-sup': {
    name: 'Lencseleves joghurttal',
    tip: 'Krémlevesnek turmixold botmixerrel 30 mp-ig. A hűtőben a leves besűrűsödik — melegítéskor adj hozzá egy kevés vizet. Adagonként 3 hónapig fagyasztható.',
    notes: {
      1: '~1 cm-es kockákra vágva',
      2: 'lereszelve',
      9: 'csak a leve',
      10: 'tálaláshoz',
      11: 'tálaláshoz',
    },
    steps: [
      { text: 'Mosd át a lencsét egy szűrőben hideg folyóvíz alatt 1 percig, közben kézzel kevergetve.' },
      { text: 'Vágd a hagymát ~1 cm-es kockákra, a sárgarépát reszeld le nagy lyukú reszelőn, a fokhagymát vágd apróra.' },
      {
        text: 'Melegítsd fel az olajat egy 3 literes lábasban közepes lángon. Tedd bele a hagymát és a répát, és dinszteld 5 percig, kevergetve.',
        done: 'A hagyma puha, a sercegés halkabb lett, és édeskés illata van.',
        look: 'A hagyma üveges, a répa élénk narancssárga, nincsenek odaégett szélek.',
        warn: 'Az olaj forró — a zöldségeket magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a fokhagymát, a paradicsompürét, a római köményt és a curryt. Kevergesd 1 percig.',
        done: 'Erős fűszeres illat árad, a paradicsompüré kicsit leragad az edény aljára.',
      },
      {
        text: 'Szórd bele a lencsét, önts hozzá 1,2 l vizet, és nagy lángon forrald fel.',
        done: 'Az edényben mindenhol nagy buborékok törnek fel.',
      },
      {
        text: 'Sózd meg, vedd kis lángra, és főzd 20 percig résnyire nyitott fedő alatt. 5 percenként keverd meg.',
        done: 'A lencse teljesen szétfőtt, és kanállal az edény falához nyomva szétkenődik; a leves sűrű.',
        warn: 'A fedőt magadtól elfelé emeld fel — a gőz megégethet.',
      },
      { text: 'Húzd le a lábast a tűzről, facsard bele egy fél citrom levét, és keverd meg. Ízlés szerint sózd.' },
      { text: 'Minden tányérba tegyél egy kanál joghurtot, és tálald egy szelet kenyérrel.' },
    ],
  },
  'kuriachyi-sup': {
    name: 'Zöldséges csirkeleves cérnametélttel',
    tip: 'Ha le akarod fagyasztani, a tésztát főzd külön, és csak a tányérba tedd — a fagyasztóban szétázik. Tészta nélkül a leves 3 hónapig eláll a fagyasztóban.',
    notes: {
      0: '~2 cm-es kockákra vágva',
      1: '~1,5 cm-es kockákra vágva',
      2: 'karikákra vágva',
      3: 'apróra vágva',
      4: 'cérnametélt',
      5: 'apróra vágva',
      9: 'tálaláshoz',
    },
    steps: [
      {
        text: 'Vágd a csirkét ~2 cm-es kockákra egy külön vágódeszkán.',
        warn: 'A nyers csirke után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      {
        text: 'Tedd a csirkét egy 4 literes lábasba, öntsd fel 2 l hideg vízzel, és nagy lángon forrald fel.',
        done: 'A víz forr, a tetején hab gyűlt össze.',
        warn: 'Ne menj el a tűzhely mellől: forráskor a hab kifuthat.',
      },
      { text: 'Szedd le a habot szűrőkanállal, vedd kis lángra, és főzd 10 percig.' },
      { text: 'Közben vágd a krumplit ~1,5 cm-es kockákra, a sárgarépát ~0,5 cm-es karikákra, a hagymát apróra.' },
      {
        text: 'Add hozzá a zöldségeket és a babérlevelet, sózd meg, és főzd kis lángon 15 percig.',
        done: 'A krumpli villával ellenállás nélkül átszúrható.',
      },
      {
        text: 'Szórd bele a cérnametéltet, keverd meg, és főzd 5 percig.',
        done: 'A tészta puha. Halászd ki a legnagyobb csirkedarabot, és vágd ketté: a hús belül egynemű, rostos, és villával könnyen szétválik.',
        look: 'A csirke kettévágva fehér, rózsaszín nélkül.',
      },
      {
        text: 'Kapcsold le a tűzhelyet, vedd ki a babérlevelet, és add hozzá a zöldfűszert. Hagyd a levest lefedve állni 5 percig.',
      },
      { text: 'Tálald egy szelet kenyérrel.' },
    ],
  },

  // ── Обіди та вечері ───────────────────────────────────────────────
  'hrechka-z-indychkoiu': {
    name: 'Egyserpenyős hajdina pulykával és zöldségekkel',
    tip: 'Ételhordóba a salátát külön dobozba tedd, különben az uborka levet ereszt. A pulykás hajdinát lefedve melegítsd 2 percig a mikróban.',
    notes: {
      0: '~2 cm-es kockákra vágva',
      2: '~1 cm-es kockákra vágva',
      3: 'lereszelve',
      10: 'a salátához',
      11: 'a salátához',
      12: 'a salátához',
    },
    steps: [
      {
        text: 'Vágd a pulykát ~2 cm-es kockákra egy külön vágódeszkán.',
        warn: 'A nyers hús után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      {
        text: 'Vágd a hagymát ~1 cm-es kockákra, a sárgarépát reszeld le nagy lyukú reszelőn, a fokhagymát vágd apróra. A hajdinát mosd át egy szűrőben.',
      },
      {
        text: 'Melegítsd fel az olajat egy mély, fedős serpenyőben közepesnél erősebb lángon. Süsd a pulykát 5 percig, kevergetve.',
        done: 'A darabok kívül átlátszatlanok és feszesek, hangosan sercegnek.',
        look: 'A darabok kívül kifehéredtek, a felületükön nincs rózsaszín.',
        warn: 'Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a hagymát és a répát, és süsd még 4 percig.',
        done: 'A hagyma puha, és édeskés illata lett.',
        look: 'A hagyma üveges.',
      },
      {
        text: 'Keverd hozzá a fokhagymát, a paradicsompürét és a hajdinát, és kevergetve hevítsd 1 percig.',
        done: 'A szemek pattognak, sült hajdina illata van.',
      },
      {
        text: 'Önts hozzá 400 ml vizet, sózd meg, tedd bele a babérlevelet, és forrald fel.',
        done: 'A víz az egész felületén bugyog.',
      },
      {
        text: 'Tedd rá a fedőt, vedd a lángot a legkisebbre, és főzd 18 percig — közben ne emeld fel a fedőt.',
        done: 'A víz felszívódott: ha megdöntöd a serpenyőt, nincs folyadék az alján. Vágd ketté a legvastagabb pulykadarabot: belül egynemű és rostos, villával könnyen szétválik.',
        look: 'A pulyka belül fehér, rózsaszín részek nélkül.',
        warn: 'A fedőt magadtól elfelé emeld fel — a gőz megégethet.',
      },
      {
        text: 'Kapcsold le a tűzhelyet, és hagyd a hajdinát lefedve 10 percig. Közben vágd fel az uborkát, aprítsd fel a zöldfűszert, és keverd össze őket a joghurttal és egy csipet sóval.',
        done: 'A hajdina pergős, a szemek puhák.',
      },
      { text: 'Vedd ki a babérlevelet, keverd át a hajdinát, és tálald a salátával.' },
    ],
  },
  'kurka-teriyaki': {
    name: 'Teriyaki csirke rizzsel és brokkolival',
    tip: 'Comb helyett csirkemellet is használhatsz — azt 2 perccel rövidebb ideig süsd, hogy ne száradjon ki, és ugyanúgy ellenőrizd, hogy elérje a 74 °C-ot.',
    notes: {
      0: '~3 cm-es darabokra vágva',
    },
    steps: [
      {
        text: 'Önts egy lábasba 1,5 l vizet, sózd meg, és tedd fel nagy lángon.',
        done: 'A víz lobogva forr, az egész felületén nagy buborékokkal.',
      },
      { text: 'Szórd bele a rizst, keverd meg, és főzd közepes lángon 12 percig (a hántolatlan rizst 25 percig).' },
      {
        text: 'Amíg a rizs fő, vágd a csirkét ~3 cm-es darabokra egy külön vágódeszkán.',
        warn: 'A nyers csirke után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      { text: 'Egy bögrében keverd össze a szójaszószt, a mézet, az apróra vágott fokhagymát és 3 ek. vizet.' },
      {
        text: 'Add a rizshez a brokkolit, főzd még 5 percig, majd szűrd le tésztaszűrőn.',
        done: 'A rizsszemek puhák, nincs kemény belük; a brokkoli késsel könnyen átszúrható.',
        warn: 'A vizet magadtól elfelé öntsd le — a gőz megégethet.',
      },
      {
        text: 'Melegítsd fel az olajat egy serpenyőben közepesnél erősebb lángon. Tedd bele a csirkét egy rétegben, és süsd 8 percig, 2 percenként megforgatva.',
        done: 'A darabok megnyomva rugalmasak. Vágd ketté a legnagyobbat: belül egynemű és rostos, nincs nedves, kocsonyás közepe.',
        look: 'A darabok kívül megpirultak, kettévágva világosak, rózsaszín nélkül.',
        warn: 'Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Öntsd rá a szószt, és főzd 2 percig, folyamatosan kevergetve.',
        done: 'A szósz szirupszerűre sűrűsödött, és bevonja a darabokat; a spatula szabad csíkot hagy a serpenyő alján.',
      },
      { text: 'Oszd el a rizst és a brokkolit tányérokra vagy dobozokba, a tetejükre tedd a szószos csirkét.' },
    ],
  },
  'tushkovana-kapusta': {
    name: 'Párolt káposzta pulykával és krumplival',
    tip: 'Adagonként, dobozokban jól fagyasztható, 3 hónapig eláll. Előző este tedd át a hűtőbe kiolvadni, és addig melegítsd, amíg a közepe is forró nem lesz.',
    notes: {
      0: 'vékony csíkokra vágva',
      1: '~2 cm-es kockákra vágva',
      2: '~2 cm-es kockákra vágva',
      3: 'lereszelve',
      4: 'apróra vágva',
    },
    steps: [
      {
        text: 'Vágd a pulykát ~2 cm-es kockákra egy külön vágódeszkán.',
        warn: 'A nyers hús után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      {
        text: 'A káposztát vágd vékony csíkokra, a krumplit ~2 cm-es kockákra. A hagymát vágd apróra, a sárgarépát reszeld le nagy lyukú reszelőn.',
      },
      {
        text: 'Melegítsd fel az olajat egy széles, 4–5 literes lábasban közepesnél erősebb lángon. Süsd a pulykát 5 percig, kevergetve.',
        done: 'A darabok kívül átlátszatlanok és feszesek, hangosan sercegnek.',
        look: 'A darabok kívül kifehéredtek, a felületükön nincs rózsaszín.',
        warn: 'Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a hagymát és a répát, és süsd 4 percig, kevergetve.',
        done: 'A hagyma puha, és édeskés illata van.',
        look: 'A hagyma üveges, épphogy aranyszínű.',
      },
      {
        text: 'Add hozzá a káposztát, a paradicsompürét és az őrölt paprikát. Süsd 5 percig, kevergetve.',
        done: 'A káposzta nagyjából a felére esett össze, és puhább lett.',
      },
      {
        text: 'Tedd bele a krumplit és a babérlevelet, sózd meg, önts hozzá 200 ml vizet, és forrald fel.',
        done: 'A folyadék az egész felületén bugyog.',
      },
      {
        text: 'Tedd rá a fedőt, és párold kis lángon 25 percig, 10 percenként megkeverve.',
        done: 'A krumpli villával ellenállás nélkül átszúrható, a káposzta puha. Vágd ketté a legvastagabb pulykadarabot: belül egynemű, és villával könnyen szétválik.',
        look: 'A pulyka belül fehér, rózsaszín nélkül; a káposzta átvette a paradicsom színét.',
        warn: 'A fedőt magadtól elfelé emeld fel — a gőz megégethet.',
      },
      { text: 'Vedd ki a babérlevelet, és hagyd az ételt lefedve állni 5 percig.' },
    ],
  },
  'pasta-boloneze': {
    name: 'Bolognai tészta pulykával és cukkinivel',
    tip: 'A szósz tészta nélkül adagonként 3 hónapig fagyasztható. A tésztát jobb frissen főzni — ez csak 10 perc.',
    notes: {
      3: 'lereszelve',
      4: 'apróra vágva',
      5: 'lereszelve',
      11: 'lereszelve, tálaláshoz',
    },
    steps: [
      { text: 'Vágd a hagymát apró kockákra, a sárgarépát és a cukkinit reszeld le nagy lyukú reszelőn, a fokhagymát vágd apróra.' },
      {
        text: 'Melegítsd fel az olajat egy mély serpenyőben közepesnél erősebb lángon. Süsd a darált húst 7 percig, közben a spatulával törd apró morzsákra.',
        done: 'A darált hús morzsalékos, nincsenek benne nyers csomók; a kiengedett leve elpárolgott, és hangosan serceg.',
        look: 'A darált húsban egyáltalán nincs rózsaszín rész; világosszürke, itt-ott aranyszínű morzsákkal.',
        warn: 'A nyers darált hús után mosd meg szappannal a kezed. Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a hagymát, a répát, a cukkinit és a fokhagymát. Süsd 5 percig, kevergetve.',
        done: 'A zöldségek puhák, a cukkini leve majdnem teljesen elpárolgott.',
      },
      {
        text: 'Öntsd hozzá a paradicsomot, add hozzá a szárított fűszernövényeket, a sót és a borsot. Fedő nélkül, kis lángon főzd 15 percig, időnként megkeverve.',
        done: 'A szósz besűrűsödött: a spatula szabad csíkot hagy a serpenyő alján, ami nem folyik össze azonnal. A szósz az egész felületén forr — a hús benne teljesen átforrósodott.',
        look: 'A darált hús világos, szürkésbézs, rózsaszín csomók nélkül; a szósz mélyvörös.',
        warn: 'A szósz fröcsköl — hosszú nyelű kanállal keverd.',
      },
      {
        text: 'Közben forralj fel egy lábasban 2,5 l vizet, és sózd meg.',
        done: 'A víz lobogva forr.',
      },
      {
        text: 'Szórd bele a tésztát, és főzd a csomagoláson jelzett ideig (általában 9–11 percig); az első percben keverd meg.',
        done: 'Ha beleharapsz egy darabba, a tészta rugalmas, és nincs kemény belseje.',
      },
      {
        text: 'Szűrd le a tésztát tésztaszűrőn, és tedd át a szószos serpenyőbe. Keverd össze.',
        warn: 'A vizet magadtól elfelé öntsd le — a gőz megégethet.',
      },
      { text: 'Tálaláskor szórd meg minden adagot reszelt sajttal.' },
    ],
  },
  'plov-z-kurkoiu': {
    name: 'Csirkés piláf zöldségsalátával',
    tip: 'Hántolatlan rizzsel önts 100 ml-rel több vizet, és 25 helyett 40 percig főzd.',
    notes: {
      0: '~3 cm-es darabokra vágva',
      1: 'lehetőleg parboiled',
      2: 'csíkokra vágva',
      3: 'félkarikákra vágva',
      4: 'hámozatlanul',
      9: 'a salátához',
      10: 'a salátához',
    },
    steps: [
      { text: 'Egy tálban mosd át a rizst hideg vízzel 3–4-szer, minden alkalommal leöntve a vizet. Hagyd egy szűrőben lecsöpögni.' },
      {
        text: 'Vágd a csirkét ~3 cm-es darabokra egy külön vágódeszkán.',
        warn: 'A nyers csirke után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      { text: 'Vágd a hagymát félkarikákra, a sárgarépát ~0,5 cm vastag csíkokra.' },
      {
        text: 'Melegítsd fel az olajat egy öntöttvas edényben vagy egy vastag falú, fedős lábasban közepesnél erősebb lángon. Süsd a csirkét 6 percig, kevergetve.',
        done: 'A darabok kívül átlátszatlanok és feszesek, hangosan sercegnek.',
        look: 'A csirke kívül kifehéredett, és itt-ott megpirult.',
        warn: 'Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a hagymát és a répát, és süsd 7 percig, kevergetve.',
        done: 'A répa hajlik, de nem törik; a hagyma puha, és édes illata van.',
        look: 'Az olaj a répától narancssárga lett, a hagyma aranyszínű.',
      },
      {
        text: 'Szórd bele a római köményt, sózd meg, önts hozzá 550 ml vizet, és forrald fel.',
        done: 'A víz az egész felületén bugyog.',
      },
      {
        text: 'Szórd rá a rizst egyenletes rétegben, keverés nélkül, és szúrd bele a fokhagymagerezdeket. Tedd rá a fedőt, és a legkisebb lángon főzd 25 percig — közben ne emeld fel a fedőt.',
        done: 'A víz teljesen felszívódott, a rizsszemek puhák. Vágd ketté a legvastagabb csirkedarabot: belül egynemű és rostos.',
        look: 'A rizs a répától egyenletesen sárgás-narancssárga lett; a csirke belül nem rózsaszín.',
        warn: 'A fedőt magadtól elfelé emeld fel — a gőz megégethet.',
      },
      {
        text: 'Kapcsold le a tűzhelyet, és hagyd a piláfot lefedve 10 percig. Közben vágd fel az uborkát és a paradicsomot, és sózd meg.',
      },
      { text: 'Keverd át a piláfot, és tálald a salátával.' },
    ],
  },
  'kotlety-z-indychky': {
    name: 'Pulykafasírt airfryerben karfiolpürével',
    tip: 'A megformázott nyers fasírtokat fagyaszd le egy deszkán, aztán tedd át őket egy zacskóba — 3 hónapig elállnak. Kiolvasztás nélkül süsd őket 18–20 percig 180 °C-on, félidőben megfordítva, és ellenőrizd, hogy a közepük elérje a 74 °C-ot.',
    notes: {
      1: 'finomra reszelve',
      5: 'apróra vágva',
      9: '~3 cm-es kockákra vágva',
      11: 'a kosár kikenéséhez',
    },
    steps: [
      {
        text: 'Vágd a krumplit ~3 cm-es kockákra, és tedd egy lábasba a karfiollal együtt. Öntsd fel annyi vízzel, hogy 2 cm-rel ellepje, sózd meg, és tedd fel nagy lángon.',
      },
      {
        text: 'Amikor a víz felforr, vedd közepes lángra, és fedő alatt főzd 15 percig.',
        done: 'A krumpli és a karfiol villával ellenállás nélkül átszúrható.',
      },
      { text: 'Közben reszeld le a hagymát finom reszelőn, a fokhagymát vágd apróra, a zöldfűszert pedig aprítsd fel finomra.' },
      {
        text: 'Egy tálban keverd össze a darált húst, a hagymát, a fokhagymát, a zöldfűszert, a tojást, a zabpelyhet, a sót és a borsot. Hagyd állni 10 percig.',
        done: 'A zabpehely megszívta magát, a massza megtartja a formáját, és nem folyik szét.',
        warn: 'A nyers darált hús után mosd meg szappannal a kezed.',
      },
      {
        text: 'Vizes kézzel formázz 8 darab, ~2 cm vastag fasírtot. Kend ki olajjal az airfryer kosarát, és rakd bele a fasírtokat egy rétegben, kis távolságra egymástól.',
      },
      {
        text: 'Süsd a fasírtokat 8 percig 180 °C-on. Ha nem férnek el egy rétegben, süsd őket 2 adagban.',
        warn: 'A kosár forró — edényfogóval fogd meg.',
      },
      {
        text: 'Spatulával fordítsd meg a fasírtokat, és süsd őket még 6 percig.',
        done: 'A fasírtok megnyomva rugalmasak. Vágd ketté a legvastagabbat: belül tömör és egynemű, nincs nedves, nyers közepe.',
        look: 'A tetejükön aranyszínű kéreg; kettévágva a hús világos, szürkésfehér, rózsaszín nélkül.',
      },
      {
        text: 'Öntsd le a vizet a zöldségekről, öntsd hozzá a tejet, és krumplitörővel törd pürévé. Ízlés szerint sózd.',
        done: 'A püré sima, nincsenek benne nagy darabok.',
        warn: 'A vizet magadtól elfelé öntsd le — a gőz megégethet.',
      },
      { text: 'Tálald a fasírtokat a pürével.' },
    ],
  },
  'chili-z-kvasoleiu': {
    name: 'Babos-marhahúsos chili rizzsel',
    tip: 'A chili másnap még finomabb. Adagonként 3 hónapig fagyasztható; addig melegítsd, amíg a közepe is forró nem lesz.',
    notes: {
      1: '2 doboz, lecsöpögtetve',
      3: '~1,5 cm-es kockákra vágva',
      4: '~1 cm-es kockákra vágva',
      5: 'lecsöpögtetve',
      13: 'tálaláshoz, tejföl helyett',
    },
    steps: [
      {
        text: 'Vágd a hagymát ~1 cm-es, a kaliforniai paprikát ~1,5 cm-es kockákra, a fokhagymát pedig apróra. Csöpögtesd le a babot és a kukoricát.',
      },
      {
        text: 'Melegítsd fel az olajat egy széles lábasban közepesnél erősebb lángon. Süsd a darált húst 7 percig, közben a spatulával törd apró morzsákra.',
        done: 'A darált hús morzsalékos, nincsenek benne nyers csomók; a kiengedett leve elpárolgott, és hangosan serceg.',
        look: 'A darált hús barna, egyáltalán nincs benne rózsaszín rész.',
        warn: 'A nyers darált hús után mosd meg szappannal a kezed. Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Add hozzá a hagymát, a kaliforniai paprikát és a fokhagymát, és süsd 5 percig, kevergetve.',
        done: 'A hagyma puha, és édeskés illata van.',
      },
      {
        text: 'Szórd bele az őrölt paprikát és a római köményt, és kevergesd 30 mp-ig.',
        done: 'Erős fűszeres illat árad.',
      },
      {
        text: 'Add hozzá a paradicsomot, a babot és a kukoricát, sózd meg, és forrald fel. Fedő nélkül, kis lángon főzd 20 percig, időnként megkeverve.',
        done: 'A chili besűrűsödött: a kanál szabad csíkot hagy az edény alján. Az egész felületén forr — a hús teljesen átforrósodott.',
        look: 'A darált hús barna, nincsenek benne rózsaszín vagy piros nyers csomók; a szósz sűrű, téglavörös.',
        warn: 'A sűrű szósz fröcsköl — hosszú nyelű kanállal keverd.',
      },
      {
        text: 'Közben egy másik lábasban forralj fel 1,5 l vizet, és sózd meg.',
        done: 'A víz lobogva forr.',
      },
      {
        text: 'Szórd bele a rizst, és főzd közepes lángon 15 percig (a hántolatlan rizst 30 percig). Szűrd le tésztaszűrőn.',
        done: 'A rizsszemek puhák, nincs kemény belük.',
        warn: 'A vizet magadtól elfelé öntsd le — a gőz megégethet.',
      },
      { text: 'Tálald a chilit rizzsel, és ha szeretnéd, egy kanál görög joghurttal.' },
    ],
  },
  'ragu-z-kurkoiu': {
    name: 'Csirkés zöldségragu bulgurral',
    tip: 'A padlizsán helyett 300 g csiperkegombát is használhatsz — ugyanúgy süsd, 6 percig. A ragu adagonként 3 hónapig fagyasztható.',
    notes: {
      0: '~2 cm-es kockákra vágva',
      1: '~2 cm-es kockákra vágva',
      2: '~2 cm-es kockákra vágva',
      3: '~2 cm-es négyzetekre vágva',
      4: 'apró kockákra vágva',
      5: 'félkarikákra vágva',
    },
    steps: [
      {
        text: 'Vágd a csirkét ~2 cm-es kockákra egy külön vágódeszkán.',
        warn: 'A nyers csirke után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      {
        text: 'Vágd a padlizsánt, a cukkinit és a kaliforniai paprikát ~2 cm-es kockákra, a hagymát félkarikákra. A paradicsomot vágd apró kockákra, a fokhagymát apróra.',
      },
      {
        text: 'Melegíts fel 1 ek. olajat egy széles lábasban közepesnél erősebb lángon. Süsd a csirkét 5 percig, kevergetve, majd tedd át egy tiszta tányérra.',
        done: 'A darabok kívül átlátszatlanok és feszesek.',
        look: 'A csirke kívül kifehéredett.',
        warn: 'Az olaj fröcsköl — a húst magadtól elfelé tedd bele.',
      },
      {
        text: 'Öntsd bele a maradék olajat, tedd bele a hagymát és a padlizsánt, és süsd 6 percig, kevergetve.',
        done: 'A padlizsán puha, és láthatóan összement, a hagymának édeskés illata van.',
      },
      { text: 'Add hozzá a cukkinit és a paprikát, és süsd még 4 percig.' },
      {
        text: 'Tedd vissza a csirkét, add hozzá a paradicsomot, a fokhagymát, a szárított fűszernövényeket, a sót és 100 ml vizet. Tedd rá a fedőt, és párold kis lángon 15 percig.',
        done: 'A zöldségek villával ellenállás nélkül átszúrhatók. Vágd ketté a legvastagabb csirkedarabot: belül egynemű és rostos, villával könnyen szétválik.',
        look: 'A csirke belül fehér, rózsaszín nélkül; a padlizsán megpuhult és sötétebb lett.',
        warn: 'A fedőt magadtól elfelé emeld fel — a gőz megégethet.',
      },
      {
        text: 'Közben egy kisebb lábasban forralj fel 300 ml vizet, és sózd meg. Szórd bele a bulgurt, fedd le, és a legkisebb lángon főzd 12 percig.',
        done: 'A víz felszívódott: ha megdöntöd a lábast, nincs folyadék az alján.',
      },
      {
        text: 'Húzd le a bulgurt a tűzről, hagyd lefedve állni 5 percig, majd villával lazítsd fel.',
        done: 'A szemek puhák, de egészek és rugalmasak.',
      },
      { text: 'Tálald a ragut a bulgurral.' },
    ],
  },
  'kurka-na-deku': {
    name: 'Tepsiben sült csirke zöldségekkel',
    tip: 'Cukkini helyett jó a fagyasztott brokkoli vagy karfiol is — a csirkével együtt tedd a tepsibe, kiolvasztás nélkül.',
    notes: {
      1: '~2,5 cm-es kockákra vágva',
      2: '~1 cm-es karikákra vágva',
      3: '8 cikkre vágva',
      4: '~3 cm-es kockákra vágva',
    },
    steps: [
      {
        text: 'Melegítsd elő a sütőt 200 °C-ra (alsó-felső sütés), és bélelj ki egy tepsit sütőpapírral.',
        done: 'A sütő jelzett, vagy kialudt a fűtésjelző lámpa.',
      },
      { text: 'Vágd a krumplit ~2,5 cm-es kockákra, a sárgarépát ~1 cm-es karikákra, a hagymát 8 cikkre.' },
      {
        text: 'A tepsin keverd össze ezeket a zöldségeket 1 ek. olajjal, az őrölt paprika felével és sóval, majd terítsd szét egy rétegben. Süsd a sütő középső szintjén 15 percig.',
        warn: 'A tepsi és a sütő ajtaja forró — edényfogóval dolgozz.',
      },
      { text: 'Közben vágd a cukkinit ~3 cm-es kockákra, a fokhagymát apróra.' },
      {
        text: 'Egy tálban keverd össze a csirkét a maradék olajjal, a fokhagymával, az őrölt paprikával, a szárított fűszernövényekkel, sóval és borssal.',
        warn: 'A nyers csirkéhez külön tálat használj; utána mosd meg szappannal a kezed.',
      },
      {
        text: 'Vedd ki a tepsit, keverd át a zöldségeket, add hozzá a cukkinit, és tedd a tetejükre a csirkét. Süsd még 25 percig.',
        done: 'A krumpli villával ellenállás nélkül átszúrható; ha kettévágod a legvastagabb csirkedarabot, belül egynemű, rostos, és nincs nedves, kocsonyás közepe. Ha nem így van, süsd még 5 percig, és nézd meg újra.',
        look: 'A csirke felülete aranybarna, a kifolyó lé átlátszó, kettévágva nincs rózsaszín; a krumpli széle megpirult.',
        warn: 'A sütő ajtaját magadtól elfelé nyisd ki — forró gőz csap ki.',
      },
      { text: 'Hagyd az ételt 5 percig pihenni, majd oszd el tányérokra vagy dobozokba.' },
    ],
  },

  // ── Риба ──────────────────────────────────────────────────────────
  'mintai-pid-marynadom': {
    name: 'Alaszkai tőkehal zöldséges marinádban, krumplival',
    tip: 'A fagyasztott filét előző este tedd a hűtőbe kiolvadni, ne vízben olvaszd ki — így a hal párolás közben nem esik szét.',
    notes: {
      0: 'kiolvasztva',
      1: 'lereszelve',
      2: 'vékony félkarikákra vágva',
    },
    steps: [
      {
        text: 'Hámozd meg a krumplit, vágd félbe, és tedd egy lábasba. Öntsd fel annyi hideg vízzel, hogy 2 cm-rel ellepje, sózd meg, és tedd fel nagy lángon.',
      },
      {
        text: 'Amikor a víz felforr, vedd közepes lángra, és fedő alatt főzd 20 percig.',
        done: 'A krumpli késsel ellenállás nélkül átszúrható.',
      },
      { text: 'Közben vágd a hagymát vékony félkarikákra, a sárgarépát reszeld le nagy lyukú reszelőn.' },
      {
        text: 'Melegítsd fel az olajat egy mély, fedős serpenyőben közepes lángon. Dinszteld a hagymát és a répát 8 percig, kevergetve.',
        done: 'A zöldségek puhák, majdnem a felükre estek össze, és édeskés illatuk van.',
        look: 'A hagyma üveges, a répa élénk narancssárga.',
        warn: 'Az olaj forró — a zöldségeket magadtól elfelé tedd bele.',
      },
      {
        text: 'Keverd bele a paradicsompürét, öntsd hozzá az ecetet és 250 ml vizet, majd add hozzá a babérlevelet, a sót és a borsot. Forrald fel.',
        done: 'A marinád az egész felületén bugyog.',
      },
      {
        text: 'Vágd a halat ~5 cm-es darabokra egy külön vágódeszkán, és enyhén sózd meg.',
        warn: 'A nyers hal után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      {
        text: 'Tedd a halat a marinádba, és takard be a zöldségekkel. Tedd rá a fedőt, és párold kis lángon 12 percig.',
        done: 'A hal villával könnyen lemezekre válik, és belül átlátszatlan.',
        look: 'A hús teljes vastagságában matt fehér, szürkés, áttetsző részek nélkül.',
        warn: 'A fedőt magadtól elfelé emeld fel — a gőz megégethet.',
      },
      {
        text: 'Öntsd le a vizet a krumpliról, és tálald a hallal és a marináddal.',
        warn: 'A vizet magadtól elfelé öntsd le — a gőz megégethet.',
      },
      {
        text: 'A maradékot hagyd 30 percig hűlni a konyhapulton, aztán tedd a hűtőbe. A marinádos hal hidegen, melegítés nélkül is finom — ideális ételhordóba.',
      },
    ],
  },
  'khek-v-pergamenti': {
    name: 'Sütőpapírban sült hekk zöldségekkel és bulgurral',
    tip: 'Hekk helyett jó az alaszkai tőkehal is — a sütési idő ugyanannyi. Lazaccal süsd 3–4 perccel tovább.',
    notes: {
      0: 'kiolvasztva, 3 darab',
      1: '~0,5 cm-es karikákra vágva',
      2: 'karikákra vágva',
      3: 'a fele karikázva, a másik fele a levéhez',
      4: 'vékony félkarikákra vágva',
    },
    steps: [
      {
        text: 'Melegítsd elő a sütőt 200 °C-ra. Vágj le 3 darab ~35×35 cm-es sütőpapírt.',
        done: 'A sütő jelzett, vagy kialudt a fűtésjelző lámpa.',
      },
      {
        text: 'Szórd a bulgurt egy fedős tálba, sózd meg, és öntsd fel 300 ml forrásban lévő vízzel a vízforralóból. Fedd le, és hagyd állni 25 percig.',
        done: 'A víz felszívódott, a szemek puhák, de kicsit még rugalmasak.',
        warn: 'Forró víz — lassan öntsd, és a tál közben álljon az asztalon.',
      },
      {
        text: 'Vágd a cukkinit és a paradicsomot ~0,5 cm-es karikákra, a hagymát vékony félkarikákra. A citrom felét vágd karikákra.',
      },
      {
        text: 'Itasd le a halat papírtörlővel, sózd, borsozd, és csepegtesd meg a citrom másik felének levével.',
        warn: 'A nyers hal után mosd meg szappannal a kezed, a kést és a vágódeszkát.',
      },
      {
        text: 'Minden sütőpapír közepére tegyél cukkinit és hagymát, a tetejükre a halat, a paradicsomot és a citromot. Csepegtess rá olajat, és szórd meg a szárított fűszernövényekkel.',
      },
      {
        text: 'Hajtsd össze a sütőpapír széleit a hal fölött, és néhányszor szorosan hajtsd rá, a két végét pedig csavard meg, mint a cukorka papírját.',
      },
      {
        text: 'Tedd a csomagokat egy tepsire, és süsd a sütő középső szintjén 15 percig.',
        done: 'Óvatosan nyiss ki egy csomagot: a hal villával könnyen lemezekre válik, és belül átlátszatlan. Ha nem, csomagold vissza, és süsd még 3 percig.',
        look: 'A hús teljes vastagságában matt fehér.',
        warn: 'A csomagot ollóval, magadtól elfelé vágd fel — forró gőz csap ki.',
      },
      { text: 'Villával lazítsd fel a bulgurt, és tálald a hal és a zöldségek mellé.' },
    ],
  },

  // ── Салати ────────────────────────────────────────────────────────
  'vinegret-z-kvasoleiu': {
    name: 'Céklasaláta (vinegret) babbal és tojással',
    tip: 'Csak azt a részt locsold meg olajjal, amit még aznap megeszel: olaj nélkül a saláta tovább friss marad. A főtt tojást héjában tárold.',
    notes: {
      0: '~1 cm-es kockákra vágva',
      1: 'héjában',
      2: 'héjában',
      4: '2 doboz, lecsöpögtetve',
      5: '~1 cm-es kockákra vágva',
      6: 'kinyomkodva',
      7: 'apróra vágva',
    },
    steps: [
      {
        text: 'Kefével mosd meg a krumplit és a sárgarépát, és hámozatlanul tedd őket egy lábasba. Öntsd fel annyi hideg vízzel, hogy 3 cm-rel ellepje, és tedd fel nagy lángon.',
      },
      { text: 'Amikor a víz felforr, vedd közepes lángra, és főzd 15 percig.' },
      {
        text: 'Egy kanállal óvatosan engedd bele a tojásokat ugyanabba a lábasba, és főzd együtt az egészet még 10 percig.',
        done: 'A krumpli és a répa késsel ellenállás nélkül átszúrható, a tojások keményre főttek.',
        warn: 'A tojásokat a kanállal egészen az edény aljáig engedd le, hogy a forró víz ne fröccsenjen.',
      },
      {
        text: 'Öntsd le a forró vizet, és öntsd fel az egészet hideg vízzel 15 percre.',
        done: 'A zöldségek és a tojások tapintásra hűvösek.',
        warn: 'A forró vizet magadtól elfelé öntsd le — a gőz megégethet.',
      },
      {
        text: 'Közben vágd a céklát és a savanyú uborkát ~1 cm-es kockákra, a hagymát apróra. Nyomkodd ki a savanyú káposztát, és csöpögtesd le a babot.',
      },
      {
        text: 'Hámozd meg a krumplit és a répát, és pucold meg a tojásokat. A krumplit és a répát vágd ~1 cm-es kockákra, a tojásokat félbe.',
      },
      { text: 'Egy tálban keverd össze az összes zöldséget, a babot és a káposztát, locsold meg olajjal, sózd és borsozd.' },
      { text: 'Oszd el a salátát tányérokra vagy dobozokba, és tedd a tetejére a tojásokat.' },
    ],
  },
};
