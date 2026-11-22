import type { RecipeTr } from '../types';

/** Угорські переклади рецептів рівня 3 (ключ — id рецепта). */
export const HU_RECIPES_3: Record<string, RecipeTr> = {
  // ── 1. borshch ────────────────────────────────────────────────────
  'borshch': {
    name: 'Ukrán borscs (könnyű, rántás nélkül)',
    tip: 'Oszd el a munkát két estére: az elsőn főzd meg a húst (1–3. lépés), hűtsd le az alaplevet, és tedd hűtőbe. Másnap forrald fel, és folytasd a 4. lépéstől — ez még nagyjából egy óra.',
    notes: {
      0: 'csont nélküli comb',
      1: '~5 mm-es csíkokra vágva vagy durvára reszelve',
      2: 'durvára reszelve',
      3: 'apró kockákra vágva',
      7: '~2 cm-es kockákra vágva',
      8: 'vékony csíkokra vágva',
      9: '~1 cm-es csíkokra vágva',
      11: '2 levél',
      14: 'tejföl helyett, tálaláshoz',
      15: 'a klasszikus ízért — a joghurt fele helyett',
      16: 'tálaláshoz',
      17: 'adagonként 1 szelet',
    },
    steps: [
      {
        text: 'Vágd a marhahúst ~3 cm-es darabokra. Tedd egy 5 literes fazékba, és öntsd fel 2,5 l hideg vízzel.',
        warn: 'A nyers húst külön vágódeszkán vágd. Utána mosd meg a kezed, a kést és a deszkát meleg, szappanos vízzel.',
      },
      {
        text: 'Forrald fel nagy lángon. A forrás előtt a tetején összegyűlő habot szedd le szűrőkanállal — így tisztább lesz az alaplé íze.',
        done: 'A víz az egész felületén bugyog, és alig képződik új hab.',
      },
      {
        text: 'Vedd kicsire a lángot, tedd rá a fedőt úgy, hogy egy kis rés maradjon, és főzd 70 percig. A lassú gyöngyözéstől a sovány marhahús is megpuhul.',
        done: 'A felületén csak néha száll fel egy-egy buborék — ez a megfelelő lángerősség.',
      },
      {
        text: 'Amíg a hús fő, vágd a céklát ~5 mm-es csíkokra, vagy reszeld le a reszelő nagy lyukú oldalán. A sárgarépát is reszeld le, a hagymát pedig vágd apró kockákra.',
      },
      {
        text: 'Vágd a burgonyát ~2 cm-es kockákra, a káposztát vékony csíkokra, a paprikát ~1 cm-es csíkokra. Ezek a zöldségek egyenesen az alaplébe kerülnek, ezért tartsd őket külön a céklától.',
      },
      {
        text: 'Hevítsd fel az olajat egy serpenyőben közepes lángon, és tedd bele a céklát, a sárgarépát, a hagymát, a paradicsompürét és az ecetet. Önts hozzá 1 merőkanál alaplevet, fedd le, és párold kis lángon 20 percig.',
        done: 'A cékla puha: a csíkok fakanállal könnyen szétnyomhatók.',
        look: 'A cékla megőrizte mély rubinvörös színét — ez az ecetnek köszönhető.',
        warn: 'A forró alaplevet lassan, közvetlenül a serpenyő fölött öntsd bele, hogy ne fröccsenjen.',
      },
      {
        text: 'Vedd ki egy kanállal a legnagyobb húsdarabot, és próbáld meg villával (vagy szúrd bele a hőmérőt, ha van). Ha a hús még kissé rágós, tedd vissza a fazékba, és főzd még 15 percig.',
        done: 'A rostok villával könnyen szétválnak, a hús puha, nem gumis.',
        look: 'Belül a hús szürkésbarna, piros részek nélkül.',
      },
      {
        text: 'Tedd a burgonyát az alaplébe, vedd fel a lángot közepesre, és főzd 10 percig.',
        done: 'A burgonyát már át lehet szúrni késsel, de a közepe még kicsit kemény.',
      },
      {
        text: 'Add hozzá a káposztát, a paprikát, a párolt céklát a többi zöldséggel együtt, 2 babérlevelet és 1½ tk. sót. Főzd kis lángon 10 percig.',
        done: 'A káposzta puha, a burgonyába ellenállás nélkül csúszik bele a kés.',
        look: 'A borscs mély rubinvörös. Ha a színe barnásra változott, adj hozzá 1 tk. ecetet vagy citromlevet.',
      },
      {
        text: 'Zárd el a lángot, vedd ki a babérleveleket, és add hozzá az aprított fokhagymát. Fedd le, és hagyd a borscsot 15 percig állni — így mélyebb lesz az íze.',
        done: 'Kóstold meg: ha kevés benne a só, adj hozzá egy csipetnyit, és keverd meg.',
      },
      {
        text: 'Merd tányérokba a borscsot, tegyél mindegyikbe egy kanál görög joghurtot, és szórd meg zöldfűszerrel. Egy szelet kenyérrel tálald.',
      },
    ],
  },

  // ── 2. holubtsi-linyvi ────────────────────────────────────────────
  'holubtsi-linyvi': {
    name: 'Lusta töltött káposzta sütőben',
    tip: 'Oszd el a munkát két estére: az elsőn főzd elő a rizst, és párold meg a káposztát (1–3. lépés), aztán hűtsd le, és tárold lefedve a hűtőben. Másnap már csak össze kell keverned, formáznod és megsütnöd — ez nagyjából egy óra.',
    notes: {
      1: 'vékony, ~3 mm-es csíkokra vágva',
      2: 'apró kockákra vágva',
      3: 'durvára reszelve',
      7: '~1 tk.',
      10: 'tálaláshoz',
      11: 'tálaláshoz',
    },
    steps: [
      {
        text: 'Egy szűrőben öblítsd át a rizst hideg vízzel 2–3-szor. Öntsd fel 300 ml vízzel, forrald fel, és főzd közepes lángon 10 percig (a hántolatlan rizst 15 percig).',
        done: 'A szemek kívül puhák, de belül még kemények — a rizs a sütőben fő majd készre.',
      },
      {
        text: 'Közben önts egy serpenyőbe 100 ml vizet, és tedd bele a káposztát, a hagymát és a sárgarépát. Fedd le, és párold közepes lángon 8 percig, közben kétszer keverd meg.',
        done: 'A káposzta megpuhult, és nagyjából a felére esett össze; a serpenyő alján már alig van víz.',
      },
      {
        text: 'Szűrd le a rizst, keverd össze a zöldségekkel egy nagy tálban, és hagyd hűlni 10 percig. Közben melegítsd elő a sütőt 200 °C-ra.',
        done: 'A keverék tapintásra már csak langyos: ha forró lenne, a tojás és a darált hús már formázás előtt főni kezdene.',
      },
      {
        text: 'Add hozzá a darált húst, a tojást, 1 tk. sót, a borsot és az őrölt paprika felét. Gyúrd kézzel 2 percig, amíg a massza ragacsos nem lesz — így a gombócok nem esnek szét.',
        warn: 'Nyers darált hús: utána mosd meg a kezed, a tálat és mindent, amihez hozzáért, meleg, szappanos vízzel.',
      },
      {
        text: 'Vizezd be a kezed, hogy a massza ne ragadjon, és formázz belőle 12 ovális, ~8 cm hosszú és ~3 cm vastag gombócot. Rakd őket szorosan egymás mellé egy ~20×30 cm-es jénaiba.',
      },
      {
        text: 'Süsd 20 percig szósz nélkül — így a gombócok összeállnak, és megtartják a formájukat.',
        done: 'A gombócok tapintásra tömörek, és nem nyomódnak szét, ha finoman megnyomod őket egy spatulával.',
        look: 'A gombócok teteje enyhén megpirult.',
        warn: 'A jénait csak sütőkesztyűben vedd ki — nagyon forró.',
      },
      {
        text: 'Keverd össze a konzerv paradicsomot, 150 ml vizet, a maradék őrölt paprikát és ½ tk. sót. Öntsd a gombócokra — a szósz nagyjából a gombócok feléig érjen.',
      },
      {
        text: 'Vedd vissza a sütőt 180 °C-ra, fedd le a jénait alufóliával, és süsd 25 percig.',
        done: 'A szósz bugyog a jénai szélén, a gombócokban a rizs puha.',
        warn: 'Az alufóliát magadtól elfelé emeld le — alatta forró gőz van.',
      },
      {
        text: 'Ellenőrizd a legnagyobb gombócot: vágd ketté (vagy szúrd a hőmérőt a közepébe, ha van).',
        done: 'Belül a hús tömör és egynemű, nincs nedves, nyers közepe; a rizs puha; a szósz bugyog a jénai szélén. Ha nem így van, süsd még 5 percig, és nézd meg újra.',
        look: 'A vágásfelületen a hús világos, szürkésbézs, nincs benne rózsaszín.',
      },
      {
        text: 'Hagyd a gombócokat 10 percig pihenni, hogy a szósz kicsit besűrűsödjön. Adagonként 3 gombócot tálalj egy kanál görög joghurttal, zöldfűszerrel megszórva.',
        done: 'A szósz besűrűsödött, és nem folyik szét a tányéron.',
      },
    ],
  },

  // ── 3. perci-farshyrovani ─────────────────────────────────────────
  'perci-farshyrovani': {
    name: 'Pulykával és rizzsel töltött paprika',
    tip: 'A töltött paprika jól fagyasztható: hűtsd ki a szószban, tedd dobozokba, és a fagyasztóban legfeljebb 2 hónapig tárold. Egy éjszaka alatt olvaszd ki a hűtőben, és lefedve melegítsd fel.',
    notes: {
      1: 'nagy, egyenes aljú',
      3: 'apró kockákra vágva',
      4: 'apróra vágva',
      6: 'durvára reszelve',
      7: '~1 tk.',
      10: 'tálaláshoz',
      11: 'adagonként 1 szelet',
    },
    steps: [
      {
        text: 'Egy szűrőben öblítsd át a rizst hideg vízzel 2–3-szor. Öntsd fel 250 ml vízzel, forrald fel, és főzd közepes lángon 10 percig (a hántolatlan rizst 15 percig).',
        done: 'A szemek kívül puhák, de belül még kemények — a rizs a paprikában fő majd készre.',
      },
      {
        text: 'Amíg a rizs fő, vágd le a paprikák tetejét a szárral együtt (~1,5 cm), és egy kanállal kaparj ki belőlük a magokat az erekkel együtt. Ha egy paprika billeg, vágj le az aljából egy vékony szeletet, de vigyázz, hogy ne legyen lyukas.',
      },
      {
        text: 'Szűrd le a rizst, és hagyd hűlni 10 percig. Közben melegítsd elő a sütőt 190 °C-ra.',
        done: 'A rizs tapintásra már csak langyos: ha forró lenne, a darált hús már sütés előtt főni kezdene.',
      },
      {
        text: 'Egy tálban keverd össze a darált húst, a rizst, a hagymát, a zöldfűszer felét, 1 tk. sót és a borsot. Gyúrd kézzel 1–2 percig, amíg egynemű, ragacsos masszát nem kapsz.',
        warn: 'Nyers darált hús: utána mosd meg a kezed, a tálat és mindent, amihez hozzáért, meleg, szappanos vízzel.',
      },
      {
        text: 'Töltsd meg a paprikákat a töltelékkel, kanállal enyhén lenyomkodva, de ne tömörítsd — a rizs még megdagad. Állítsd a paprikákat függőlegesen egy mély jénaiba.',
      },
      {
        text: 'Egy lábasban keverd össze a konzerv paradicsomot, a sárgarépát, 200 ml vizet, az őrölt paprikát és ½ tk. sót. Forrald fel, és főzd közepes lángon 5 percig.',
        done: 'A szósz forr, a sárgarépa kicsit megpuhult.',
      },
      {
        text: 'Öntsd a forró szószt a jénaiba a paprikák köré — nagyjából a paprikák harmadáig érjen.',
        warn: 'Lassan, közvetlenül a jénai fölött öntsd, hogy a forró szósz ne fröccsenjen.',
      },
      {
        text: 'Fedd le a jénait alufóliával, és süsd 40 percig — a fólia alatt a paprikák gőzben párolódnak és megpuhulnak.',
        done: 'A szósz bugyog a jénai szélén.',
        warn: 'A jénait csak sütőkesztyűben tedd be és vedd ki.',
      },
      {
        text: 'Vedd le az alufóliát, és süsd még 15 percig, hogy a szósz kicsit besűrűsödjön.',
        done: 'A szósz besűrűsödött, a paprikák falába pedig ellenállás nélkül csúszik bele a kés.',
        look: 'A paprikák héja helyenként ráncos lett és megsötétedett — ez normális.',
        warn: 'Az alufóliát magadtól elfelé emeld le — alatta forró gőz van.',
      },
      {
        text: 'Ellenőrizd a legnagyobb paprikát: vágd ketté (vagy szúrd a hőmérőt felülről a töltelék közepébe, ha van).',
        done: 'A töltelék teljes vastagságában tömör és egynemű, nincs nedves, nyers közepe; a paprika falába ellenállás nélkül csúszik bele a kés. Ha nem így van, süsd még 5–10 percig.',
        look: 'A töltelék belül világos, szürkésbézs, nincs benne rózsaszín.',
      },
      {
        text: 'Hagyd a paprikákat 10 percig pihenni. Tálald a szósszal, egy kanál görög joghurttal, a maradék zöldfűszerrel és egy szelet kenyérrel.',
        done: 'A töltelék kicsit összeesett, és a paprika nem esik szét, amikor tányérra teszed.',
      },
    ],
  },

  // ── 4. lazanya-z-kabachkiv ────────────────────────────────────────
  'lazanya-z-kabachkiv': {
    name: 'Cukkinis lasagne pulykával és sajttal',
    tip: 'Ne siess a vágással: a 10 perc pihentetés alatt a rétegek összeállnak, és az adagok nem folynak szét. Ha dobozokba csomagolod, még jobb, ha másnap, hidegen vágod fel — így szép, szabályos szeletek lesznek.',
    notes: {
      0: 'hosszában ~5 mm-es szeletekre vágva',
      2: 'apró kockákra vágva',
      6: '~1 tk.',
      11: 'lereszelve vagy darabokra tépve',
      12: 'adagonként 1 szelet',
    },
    steps: [
      {
        text: 'Vágd a cukkinit hosszában ~5 mm vastag szeletekre. Sózd meg mindkét oldalukat, és hagyd állni 15 percig — a só kihúzza belőlük a felesleges vizet, így a lasagne nem lesz vizes.',
        done: 'A szeletek felületén vízcseppek jelentek meg.',
      },
      {
        text: 'Közben hevítsd fel az olajat egy serpenyőben közepes lángon. Tedd bele a hagymát, és dinszteld 4 percig, közben kevergesd.',
        done: 'A hagyma puha és üveges.',
        look: 'A hagyma áttetsző.',
      },
      {
        text: 'Add hozzá a darált húst, és fakanállal törd apró darabokra. Süsd 7 percig, közben kevergesd.',
        done: 'A hús morzsalékos, nincsenek benne nagy csomók; a kiengedett leve elpárolgott, és a serpenyő újra serceg.',
        look: 'A darált hús világos, sehol sem rózsaszín.',
        warn: 'A nyers darált hús után mosd meg a kezed és mindent, amihez hozzáért, meleg, szappanos vízzel.',
      },
      {
        text: 'Add hozzá a konzerv paradicsomot, az aprított fokhagymát, a szárított fűszernövényeket, ½ tk. sót és a borsot. Rotyogtasd fedő nélkül, kis lángon 10 percig, közben kevergesd.',
        done: 'A szósz besűrűsödött: ha a fakanállal végighúzol a serpenyő alján, a csík csak lassan záródik össze.',
        warn: 'A sűrű szósz forró cseppeket „köphet” — úgy kevergesd, hogy a kezed oldalt legyen, ne a serpenyő fölött.',
      },
      {
        text: 'Melegítsd elő a sütőt 190 °C-ra. Egy tálban villával törd össze a túrót a tojással és egy csipet sóval, amíg egynemű nem lesz.',
      },
      {
        text: 'Itasd le a cukkiniszeleteket papírtörlővel mindkét oldalukon. A szeletek harmadát rakd egy ~20×25 cm-es jénai aljára úgy, hogy kicsit fedjék egymást.',
      },
      {
        text: 'Oszlasd el rajtuk a húsos szósz felét, arra pedig a túrós massza felét. Ismételd meg a rétegeket: cukkini, szósz, túrós massza.',
      },
      {
        text: 'Fedd be a maradék cukkiniszeletekkel, és szórd meg a mozzarellával. Süsd 35 percig a sütő középső szintjén.',
        done: 'A sajt a tetején megolvadt és buborékol, a jénai szélénél bugyog a szósz.',
        look: 'A sajt a tetején aranyszínű, helyenként megpirult.',
        warn: 'A jénait csak sütőkesztyűben tedd be és vedd ki.',
      },
      {
        text: 'Ellenőrizd a lasagne közepét: szúrj egy kést pont a közepébe, hagyd benne 10 mp-ig, húzd ki, és óvatosan érintsd a pengét a csuklód hátoldalához (vagy szúrd bele a hőmérőt, ha van).',
        done: 'A penge teljes hosszában forró, a szósz élénken bugyog a széleken, a cukkini puha. Ha a penge csak langyos, süsd még 5–10 percig.',
        look: 'A sajt teteje foltokban megpirult, a szósz a széleken sűrű és sötétvörös.',
      },
      {
        text: 'Vágás előtt hagyd a lasagnét 10 percig pihenni — a rétegek összeállnak, és nem folynak szét.',
        done: 'A rétegek közötti szósz besűrűsödött, és nem folyik ki, ha megnyomod egy spatulával.',
      },
      {
        text: 'Vágd a lasagnét 5 adagra, és egy szelet kenyérrel tálald.',
      },
    ],
  },

  // ── 5. kuriachyi-rulet ────────────────────────────────────────────
  'kuriachyi-rulet': {
    name: 'Spenótos-fetás csirkemellroló sült édesburgonyával',
    tip: 'Munkahelyi ebédhez egészben hűtsd le a rolót, és csak reggel szeleteld fel — így tovább marad szaftos. Hidegen is finom, így mikróra sem lesz szükséged.',
    notes: {
      0: 'kiolvasztva és kinyomkodva',
      1: 'elmorzsolva',
      3: '2–3 filé',
      4: '~1 tk.',
      7: '~2,5 cm-es kockákra vágva',
      8: '~2 cm-es csíkokra vágva',
    },
    steps: [
      {
        text: 'Olvaszd ki a spenótot: egy éjszaka alatt a hűtőben, vagy 15 perc alatt egy tál langyos vízben. Kézzel alaposan nyomkodd ki — a felesleges víztől a roló vizes lenne.',
        done: 'A spenót puha, és a kinyomkodott gombócból már alig csöpög víz.',
      },
      {
        text: 'Melegítsd elő a sütőt 200 °C-ra. Keverd össze a spenótot, a morzsolt fetát és az aprított fokhagymát — a feta sós, ezért a tölteléket ne sózd.',
      },
      {
        text: 'Tedd a filét a vágódeszkára, és nyomd le a tenyereddel. A kést a deszkával párhuzamosan tartva vágd be minden filét hosszában, a vastagsága közepén, de ne vágd át: a túlsó szélénél hagyj ~1 cm-t. Aztán nyisd szét, mint egy könyvet.',
        warn: 'Az ujjaidat tartsd felül, távol a pengétől. A nyers hús külön vágódeszkára kerüljön; utána mosd meg a kezed, a kést és a deszkát meleg, szappanos vízzel.',
      },
      {
        text: 'Takard le a filét folpackkal, és nyújtófával vagy egy serpenyő aljával klopfold ki ~1 cm vastagra. Az egyenletes vastagság kell ahhoz, hogy a roló egyenletesen átsüljön, és könnyen feltekerhető legyen.',
      },
      {
        text: 'Vedd le a fóliát, sózd, borsozd, és szórd meg az őrölt paprika felével. Oszlasd el rajta egyenletesen a tölteléket, a szélein 2 cm-t szabadon hagyva.',
      },
      {
        text: 'Tekerd fel szorosan minden filét, a hosszabb oldaláról kezdve. A tekercs szélét ~3 cm-enként tűzd össze fogpiszkálóval, vagy kösd át konyhai zsineggel.',
      },
      {
        text: 'Vágd az édesburgonyát ~2,5 cm-es kockákra, a kaliforniai paprikát ~2 cm-es csíkokra. Forgasd össze őket 2 tk. olajjal, sóval és a maradék őrölt paprikával.',
      },
      {
        text: 'Fektesd a rolókat a záródásukkal lefelé egy sütőpapírral bélelt tepsibe, és kend meg őket a maradék olajjal. A zöldségeket egy rétegben terítsd el körülöttük, és süsd 30 percig.',
        done: 'A rolók megnyomva rugalmasan visszaugranak, az édesburgonyába ellenállás nélkül csúszik bele a kés.',
        look: 'A rolók teteje halványan aranyszínű, az édesburgonya széle megpirult.',
        warn: 'A tepsit csak sütőkesztyűben tedd be és vedd ki.',
      },
      {
        text: 'Ellenőrizd a legvastagabb rolót: vágd ketté a közepén (vagy szúrd a hőmérőt a végén át a közepébe, ha van).',
        done: 'A hús teljes vastagságában tömör és rostos, nincs nedves, kocsonyás közepe; a roló rugalmas. Ha nem így van, süsd még 5 percig.',
        look: 'A vágásfelületen a hús fehér, a töltelék mellett sincs rózsaszín réteg; a kifolyó lé átlátszó; a tetején enyhe aranyszínű kéreg.',
      },
      {
        text: 'Takard le a rolókat alufóliával, és hagyd pihenni 10 percig — így szaftos marad, és szeleteléskor nem esik szét.',
        done: 'A roló tömör, és megtartja a formáját, amikor átteszed a vágódeszkára.',
      },
      {
        text: 'Húzd ki a fogpiszkálókat, vagy vágd le a zsineget. Vágd a rolót ~1,5 cm-es korongokra, és tálald az édesburgonyával és a paprikával.',
      },
    ],
  },

  // ── 6. hrechanyky ─────────────────────────────────────────────────
  'hrechanyky': {
    name: 'Hajdinás pulykafasírt (grecsanyiki) paradicsomos-joghurtos mártással',
    tip: 'Oszd el a munkát két estére: a hajdinát főzd meg előző nap, és tárold lefedve a hűtőben. A hideg hajdina azonnal összekeverhető a darált hússal, így másnap az egész nagyjából 45 perc.',
    notes: {
      2: 'finomra reszelve',
      5: 'apróra vágva',
      8: 'a mártáshoz',
      9: 'a mártáshoz',
      10: 'a salátához',
      11: 'a salátához',
      12: 'a salátához',
    },
    steps: [
      {
        text: 'Öblítsd át a hajdinát, öntsd fel 300 ml vízzel, és adj hozzá ½ tk. sót. Forrald fel, fedd le, és főzd kis lángon 15 percig.',
        done: 'A víz teljesen felszívódott: ha megbillented a lábast, az alján nincs folyadék.',
      },
      {
        text: 'Tedd át a hajdinát egy széles tálba, és hagyd hűlni 15 percig. A forró hajdinától a tojás és a darált hús főni kezdene, és a masszát nehéz lenne formázni.',
        done: 'A hajdina tapintásra már csak langyos.',
      },
      {
        text: 'Melegítsd elő a sütőt 200 °C-ra. Reszeld le a hagymát a reszelő finom oldalán, a fokhagymát pedig aprítsd fel.',
      },
      {
        text: 'Add a hajdinához a darált húst, a hagymát, a fokhagyma felét, a tojást, a zöldfűszer felét, ½ tk. sót és a borsot. Gyúrd kézzel 2 percig, hogy a massza ragacsos legyen, és a fasírtok ne essenek szét.',
        warn: 'Nyers darált hús: utána mosd meg a kezed, a tálat és mindent, amihez hozzáért, meleg, szappanos vízzel.',
      },
      {
        text: 'Vizezd be a kezed, és formázz a masszából 12 darab ~7 cm átmérőjű, ~2 cm vastag fasírtot. Rakd őket sütőpapírral bélelt tepsibe, egymástól ~2 cm-re.',
      },
      {
        text: 'Süsd 20 percig a sütő középső szintjén.',
        done: 'A fasírtok tömörek, és megnyomva rugalmasan visszaugranak.',
        look: 'A tetejükön enyhe aranyszínű kéreg képződött.',
        warn: 'A tepsit csak sütőkesztyűben tedd be és vedd ki.',
      },
      {
        text: 'Amíg a fasírtok sülnek, keverd össze a joghurtot, a paradicsompürét, a maradék fokhagymát és zöldfűszert, valamint egy csipet sót — ez lesz a mártás.',
      },
      {
        text: 'Vágd az uborkát félkarikákra, a paradicsomot cikkekre. Csak közvetlenül tálalás előtt locsold meg olajjal és sózd meg — így a saláta nem lesz vizes.',
      },
      {
        text: 'Ellenőrizd a legvastagabb fasírtot: törd ketté (vagy szúrd a hőmérőt oldalról a közepébe, ha van).',
        done: 'Belül tömör és egynemű, nincs nedves, nyers közepe; megtartja a formáját. Ha nem így van, süsd még 3–5 percig.',
        look: 'Belül a hús világos, nincs benne rózsaszín.',
      },
      {
        text: 'Adagonként 3 fasírtot tálalj a mártással és a salátával.',
      },
    ],
  },

  // ── 7. hulyash ────────────────────────────────────────────────────
  'hulyash': {
    name: 'Marhapörkölt zöldségekkel és hajdinával',
    tip: 'A pörkölt másnap még finomabb, ezért kényelmes vasárnap megfőzni több ebédre: a hűtőben legfeljebb 3 napig, a fagyasztóban legfeljebb 3 hónapig áll el. A fagyasztottat egy éjszaka alatt olvaszd ki a hűtőben.',
    notes: {
      0: 'comb, ~2,5 cm-es kockákra vágva',
      2: 'félkarikákra vágva',
      3: '~5 mm-es karikákra vágva',
      5: '~1 ek.',
      6: '2 levél',
      9: '~1 cm-es csíkokra vágva',
      12: 'tálaláshoz',
    },
    steps: [
      {
        text: 'Vágd a marhahúst ~2,5 cm-es kockákra, és itasd szárazra papírtörlővel. A száraz hús kérget kap, a nedves viszont a saját levében párolódik.',
        warn: 'A nyers húst külön vágódeszkán vágd. Utána mosd meg a kezed, a kést és a deszkát meleg, szappanos vízzel.',
      },
      {
        text: 'Hevítsd fel az olajat egy vastag falú lábasban nagy lángon. A húst két adagban süsd körbe, adagonként 4 percig, és szedd át egy tálba — ha egyszerre teszed bele az egészet, kiengedi a levét, és főni kezd.',
        done: 'A hús egyenletesen sistereg, és magától elválik a lábas aljától.',
        look: 'A hús minden oldalán barna, sötét kéreggel.',
        warn: 'A húst magadtól elfelé tedd bele — a forró olaj kifröccsenhet.',
      },
      {
        text: 'Tedd vissza az összes húst a lábasba, és add hozzá a hagymát meg a sárgarépát. Párold közepes lángon 5 percig, közben kevergesd.',
        done: 'A hagyma puha és üveges, édeskés illata van.',
        look: 'A hagyma áttetsző, a sárgarépa élénk narancssárga.',
      },
      {
        text: 'Add hozzá a paradicsompürét és 1 ek. őrölt paprikát, és folyamatosan kevergetve hevítsd 1 percig — az őrölt paprika gyorsan odaég, és keserű lesz.',
        done: 'Erős, fűszeres illat árad.',
      },
      {
        text: 'Önts hozzá 600 ml forró vizet, tegyél bele 2 babérlevelet és 1 tk. sót. Forrald fel.',
        done: 'A folyadék az egész felületén bugyog.',
        warn: 'Lassan öntsd hozzá a vizet — a forró lábasból gőz csap fel.',
      },
      {
        text: 'Vedd kicsire a lángot, fedd le, és párold 60 percig, 20 percenként megkeverve. Ha a folyadék már a hús feléig sem ér, önts hozzá 100 ml forró vizet.',
        done: 'A fedő alatt épp csak rotyog, a húsdarabok már engednek a villának.',
      },
      {
        text: 'Add hozzá a kaliforniai paprikát, és párold lefedve még 20 percig.',
        done: 'A paprika puha, a szaft besűrűsödött, és bevonja a kanalat.',
      },
      {
        text: 'Közben öblítsd át a hajdinát, öntsd fel 400 ml vízzel, sózd meg, és forrald fel. Fedd le, és főzd kis lángon 15 percig.',
        done: 'A víz teljesen felszívódott, a szemek puhák és pergősek.',
      },
      {
        text: 'Vedd ki a legnagyobb húsdarabot, és próbáld meg villával (vagy szúrd bele a hőmérőt, ha van).',
        done: 'A hús villával könnyen rostjaira válik, és kóstolva puha. Ha még kissé rágós, párold még 15 percig.',
        look: 'Belül a hús barna, piros részek nélkül; a szaft a paprikától vörösesbarna.',
      },
      {
        text: 'Zárd el a lángot, vedd ki a babérleveleket, add hozzá az aprított fokhagymát, és keverd össze. Hagyd lefedve állni 5 percig.',
        done: 'A pörköltnek fokhagyma- és paprikaillata van, a szaft sűrű.',
      },
      {
        text: 'A pörköltet hajdinára szedve tálald, mellé tegyél szeletelt uborkát.',
      },
    ],
  },

  // ── 8. svynyna-z-ovochamy ─────────────────────────────────────────
  'svynyna-z-ovochamy': {
    name: 'Mustáros sertésszűz sült zöldségekkel',
    tip: 'A szűzpecsenye hidegen, melegítés nélkül is finom — jó ebéd oda, ahol nincs mikró. Egészben hűtsd le, és csak evés előtt vágd vékony szeletekre: így nem szárad ki.',
    notes: {
      0: '~3 cm-es cikkekre vágva',
      1: '~1,5 cm-es hasábokra vágva',
      3: '~2 tk.',
      4: '1–2 darab',
      9: 'nem kell kiolvasztani',
    },
    steps: [
      {
        text: 'Melegítsd elő a sütőt 200 °C-ra. Vágd a burgonyát ~3 cm-es cikkekre, a sárgarépát pedig ~1,5 cm vastag és ~6 cm hosszú hasábokra.',
      },
      {
        text: 'Forgasd össze a burgonyát és a sárgarépát 1 ek. olajjal, sóval és a fűszernövények felével. Terítsd szét egy rétegben egy sütőpapírral bélelt tepsiben, és süsd 20 percig.',
        done: 'A kés kis ellenállással megy bele a burgonyába — a hússal együtt sül majd készre.',
        warn: 'A tepsit csak sütőkesztyűben tedd be és vedd ki.',
      },
      {
        text: 'Amíg a zöldségek sülnek, itasd szárazra a szűzpecsenyét papírtörlővel, és éles késsel vágd le a felületéről a kemény hártyát — sütés közben összehúzná a húst. Sózd és borsozd meg minden oldalát.',
        warn: 'A nyers húst külön vágódeszkán vágd. Utána mosd meg a kezed, a kést és a deszkát meleg, szappanos vízzel.',
      },
      {
        text: 'Hevíts fel ½ ek. olajat egy serpenyőben nagy lángon. Süsd körbe a szűzpecsenyét, oldalanként 2 percig, konyhai csipesszel forgatva.',
        done: 'A hús hangosan sistereg, és könnyen elválik a serpenyőtől — kialakult a kéreg.',
        look: 'Minden oldalán barna kéreg.',
        warn: 'A húst magadtól elfelé tedd a serpenyőbe, és ne hajolj fölé — a forró olaj fröcsköl.',
      },
      {
        text: 'Keverd össze a mustárt, az aprított fokhagymát és a maradék fűszernövényeket. Kend be vele a szűzpecsenyét minden oldalán.',
      },
      {
        text: 'Vedd ki a tepsit, forgasd át a zöldségeket, és add hozzá a zöldbabot. Fektesd rájuk a szűzpecsenyét, és süsd 15 percig.',
        done: 'A hús megnyomva rugalmas, a sütőből sercegés hallatszik.',
        warn: 'A tepsi nagyon forró — csak sütőkesztyűben fogd meg.',
      },
      {
        text: 'Ellenőrizd a szűzpecsenyét. Ha van hőmérőd: a szondáját oldalról, vízszintesen szúrd a legvastagabb rész közepéig (felülről a vékony húst könnyű véletlenül átszúrni). Hőmérő nélkül: nyomd meg a húst, és vágj bele a legvastagabb részébe.',
        done: 'A hús rugalmas, nem puha és kocsonyás; a bevágásnál a rostok tömörek, és nem folyik belőle sugárban a lé. Ha bizonytalan vagy, süsd még 3–5 percig: így biztosabb.',
        look: '63 °C-on a halványan rózsaszín közép normális, és sertéshúsnál biztonságos; a kifolyó lé világos. Kívül barna kéreg.',
      },
      {
        text: 'Tedd át a szűzpecsenyét egy vágódeszkára, takard le alufóliával, és hagyd pihenni 5 percig (legalább 3 percig). Ezalatt a hús teljesen elkészül, a szaftja pedig eloszlik benne.',
        done: 'Eltelt legalább 3 perc — a hús biztonságos és szaftos.',
      },
      {
        text: 'Közben nézd meg a zöldségeket egy késsel. Ha a burgonya vagy a sárgarépa még kemény, tedd vissza a tepsit a sütőbe 5 percre.',
        done: 'A burgonyába és a sárgarépába ellenállás nélkül csúszik bele a kés.',
      },
      {
        text: 'Vágd a szűzpecsenyét ~1,5 cm-es szeletekre, a rostokra merőlegesen — így omlósabb a hús. Tálald a zöldségekkel.',
      },
    ],
  },

  // ── 9. rybni-kotlety ──────────────────────────────────────────────
  'rybni-kotlety': {
    name: 'Sütőben sült tőkehalfasírt burgonyával és salátával',
    tip: 'A fasírtokat nyersen is lefagyaszthatod: rakd ki őket egy sütőpapírral bélelt deszkára, fagyaszd 2 órán át, majd tedd át egy zacskóba — így legfeljebb 2 hónapig elállnak. Kiolvasztás nélkül süsd 25–28 percig, és mindenképp ellenőrizd, hogy a közepük elérte-e a 63 °C-ot.',
    notes: {
      0: 'kiolvasztott filé',
      1: '4 részre vágva',
      4: 'apróra vágva',
      9: 'a salátához, vékony csíkokra vágva',
      10: 'a salátához, csíkokra vágva',
      11: 'a salátához',
      12: 'a mártáshoz',
    },
    steps: [
      {
        text: 'Olvaszd ki előre a filét a hűtőben (8–10 óra). Itasd szárazra papírtörlővel, és vágd ~3 cm-es darabokra.',
        warn: 'A nyers halat külön vágódeszkán vágd. Utána mosd meg a kezed, a kést és a deszkát meleg, szappanos vízzel.',
      },
      {
        text: 'Aprítsd fel a halat és a hagymát aprítógépben (vagy turmixgépben) 2–3 mp-es impulzusokkal, amíg apró darabos masszát nem kapsz. Ne pépesítsd — attól a fasírtok tömörek és gumisak lesznek.',
        warn: 'Mielőtt kiveszed a masszát, húzd ki a gép csatlakozóját a konnektorból — a kések nagyon élesek.',
      },
      {
        text: 'Add hozzá a tojást, a zabpelyhet, a zöldfűszer felét, ¼ citrom levét, 1 tk. sót és a borsot. Keverd össze, és tedd 15 percre a hűtőbe — a zabpehely felszívja a nedvességet, így a fasírtok megtartják a formájukat.',
        done: 'A massza besűrűsödött, és ha golyót gömbölyítesz belőle, megtartja a formáját.',
      },
      {
        text: 'Közben melegítsd elő a sütőt 200 °C-ra. Hámozd meg a burgonyát, vágj minden darabot 4 részre, öntsd fel hideg vízzel, sózd meg, és tedd nagy lángra.',
      },
      {
        text: 'Amikor a víz felforr, vedd közepesre a lángot, és főzd a burgonyát lefedve 20 percig. Aztán zárd el a lángot — a burgonya megvár a forró vízben.',
        done: 'A burgonyába ellenállás nélkül csúszik bele a kés.',
      },
      {
        text: 'Vizezd be a kezed hideg vízzel, és formázz 12 darab ~2 cm vastag fasírtot. Rakd őket sütőpapírral bélelt tepsibe.',
      },
      {
        text: 'Süsd a fasírtokat 18 percig a sütő középső szintjén.',
        done: 'A fasírtok megnyomva rugalmasan visszaugranak, és könnyen elválnak a sütőpapírtól.',
        look: 'A fasírtok teteje halványan aranyszínű.',
        warn: 'A tepsit csak sütőkesztyűben tedd be és vedd ki.',
      },
      {
        text: 'Amíg a fasírtok sülnek, sózd meg a káposztát, és nyomkodd át kézzel 1 percig, hogy puhább legyen. Add hozzá az uborkát, a maradék citrom levét és az olajat, majd keverd össze.',
      },
      {
        text: 'Keverd össze a joghurtot a maradék zöldfűszerrel és egy csipet sóval — ez lesz a mártás a fasírtokhoz.',
      },
      {
        text: 'Ellenőrizd a legvastagabb fasírtot: törd ketté villával (vagy szúrd a hőmérőt oldalról a közepébe, ha van).',
        done: 'A törésfelületen a hús átlátszatlan, tömör, és rétegesen szétválik; a fasírt rugalmas. Ha nem így van, süsd még 3 percig.',
        look: 'A törésfelületen a hús matt fehér, szürkés, áttetsző részek nélkül; a tetején enyhe aranyszínű kéreg.',
      },
      {
        text: 'Öntsd le a vizet a burgonyáról. Adagonként 3 fasírtot tálalj a burgonyával, a mártással és a salátával.',
        warn: 'A vizet a mosogató fölött, magadtól elfelé öntsd le — a gőz leforrázhat.',
      },
    ],
  },
};
